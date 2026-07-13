/* ============================================================
 *  Süper Lig otomatik skor senkronu (GitHub Actions cron ile çalışır)
 * ------------------------------------------------------------
 *  API-Football (RapidAPI) üzerinden Süper Lig sonuçlarını çeker,
 *  Firestore'daki "sl" (Süper Lig) maçlarıyla takım ismine ve
 *  tarihe göre eşleştirip biten maçların skorunu otomatik yazar.
 *
 *  Lig kimliğini (league id) sabit kodlamak yerine ilk çalıştırmada
 *  API'den arayıp bulur ve Firestore'a önbellekler (config/superlig),
 *  böylece yanlış/eski bir ID'ye güvenme riski olmaz.
 *
 *  Bir maç otomatik eşleşmezse (isim farkı vb.) hiçbir şey bozulmaz —
 *  yönetici panelinden her zaman elle skor girilebilir (yedek yöntem).
 * ============================================================ */
const admin = require("firebase-admin");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "api-football-v1.p.rapidapi.com";
const API_BASE = "https://api-football-v1.p.rapidapi.com/v3";

if (!RAPIDAPI_KEY) {
  console.error("HATA: RAPIDAPI_KEY secret'ı eksik.");
  process.exit(1);
}

const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
if (!sa.project_id) {
  console.error("HATA: FIREBASE_SERVICE_ACCOUNT secret'ı eksik veya geçersiz.");
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "X-RapidAPI-Key": RAPIDAPI_KEY, "X-RapidAPI-Host": RAPIDAPI_HOST }
  });
  if (!res.ok) throw new Error(`API isteği başarısız (${res.status}): ${path}`);
  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length) {
    throw new Error(`API hata döndürdü: ${JSON.stringify(json.errors)}`);
  }
  return json.response || [];
}

// Türkçe karakterleri sadeleştirip küçük harfe çevirir
function norm(s) {
  return String(s || "")
    .toLocaleLowerCase("tr")
    .replace(/i̇/g, "i")
    .replace(/[şŞ]/g, "s").replace(/[ğĞ]/g, "g").replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o").replace(/[çÇ]/g, "c").replace(/[ıİ]/g, "i")
    .replace(/[^a-z0-9]/g, "");
}

// Bizim isim <-> API'nin muhtemel isim varyantları (bilinen farklar)
const ALIASES = {
  "amedspor": ["amed", "amedsportiffaaliyetler"],
  "basaksehir": ["istanbulbasaksehir", "basaksehirfk"],
  "corumfk": ["corum", "corumfk"],
  "erzurumsporfk": ["erzurumspor", "buyuksehirbelediyeerzurumspor"],
  "gaziantepfk": ["gaziantep"],
  "kasimpasa": ["kasimpasa"]
};
function namesMatch(ourName, apiName) {
  const a = norm(ourName), b = norm(apiName);
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const variants = ALIASES[a] || [];
  return variants.some(v => v === b || b.includes(v) || v.includes(b));
}

async function getLeagueConfig() {
  const ref = db.collection("config").doc("superlig");
  const snap = await ref.get();
  if (snap.exists && snap.data().leagueId) return snap.data();

  console.log("Süper Lig id'si önbellekte yok, API'den aranıyor...");
  const leagues = await apiGet(`/leagues?country=Turkey`);
  const sl = leagues.find(l => norm(l.league.name) === norm("Süper Lig"));
  if (!sl) throw new Error("API'de 'Süper Lig' bulunamadı (country=Turkey araması boş döndü).");

  const seasons = sl.seasons || [];
  const season = (seasons.find(s => s.current) || seasons[seasons.length - 1] || {}).year;
  if (!season) throw new Error("Süper Lig için sezon bilgisi bulunamadı.");

  const cfg = { leagueId: sl.league.id, season, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
  await ref.set(cfg);
  console.log(`Bulundu ve önbelleklendi: leagueId=${cfg.leagueId}, season=${season}`);
  return cfg;
}

(async () => {
  const { leagueId, season } = await getLeagueConfig();

  const now = new Date();
  const from = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const to = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const fixtures = await apiGet(`/fixtures?league=${leagueId}&season=${season}&from=${from}&to=${to}`);
  console.log(`API'den ${fixtures.length} fikstür geldi (${from} → ${to}).`);

  const matchesSnap = await db.collection("matches").where("tournament", "==", "sl").get();
  const pending = [];
  matchesSnap.forEach(d => { const m = d.data(); if (!m.finished) pending.push({ id: d.id, ...m }); });
  console.log(`Firestore'da ${pending.length} bitmemiş Süper Lig maçı var.`);

  let updated = 0, unmatched = 0;
  for (const m of pending) {
    const mDate = (m.kickoff || "").slice(0, 10);
    const fx = fixtures.find(f => {
      const fDate = (f.fixture.date || "").slice(0, 10);
      return fDate === mDate &&
        namesMatch(m.home, f.teams.home.name) &&
        namesMatch(m.away, f.teams.away.name);
    });
    if (!fx) { unmatched++; continue; }

    const status = fx.fixture.status.short; // FT, AET, PEN, 1H, HT, 2H, NS, PST, ...
    const finishedCodes = ["FT", "AET", "PEN"];
    if (!finishedCodes.includes(status)) continue;

    const gh = fx.goals.home, ga = fx.goals.away;
    if (gh == null || ga == null) continue;

    await db.collection("matches").doc(m.id).set(
      { realHome: gh, realAway: ga, finished: true },
      { merge: true }
    );
    updated++;
    console.log(`✓ Güncellendi: ${m.home} ${gh}-${ga} ${m.away}`);
  }

  console.log(`Bitti. ${updated} maç güncellendi, ${unmatched} maç API'de eşleşmedi (henüz oynanmamış olabilir).`);
  process.exit(0);
})().catch((e) => { console.error("Beklenmeyen hata:", e); process.exit(1); });

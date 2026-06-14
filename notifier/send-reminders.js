/* ============================================================
 *  Maç hatırlatma göndericisi (GitHub Actions cron ile çalışır)
 * ------------------------------------------------------------
 *  Önümüzdeki 24 saatte başlayacak ve kullanıcının tahmin
 *  yapmadığı maçlar için telefona bildirim gönderir.
 *  Aynı maç için aynı kişiye yalnızca bir kez bildirim gider.
 * ============================================================ */
const admin = require("firebase-admin");

const SITE_URL = "https://barisaykent-spec.github.io/FIFA_WORLD_CUP_2026/";
const WINDOW_MS = 24 * 60 * 60 * 1000;

const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
if (!sa.project_id) {
  console.error("HATA: FIREBASE_SERVICE_ACCOUNT secret'ı eksik veya geçersiz.");
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();
const messaging = admin.messaging();

(async () => {
  const now = Date.now();
  const [matchesSnap, predsSnap, tokensSnap, remindersSnap] = await Promise.all([
    db.collection("matches").get(),
    db.collection("predictions").get(),
    db.collection("fcmTokens").get(),
    db.collection("reminders").get()
  ]);

  // Önümüzdeki 24 saatte başlayacak, bitmemiş maçlar
  const soon = [];
  matchesSnap.forEach((d) => {
    const m = d.data();
    if (m.finished || !m.kickoff) return;
    const t = new Date(m.kickoff).getTime();
    if (isNaN(t)) return;
    const diff = t - now;
    if (diff >= 0 && diff <= WINDOW_MS) soon.push({ id: d.id, ...m });
  });
  if (!soon.length) { console.log("Yaklaşan maç yok, çıkılıyor."); return; }

  // Tahmin yapılmış (matchId_uid) kümesi
  const predicted = new Set();
  predsSnap.forEach((d) => { const p = d.data(); predicted.add(`${p.matchId}_${p.uid}`); });

  // Kullanıcı başına jetonlar
  const byUid = {}; // uid -> [{ token, ref }]
  tokensSnap.forEach((d) => {
    const x = d.data();
    if (!x.uid || !x.token) return;
    (byUid[x.uid] ||= []).push({ token: x.token, ref: d.ref });
  });

  // Daha önce hatırlatılanlar (uid_matchId)
  const reminded = new Set();
  remindersSnap.forEach((d) => reminded.add(d.id));

  let totalSent = 0;
  for (const uid of Object.keys(byUid)) {
    const pending = soon.filter(
      (m) => !predicted.has(`${m.id}_${uid}`) && !reminded.has(`${uid}_${m.id}`)
    );
    if (!pending.length) continue;

    const first = pending[0];
    const extra = pending.length - 1;
    const body = extra > 0
      ? `${first.home} - ${first.away} ve ${extra} maç daha. Tahminini yapmayı unutma!`
      : `${first.home} - ${first.away} 24 saat içinde başlıyor. Tahminini yap!`;

    const entries = byUid[uid];
    const tokens = entries.map((e) => e.token);

    let res;
    try {
      res = await messaging.sendEachForMulticast({
        tokens,
        notification: { title: "⚽ Tahmin zamanı!", body },
        webpush: { fcmOptions: { link: SITE_URL } }
      });
    } catch (e) {
      console.error(`Gönderim hatası (${uid}):`, e.message);
      continue;
    }

    totalSent += res.successCount;

    // Geçersiz jetonları temizle
    const cleanup = [];
    res.responses.forEach((r, i) => {
      if (!r.success) {
        const code = (r.error && r.error.code) || "";
        if (code.includes("registration-token-not-registered") || code.includes("invalid-argument")) {
          cleanup.push(entries[i].ref.delete());
        }
      }
    });

    // En az bir bildirim gittiyse bu maçları "hatırlatıldı" işaretle
    if (res.successCount > 0) {
      const batch = db.batch();
      for (const m of pending) {
        batch.set(db.collection("reminders").doc(`${uid}_${m.id}`), {
          uid, matchId: m.id, ts: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      await batch.commit();
    }
    await Promise.allSettled(cleanup);
    console.log(`${uid}: ${res.successCount}/${tokens.length} bildirim, ${pending.length} maç işaretlendi.`);
  }

  console.log(`Bitti. Toplam ${totalSent} bildirim gönderildi.`);
  process.exit(0);
})().catch((e) => { console.error("Beklenmeyen hata:", e); process.exit(1); });

// ============================================================
//  Dünya Kupası Aile Tahmin Ligi
// ============================================================
import { firebaseConfig, ADMIN_PIN, LIG_ADI, VAPID_KEY } from "./firebase-config.js?v=16";
import { FIXTURES } from "./fixtures.js?v=16";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc,
  onSnapshot, serverTimestamp, query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getMessaging, getToken, onMessage, isSupported
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// ---------- Kurulum kontrolü ----------
if (firebaseConfig.apiKey.startsWith("BURAYA")) {
  document.getElementById("loaderText").innerHTML =
    "⚠️ Kurulum eksik.<br>firebase-config.js dosyasını doldurman gerekiyor.<br>Detay için README.md";
  throw new Error("Firebase ayarlanmamış. firebase-config.js dosyasını doldurun.");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------- Durum ----------
let uid = null;
let myName = localStorage.getItem("wc_name") || "";
let isAdmin = localStorage.getItem("wc_admin") === "1";
let matches = [];          // {id, ...}
let predictions = [];      // {id, matchId, uid, name, home, away}
let users = [];            // {id(uid), name}
let activeFilter = "all";
let searchText = "";
let currentMatchId = null;

// ---------- Kısa yardımcılar ----------
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString("tr-TR", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" });
}
function isLocked(m) {
  if (m.finished) return true;
  if (!m.kickoff) return false;
  return new Date(m.kickoff).getTime() <= Date.now();
}
// Maç önümüzdeki 24 saat içinde mi başlıyor? (gece maçlarını kaçırmamak için)
function isSoon(iso) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (isNaN(t)) return false;
  const diff = t - Date.now();
  return diff >= 0 && diff <= 24 * 60 * 60 * 1000;
}

// 1 = ev sahibi kazanır, 0 = beraberlik, -1 = deplasman kazanır
const sign = (h, a) => (h > a ? 1 : h < a ? -1 : 0);

// Ülke adı -> bayrak emojisi (Türkçe ve İngilizce isimler)
const FLAGS = {
  "türkiye":"🇹🇷","turkey":"🇹🇷","brezilya":"🇧🇷","brazil":"🇧🇷","almanya":"🇩🇪","germany":"🇩🇪",
  "arjantin":"🇦🇷","argentina":"🇦🇷","fransa":"🇫🇷","france":"🇫🇷","ispanya":"🇪🇸","i̇spanya":"🇪🇸","spain":"🇪🇸",
  "ingiltere":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","i̇ngiltere":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","england":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","hollanda":"🇳🇱","netherlands":"🇳🇱",
  "portekiz":"🇵🇹","portugal":"🇵🇹","hırvatistan":"🇭🇷","croatia":"🇭🇷","italya":"🇮🇹","i̇talya":"🇮🇹","italy":"🇮🇹",
  "belçika":"🇧🇪","belgium":"🇧🇪","abd":"🇺🇸","amerika":"🇺🇸","usa":"🇺🇸","meksika":"🇲🇽","mexico":"🇲🇽",
  "kanada":"🇨🇦","canada":"🇨🇦","japonya":"🇯🇵","japan":"🇯🇵","güney kore":"🇰🇷","south korea":"🇰🇷",
  "avustralya":"🇦🇺","australia":"🇦🇺","fas":"🇲🇦","morocco":"🇲🇦","senegal":"🇸🇳","gana":"🇬🇭","ghana":"🇬🇭",
  "nijerya":"🇳🇬","nigeria":"🇳🇬","kamerun":"🇨🇲","cameroon":"🇨🇲","mısır":"🇪🇬","egypt":"🇪🇬",
  "cezayir":"🇩🇿","algeria":"🇩🇿","tunus":"🇹🇳","tunisia":"🇹🇳","uruguay":"🇺🇾","kolombiya":"🇨🇴","colombia":"🇨🇴",
  "şili":"🇨🇱","chile":"🇨🇱","peru":"🇵🇪","ekvador":"🇪🇨","ecuador":"🇪🇨","paraguay":"🇵🇾","polonya":"🇵🇱","poland":"🇵🇱",
  "isviçre":"🇨🇭","i̇sviçre":"🇨🇭","switzerland":"🇨🇭","danimarka":"🇩🇰","denmark":"🇩🇰","isveç":"🇸🇪","i̇sveç":"🇸🇪","sweden":"🇸🇪",
  "norveç":"🇳🇴","norway":"🇳🇴","sırbistan":"🇷🇸","serbia":"🇷🇸","galler":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","wales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "iskoçya":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","i̇skoçya":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","irlanda":"🇮🇪","i̇rlanda":"🇮🇪","ireland":"🇮🇪",
  "avusturya":"🇦🇹","austria":"🇦🇹","çekya":"🇨🇿","czechia":"🇨🇿","yunanistan":"🇬🇷","greece":"🇬🇷",
  "ukrayna":"🇺🇦","ukraine":"🇺🇦","katar":"🇶🇦","qatar":"🇶🇦","suudi arabistan":"🇸🇦","saudi arabia":"🇸🇦",
  "iran":"🇮🇷","i̇ran":"🇮🇷","irak":"🇮🇶","i̇rak":"🇮🇶","iraq":"🇮🇶","bae":"🇦🇪","çin":"🇨🇳","china":"🇨🇳",
  "yeni zelanda":"🇳🇿","new zealand":"🇳🇿","kosta rika":"🇨🇷","costa rica":"🇨🇷","panama":"🇵🇦",
  "jamaika":"🇯🇲","jamaica":"🇯🇲","honduras":"🇭🇳","bolivya":"🇧🇴","bolivia":"🇧🇴","venezuela":"🇻🇪",
  "güney afrika":"🇿🇦","south africa":"🇿🇦","bosna hersek":"🇧🇦","bosnia and herzegovina":"🇧🇦",
  "haiti":"🇭🇹","curaçao":"🇨🇼","curacao":"🇨🇼","fildişi sahili":"🇨🇮","ivory coast":"🇨🇮",
  "cabo verde":"🇨🇻","yeşil burun":"🇨🇻","cape verde":"🇨🇻","ürdün":"🇯🇴","jordan":"🇯🇴",
  "demokratik kongo":"🇨🇩","dr kongo":"🇨🇩","dr congo":"🇨🇩","özbekistan":"🇺🇿","uzbekistan":"🇺🇿"
};
const flagOf = (name) => FLAGS[String(name||"").trim().toLowerCase()] || "🏳️";
const teamCell = (name, side) =>
  `<div class="team ${side}"><span class="flag">${flagOf(name)}</span><span class="tname">${esc(name)}</span></div>`;

// Bir tahmin için puan: kazananı +1, kesin skor +1, penaltıya gideceğini bildiyse +1
function scorePred(p, m) {
  if (!m.finished || m.realHome == null || m.realAway == null) return { pts:0, outcome:false, exact:false, penaltyHit:false };
  if (p == null || p.home == null || p.away == null) return { pts:0, outcome:false, exact:false, penaltyHit:false };
  const outcome = sign(p.home, p.away) === sign(m.realHome, m.realAway);
  const exact = p.home === m.realHome && p.away === m.realAway;
  const penaltyHit = !!p.penalty && !!m.penalty;
  return { pts: (outcome ? 1 : 0) + (exact ? 1 : 0) + (penaltyHit ? 1 : 0), outcome, exact, penaltyHit };
}

// Maç eleme turu mu? (grup maçları penaltıya gitmez)
const isKnockout = (m) => !!m && !/grubu/i.test(m.stage || "");

// ============================================================
//  Başlangıç
// ============================================================
onAuthStateChanged(auth, async (user) => {
  if (!user) { signInAnonymously(auth).catch(showAuthError); return; }
  uid = user.uid;

  if (!myName) {
    // Daha önce kayıt olmuş olabilir
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists() && snap.data().name) {
      myName = snap.data().name;
      localStorage.setItem("wc_name", myName);
    }
  }

  if (!myName) {
    $("loader").classList.add("hidden");
    $("nameGate").classList.remove("hidden");
  } else {
    startApp();
  }
});

function showAuthError(e) {
  $("loaderText").innerHTML =
    "Bağlanılamadı.<br>Firebase'de <b>Anonymous</b> girişi açık mı?<br><small>" + esc(e.message) + "</small>";
}

// ---------- İsim kaydı ----------
$("gateTitle").textContent = LIG_ADI;
$("nameSaveBtn").addEventListener("click", saveName);
$("nameInput").addEventListener("keydown", e => { if (e.key === "Enter") saveName(); });

async function saveName() {
  const name = $("nameInput").value.trim();
  if (name.length < 2) { $("nameError").textContent = "Lütfen en az 2 harfli bir isim yaz."; return; }
  myName = name;
  localStorage.setItem("wc_name", name);
  await setDoc(doc(db, "users", uid), { name, updatedAt: serverTimestamp() }, { merge:true });
  $("nameGate").classList.add("hidden");
  startApp();
}

// ============================================================
//  Uygulamayı başlat + canlı dinleyiciler
// ============================================================
function startApp() {
  $("loader").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("ligName").textContent = LIG_ADI;
  $("meName").textContent = myName;

  // İsmimi her ihtimale karşı kaydet
  setDoc(doc(db, "users", uid), { name: myName, updatedAt: serverTimestamp() }, { merge:true });

  onSnapshot(query(collection(db, "matches")), (snap) => {
    matches = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    matches.sort((a,b) => (a.kickoff||"").localeCompare(b.kickoff||""));
    renderMatches(); renderLeaderboard(); renderAdminMatches();
    if (currentMatchId) refreshModal();
  });

  onSnapshot(query(collection(db, "predictions")), (snap) => {
    predictions = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderMatches(); renderLeaderboard(); renderAdminUsers();
    if (currentMatchId) refreshModal();
  });

  onSnapshot(query(collection(db, "users")), (snap) => {
    users = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderLeaderboard(); renderAdminUsers();
  });

  setupTabs();
  setupSearch();
  setupAdmin();
  setupModal();
  setupNotifications();
  if (isAdmin) showAdminPanel();
}

// ============================================================
//  Bildirimler (Firebase Cloud Messaging)
// ============================================================
let swReg = null;

async function setupNotifications() {
  const btn = $("notifBtn");
  if (!btn) return;

  // Tarayıcı desteklemiyorsa butonu hiç gösterme
  let supported = false;
  try { supported = await isSupported(); } catch { supported = false; }
  if (!supported || !("serviceWorker" in navigator) || !VAPID_KEY || VAPID_KEY.startsWith("BURAYA")) {
    btn.classList.add("hidden");
    return;
  }

  try {
    swReg = await navigator.serviceWorker.register("firebase-messaging-sw.js");
  } catch (e) {
    console.warn("Service worker kaydı başarısız:", e);
    btn.classList.add("hidden");
    return;
  }

  // İzin durumu
  if (Notification.permission === "granted") {
    btn.classList.add("hidden");
    registerFcmToken();
  } else if (Notification.permission === "denied") {
    btn.classList.add("hidden"); // kullanıcı reddetmiş, zorlamayalım
  } else {
    btn.classList.remove("hidden");
  }

  btn.addEventListener("click", async () => {
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      btn.classList.add("hidden");
      registerFcmToken();
    } else {
      btn.textContent = "Bildirim izni verilmedi";
      setTimeout(() => btn.classList.add("hidden"), 2500);
    }
  });

  // Uygulama açıkken bildirim gelirse göster
  try {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      const n = payload.notification || payload.data || {};
      if (swReg) swReg.showNotification(n.title || "⚽ Tahmin zamanı!", {
        body: n.body || "Yaklaşan maçlara tahmin yapmayı unutma.",
        icon: "assets/icon-192.png"
      });
    });
  } catch {}
}

async function registerFcmToken() {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg });
    if (!token) return;
    const id = token.replace(/[\/#?]/g, "_").slice(0, 300);
    await setDoc(doc(db, "fcmTokens", id), {
      uid, token, name: myName, updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("Bildirim jetonu alınamadı:", e);
  }
}

function setupSearch() {
  const input = $("matchSearch");
  const clear = $("matchSearchClear");
  if (!input) return;
  input.addEventListener("input", () => {
    searchText = input.value;
    clear.classList.toggle("hidden", !input.value);
    renderMatches();
  });
  clear.addEventListener("click", () => {
    input.value = "";
    searchText = "";
    clear.classList.add("hidden");
    renderMatches();
    input.focus();
  });
}

// ============================================================
//  Sekmeler
// ============================================================
function setupTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const page = btn.dataset.page;
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
      $("page-" + page).classList.add("active");
    });
  });
}

// ============================================================
//  MAÇLAR sayfası
// ============================================================
function myPred(matchId) {
  return predictions.find(p => p.matchId === matchId && p.uid === uid);
}

// Grup maçlarının hepsini tek "Grup Aşaması" başlığı altında göster (veri değişmez)
function displayStage(stage) {
  return /grubu/i.test(stage || "") ? "Grup Aşaması" : (stage || "");
}

// Tek bir maç kartının HTML'ini üretir
function matchCardHTML(m) {
  const mp = myPred(m.id);
  const locked = isLocked(m);
  const live = locked && !m.finished;
  const soon = isSoon(m.kickoff);

  let scoreHtml;
  if (m.finished && m.realHome != null) {
    scoreHtml = `<div class="score-box">${m.realHome} <span class="sep">-</span> ${m.realAway}</div>`;
  } else if (live) {
    scoreHtml = `<div class="score-box pending live">CANLI</div>`;
  } else {
    scoreHtml = `<div class="score-box pending">VS</div>`;
  }

  const timeHtml = live
    ? `<span class="match-time live-tag"><span class="live-dot"></span>CANLI</span>`
    : m.finished
      ? `<span class="match-time done-tag">Bitti</span>`
      : `<span class="match-time">${fmtDate(m.kickoff)}</span>`;

  // Alt bilgi: benim tahminim + sonuç rozeti
  let foot = "";
  if (mp) {
    const sc = scorePred(mp, m);
    let badge = "";
    if (m.finished) {
      if (sc.pts > 0) {
        const parts = [];
        if (sc.exact) parts.push("Tam skor");
        else if (sc.outcome) parts.push("Kazananı bildin");
        if (sc.penaltyHit) parts.push("Penaltı");
        badge = `<span class="badge ${sc.exact ? "exact" : "win"}">✓ ${parts.join(" + ")} +${sc.pts}</span>`;
      } else {
        badge = `<span class="badge lose">✗ Tutmadı</span>`;
      }
    } else {
      badge = `<span class="badge ${locked?"locked":"open"}">${locked?"Kilitli":"Tahmin yapıldı"}</span>`;
    }
    foot = `<span class="mypred">Tahminin: <b>${mp.home} - ${mp.away}</b></span>${badge}`;
  } else {
    const badge = locked
      ? `<span class="badge locked">Kapandı</span>`
      : `<span class="badge open">Tahmin yap →</span>`;
    foot = `<span class="mypred">Henüz tahmin yok</span>${badge}`;
  }

  return `
    <div class="match${soon ? " soon" : ""}" data-id="${m.id}">
      <div class="match-top">
        <span class="match-stage">${esc(displayStage(m.stage))}${soon ? ` <span class="soon-tag">SON 24 SAAT</span>` : ""}</span>
        ${timeHtml}
      </div>
      <div class="match-row">
        ${teamCell(m.home, "home")}
        ${scoreHtml}
        ${teamCell(m.away, "away")}
      </div>
      <div class="match-foot">${foot}</div>
    </div>`;
}

function renderMatches() {
  // Filtre butonları (aşamalara göre)
  const stages = [...new Set(matches.map(m => displayStage(m.stage)).filter(Boolean))];
  const filterBox = $("matchFilters");
  const filters = [["all","Tümü"], ...stages.map(s => [s, s])];
  filterBox.innerHTML = filters.map(([k,label]) =>
    `<button data-f="${esc(k)}" class="${activeFilter===k?"active":""}">${esc(label)}</button>`).join("");
  filterBox.querySelectorAll("button").forEach(b =>
    b.addEventListener("click", () => { activeFilter = b.dataset.f; renderMatches(); }));

  let list = activeFilter === "all" ? matches : matches.filter(m => displayStage(m.stage) === activeFilter);

  // Takım ismine göre arama (Türkçe büyük/küçük harf duyarsız)
  const q = searchText.trim().toLocaleLowerCase("tr");
  if (q) list = list.filter(m => `${m.home} ${m.away}`.toLocaleLowerCase("tr").includes(q));

  const box = $("matchList");

  if (!list.length) {
    if (q) {
      box.innerHTML = `<div class="empty">"${esc(searchText.trim())}" için maç bulunamadı.</div>`;
      $("matchEmpty").classList.add("hidden");
    } else {
      box.innerHTML = "";
      $("matchEmpty").classList.toggle("hidden", matches.length > 0);
    }
    return;
  }
  $("matchEmpty").classList.add("hidden");

  // Son 24 saatte başlayacak maçlar en üste sabitlenir (çerçeveli kalır)
  const soonList = list.filter(m => isSoon(m.kickoff));
  const restList = list.filter(m => !isSoon(m.kickoff));

  let html = "";
  if (soonList.length) {
    html += `<div class="stage-head soon-head">⏰ SON 24 SAAT</div>`;
    for (const m of soonList) html += matchCardHTML(m);
  }

  let lastStage = null;
  for (const m of restList) {
    const ds = displayStage(m.stage);
    if (ds && ds !== lastStage && activeFilter === "all") {
      html += `<div class="stage-head">${esc(ds)}</div>`;
      lastStage = ds;
    }
    html += matchCardHTML(m);
  }
  box.innerHTML = html;
  box.querySelectorAll(".match").forEach(el =>
    el.addEventListener("click", () => openPredict(el.dataset.id)));
}

// ============================================================
//  LİG sayfası
// ============================================================
function renderLeaderboard() {
  // uid -> { name, pts, exact, outcome, played }
  const table = {};
  // Tüm kullanıcıları (ismi olanları) ekle
  for (const u of users) if (u.name) table[u.id] = { name:u.name, pts:0, exact:0, outcome:0, played:0 };

  for (const p of predictions) {
    const m = matches.find(x => x.id === p.matchId);
    if (!m) continue;
    if (!table[p.uid]) table[p.uid] = { name:p.name || "?", pts:0, exact:0, outcome:0, played:0 };
    if (m.finished) {
      const sc = scorePred(p, m);
      table[p.uid].pts += sc.pts;
      table[p.uid].played += 1;
      if (sc.exact) table[p.uid].exact += 1;
      if (sc.outcome) table[p.uid].outcome += 1;
    }
  }

  const rows = Object.entries(table).map(([id,v]) => ({ id, ...v }));
  rows.sort((a,b) => b.pts - a.pts || b.exact - a.exact || a.name.localeCompare(b.name));

  const box = $("leaderboard");
  if (!rows.length) {
    box.innerHTML = "";
    $("leagueEmpty").classList.remove("hidden");
    return;
  }
  $("leagueEmpty").classList.add("hidden");

  let rank = 0, lastPts = null, lastExact = null, shown = 0;
  box.innerHTML = rows.map(r => {
    shown++;
    if (r.pts !== lastPts || r.exact !== lastExact) { rank = shown; lastPts = r.pts; lastExact = r.exact; }
    const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
    const topCls = rank <= 3 ? ` top${rank}` : "";
    const meCls = r.id === uid ? " me" : "";
    const initial = (r.name||"?").trim().charAt(0).toUpperCase();
    const hue = [...(r.name||"?")].reduce((s,c)=>s+c.charCodeAt(0),0) % 360;
    return `
      <div class="lb-row${topCls}${meCls}">
        <div class="lb-rank">${medal}</div>
        <div class="lb-avatar" style="background:linear-gradient(135deg,hsl(${hue} 70% 55%),hsl(${(hue+40)%360} 70% 45%))">${esc(initial)}</div>
        <div>
          <div class="lb-name">${esc(r.name)}${r.id===uid?" (sen)":""}</div>
          <div class="lb-sub">${r.outcome} kazanan • ${r.exact} tam • ${r.played} maç</div>
        </div>
        <div class="lb-pts">${r.pts}<span> puan</span></div>
      </div>`;
  }).join("");
}

// ============================================================
//  Tahmin penceresi
// ============================================================
function setupModal() {
  $("predictClose").addEventListener("click", closePredict);
  $("predictModal").addEventListener("click", e => { if (e.target.id === "predictModal") closePredict(); });
  $("predSaveBtn").addEventListener("click", savePrediction);
}

function openPredict(matchId) {
  currentMatchId = matchId;
  $("predMsg").textContent = "";
  $("predictModal").classList.remove("hidden");
  refreshModal();
}
function closePredict() {
  currentMatchId = null;
  $("predictModal").classList.add("hidden");
}

function refreshModal() {
  const m = matches.find(x => x.id === currentMatchId);
  if (!m) { closePredict(); return; }
  const locked = isLocked(m);
  const mp = myPred(m.id);

  $("predStage").textContent = (m.stage ? m.stage + " • " : "") + fmtDate(m.kickoff);
  $("predHomeName").innerHTML = `<span class="flag-lg">${flagOf(m.home)}</span><span>${esc(m.home)}</span>`;
  $("predAwayName").innerHTML = `<span class="flag-lg">${flagOf(m.away)}</span><span>${esc(m.away)}</span>`;
  $("predHomeScore").value = mp ? mp.home : "";
  $("predAwayScore").value = mp ? mp.away : "";
  $("predHomeScore").disabled = locked;
  $("predAwayScore").disabled = locked;

  // Penaltı tahmini (sadece eleme turu maçlarında)
  const penRow = $("predPenaltyRow");
  const penBox = $("predPenalty");
  if (isKnockout(m)) {
    penRow.classList.remove("hidden");
    penBox.checked = !!(mp && mp.penalty);
    penBox.disabled = locked;
  } else {
    penRow.classList.add("hidden");
    penBox.checked = false;
  }

  if (m.finished && m.realHome != null) {
    $("predKickoff").innerHTML = `Gerçek skor: <b>${m.realHome} - ${m.realAway}</b>` + (m.penalty ? ` 🥅 <b>(Penaltılar)</b>` : "");
  } else if (locked) {
    $("predKickoff").textContent = "Maç başladı, tahminler kilitlendi.";
  } else {
    $("predKickoff").textContent = "Maç başlayınca tahminler kilitlenir.";
  }

  $("predSaveBtn").style.display = locked ? "none" : "block";

  // Diğerlerinin tahminleri — sadece kilitlendiyse göster (önceden görmek adil değil)
  const others = $("predOthers");
  if (locked) {
    const preds = predictions.filter(p => p.matchId === m.id);
    if (preds.length) {
      preds.sort((a,b) => (a.name||"").localeCompare(b.name||""));
      others.innerHTML = `<h4>Herkesin tahmini</h4>` + preds.map(p => {
        const sc = scorePred(p, m);
        let tag = "";
        if (m.finished) tag = sc.pts > 0 ? (sc.exact ? " 🎯" : " ✓") : " ✗";
        const pen = p.penalty ? " 🥅" : "";
        return `<div class="po-row"><span class="po-name">${esc(p.name)}${p.uid===uid?" (sen)":""}</span>
          <span class="po-score">${p.home} - ${p.away}${pen}${tag}</span></div>`;
      }).join("");
    } else {
      others.innerHTML = `<h4>Herkesin tahmini</h4><div class="po-row"><span class="po-name muted">Kimse tahmin yapmamış.</span></div>`;
    }
  } else {
    others.innerHTML = "";
  }
}

async function savePrediction() {
  const m = matches.find(x => x.id === currentMatchId);
  if (!m || isLocked(m)) { $("predMsg").textContent = ""; return; }
  const h = parseInt($("predHomeScore").value, 10);
  const a = parseInt($("predAwayScore").value, 10);
  if (isNaN(h) || isNaN(a) || h < 0 || a < 0) {
    $("predMsg").style.color = "var(--red)";
    $("predMsg").textContent = "Lütfen iki takım için de skor gir.";
    return;
  }
  const penalty = isKnockout(m) && $("predPenalty").checked;
  await setDoc(doc(db, "predictions", `${m.id}_${uid}`), {
    matchId: m.id, uid, name: myName, home: h, away: a, penalty, ts: serverTimestamp()
  });
  $("predMsg").style.color = "var(--green)";
  $("predMsg").textContent = "Tahminin kaydedildi! ✓";
  setTimeout(closePredict, 700);
}

// ============================================================
//  YÖNETİCİ
// ============================================================
function setupAdmin() {
  $("adminLoginBtn").addEventListener("click", () => {
    if ($("adminPin").value === ADMIN_PIN) {
      isAdmin = true; localStorage.setItem("wc_admin", "1");
      $("adminError").textContent = ""; $("adminPin").value = "";
      showAdminPanel();
    } else {
      $("adminError").textContent = "Şifre yanlış.";
    }
  });
  $("adminLogoutBtn").addEventListener("click", () => {
    isAdmin = false; localStorage.removeItem("wc_admin");
    $("adminPanel").classList.add("hidden");
    $("adminLogin").classList.remove("hidden");
  });
  $("addMatchBtn").addEventListener("click", addMatch);
  $("loadFixturesBtn").addEventListener("click", loadFixtures);
}

function showAdminPanel() {
  $("adminLogin").classList.add("hidden");
  $("adminPanel").classList.remove("hidden");
  renderAdminMatches();
  renderAdminUsers();
}

async function addMatch() {
  const home = $("newHome").value.trim();
  const away = $("newAway").value.trim();
  const stage = $("newStage").value.trim();
  const kickoff = $("newKickoff").value;
  if (!home || !away) { adminMsg("Ev sahibi ve deplasman gerekli.", true); return; }
  const id = "m_" + Date.now() + "_" + Math.random().toString(36).slice(2,7);
  await setDoc(doc(db, "matches", id), {
    home, away, stage, kickoff, finished:false, realHome:null, realAway:null
  });
  $("newHome").value = ""; $("newAway").value = ""; $("newStage").value = ""; $("newKickoff").value = "";
  adminMsg("Maç eklendi ✓", false);
}

async function loadFixtures() {
  if (!FIXTURES.length) { adminMsg("fixtures.js boş.", true); return; }
  const fxId = (f) => ("fx_" + f.stage + "_" + f.home + "_" + f.away).replace(/[^a-zA-Z0-9_]/g, "-");
  const wanted = new Map(FIXTURES.map(f => [fxId(f), f]));

  // Artık listede olmayan eski fikstür maçlarını (ör. yanlış saatli kopyalar) temizle
  let removed = 0;
  const snap = await getDocs(collection(db, "matches"));
  for (const d of snap.docs) {
    if (d.id.startsWith("fx") && !wanted.has(d.id)) {
      const preds = predictions.filter(p => p.matchId === d.id);
      for (const p of preds) await deleteDoc(doc(db, "predictions", p.id));
      await deleteDoc(doc(db, "matches", d.id));
      removed++;
    }
  }

  // Maçları ekle / güncelle — girilen gerçek skorlara dokunmaz (merge)
  for (const [id, f] of wanted) {
    await setDoc(doc(db, "matches", id),
      { home: f.home, away: f.away, stage: f.stage || "", kickoff: f.kickoff || "" },
      { merge: true });
  }
  adminMsg(`${wanted.size} maç güncellendi${removed ? `, ${removed} eski temizlendi` : ""} ✓`, false);
}

function adminMsg(text, isError) {
  const el = $("adminMsg");
  el.style.color = isError ? "var(--red)" : "var(--green)";
  el.textContent = text;
  setTimeout(() => { el.textContent = ""; }, 3000);
}

function renderAdminMatches() {
  if (!isAdmin) return;
  const box = $("adminMatchList");
  if (!box) return;
  if (!matches.length) { box.innerHTML = `<p class="muted">Henüz maç yok.</p>`; return; }

  box.innerHTML = matches.map(m => `
    <div class="amatch" data-id="${m.id}">
      <div class="amatch-top">${esc(m.home)} - ${esc(m.away)}</div>
      <div class="amatch-sub">${esc(m.stage||"")} • ${fmtDate(m.kickoff)} ${m.finished?"• ✅ bitti":""}</div>
      <div class="amatch-row">
        <input type="number" min="0" class="ah" value="${m.realHome ?? ""}" placeholder="0" />
        <span>-</span>
        <input type="number" min="0" class="aa" value="${m.realAway ?? ""}" placeholder="0" />
        <button class="amatch-save">Kaydet</button>
      </div>
      ${isKnockout(m) ? `<label class="amatch-pen"><input type="checkbox" class="apen" ${m.penalty ? "checked" : ""}/> 🥅 Maç penaltılara gitti</label>` : ""}
      <button class="amatch-del">Maçı sil</button>
    </div>`).join("");

  box.querySelectorAll(".amatch").forEach(el => {
    const id = el.dataset.id;
    el.querySelector(".amatch-save").addEventListener("click", async () => {
      const h = parseInt(el.querySelector(".ah").value, 10);
      const a = parseInt(el.querySelector(".aa").value, 10);
      if (isNaN(h) || isNaN(a)) { adminMsg("İki skoru da gir.", true); return; }
      const penBox = el.querySelector(".apen");
      const penalty = penBox ? penBox.checked : false;
      await setDoc(doc(db, "matches", id), { realHome:h, realAway:a, finished:true, penalty }, { merge:true });
      adminMsg("Skor kaydedildi, tahminler değerlendirildi ✓", false);
    });
    el.querySelector(".amatch-del").addEventListener("click", async () => {
      if (!confirm("Bu maç ve tüm tahminleri silinsin mi?")) return;
      await deleteDoc(doc(db, "matches", id));
      // İlgili tahminleri de sil
      const preds = predictions.filter(p => p.matchId === id);
      for (const p of preds) await deleteDoc(doc(db, "predictions", p.id));
      adminMsg("Maç silindi.", false);
    });
  });
}

function renderAdminUsers() {
  if (!isAdmin) return;
  const box = $("adminUserList");
  if (!box) return;
  const list = users.filter(u => u.name);
  if (!list.length) { box.innerHTML = `<p class="muted">Henüz oyuncu yok.</p>`; return; }
  list.sort((a,b) => (a.name||"").localeCompare(b.name||""));

  box.innerHTML = list.map(u => {
    const cnt = predictions.filter(p => p.uid === u.id).length;
    return `
      <div class="amatch urow" data-id="${u.id}">
        <div>
          <div class="amatch-top">${esc(u.name)}${u.id===uid?" (sen)":""}</div>
          <div class="amatch-sub">${cnt} tahmin</div>
        </div>
        <button class="urow-del">🗑️ Sil</button>
      </div>`;
  }).join("");

  box.querySelectorAll(".urow").forEach(el => {
    el.querySelector(".urow-del").addEventListener("click", async () => {
      const id = el.dataset.id;
      const u = users.find(x => x.id === id);
      if (!confirm(`"${u?.name || "?"}" oyuncusu ve tüm tahminleri silinsin mi?`)) return;
      const preds = predictions.filter(p => p.uid === id);
      for (const p of preds) await deleteDoc(doc(db, "predictions", p.id));
      await deleteDoc(doc(db, "users", id));
      adminMsg("Oyuncu silindi.", false);
    });
  });
}

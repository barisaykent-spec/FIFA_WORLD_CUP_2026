// ============================================================
//  AYAR DOSYASI  —  Burayı bir kez doldurman yeterli.
// ============================================================
//
// 1) https://console.firebase.google.com adresine gir, ücretsiz
//    bir proje oluştur (kredi kartı gerekmez).
// 2) Sol menü > Build > Firestore Database > "Create database"
//    (Production veya Test fark etmez, kuralları README'den ekle).
// 3) Sol menü > Build > Authentication > "Get started" >
//    "Anonymous" sağlayıcısını AÇ (Enable).
// 4) Proje ayarları (dişli ikonu) > "Your apps" > Web (</>) ekle.
//    Sana verilen "firebaseConfig" değerlerini aşağıya yapıştır.
//
// Detaylı anlatım için README.md dosyasına bak.
// ============================================================

export const firebaseConfig = {
  apiKey: "BURAYA_API_KEY",
  authDomain: "BURAYA.firebaseapp.com",
  projectId: "BURAYA_PROJECT_ID",
  storageBucket: "BURAYA.appspot.com",
  messagingSenderId: "BURAYA_SENDER_ID",
  appId: "BURAYA_APP_ID"
};

// Yönetici (maç ekleyen / skor giren kişi) için şifre.
// Bunu kendine göre değiştir. Aile içi kullanım için yeterlidir.
export const ADMIN_PIN = "1234";

// Lig adı (ekranın üstünde görünür).
export const LIG_ADI = "Aile Dünya Kupası Ligi";

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
  apiKey: "AIzaSyBC-NtqfuQJNS7IY-oZYFw2NsvuxtbnRfk",
  authDomain: "worldcup-2026-18551.firebaseapp.com",
  projectId: "worldcup-2026-18551",
  storageBucket: "worldcup-2026-18551.firebasestorage.app",
  messagingSenderId: "73673156328",
  appId: "1:73673156328:web:5612b284b5996eed79cb5d",
  measurementId: "G-5ZK29RP4Q8"
};

// Yönetici (maç ekleyen / skor giren kişi) için şifre.
// Bunu kendine göre değiştir. Aile içi kullanım için yeterlidir.
export const ADMIN_PIN = "baris1980";

// Lig adı (ekranın üstünde görünür).
export const LIG_ADI = "Aile Dünya Kupası Ligi";

// Bildirimler için VAPID anahtarı (Web Push certificate).
// Firebase Console > Project settings > Cloud Messaging >
// "Web Push certificates" > Generate key pair ile alınır.
export const VAPID_KEY = "BDsS_-hRu1k_sJ3U3TD2IzuXCuzOQ2RzmlxfHmkSU34vB7FRMKitzej0AgMf7x8xN9sGTywmkHADtjBOVrELgCs";

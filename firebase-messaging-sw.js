/* Firebase Cloud Messaging - Service Worker
   Uygulama kapalı/arka plandayken bildirimleri gösterir. */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBC-NtqfuQJNS7IY-oZYFw2NsvuxtbnRfk",
  authDomain: "worldcup-2026-18551.firebaseapp.com",
  projectId: "worldcup-2026-18551",
  storageBucket: "worldcup-2026-18551.firebasestorage.app",
  messagingSenderId: "73673156328",
  appId: "1:73673156328:web:5612b284b5996eed79cb5d"
});

const messaging = firebase.messaging();

// Sadece "data" mesajı gelirse bildirimi elle göster
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || payload.data || {};
  const title = n.title || "⚽ Tahmin zamanı!";
  self.registration.showNotification(title, {
    body: n.body || "Yaklaşan maçlara tahmin yapmayı unutma.",
    icon: "assets/icon-192.png",
    badge: "assets/icon-192.png",
    data: { url: (payload.fcmOptions && payload.fcmOptions.link) || "./index.html" }
  });
});

// Bildirime tıklayınca uygulamayı aç
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "./index.html";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

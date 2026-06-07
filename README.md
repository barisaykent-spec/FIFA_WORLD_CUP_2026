# 🏆 Dünya Kupası Aile Tahmin Ligi

Aile içi eğlence amaçlı, **bahis olmayan** maç tahmin uygulaması.
Herkes aynı linke girer, maçları görür, tahmin yapar; gerçek skor girilince
otomatik puanlanır ve sıralama herkeste canlı güncellenir.

- 📱 **iPhone, Android, Mac, Windows, tablet** — hepsinde tarayıcıdan çalışır.
- 🏠 "Ana ekrana ekle" deyince **uygulama gibi** açılır (PWA).
- 👥 4 kişiden 50 kişiye kadar rahat kullanım.
- 🔢 Puanlama: **kazananı bilirsen +1**, **kesin skoru da bilirsen +1 daha**.
- 🥇🥈🥉 İlk 3 farklı renklerde gösterilir.

---

## Bilgisayarda denemek için ekstra bir şey gerekir mi?

Geliştirme/deneme için tek bir komut yeterli (bu klasörün içinde):

```bash
python3 -m http.server 8000
```

Sonra tarayıcıda **http://localhost:8000** adresini aç. Hepsi bu.
(Çift tıklayıp `file://` ile açma — modüller `file://` üzerinde çalışmaz.)

Herkesin kullanması için ise internete koymak gerekir → aşağıdaki **Yayına Alma** bölümü.

---

## Kurulum (sadece 1 kez, ~10 dakika)

Ortak sıralama için ücretsiz **Firebase** kullanıyoruz (kredi kartı gerekmez).

### 1) Firebase projesi oluştur
1. https://console.firebase.google.com → **Add project** → bir isim ver → oluştur.

### 2) Firestore veritabanını aç
1. Sol menü: **Build → Firestore Database → Create database**.
2. Konum seç (örn. *eur3*), **Production mode** seç → Enable.
3. Üst sekme **Rules** → aşağıdaki kuralları yapıştır → **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Aile içi güven ortamı: giriş yapan herkes okuyup yazabilir.
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
> Not: Bu kurallar aile gibi güvenilir bir grup için uygundur. Yönetici
> yetkisi (maç ekleme/skor girme) uygulama içinde şifre ile korunur.

### 3) Anonim girişi aç
1. Sol menü: **Build → Authentication → Get started**.
2. **Sign-in method → Anonymous → Enable → Save**.

### 4) Web uygulaması ekle ve ayarları kopyala
1. Proje ayarları (⚙️ dişli) → **General → Your apps → Web (</>)**.
2. Bir takma ad ver → kaydet. Sana bir **firebaseConfig** kod bloğu verilir.
3. O değerleri **`firebase-config.js`** dosyasına yapıştır.
4. Aynı dosyada **`ADMIN_PIN`** (yönetici şifresi) ve **`LIG_ADI`** değerlerini
   kendine göre düzenle.

Hepsi bu! Artık `python3 -m http.server 8000` ile localde deneyebilirsin.

---

## Yayına Alma (herkesin girebilmesi için)

En kolay 2 yöntem (ikisi de ücretsiz):

### A) Netlify Drop (en kolay — 1 dakika)
1. https://app.netlify.com/drop adresine git.
2. Bu **World_cup klasörünü** sürükle bırak.
3. Sana `https://...netlify.app` gibi bir link verir. Linki ailene gönder.

### B) Firebase Hosting (Firebase ile aynı yerde)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # public klasör olarak "." seç, single-page: No
firebase deploy
```

> Netlify kullanırsan Firebase Authentication'da o domain'i izinli yapman
> gerekebilir: **Authentication → Settings → Authorized domains → Add domain**.

---

## Telefona "uygulama gibi" ekleme
- **iPhone (Safari):** Paylaş düğmesi → **Ana Ekrana Ekle**.
- **Android (Chrome):** ⋮ menü → **Ana ekrana ekle / Uygulamayı yükle**.

---

## Nasıl kullanılır?
1. **İlk açılışta** herkes adını yazar (sıralamada bu isimle görünür).
2. **Maçlar** sekmesinden maça tıkla, skor tahminini gir, kaydet.
   - Maç başlangıç saati geçince tahminler otomatik kilitlenir.
   - Kilitlendikten sonra herkesin tahminini görebilirsin.
3. **Yönetici** (sen): şifreyle giriş yap →
   - "Maç Ekle" ile maç ekle ya da "Başlangıç Fikstürünü Yükle".
   - Maç bitince gerçek skoru gir → herkesin tahmini otomatik X/O olur.
4. **Lig** sekmesinde sıralamayı gör. İlk 3 altın/gümüş/bronz renkte.

---

## Maçları toplu eklemek
`fixtures.js` içinde **2026 Dünya Kupası grup aşamasının 72 maçı** hazır
gelir (gerçek gruplar ve tarihler — Türkiye D Grubu'nda). Yönetici
panelinde **"Başlangıç Fikstürünü Yükle"** butonuna basınca hepsi eklenir.
Zaten ekli olan maçlar tekrar eklenmez.

- Maç saatleri yaklaşık (TSİ) girildi; kesin saatler açıklandıkça
  `fixtures.js`'ten düzenleyebilirsin (tarihler doğrudur).
- Eleme turları (son 32, çeyrek final…) gruplar bitince belli olacağı için
  o maçları sonradan yönetici panelinden tek tek ekleyebilirsin.

---

## Dosyalar
| Dosya | Ne işe yarar |
|------|---------------|
| `index.html` | Uygulama arayüzü |
| `app.js` | Tüm mantık (tahmin, puanlama, sıralama) |
| `styles.css` | Görünüm/tasarım |
| `firebase-config.js` | **Senin doldurman gereken** ayarlar |
| `fixtures.js` | İsteğe bağlı başlangıç maç listesi |
| `manifest.json` + `assets/` | Telefonda uygulama gibi görünmesi (PWA) |

Sorun olursa tarayıcı konsolunu (F12) açıp hatayı kontrol et.

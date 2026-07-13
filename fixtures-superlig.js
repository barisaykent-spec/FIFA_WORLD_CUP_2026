// ============================================================
//  SÜPER LİG 2026-2027 — SADECE 4 BÜYÜK TAKIM
// ============================================================
//
//  Galatasaray, Fenerbahçe, Beşiktaş, Trabzonspor'un ilk 6 haftalık
//  fikstürü (rakipler doğrulanmış kaynaklardan alındı).
//
//  ⚠️ SAATLER TAHMİNİDİR. TFF/yayıncı, maçların kesin gün ve saatini
//  genelde o haftaya ~10 gün kala açıklıyor (sezon 14 Ağustos 2026'da
//  başlıyor). Şimdilik her haftanın Pazar günü 19:00'ı yer tutucu
//  olarak kullanıldı. Kesin saatler açıklandıkça bu dosya güncellenip
//  yönetici panelindeki "Süper Lig Fikstürünü Yükle" butonuyla
//  yeniden senkronlanacak (girilen skorlara dokunmaz).
//
//  Yönetici panelinden "Süper Lig Fikstürünü Yükle" butonuna basınca
//  bu maçlar Süper Lig sekmesine eklenir/güncellenir.
// ============================================================

export const SUPER_LIG_FIXTURES = [
  // --- 1. Hafta (14-17 Ağustos 2026 aralığında, kesin gün belli değil) ---
  { home: "Galatasaray",     away: "Çorum FK",       stage: "1. Hafta", kickoff: "2026-08-16T19:00" },
  { home: "Gençlerbirliği",  away: "Fenerbahçe",     stage: "1. Hafta", kickoff: "2026-08-16T19:00" },
  { home: "Beşiktaş",        away: "Eyüpspor",       stage: "1. Hafta", kickoff: "2026-08-16T19:00" },
  { home: "Kasımpaşa",       away: "Trabzonspor",    stage: "1. Hafta", kickoff: "2026-08-16T19:00" },

  // --- 2. Hafta ---
  { home: "Erzurumspor FK",  away: "Galatasaray",    stage: "2. Hafta", kickoff: "2026-08-23T19:00" },
  { home: "Fenerbahçe",      away: "Konyaspor",      stage: "2. Hafta", kickoff: "2026-08-23T19:00" },
  { home: "Alanyaspor",      away: "Beşiktaş",       stage: "2. Hafta", kickoff: "2026-08-23T19:00" },
  { home: "Trabzonspor",     away: "Başakşehir",     stage: "2. Hafta", kickoff: "2026-08-23T19:00" },

  // --- 3. Hafta ---
  { home: "Galatasaray",     away: "Göztepe",        stage: "3. Hafta", kickoff: "2026-08-30T19:00" },
  { home: "Samsunspor",      away: "Fenerbahçe",     stage: "3. Hafta", kickoff: "2026-08-30T19:00" },
  { home: "Beşiktaş",        away: "Çorum FK",       stage: "3. Hafta", kickoff: "2026-08-30T19:00" },
  { home: "Amedspor",        away: "Trabzonspor",    stage: "3. Hafta", kickoff: "2026-08-30T19:00" },

  // --- 4. Hafta (Fenerbahçe - Beşiktaş derbisi) ---
  { home: "Başakşehir",      away: "Galatasaray",    stage: "4. Hafta", kickoff: "2026-09-06T19:00" },
  { home: "Fenerbahçe",      away: "Beşiktaş",       stage: "4. Hafta", kickoff: "2026-09-06T19:00" },
  { home: "Trabzonspor",     away: "Gençlerbirliği", stage: "4. Hafta", kickoff: "2026-09-06T19:00" },

  // --- 5. Hafta ---
  { home: "Galatasaray",     away: "Kocaelispor",    stage: "5. Hafta", kickoff: "2026-09-13T19:00" },
  { home: "Gaziantep FK",    away: "Fenerbahçe",     stage: "5. Hafta", kickoff: "2026-09-13T19:00" },
  { home: "Beşiktaş",        away: "Erzurumspor FK", stage: "5. Hafta", kickoff: "2026-09-13T19:00" },
  { home: "Konyaspor",       away: "Trabzonspor",    stage: "5. Hafta", kickoff: "2026-09-13T19:00" },

  // --- 6. Hafta (Trabzonspor - Galatasaray derbisi) ---
  { home: "Trabzonspor",     away: "Galatasaray",    stage: "6. Hafta", kickoff: "2026-09-20T19:00" },
  { home: "Fenerbahçe",      away: "Eyüpspor",       stage: "6. Hafta", kickoff: "2026-09-20T19:00" },
  { home: "Amedspor",        away: "Beşiktaş",       stage: "6. Hafta", kickoff: "2026-09-20T19:00" }
];

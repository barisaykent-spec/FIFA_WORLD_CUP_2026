// ============================================================
//  2026 DÜNYA KUPASI — GRUP AŞAMASI FİKSTÜRÜ
// ============================================================
//
//  Kanada / Meksika / ABD • 11 Haziran – 19 Temmuz 2026
//  48 takım, 12 grup (A–L), 72 grup maçı.
//  Türkiye: D Grubu (ABD, Paraguay, Avustralya ile).
//
//  ⏰ SAATLER TÜRKİYE SAATİNE (TSİ) GÖREDİR ve doğrulanmıştır.
//  Maçlar Kuzey Amerika'da oynandığı için çoğu Türkiye'de gece /
//  sabaha karşıdır. Bir maça, başlama saatinden sonra artık
//  tahmin yapılamaz (otomatik kilitlenir).
//
//  Yönetici panelindeki "Fikstürü Yükle / Güncelle" butonu bu
//  listeyi lige işler: eksikleri ekler, saati değişenleri günceller,
//  listeden çıkanları temizler. Girilen skorlara dokunmaz.
//
//  Eleme turları (son 32, çeyrek final…) gruplar bitince belli
//  olacağı için, o maçları sonra "Yeni Maç Ekle" ile eklersin.
// ============================================================

export const FIXTURES = [
  // --- 1. Maç Günü ---
  { home: "Meksika",          away: "Güney Afrika",     stage: "A Grubu", kickoff: "2026-06-11T22:00" },
  { home: "Güney Kore",       away: "Çekya",            stage: "A Grubu", kickoff: "2026-06-12T05:00" },
  { home: "Kanada",           away: "Bosna Hersek",     stage: "B Grubu", kickoff: "2026-06-12T22:00" },
  { home: "ABD",              away: "Paraguay",         stage: "D Grubu", kickoff: "2026-06-13T04:00" },
  { home: "Katar",            away: "İsviçre",          stage: "B Grubu", kickoff: "2026-06-13T22:00" },
  { home: "Brezilya",         away: "Fas",              stage: "C Grubu", kickoff: "2026-06-14T01:00" },
  { home: "Haiti",            away: "İskoçya",          stage: "C Grubu", kickoff: "2026-06-14T04:00" },
  { home: "Avustralya",       away: "Türkiye",          stage: "D Grubu", kickoff: "2026-06-14T07:00" },
  { home: "Almanya",          away: "Curaçao",          stage: "E Grubu", kickoff: "2026-06-14T20:00" },
  { home: "Hollanda",         away: "Japonya",          stage: "F Grubu", kickoff: "2026-06-14T23:00" },
  { home: "Fildişi Sahili",   away: "Ekvador",          stage: "E Grubu", kickoff: "2026-06-15T02:00" },
  { home: "İsveç",            away: "Tunus",            stage: "F Grubu", kickoff: "2026-06-15T05:00" },
  { home: "İspanya",          away: "Cabo Verde",       stage: "H Grubu", kickoff: "2026-06-15T19:00" },
  { home: "Belçika",          away: "Mısır",            stage: "G Grubu", kickoff: "2026-06-15T22:00" },
  { home: "Suudi Arabistan",  away: "Uruguay",          stage: "H Grubu", kickoff: "2026-06-16T01:00" },
  { home: "İran",             away: "Yeni Zelanda",     stage: "G Grubu", kickoff: "2026-06-16T04:00" },
  { home: "Fransa",           away: "Senegal",          stage: "I Grubu", kickoff: "2026-06-16T22:00" },
  { home: "Irak",             away: "Norveç",           stage: "I Grubu", kickoff: "2026-06-17T01:00" },
  { home: "Arjantin",         away: "Cezayir",          stage: "J Grubu", kickoff: "2026-06-17T04:00" },
  { home: "Avusturya",        away: "Ürdün",            stage: "J Grubu", kickoff: "2026-06-17T07:00" },
  { home: "Portekiz",         away: "Demokratik Kongo", stage: "K Grubu", kickoff: "2026-06-17T20:00" },
  { home: "İngiltere",        away: "Hırvatistan",      stage: "L Grubu", kickoff: "2026-06-17T23:00" },
  { home: "Gana",             away: "Panama",           stage: "L Grubu", kickoff: "2026-06-18T02:00" },
  { home: "Özbekistan",       away: "Kolombiya",        stage: "K Grubu", kickoff: "2026-06-18T05:00" },

  // --- 2. Maç Günü ---
  { home: "Çekya",            away: "Güney Afrika",     stage: "A Grubu", kickoff: "2026-06-18T19:00" },
  { home: "İsviçre",          away: "Bosna Hersek",     stage: "B Grubu", kickoff: "2026-06-18T22:00" },
  { home: "Kanada",           away: "Katar",            stage: "B Grubu", kickoff: "2026-06-19T01:00" },
  { home: "Meksika",          away: "Güney Kore",       stage: "A Grubu", kickoff: "2026-06-19T04:00" },
  { home: "ABD",              away: "Avustralya",       stage: "D Grubu", kickoff: "2026-06-19T22:00" },
  { home: "İskoçya",          away: "Fas",              stage: "C Grubu", kickoff: "2026-06-20T01:00" },
  { home: "Brezilya",         away: "Haiti",            stage: "C Grubu", kickoff: "2026-06-20T03:30" },
  { home: "Türkiye",          away: "Paraguay",         stage: "D Grubu", kickoff: "2026-06-20T06:00" },
  { home: "Hollanda",         away: "İsveç",            stage: "F Grubu", kickoff: "2026-06-20T20:00" },
  { home: "Almanya",          away: "Fildişi Sahili",   stage: "E Grubu", kickoff: "2026-06-20T23:00" },
  { home: "Ekvador",          away: "Curaçao",          stage: "E Grubu", kickoff: "2026-06-21T03:00" },
  { home: "Tunus",            away: "Japonya",          stage: "F Grubu", kickoff: "2026-06-21T07:00" },
  { home: "İspanya",          away: "Suudi Arabistan",  stage: "H Grubu", kickoff: "2026-06-21T19:00" },
  { home: "Belçika",          away: "İran",             stage: "G Grubu", kickoff: "2026-06-21T22:00" },
  { home: "Uruguay",          away: "Cabo Verde",       stage: "H Grubu", kickoff: "2026-06-22T01:00" },
  { home: "Yeni Zelanda",     away: "Mısır",            stage: "G Grubu", kickoff: "2026-06-22T04:00" },
  { home: "Arjantin",         away: "Avusturya",        stage: "J Grubu", kickoff: "2026-06-22T20:00" },
  { home: "Fransa",           away: "Irak",             stage: "I Grubu", kickoff: "2026-06-23T00:00" },
  { home: "Norveç",           away: "Senegal",          stage: "I Grubu", kickoff: "2026-06-23T03:00" },
  { home: "Ürdün",            away: "Cezayir",          stage: "J Grubu", kickoff: "2026-06-23T06:00" },
  { home: "Portekiz",         away: "Özbekistan",       stage: "K Grubu", kickoff: "2026-06-23T20:00" },
  { home: "İngiltere",        away: "Gana",             stage: "L Grubu", kickoff: "2026-06-23T23:00" },
  { home: "Panama",           away: "Hırvatistan",      stage: "L Grubu", kickoff: "2026-06-24T02:00" },
  { home: "Kolombiya",        away: "Demokratik Kongo", stage: "K Grubu", kickoff: "2026-06-24T05:00" },

  // --- 3. Maç Günü (grupta son maçlar aynı saatte) ---
  { home: "İsviçre",          away: "Kanada",           stage: "B Grubu", kickoff: "2026-06-24T22:00" },
  { home: "Bosna Hersek",     away: "Katar",            stage: "B Grubu", kickoff: "2026-06-24T22:00" },
  { home: "İskoçya",          away: "Brezilya",         stage: "C Grubu", kickoff: "2026-06-25T01:00" },
  { home: "Fas",              away: "Haiti",            stage: "C Grubu", kickoff: "2026-06-25T01:00" },
  { home: "Çekya",            away: "Meksika",          stage: "A Grubu", kickoff: "2026-06-25T04:00" },
  { home: "Güney Afrika",     away: "Güney Kore",       stage: "A Grubu", kickoff: "2026-06-25T04:00" },
  { home: "Curaçao",          away: "Fildişi Sahili",   stage: "E Grubu", kickoff: "2026-06-25T23:00" },
  { home: "Ekvador",          away: "Almanya",          stage: "E Grubu", kickoff: "2026-06-25T23:00" },
  { home: "Japonya",          away: "İsveç",            stage: "F Grubu", kickoff: "2026-06-26T02:00" },
  { home: "Tunus",            away: "Hollanda",         stage: "F Grubu", kickoff: "2026-06-26T02:00" },
  { home: "Türkiye",          away: "ABD",              stage: "D Grubu", kickoff: "2026-06-26T05:00" },
  { home: "Paraguay",         away: "Avustralya",       stage: "D Grubu", kickoff: "2026-06-26T05:00" },
  { home: "Norveç",           away: "Fransa",           stage: "I Grubu", kickoff: "2026-06-26T22:00" },
  { home: "Senegal",          away: "Irak",             stage: "I Grubu", kickoff: "2026-06-26T22:00" },
  { home: "Cabo Verde",       away: "Suudi Arabistan",  stage: "H Grubu", kickoff: "2026-06-27T03:00" },
  { home: "Uruguay",          away: "İspanya",          stage: "H Grubu", kickoff: "2026-06-27T03:00" },
  { home: "Mısır",            away: "İran",             stage: "G Grubu", kickoff: "2026-06-27T06:00" },
  { home: "Yeni Zelanda",     away: "Belçika",          stage: "G Grubu", kickoff: "2026-06-27T06:00" },
  { home: "Panama",           away: "İngiltere",        stage: "L Grubu", kickoff: "2026-06-28T00:00" },
  { home: "Hırvatistan",      away: "Gana",             stage: "L Grubu", kickoff: "2026-06-28T00:00" },
  { home: "Kolombiya",        away: "Portekiz",         stage: "K Grubu", kickoff: "2026-06-28T02:30" },
  { home: "Demokratik Kongo", away: "Özbekistan",       stage: "K Grubu", kickoff: "2026-06-28T02:30" },
  { home: "Cezayir",          away: "Avusturya",        stage: "J Grubu", kickoff: "2026-06-28T05:00" },
  { home: "Ürdün",            away: "Arjantin",         stage: "J Grubu", kickoff: "2026-06-28T05:00" },

  // --- SON 32 (Eleme turu — gerçek eşleşmeler, TSİ) ---
  { home: "Güney Afrika",     away: "Kanada",           stage: "Son 32", kickoff: "2026-06-28T22:00" },
  { home: "Almanya",          away: "Paraguay",         stage: "Son 32", kickoff: "2026-06-29T20:00" },
  { home: "Brezilya",         away: "Japonya",          stage: "Son 32", kickoff: "2026-06-29T23:30" },
  { home: "Hollanda",         away: "Fas",              stage: "Son 32", kickoff: "2026-06-30T04:00" },
  { home: "Fildişi Sahili",   away: "Norveç",           stage: "Son 32", kickoff: "2026-06-30T20:00" },
  { home: "Fransa",           away: "İsveç",            stage: "Son 32", kickoff: "2026-07-01T00:00" },
  { home: "Meksika",          away: "Ekvador",          stage: "Son 32", kickoff: "2026-07-01T04:00" },
  { home: "İngiltere",        away: "Demokratik Kongo", stage: "Son 32", kickoff: "2026-07-01T19:00" },
  { home: "Belçika",          away: "Senegal",          stage: "Son 32", kickoff: "2026-07-01T23:00" },
  { home: "ABD",              away: "Bosna Hersek",     stage: "Son 32", kickoff: "2026-07-02T03:00" },
  { home: "İspanya",          away: "Avusturya",        stage: "Son 32", kickoff: "2026-07-02T22:00" },
  { home: "Portekiz",         away: "Hırvatistan",      stage: "Son 32", kickoff: "2026-07-03T02:00" },
  { home: "İsviçre",          away: "Cezayir",          stage: "Son 32", kickoff: "2026-07-03T06:00" },
  { home: "Avustralya",       away: "Mısır",            stage: "Son 32", kickoff: "2026-07-03T21:00" },
  { home: "Arjantin",         away: "Cabo Verde",       stage: "Son 32", kickoff: "2026-07-04T01:00" },
  { home: "Kolombiya",        away: "Gana",             stage: "Son 32", kickoff: "2026-07-04T04:30" },

  // --- SON 16 (Eleme turu — gerçek eşleşmeler, TSİ) ---
  { home: "Kanada",           away: "Fas",              stage: "Son 16", kickoff: "2026-07-04T20:00" },
  { home: "Paraguay",         away: "Fransa",           stage: "Son 16", kickoff: "2026-07-05T00:00" },
  { home: "Brezilya",         away: "Norveç",           stage: "Son 16", kickoff: "2026-07-05T23:00" },
  { home: "Meksika",          away: "İngiltere",        stage: "Son 16", kickoff: "2026-07-06T03:00" },
  { home: "Portekiz",         away: "İspanya",          stage: "Son 16", kickoff: "2026-07-06T22:00" },
  { home: "ABD",              away: "Belçika",          stage: "Son 16", kickoff: "2026-07-07T03:00" },
  { home: "Arjantin",         away: "Mısır",            stage: "Son 16", kickoff: "2026-07-07T19:00" },
  { home: "İsviçre",          away: "Kolombiya",        stage: "Son 16", kickoff: "2026-07-07T23:00" }
];

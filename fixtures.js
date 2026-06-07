// ============================================================
//  2026 DÜNYA KUPASI — GRUP AŞAMASI FİKSTÜRÜ
// ============================================================
//
//  Kanada / Meksika / ABD • 11 Haziran – 19 Temmuz 2026
//  48 takım, 12 grup (A–L), 72 grup maçı.
//  Türkiye: D Grubu (ABD, Paraguay, Avustralya ile).
//
//  Yönetici panelindeki "Başlangıç Fikstürünü Yükle" butonuna
//  basınca bu maçlar lige eklenir (zaten varsa tekrar eklenmez).
//
//  NOT: kickoff = maçın başlama tarih/saati. Saatler yaklaşık
//  Türkiye saatine göre konuldu; kesin saatler açıklandıkça
//  buradan düzenleyebilirsin (tarihler doğrudur). Bu saatten
//  sonra ilgili maça artık tahmin yapılamaz (otomatik kilitlenir).
//
//  Eleme turları (son 32, çeyrek final vb.) gruplar bitince
//  belli olacağı için, o maçları daha sonra yönetici panelinden
//  tek tek ekleyebilirsin.
// ============================================================

export const FIXTURES = [
  // --- 1. Maç Günü ---
  { home: "Meksika",          away: "Güney Afrika",     stage: "A Grubu", kickoff: "2026-06-11T20:00" },
  { home: "Güney Kore",       away: "Çekya",            stage: "A Grubu", kickoff: "2026-06-11T23:00" },

  { home: "Kanada",           away: "Bosna Hersek",     stage: "B Grubu", kickoff: "2026-06-12T20:00" },
  { home: "ABD",              away: "Paraguay",         stage: "D Grubu", kickoff: "2026-06-12T23:00" },

  { home: "Katar",            away: "İsviçre",          stage: "B Grubu", kickoff: "2026-06-13T19:00" },
  { home: "Brezilya",         away: "Fas",              stage: "C Grubu", kickoff: "2026-06-13T20:00" },
  { home: "Haiti",            away: "İskoçya",          stage: "C Grubu", kickoff: "2026-06-13T22:00" },
  { home: "Avustralya",       away: "Türkiye",          stage: "D Grubu", kickoff: "2026-06-13T23:00" },

  { home: "Almanya",          away: "Curaçao",          stage: "E Grubu", kickoff: "2026-06-14T19:00" },
  { home: "Hollanda",         away: "Japonya",          stage: "F Grubu", kickoff: "2026-06-14T20:00" },
  { home: "Fildişi Sahili",   away: "Ekvador",          stage: "E Grubu", kickoff: "2026-06-14T22:00" },
  { home: "İsveç",            away: "Tunus",            stage: "F Grubu", kickoff: "2026-06-14T23:00" },

  { home: "İspanya",          away: "Cabo Verde",       stage: "H Grubu", kickoff: "2026-06-15T19:00" },
  { home: "Belçika",          away: "Mısır",            stage: "G Grubu", kickoff: "2026-06-15T20:00" },
  { home: "Suudi Arabistan",  away: "Uruguay",          stage: "H Grubu", kickoff: "2026-06-15T22:00" },
  { home: "İran",             away: "Yeni Zelanda",     stage: "G Grubu", kickoff: "2026-06-15T23:00" },

  { home: "Fransa",           away: "Senegal",          stage: "I Grubu", kickoff: "2026-06-16T19:00" },
  { home: "Irak",             away: "Norveç",           stage: "I Grubu", kickoff: "2026-06-16T20:00" },
  { home: "Arjantin",         away: "Cezayir",          stage: "J Grubu", kickoff: "2026-06-16T22:00" },
  { home: "Avusturya",        away: "Ürdün",            stage: "J Grubu", kickoff: "2026-06-16T23:00" },

  { home: "Portekiz",         away: "Demokratik Kongo", stage: "K Grubu", kickoff: "2026-06-17T19:00" },
  { home: "İngiltere",        away: "Hırvatistan",      stage: "L Grubu", kickoff: "2026-06-17T20:00" },
  { home: "Gana",             away: "Panama",           stage: "L Grubu", kickoff: "2026-06-17T22:00" },
  { home: "Özbekistan",       away: "Kolombiya",        stage: "K Grubu", kickoff: "2026-06-17T23:00" },

  // --- 2. Maç Günü ---
  { home: "Çekya",            away: "Güney Afrika",     stage: "A Grubu", kickoff: "2026-06-18T19:00" },
  { home: "İsviçre",          away: "Bosna Hersek",     stage: "B Grubu", kickoff: "2026-06-18T20:00" },
  { home: "Kanada",           away: "Katar",            stage: "B Grubu", kickoff: "2026-06-18T22:00" },
  { home: "Meksika",          away: "Güney Kore",       stage: "A Grubu", kickoff: "2026-06-18T23:00" },

  { home: "ABD",              away: "Avustralya",       stage: "D Grubu", kickoff: "2026-06-19T19:00" },
  { home: "İskoçya",          away: "Fas",              stage: "C Grubu", kickoff: "2026-06-19T20:00" },
  { home: "Brezilya",         away: "Haiti",            stage: "C Grubu", kickoff: "2026-06-19T22:00" },
  { home: "Türkiye",          away: "Paraguay",         stage: "D Grubu", kickoff: "2026-06-19T23:00" },

  { home: "Hollanda",         away: "İsveç",            stage: "F Grubu", kickoff: "2026-06-20T19:00" },
  { home: "Almanya",          away: "Fildişi Sahili",   stage: "E Grubu", kickoff: "2026-06-20T20:00" },
  { home: "Ekvador",          away: "Curaçao",          stage: "E Grubu", kickoff: "2026-06-20T22:00" },
  { home: "Tunus",            away: "Japonya",          stage: "F Grubu", kickoff: "2026-06-20T23:00" },

  { home: "İspanya",          away: "Suudi Arabistan",  stage: "H Grubu", kickoff: "2026-06-21T19:00" },
  { home: "Belçika",          away: "İran",             stage: "G Grubu", kickoff: "2026-06-21T20:00" },
  { home: "Uruguay",          away: "Cabo Verde",       stage: "H Grubu", kickoff: "2026-06-21T22:00" },
  { home: "Yeni Zelanda",     away: "Mısır",            stage: "G Grubu", kickoff: "2026-06-21T23:00" },

  { home: "Arjantin",         away: "Avusturya",        stage: "J Grubu", kickoff: "2026-06-22T19:00" },
  { home: "Fransa",           away: "Irak",             stage: "I Grubu", kickoff: "2026-06-22T20:00" },
  { home: "Norveç",           away: "Senegal",          stage: "I Grubu", kickoff: "2026-06-22T22:00" },
  { home: "Ürdün",            away: "Cezayir",          stage: "J Grubu", kickoff: "2026-06-22T23:00" },

  { home: "Portekiz",         away: "Özbekistan",       stage: "K Grubu", kickoff: "2026-06-23T19:00" },
  { home: "İngiltere",        away: "Gana",             stage: "L Grubu", kickoff: "2026-06-23T20:00" },
  { home: "Panama",           away: "Hırvatistan",      stage: "L Grubu", kickoff: "2026-06-23T22:00" },
  { home: "Kolombiya",        away: "Demokratik Kongo", stage: "K Grubu", kickoff: "2026-06-23T23:00" },

  // --- 3. Maç Günü (grupta son maçlar aynı saatte) ---
  { home: "İsviçre",          away: "Kanada",           stage: "B Grubu", kickoff: "2026-06-24T18:00" },
  { home: "Bosna Hersek",     away: "Katar",            stage: "B Grubu", kickoff: "2026-06-24T18:00" },
  { home: "İskoçya",          away: "Brezilya",         stage: "C Grubu", kickoff: "2026-06-24T21:00" },
  { home: "Fas",              away: "Haiti",            stage: "C Grubu", kickoff: "2026-06-24T21:00" },
  { home: "Çekya",            away: "Meksika",          stage: "A Grubu", kickoff: "2026-06-24T23:00" },
  { home: "Güney Afrika",     away: "Güney Kore",       stage: "A Grubu", kickoff: "2026-06-24T23:00" },

  { home: "Ekvador",          away: "Almanya",          stage: "E Grubu", kickoff: "2026-06-25T18:00" },
  { home: "Curaçao",          away: "Fildişi Sahili",   stage: "E Grubu", kickoff: "2026-06-25T18:00" },
  { home: "Japonya",          away: "İsveç",            stage: "F Grubu", kickoff: "2026-06-25T21:00" },
  { home: "Tunus",            away: "Hollanda",         stage: "F Grubu", kickoff: "2026-06-25T21:00" },
  { home: "Türkiye",          away: "ABD",              stage: "D Grubu", kickoff: "2026-06-25T23:00" },
  { home: "Paraguay",         away: "Avustralya",       stage: "D Grubu", kickoff: "2026-06-25T23:00" },

  { home: "Norveç",           away: "Fransa",           stage: "I Grubu", kickoff: "2026-06-26T18:00" },
  { home: "Senegal",          away: "Irak",             stage: "I Grubu", kickoff: "2026-06-26T18:00" },
  { home: "Cabo Verde",       away: "Suudi Arabistan",  stage: "H Grubu", kickoff: "2026-06-26T21:00" },
  { home: "Uruguay",          away: "İspanya",          stage: "H Grubu", kickoff: "2026-06-26T21:00" },
  { home: "Mısır",            away: "İran",             stage: "G Grubu", kickoff: "2026-06-26T23:00" },
  { home: "Yeni Zelanda",     away: "Belçika",          stage: "G Grubu", kickoff: "2026-06-26T23:00" },

  { home: "Panama",           away: "İngiltere",        stage: "L Grubu", kickoff: "2026-06-27T18:00" },
  { home: "Hırvatistan",      away: "Gana",             stage: "L Grubu", kickoff: "2026-06-27T18:00" },
  { home: "Kolombiya",        away: "Portekiz",         stage: "K Grubu", kickoff: "2026-06-27T21:00" },
  { home: "Demokratik Kongo", away: "Özbekistan",       stage: "K Grubu", kickoff: "2026-06-27T21:00" },
  { home: "Cezayir",          away: "Avusturya",        stage: "J Grubu", kickoff: "2026-06-27T23:00" },
  { home: "Ürdün",            away: "Arjantin",         stage: "J Grubu", kickoff: "2026-06-27T23:00" }
];

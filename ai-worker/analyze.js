/* ============================================================
 *  YAPAY ZEKA MAÇ ANALİZİ — Cloudflare Worker
 * ------------------------------------------------------------
 *  Bu dosya bir Cloudflare Worker'dır. Uygulamanın (GitHub Pages)
 *  içine Groq API anahtarını doğrudan yazamayız (herkes görür ve
 *  kötüye kullanabilir) — bu yüzden anahtar burada, gizli bir
 *  ortam değişkeni (secret) olarak saklanır. Uygulama sadece bu
 *  Worker'ın adresine istek atar, Worker da Groq'a bağlanıp
 *  cevabı geri döner.
 *
 *  ⚙️ KURULUM (tek seferlik, ~5 dakika):
 *  1) https://console.groq.com adresinden ücretsiz kayıt ol
 *     (kart istemez) → sol menü "API Keys" → "Create API Key"
 *     → oluşan anahtarı kopyala.
 *  2) https://dash.cloudflare.com adresinden ücretsiz kayıt ol
 *     (kart istemez) → sol menü "Workers & Pages" → "Create"
 *     → "Create Worker" (Hello World şablonu) → bir isim ver
 *     (örn. "wc-ai-analiz") → Deploy.
 *  3) Deploy olan Worker'ı aç → "Edit code" → içindeki örnek kodu
 *     SİL, bu dosyanın TAMAMINI yapıştır → sağ üstten "Deploy".
 *  4) Worker sayfasında "Settings" → "Variables and Secrets" →
 *     "Add" → İsim: GROQ_API_KEY, Değer: (1. adımda aldığın anahtar)
 *     → tipini "Secret" seç → Save & Deploy.
 *  5) Worker'ın adresi (örn. https://wc-ai-analiz.SENIN-ADIN.workers.dev)
 *     sayfanın üstünde görünür. Bu adresi kopyala ve bana gönder —
 *     ben firebase-config.js dosyasına ekleyip yayınlayacağım.
 * ============================================================ */

const ALLOWED_ORIGIN = "https://barisaykent-spec.github.io";
const MODEL = "openai/gpt-oss-120b";

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") {
      return new Response("Sadece POST kabul edilir.", { status: 405, headers: cors });
    }

    let body;
    try { body = await request.json(); } catch {
      return new Response(JSON.stringify({ error: "Geçersiz istek gövdesi." }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const home = String(body.home || "").slice(0, 60).trim();
    const away = String(body.away || "").slice(0, 60).trim();
    const stage = String(body.stage || "").slice(0, 60).trim();
    if (!home || !away) {
      return new Response(JSON.stringify({ error: "home/away gerekli." }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const prompt =
      `${stage ? stage + " maçı: " : ""}${home} - ${away}.\n` +
      `Bu iki futbol takımını karşılaştıran, samimi ve eğlenceli bir yorum yaz. ` +
      `Oyun tarzları, güçlü/zayıf yönleri ve varsa aralarındaki rekabeti kısaca değerlendir. ` +
      `80-110 kelime, akıcı Türkçe. Kesin skor tahmini verme, bahis/oran dili kullanma — ` +
      `sadece futbolseverlere yönelik keyifli bir ön analiz olsun.`;

    let groqRes;
    try {
      groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: "Sen samimi, esprili ve bilgili bir futbol yorumcususun. Kısa, akıcı Türkçe yazarsın." },
            { role: "user", content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 250
        })
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Groq bağlantı hatası." }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (!groqRes.ok) {
      const detail = await groqRes.text();
      return new Response(JSON.stringify({ error: "Groq isteği başarısız.", detail: detail.slice(0, 300) }),
        { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const data = await groqRes.json();
    const comment = data.choices?.[0]?.message?.content?.trim() || "Yorum alınamadı, tekrar dene.";

    return new Response(JSON.stringify({ comment }), { headers: { ...cors, "Content-Type": "application/json" } });
  }
};

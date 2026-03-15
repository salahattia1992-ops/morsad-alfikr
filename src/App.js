import { useState, useEffect, useCallback, useRef } from "react";

const THINK_TANKS = [
  { id: 1, nameAr: "معهد كارنيغي للسلام الدولي", region: "أمريكا", flag: "🇺🇸", rss: "https://carnegieendowment.org/publications/rss/", color: "#c41230", accent: "#ff4d6d" },
  { id: 2, nameAr: "مؤسسة راند", region: "أمريكا", flag: "🇺🇸", rss: "https://www.rand.org/publications/rss/articles.xml", color: "#003087", accent: "#4d8bf5" },
  { id: 3, nameAr: "معهد بروكينغز", region: "أمريكا", flag: "🇺🇸", rss: "https://www.brookings.edu/feed/", color: "#005288", accent: "#00a0e3" },
  { id: 4, nameAr: "مجلس العلاقات الخارجية", region: "أمريكا", flag: "🇺🇸", rss: "https://www.cfr.org/rss/all", color: "#1a1a2e", accent: "#e94560" },
  { id: 5, nameAr: "مؤسسة هيريتاج", region: "أمريكا", flag: "🇺🇸", rss: "https://www.heritage.org/rss/research", color: "#bf0a30", accent: "#ff6b35" },
  { id: 6, nameAr: "مركز الدراسات الاستراتيجية والدولية", region: "أمريكا", flag: "🇺🇸", rss: "https://www.csis.org/publications/rss.xml", color: "#0d2137", accent: "#00d4ff" },
  { id: 7, nameAr: "المجلس الأطلسي", region: "أمريكا", flag: "🇺🇸", rss: "https://www.atlanticcouncil.org/feed/", color: "#002868", accent: "#6ab0de" },
  { id: 8, nameAr: "مركز ويلسون", region: "أمريكا", flag: "🇺🇸", rss: "https://www.wilsoncenter.org/rss.xml", color: "#1b3a4b", accent: "#40c9a2" },
  { id: 9, nameAr: "معهد المشروع الأمريكي", region: "أمريكا", flag: "🇺🇸", rss: "https://www.aei.org/feed/", color: "#8b0000", accent: "#ff8c00" },
  { id: 10, nameAr: "مؤسسة هوفر", region: "أمريكا", flag: "🇺🇸", rss: "https://www.hoover.org/hoover.rss", color: "#8c1515", accent: "#ffd700" },
  { id: 11, nameAr: "مركز ستيمسون", region: "أمريكا", flag: "🇺🇸", rss: "https://www.stimson.org/feed/", color: "#1a3a2a", accent: "#3ddc97" },
  { id: 12, nameAr: "معهد الشرق الأوسط", region: "أمريكا", flag: "🇺🇸", rss: "https://www.mei.edu/rss", color: "#2d1b69", accent: "#c77dff" },
  { id: 13, nameAr: "تشاتام هاوس", region: "أوروبا", flag: "🇬🇧", rss: "https://www.chathamhouse.org/rss/chatham-house-news", color: "#012169", accent: "#cf142b" },
  { id: 14, nameAr: "المعهد الدولي للدراسات الاستراتيجية", region: "أوروبا", flag: "🇬🇧", rss: "https://www.iiss.org/rss", color: "#1c1c3a", accent: "#e8b84b" },
  { id: 15, nameAr: "أكسفورد أناليتيكا", region: "أوروبا", flag: "🇬🇧", rss: "https://oxan.com/feed/", color: "#002147", accent: "#a6c8ff" },
  { id: 16, nameAr: "المجلس الأوروبي للعلاقات الخارجية", region: "أوروبا", flag: "🇪🇺", rss: "https://ecfr.eu/feed/", color: "#003399", accent: "#ffcc00" },
  { id: 17, nameAr: "معهد بروغل", region: "أوروبا", flag: "🇧🇪", rss: "https://www.bruegel.org/rss", color: "#1a1a6e", accent: "#4fc3f7" },
  { id: 18, nameAr: "معهد ستوكهولم لأبحاث السلام", region: "أوروبا", flag: "🇸🇪", rss: "https://www.sipri.org/rss.xml", color: "#006aa7", accent: "#fecc02" },
  { id: 19, nameAr: "صندوق مارشال الألماني", region: "أوروبا", flag: "🇩🇪", rss: "https://www.gmfus.org/feed", color: "#1a1a1a", accent: "#dd0000" },
  { id: 20, nameAr: "معهد مونتين", region: "أوروبا", flag: "🇫🇷", rss: "https://www.institutmontaigne.org/en/rss.xml", color: "#002395", accent: "#ed2939" },
  { id: 21, nameAr: "المعهد الإيطالي للدراسات السياسية", region: "أوروبا", flag: "🇮🇹", rss: "https://www.ispionline.it/en/rss", color: "#009246", accent: "#ce2b37" },
  { id: 22, nameAr: "نادي فالداي للنقاش", region: "روسيا", flag: "🇷🇺", rss: "https://valdaiclub.com/rss/", color: "#cc0000", accent: "#ffd700" },
  { id: 23, nameAr: "المجلس الروسي للشؤون الدولية", region: "روسيا", flag: "🇷🇺", rss: "https://russiancouncil.ru/en/rss/", color: "#1a237e", accent: "#ef5350" },
  { id: 24, nameAr: "أكاديمية العلوم الاجتماعية الصينية", region: "آسيا", flag: "🇨🇳", rss: "http://www.cass.cn/rss", color: "#8b0000", accent: "#ffd700" },
  { id: 25, nameAr: "معاهد شنغهاي للدراسات الدولية", region: "آسيا", flag: "🇨🇳", rss: "https://www.siis.org.cn/rss", color: "#c0392b", accent: "#f39c12" },
  { id: 26, nameAr: "معهد الصين للدراسات الدولية", region: "آسيا", flag: "🇨🇳", rss: "http://www.ciis.org.cn/rss", color: "#922b21", accent: "#e74c3c" },
  { id: 27, nameAr: "معهد جنوب شرق آسيا", region: "آسيا", flag: "🇸🇬", rss: "https://www.iseas.edu.sg/medias/feed/", color: "#003d6b", accent: "#e74c3c" },
  { id: 28, nameAr: "مؤسسة أبحاث أوبزرفر", region: "آسيا", flag: "🇮🇳", rss: "https://www.orfonline.org/feed/", color: "#ff6600", accent: "#138808" },
  { id: 29, nameAr: "مركز الجزيرة للدراسات", region: "عربي", flag: "🇶🇦", rss: "https://studies.aljazeera.net/ar/rss.xml", color: "#4b0082", accent: "#ffd700" },
  { id: 30, nameAr: "مركز بروكينغز الدوحة", region: "عربي", flag: "🇶🇦", rss: "https://www.brookings.edu/center/brookings-doha-center/feed/", color: "#005288", accent: "#c8a951" },
];

const REGIONS = ["الكل", "أمريكا", "أوروبا", "روسيا", "آسيا", "عربي"];
const AUTO_REFRESH_MINUTES = 30;

async function fetchRSS(url) {
  const proxies = [
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=5`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  ];
  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy, { signal: AbortSignal.timeout(8000) });
      const data = await res.json();
      if (proxy.includes("rss2json") && data.status === "ok" && data.items?.length) {
        return data.items.map(item => ({
          title: item.title || "",
          description: item.description?.replace(/<[^>]*>/g, "").slice(0, 300) || "",
          link: item.link || "",
          date: item.pubDate || "",
        }));
      }
      if (proxy.includes("allorigins") && data.contents) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const items = [...xml.querySelectorAll("item")].slice(0, 5);
        if (items.length) {
          return items.map(item => ({
            title: item.querySelector("title")?.textContent || "",
            description: (item.querySelector("description")?.textContent || "").replace(/<[^>]*>/g, "").slice(0, 300),
            link: item.querySelector("link")?.textContent || "",
            date: item.querySelector("pubDate")?.textContent || "",
          }));
        }
      }
    } catch { continue; }
  }
  return null;
}

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("الكل");
  const [selectedTank, setSelectedTank] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [translating, setTranslating] = useState({});
  const [translations, setTranslations] = useState({});
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [fetchStatus, setFetchStatus] = useState({});
  const [activeView, setActiveView] = useState("grid");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("morsad_favorites") || "[]"); } catch { return []; }
  });
  const [articleCounts, setArticleCounts] = useState({});
  const [lastRefresh, setLastRefresh] = useState(null);
  const [nextRefreshIn, setNextRefreshIn] = useState(AUTO_REFRESH_MINUTES * 60);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("articles");
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const toggleFavorite = (articleId) => {
    setFavorites(prev => {
      const updated = prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId];
      try { localStorage.setItem("morsad_favorites", JSON.stringify(updated)); } catch {}
      showNotif(prev.includes(articleId) ? "تمت إزالة المقالة من المفضلة" : "✨ تمت إضافة المقالة للمفضلة");
      return updated;
    });
  };

  const filteredTanks = THINK_TANKS.filter(t => selectedRegion === "الكل" || t.region === selectedRegion);

  const doFetch = useCallback(async (tanks, silent = false) => {
    if (!silent) { setLoading(true); setArticles([]); }
    else setRefreshing(true);

    const initStatus = {};
    tanks.forEach(t => { initStatus[t.id] = "loading"; });
    setFetchStatus(prev => ({ ...prev, ...initStatus }));

    const allArticles = [];

    await Promise.allSettled(tanks.map(async (tank) => {
      const items = await fetchRSS(tank.rss);
      if (items && items.length > 0) {
        setFetchStatus(prev => ({ ...prev, [tank.id]: "ok" }));
        setArticleCounts(prev => ({ ...prev, [tank.id]: items.length }));
        items.forEach((item, i) => {
          allArticles.push({
            id: `${tank.id}-${i}-${Date.now()}`,
            stableId: `${tank.id}-${i}`,
            tankId: tank.id,
            tankName: tank.nameAr,
            tankColor: tank.color,
            tankAccent: tank.accent,
            flag: tank.flag,
            region: tank.region,
            title: item.title,
            description: item.description,
            link: item.link,
            date: item.date,
          });
        });
      } else {
        setFetchStatus(prev => ({ ...prev, [tank.id]: "error" }));
      }
    }));

    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    setArticles([...allArticles]);
    setLastRefresh(new Date());
    setNextRefreshIn(AUTO_REFRESH_MINUTES * 60);
    setLoading(false);
    setRefreshing(false);
    if (allArticles.length > 0) {
      showNotif(`✅ تم تحميل ${allArticles.length} مقالة`);
    } else {
      showNotif("⚠️ لم تُحمَّل مقالات، تحقق من الاتصال", "error");
    }
  }, []);

  useEffect(() => {
    const tanks = selectedTank ? THINK_TANKS.filter(t => t.id === selectedTank) : filteredTanks;
    doFetch(tanks);
    clearInterval(timerRef.current);
    clearInterval(countdownRef.current);
    timerRef.current = setInterval(() => doFetch(tanks, true), AUTO_REFRESH_MINUTES * 60 * 1000);
    countdownRef.current = setInterval(() => setNextRefreshIn(prev => prev > 0 ? prev - 1 : AUTO_REFRESH_MINUTES * 60), 1000);
    return () => { clearInterval(timerRef.current); clearInterval(countdownRef.current); };
  }, [selectedRegion, selectedTank]);

  const handleManualRefresh = () => {
    const tanks = selectedTank ? THINK_TANKS.filter(t => t.id === selectedTank) : filteredTanks;
    doFetch(tanks, true);
  };

  const translateArticle = async (article) => {
    const key = article.stableId;
    if (translations[key]) { setExpandedArticle(expandedArticle === key ? null : key); return; }
    setTranslating(prev => ({ ...prev, [key]: true }));
    setExpandedArticle(key);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `ترجم هذا المقال من المركز البحثي "${article.tankName}" إلى العربية الفصحى. أجب بـ JSON فقط:\n{"title":"العنوان","summary":"ملخص 3-4 جمل","keyPoints":["نقطة 1","نقطة 2","نقطة 3"]}\n\nالعنوان: ${article.title}\nالمحتوى: ${article.description}` }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setTranslations(prev => ({ ...prev, [key]: parsed }));
    } catch {
      setTranslations(prev => ({ ...prev, [key]: { title: "تعذّرت الترجمة", summary: "يُرجى المحاولة مجدداً.", keyPoints: [] } }));
    }
    setTranslating(prev => ({ ...prev, [key]: false }));
  };

  const filteredArticles = articles.filter(a => {
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.tankName.includes(searchQuery);
    return matchSearch;
  });

  const favoriteArticles = articles.filter(a => favorites.includes(a.stableId));
  const formatDate = (d) => { try { return new Date(d).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }); } catch { return ""; } };
  const formatCountdown = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const statsData = THINK_TANKS.map(t => ({ ...t, count: articles.filter(a => a.tankId === t.id).length, status: fetchStatus[t.id] })).filter(t => t.count > 0).sort((a, b) => b.count - a.count);

  const ArticleCard = ({ article }) => {
    const key = article.stableId;
    const isExpanded = expandedArticle === key;
    const trans = translations[key];
    const isTranslating = translating[key];
    const isFav = favorites.includes(key);
    return (
      <article style={{ borderRadius: 18, background: isExpanded ? `linear-gradient(135deg, ${article.tankColor}22, rgba(8,8,20,0.98))` : "rgba(255,255,255,0.03)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.3s" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${article.tankColor}, ${article.tankAccent})` }} />
        <div style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{article.flag}</span>
              <div>
                <div style={{ fontSize: 11, color: article.tankAccent, fontWeight: 700 }}>{article.tankName}</div>
                <div style={{ fontSize: 10, color: "#555" }}>{formatDate(article.date)}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${article.tankColor}44`, color: article.tankAccent, border: `1px solid ${article.tankColor}66` }}>{article.region}</span>
              <button onClick={() => toggleFavorite(key)} style={{ background: isFav ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${isFav ? "rgba(255,215,0,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontSize: 14, color: isFav ? "#ffd700" : "#555" }}>{isFav ? "★" : "☆"}</button>
            </div>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f8", lineHeight: 1.7, marginBottom: 10 }}>{article.title}</h3>
          {!isExpanded && <p style={{ fontSize: 12, color: "#555", lineHeight: 1.8, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.description}</p>}
          {isExpanded && (
            <div style={{ marginBottom: 14 }}>
              {isTranslating && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, background: "rgba(212,175,55,0.08)", borderRadius: 12, border: "1px solid rgba(212,175,55,0.2)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d4af37", animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: 13, color: "#d4af37" }}>جارٍ الترجمة بالذكاء الاصطناعي...</span>
                </div>
              )}
              {trans && !isTranslating && (
                <div style={{ background: "rgba(212,175,55,0.06)", borderRadius: 14, padding: 16, border: "1px solid rgba(212,175,55,0.15)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span>✨</span><span style={{ fontSize: 11, color: "#d4af37", fontWeight: 700 }}>ترجمة بالذكاء الاصطناعي</span>
                  </div>
                  {trans.title && <h4 style={{ fontSize: 15, fontWeight: 800, color: "#f5f0d8", marginBottom: 10, lineHeight: 1.6 }}>{trans.title}</h4>}
                  {trans.summary && <p style={{ fontSize: 13, color: "#b0a898", lineHeight: 2, marginBottom: 12 }}>{trans.summary}</p>}
                  {trans.keyPoints?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: "#d4af37", marginBottom: 8 }}>النقاط الرئيسية:</div>
                      {trans.keyPoints.map((pt, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                          <span style={{ color: article.tankAccent, fontSize: 10, marginTop: 5, flexShrink: 0 }}>◆</span>
                          <span style={{ fontSize: 12, color: "#c0b898", lineHeight: 1.8 }}>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => translateArticle(article)} style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: isExpanded ? `linear-gradient(135deg, ${article.tankColor}, ${article.tankAccent})` : "rgba(212,175,55,0.12)", color: isExpanded ? "#fff" : "#d4af37", fontSize: 12, fontWeight: 700, fontFamily: "Cairo", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {isTranslating ? "⚡ جارٍ الترجمة..." : isExpanded ? "✕ إغلاق" : "🌐 ترجم المقال"}
            </button>
            <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ padding: "9px 12px", borderRadius: 10, fontSize: 13, background: "rgba(255,255,255,0.05)", color: "#777", textDecoration: "none", border: "1px solid rgba(255,255,255,0.08)" }}>↗</a>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #030308 0%, #0a0a18 50%, #050510 100%)", fontFamily: "'Cairo', sans-serif", color: "#e8e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0a0a18}::-webkit-scrollbar-thumb{background:#8b6914;border-radius:3px}
        .pulse{animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .spin{animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .notif{animation:notifIn 0.3s ease}@keyframes notifIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .shimmer{background:linear-gradient(90deg,#0f0f24 25%,#1a1a35 50%,#0f0f24 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .card:hover{transform:translateY(-4px);border-color:rgba(212,175,55,0.25) !important;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
        .card{transition:all 0.3s ease}
        button{font-family:Cairo}
      `}</style>

      {notification && (
        <div className="notif" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: notification.type === "success" ? "rgba(61,220,151,0.15)" : "rgba(255,77,109,0.15)", border: `1px solid ${notification.type === "success" ? "rgba(61,220,151,0.4)" : "rgba(255,77,109,0.4)"}`, color: notification.type === "success" ? "#3ddc97" : "#ff4d6d", padding: "12px 24px", borderRadius: 30, fontSize: 13, fontWeight: 600, zIndex: 9999, backdropFilter: "blur(20px)", whiteSpace: "nowrap" }}>{notification.msg}</div>
      )}

      <header style={{ background: "rgba(5,5,18,0.95)", borderBottom: "1px solid rgba(212,175,55,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, padding: "0 20px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #d4af37, #8b6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 20px rgba(212,175,55,0.35)" }}>🔭</div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 900, color: "#d4af37", textShadow: "0 0 30px rgba(212,175,55,0.4)" }}>مرصد الفكر العالمي</h1>
              <p style={{ fontSize: 9, color: "#666", letterSpacing: 1 }}>GLOBAL THINK TANK MONITOR</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", padding: "5px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 9, color: "#555" }}>التحديث التالي</div>
              <div style={{ fontSize: 12, color: "#d4af37", fontWeight: 700 }}>{formatCountdown(nextRefreshIn)}</div>
            </div>
            <button onClick={handleManualRefresh} disabled={refreshing || loading} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.08)", color: "#d4af37", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, opacity: (refreshing || loading) ? 0.7 : 1 }}>
              <span className={refreshing ? "spin" : ""}>↻</span>{refreshing ? "جارٍ..." : "تحديث"}
            </button>
            <div style={{ position: "relative" }}>
              <input placeholder="ابحث..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: "8px 32px 8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8f0", fontSize: 12, outline: "none", width: 180 }} />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 14 }}>🔍</span>
            </div>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
              {["grid", "list"].map(v => (
                <button key={v} onClick={() => setActiveView(v)} style={{ padding: "7px 11px", border: "none", cursor: "pointer", fontSize: 14, background: activeView === v ? "rgba(212,175,55,0.15)" : "transparent", color: activeView === v ? "#d4af37" : "#666" }}>{v === "grid" ? "⊞" : "☰"}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 4 }}>
          {[{ key: "articles", label: "المقالات", icon: "📰", count: articles.length }, { key: "favorites", label: "المفضلة", icon: "★", count: favorites.length }, { key: "stats", label: "الإحصاءات", icon: "📊", count: null }].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: "9px 18px", borderRadius: "10px 10px 0 0", fontSize: 12, fontWeight: tab.key === activeTab ? 700 : 400, background: tab.key === activeTab ? "rgba(212,175,55,0.12)" : "transparent", color: tab.key === activeTab ? "#d4af37" : "#666", border: "none", borderBottom: tab.key === activeTab ? "2px solid #d4af37" : "2px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <span>{tab.icon}</span>{tab.label}
              {tab.count > 0 && <span style={{ background: tab.key === activeTab ? "#d4af37" : "rgba(255,255,255,0.1)", color: tab.key === activeTab ? "#000" : "#888", borderRadius: 20, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{tab.count}</span>}
            </button>
          ))}
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 20px" }}>

        {activeTab === "articles" && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => { setSelectedRegion(r); setSelectedTank(null); }} style={{ padding: "7px 16px", borderRadius: 30, fontSize: 12, background: selectedRegion === r ? "linear-gradient(135deg, #d4af37, #8b6914)" : "rgba(255,255,255,0.05)", color: selectedRegion === r ? "#000" : "#aaa", fontWeight: selectedRegion === r ? 700 : 400, border: "none", cursor: "pointer", boxShadow: selectedRegion === r ? "0 4px 16px rgba(212,175,55,0.35)" : "none" }}>{r === "الكل" ? "🌍 " : ""}{r}</button>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#d4af37", letterSpacing: 2, marginBottom: 12, fontWeight: 600 }}>◆ المراكز البحثية — {filteredTanks.length} مركزاً</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {filteredTanks.map(tank => (
                  <div key={tank.id} onClick={() => setSelectedTank(selectedTank === tank.id ? null : tank.id)} style={{ padding: "6px 12px", borderRadius: 10, background: selectedTank === tank.id ? `linear-gradient(135deg, ${tank.color}bb, ${tank.color}77)` : "rgba(255,255,255,0.03)", border: `1px solid ${selectedTank === tank.id ? "#d4af37" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", gap: 7, cursor: "pointer", transition: "all 0.2s" }}>
                    <span style={{ fontSize: 14 }}>{tank.flag}</span>
                    <span style={{ fontSize: 11, color: selectedTank === tank.id ? "#fff" : "#aaa", fontWeight: selectedTank === tank.id ? 700 : 400 }}>{tank.nameAr}</span>
                    {articleCounts[tank.id] > 0 && <span style={{ fontSize: 10, background: "rgba(212,175,55,0.15)", color: "#d4af37", borderRadius: 10, padding: "1px 5px" }}>{articleCounts[tank.id]}</span>}
                    <span style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: fetchStatus[tank.id] === "ok" ? "#3ddc97" : fetchStatus[tank.id] === "loading" ? "#d4af37" : fetchStatus[tank.id] === "error" ? "#ff4d6d" : "#333" }} className={fetchStatus[tank.id] === "loading" ? "pulse" : ""} />
                  </div>
                ))}
              </div>
            </div>

            {loading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
                {Array(6).fill(0).map((_, i) => <div key={i} className="shimmer" style={{ borderRadius: 16, height: 250 }} />)}
              </div>
            )}

            {!loading && filteredArticles.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🔭</div>
                <h3 style={{ color: "#d4af37", fontSize: 18, marginBottom: 8 }}>لا توجد مقالات</h3>
                <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>بعض المراكز قد لا تتوفر مقالاتها بسبب قيود الشبكة</p>
                <button onClick={handleManualRefresh} style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #d4af37, #8b6914)", color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "Cairo" }}>↻ إعادة المحاولة</button>
              </div>
            )}

            {!loading && filteredArticles.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                  <span style={{ fontSize: 12, color: "#555" }}><span style={{ color: "#d4af37", fontWeight: 700 }}>{filteredArticles.length}</span> مقالة</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                  <span style={{ fontSize: 11, color: "#444" }}>اضغط ترجم للترجمة الفورية بالذكاء الاصطناعي</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: activeView === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "1fr", gap: 18 }}>
                  {filteredArticles.map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "favorites" && (
          <>
            <h2 style={{ fontSize: 18, color: "#ffd700", marginBottom: 6 }}>★ المقالات المحفوظة</h2>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>{favoriteArticles.length} مقالة محفوظة</p>
            {favoriteArticles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>☆</div>
                <h3 style={{ color: "#888", fontSize: 18 }}>لا توجد مقالات محفوظة</h3>
                <p style={{ color: "#555", fontSize: 13, marginTop: 8 }}>اضغط على ☆ في أي مقالة لحفظها</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
                {favoriteArticles.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            )}
          </>
        )}

        {activeTab === "stats" && (
          <>
            <h2 style={{ fontSize: 18, color: "#d4af37", marginBottom: 6 }}>📊 إحصاءات المراكز البحثية</h2>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>نظرة عامة على نشاط المراكز</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[{ label: "إجمالي المقالات", value: articles.length, icon: "📰", color: "#d4af37" }, { label: "المراكز النشطة", value: Object.values(fetchStatus).filter(s => s === "ok").length, icon: "✅", color: "#3ddc97" }, { label: "المترجمة", value: Object.keys(translations).length, icon: "🌐", color: "#4d8bf5" }, { label: "المحفوظة", value: favorites.length, icon: "★", color: "#ffd700" }].map((stat, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 20, border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", padding: 20 }}>
              <div style={{ fontSize: 13, color: "#d4af37", marginBottom: 16, fontWeight: 700 }}>نشاط كل مركز</div>
              {statsData.length === 0 ? <p style={{ color: "#555", fontSize: 13 }}>لا توجد بيانات بعد</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {statsData.map(tank => {
                    const pct = (tank.count / Math.max(...statsData.map(t => t.count), 1)) * 100;
                    return (
                      <div key={tank.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{tank.flag}</span>
                        <div style={{ width: 150, fontSize: 11, color: "#aaa", flexShrink: 0, textAlign: "right" }}>{tank.nameAr}</div>
                        <div style={{ flex: 1, height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${tank.color}, ${tank.accent})`, borderRadius: 8 }} />
                        </div>
                        <span style={{ fontSize: 11, color: tank.accent, fontWeight: 700, width: 20 }}>{tank.count}</span>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: tank.status === "ok" ? "#3ddc97" : tank.status === "error" ? "#ff4d6d" : "#555" }} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        <footer style={{ textAlign: "center", padding: "48px 20px 24px", color: "#333", fontSize: 12 }}>
          <div style={{ color: "#d4af37", marginBottom: 4 }}>مرصد الفكر العالمي ◆ {THINK_TANKS.length} مركزاً بحثياً</div>
          <div>تحديث تلقائي كل {AUTO_REFRESH_MINUTES} دقيقة • ترجمة بالذكاء الاصطناعي</div>
        </footer>
      </div>
    </div>
  );
}

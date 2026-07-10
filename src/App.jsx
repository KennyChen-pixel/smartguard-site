import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Award,
  Cpu,
  Eye,
  Radio,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Menu,
  X,
  ArrowUpRight,
  FileBadge,
  Medal,
  Send,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

/* ============================================================
   ▼▼▼ 品牌 CI 色彩系統(自 Logo 像素級提取)▼▼▼
   設計語彙:「臨床儀器感」——
   Ink 承擔文字、Cyan 是儀器讀數的功能色、Mint 保留給安全/驗證語意,
   漸層只出現在 Logo 與頁尾一條細線上。
   ============================================================ */
const CI = {
  cyan: "#47C2E2",        // Logo 外框・天青藍(僅用於線條與焦點)
  cyanDeep: "#2BA8CC",    // 天青藍・深階(圖形、量測線)
  cyanInk: "#15718E",     // 天青藍・文字階(白底小字可讀)
  mint: "#5FC2A4",        // Logo S 字・薄荷綠
  mintInk: "#217A5F",     // 薄荷綠・文字階(安全/驗證語意)
  ink: "#13242E",         // 主文字・墨青
  inkSoft: "#46606E",     // 內文・霧灰青
  warn: "#D97706",        // 琥珀警示・僅用於障礙物偵測標記(儀器警示燈慣用色)
  line: "rgba(19,36,46,0.10)", // 面板細邊框
  mist: "#F7FAFB",        // 主背景・晨霧白
  white: "#FFFFFF",
};
const GRAD = `linear-gradient(135deg, ${CI.cyan} 0%, ${CI.mint} 100%)`;

/* 字型:IBM Plex Sans TC(內文/標題)× IBM Plex Mono(數據/讀數/專利號) */
const SANS =
  "'IBM Plex Sans TC','Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace";

/* ============================================================
   ▼▼▼ 資料區:未來更新文字只需修改此區 ▼▼▼
   ============================================================ */

// 產品核心特點
const productsData = [
  {
    title: "獨家距離感測技術",
    description:
      "精準偵測長者與周遭環境的空間距離，主動預警碰撞與跌倒風險。有別於傳統 IMU 步態分析，實現真正「事前預防」的主動防護。",
    icon: "Radio",
  },
  {
    title: "全天候主動防護",
    description:
      "輕量化穿戴設計，全天候無感配戴，即時守護不中斷。讓防護融入日常，自在生活零負擔。",
    icon: "Shield",
  },
  {
    title: "科技銀髮照護",
    description:
      "結合大數據與智慧演算，為長者及照護者提供最安心的防線，打造國際級 AgeTech 智慧照護體驗。",
    icon: "Cpu",
  },
  {
    title: "AI 智慧分析",
    description:
      "即時分析步態數據，持續優化偵測準確率，讓防護系統越用越聰明。",
    icon: "Cpu",
  },
];

// 最新消息 / 榮譽獎項（url 預留：之後填入新聞稿或公告連結）
// 請將最新的消息放在陣列最上方（由新到舊排列）
const newsData = [
  {
    date: "2026",
    title: "智感先鋒科技將於 6/25-27 Medical Taiwan 2026 展出主動式防跌系統",
    icon: "Radio",
    url: "https://www.medicaltaiwan.com.tw/zh-tw/menu/7EB43B97FCB8AED7D0636733C6861689/info.html",
  },
  {
    date: "2026",
    title: "中山大學攜智感先鋒科技亮相 Medical Taiwan 2026，智慧防跌系統獲實測肯定",
    icon: "Award",
    url: "https://www.medicaltaiwan.com.tw/zh-tw/news/80BFA2BD900FC425/info.html",
  },
  {
    date: "2026",
    title: "智感先鋒科技入選教育部 U-start 創業計畫，獲創業資源挹注",
    icon: "Award",
    url: "https://ustart.yda.gov.tw/p/16-1000-2210.php?Lang=zh-tw",
  },
  {
    date: "2025",
    title: "取得中華民國新型專利（專利公告號：M656911）",
    icon: "FileBadge",
    url: "#",
  },
  {
    date: "2023",
    title: "榮獲國際發明展銀牌獎，技術實力獲國際肯定",
    icon: "Medal",
    url: "#",
  },
];

// 信任數據列
const trustData = [
  { value: "國際發明展", label: "銀牌獎肯定" },
  { value: "M656911", label: "中華民國新型專利" },
  { value: "92%", label: "受測長者行走安心感提升" },
];

// 產品影像素材
const productMedia = {
  // 首屏儀器面板主視覺(產品示意圖,感測模組清楚可見,作為量測線動畫起點)
  hero: {
    src: "/product-render-2.png",
    width: 554,
    height: 248,
    alt: "SmartGuard 穿戴式防跌裝置產品示意圖：拖鞋鞋面搭載距離感測模組",
  },
  // 產品實測原型(核心技術區,「真實原型」證據)
  prototype: {
    src: "/prototype.jpg",
    width: 1125,
    height: 1032,
    alt: "SmartGuard 防跌裝置實測原型：距離感測模組安裝於拖鞋鞋面，模組螢幕顯示即時偵測數據",
    caption: "產品實測原型",
  },
  // 量產外觀設計方向(核心技術區,與原型並列形成「原型→量產」敘事)
  design: {
    src: "/product-render-1.png",
    width: 554,
    height: 278,
    alt: "SmartGuard 量產外觀設計示意圖：感測器內嵌於鞋面的一體化設計",
    caption: "量產外觀設計方向",
  },
};

// 團隊照片（關於我們區塊）
const teamPhoto = {
  src: "/team.jpg",
  width: 1477,
  height: 1108,
  alt: "智感先鋒科技團隊於 Medical Taiwan 台灣國際醫療暨健康照護展攤位合影",
  caption: "團隊於 Medical Taiwan 台灣國際醫療暨健康照護展，現場展出智慧主動式防跌偵測系統",
};

// 導覽連結
const navLinks = [
  { label: "核心技術", href: "#tech" },
  { label: "最新消息", href: "#news" },
  { label: "關於我們", href: "#about" },
];

/* ============================================================
   ▲▲▲ 資料區結束 ▲▲▲
   ============================================================ */

const iconMap = { Shield, Award, Cpu, Eye, Radio, HeartHandshake, Medal, FileBadge };

/* ── 品牌 Logo(六角盾形 S 標誌)── */
function LogoMark({ size = 36 }) {
  return (
    <img
      src="/logo.png"
      alt="智感先鋒科技 SmartGuard 品牌標誌"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

/* ── 儀器面板卡片(可選 href 變成連結;API 與舊版 GlassCard 相同)── */
function GlassCard({ href, className = "", innerClassName = "", children, ...rest }) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      {...rest}
      className={`sg-card group relative block rounded-2xl ${href ? "cursor-pointer" : ""} ${className}`}
      style={{
        backgroundColor: CI.white,
        border: `1px solid ${CI.line}`,
        boxShadow: "0 1px 2px rgba(19,36,46,0.04)",
      }}
    >
      <div className={`relative ${innerClassName}`}>{children}</div>
    </Tag>
  );
}

/* ── 區塊容器:改版後移除滾動進場動畫,內容直接呈現
      (動畫集中在首屏唯一的量測線橋段;保留元件 API)── */
function Reveal({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

/* ── 區塊標頭:等寬字眉標 + 標題,全站統一 ── */
function SectionHead({ eyebrow, title, children }) {
  return (
    <div>
      <p
        className="mb-3 flex items-center gap-2 text-xs font-medium tracking-[0.18em]"
        style={{ fontFamily: MONO, color: CI.cyanInk }}
      >
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2"
          style={{ backgroundColor: CI.cyan }}
        />
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl" style={{ color: CI.ink }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── 量測線幾何(對位 product-render-2.png 554×248):
      感測模組右前緣 → 鞋尖前方地面;刻度沿線等距、角度與線垂直 ── */
const BEAM = { x1: 372, y1: 92, x2: 524, y2: 208 };
const BEAM_ANGLE =
  (Math.atan2(BEAM.y2 - BEAM.y1, BEAM.x2 - BEAM.x1) * 180) / Math.PI;
const beamPoint = (t) => ({
  x: BEAM.x1 + (BEAM.x2 - BEAM.x1) * t,
  y: BEAM.y1 + (BEAM.y2 - BEAM.y1) * t,
});

export default function SmartGuardLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    org: "",
    email: "",
    type: "產品諮詢",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // 按 Esc 關閉行動選單
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    // 使用者開始修改時,即時清除該欄位的錯誤提示
    setFieldErrors((errs) => {
      if (!errs[field]) return errs;
      const next = { ...errs };
      delete next[field];
      return next;
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "請填寫姓名";
    if (!form.email.trim()) {
      errs.email = "請填寫 Email";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errs.email = "Email 格式不正確，請確認後再送出";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "61656401-9d41-4670-a2af-5a18051a3d99",
          subject: `【SmartGuard 官網諮詢】${form.type} - ${form.name}`,
          from_name: "SmartGuard 官網表單",
          姓名: form.name,
          單位機構: form.org,
          Email: form.email,
          需求類別: form.type,
          訊息內容: form.message,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError("送出失敗，請稍後再試，或直接寄信至 k3070447@gmail.com。");
      }
    } catch (err) {
      setSubmitError("送出失敗，請確認網路連線後再試一次。");
    } finally {
      setSubmitting(false);
    }
  };

  // 成功送出後返回表單,重新填寫
  const resetForm = () => {
    setForm({ name: "", org: "", email: "", type: "產品諮詢", message: "" });
    setFieldErrors({});
    setSubmitError("");
    setSubmitted(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden antialiased"
      style={{
        backgroundColor: CI.mist,
        color: CI.inkSoft,
        fontFamily: SANS,
      }}
    >
      <style>{`
        /* 平滑捲動,並預留固定導覽列高度,避免錨點標題被遮住 */
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 84px; }

        /* ── 首屏唯一動畫橋段 ──
           文字浮現 → 量測線自感測模組向前掃出 → 終點障礙物標記浮現
           → 偵測文字 → 預警標記亮起,之後全頁靜止。 */
        @keyframes sg-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sg-fade-up { animation: sg-fade-up 0.7s ease-out both; }
        .sg-d1 { animation-delay: .12s; } .sg-d2 { animation-delay: .3s; }

        /* 量測線由左(模組)向右(地面)掃出 */
        @keyframes sg-sweep {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }
        .sg-beam { animation: sg-sweep 0.9s ease-out 0.8s both; }

        @keyframes sg-appear {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .sg-alert { animation: sg-appear 0.5s ease-out both; }
        .sg-alert-1 { animation-delay: 1.6s; } /* 障礙物標記 */
        .sg-alert-2 { animation-delay: 1.9s; } /* 偵測文字 */
        .sg-alert-3 { animation-delay: 2.2s; } /* 預警膠囊 */

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .sg-fade-up, .sg-beam, .sg-alert { animation: none !important; }
        }

        /* 主要按鈕:hover 微調底色,不做縮放 */
        .sg-btn { transition: background-color 0.2s ease; }
        .sg-btn:hover { background-color: #1E3947 !important; }

        /* 連結卡片:hover 邊框轉為品牌天青,像儀器面板被選取 */
        .sg-card { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        a.sg-card:hover {
          border-color: rgba(71,194,226,0.65);
          box-shadow: 0 6px 20px rgba(19,36,46,0.08);
        }

        .sg-input:focus {
          outline: none;
          border-color: ${CI.cyan};
          box-shadow: 0 0 0 3px rgba(71,194,226,0.18);
        }
        .sg-input-error {
          border-color: #D14343 !important;
        }
        .sg-input-error:focus {
          box-shadow: 0 0 0 3px rgba(209,67,67,0.15);
        }

        /* 鍵盤焦點:比瀏覽器預設更明顯的品牌色外框 */
        :where(a, button):focus-visible {
          outline: 2px solid ${CI.cyanDeep};
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>

      {/* ───────────── 導覽列 ───────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: `1px solid ${CI.line}`,
        }}
      >
        <nav aria-label="主要導覽" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4">
          <a href="#hero" className="flex items-center gap-2.5" onClick={closeMenu}>
            <LogoMark size={34} />
            <span className="text-base font-bold tracking-wide" style={{ color: CI.ink }}>
              智感先鋒科技
              <span
                className="ml-2 hidden text-[11px] font-medium tracking-[0.14em] md:inline"
                style={{ color: CI.cyanInk, fontFamily: MONO }}
              >
                SMARTGUARD TECH
              </span>
            </span>
          </a>

          {/* 桌機導覽 */}
          <div className="hidden items-center gap-8 text-sm font-medium md:flex" style={{ color: CI.inkSoft }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:opacity-70" style={{ color: CI.ink }}>
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="sg-btn rounded-lg px-5 py-2 font-semibold text-white"
              style={{ backgroundColor: CI.ink }}
            >
              聯絡我們
            </a>
          </div>

          {/* 行動裝置漢堡按鈕 */}
          <button
            type="button"
            aria-label={menuOpen ? "關閉選單" : "開啟選單"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden"
            style={{ color: CI.ink, backgroundColor: menuOpen ? "rgba(71,194,226,0.12)" : "transparent" }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* 行動裝置展開選單 */}
        {menuOpen && (
          <div
            className="border-t md:hidden"
            style={{
              borderColor: CI.line,
              backgroundColor: "rgba(255,255,255,0.97)",
            }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 text-base font-medium transition-colors"
                  style={{ color: CI.ink }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={closeMenu}
                className="mt-2 rounded-lg px-4 py-3 text-center text-base font-semibold text-white"
                style={{ backgroundColor: CI.ink }}
              >
                聯絡我們
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 行動選單背景遮罩:點擊選單以外區域即關閉 */}
      {menuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* ───────────── Hero ───────────── */}
      <section id="hero" className="relative">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-32 sm:px-6 md:pb-24 md:pt-40 lg:grid-cols-2 lg:gap-14">
          <div className="sg-fade-up">
            <p
              className="mb-6 flex items-center gap-2 text-xs font-medium tracking-[0.18em] sm:text-[13px]"
              style={{ fontFamily: MONO, color: CI.cyanInk }}
            >
              <span aria-hidden="true" className="inline-block h-2 w-2" style={{ backgroundColor: CI.cyan }} />
              SMARTGUARD · AI 驅動主動防跌技術
            </p>
            {/* 兩個詞組各自不可內部斷行:任何寬度下換行點只會落在逗號後 */}
            <h1
              className="text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.4rem]"
              style={{ color: CI.ink, letterSpacing: "0.01em" }}
            >
              <span className="inline-block">智慧感測，</span>
              <span className="inline-block">主動守護</span>
            </h1>
            <p className="mt-4 text-lg font-semibold sm:text-xl" style={{ color: CI.cyanInk }}>
              重新定義銀髮安全新標準
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
              專為長者設計的穿戴式跌倒預防裝置，以獨家距離感測技術即時偵測環境風險，
              在跌倒發生「之前」就築起防線。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="#contact"
                className="sg-btn rounded-lg px-7 py-3 text-base font-semibold text-white"
                style={{ backgroundColor: CI.ink }}
              >
                預約產品展示
              </a>
              <a
                href="#tech"
                className="flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: CI.ink }}
              >
                了解核心技術 <ChevronDown size={16} />
              </a>
            </div>
          </div>

          {/* 儀器面板:產品示意 × 距離量測(全站唯一動畫橋段) */}
          <div className="sg-fade-up sg-d2">
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                backgroundColor: CI.white,
                border: `1px solid ${CI.line}`,
                boxShadow: "0 24px 48px -24px rgba(19,36,46,0.18)",
              }}
            >
              {/* 面板標頭 */}
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${CI.line}` }}>
                <span className="text-[11px] font-medium tracking-[0.14em]" style={{ fontFamily: MONO, color: CI.cyanInk }}>
                  SG-01 · DISTANCE SENSING
                </span>
                <span className="text-[11px]" style={{ color: CI.inkSoft }}>
                  產品示意圖
                </span>
              </div>

              {/* 產品影像 + 量測線 */}
              <div className="relative" style={{ backgroundColor: "#EDF1F4" }}>
                <img
                  src={productMedia.hero.src}
                  alt={productMedia.hero.alt}
                  width={productMedia.hero.width}
                  height={productMedia.hero.height}
                  fetchpriority="high"
                  className="w-full"
                />
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 554 248"
                  fill="none"
                >
                  {/* 量測線:由模組向前掃出 */}
                  <g className="sg-beam">
                    {/* 感測起點:模組位置 */}
                    <circle cx={BEAM.x1} cy={BEAM.y1} r="4" fill={CI.cyanDeep} />
                    <circle cx={BEAM.x1} cy={BEAM.y1} r="9" stroke={CI.cyanDeep} strokeWidth="1.2" opacity="0.5" />
                    {/* 量測虛線:模組 → 鞋尖前方地面 */}
                    <line
                      x1={BEAM.x1} y1={BEAM.y1} x2={BEAM.x2} y2={BEAM.y2}
                      stroke={CI.cyanDeep} strokeWidth="1.4" strokeDasharray="7 5"
                    />
                    {/* 尺規刻度 */}
                    {[0.25, 0.5, 0.75].map((t) => {
                      const p = beamPoint(t);
                      return (
                        <line
                          key={t}
                          x1="0" y1="-6" x2="0" y2="6"
                          stroke={CI.cyanDeep} strokeWidth="1.2"
                          transform={`translate(${p.x} ${p.y}) rotate(${BEAM_ANGLE})`}
                        />
                      );
                    })}
                    {/* 量測終點:地面標記 */}
                    <circle cx={BEAM.x2} cy={BEAM.y2} r="3" fill={CI.cyanDeep} />
                  </g>
                  {/* 障礙物警示標記:量測線掃到終點後浮現 */}
                  <g className="sg-alert sg-alert-1">
                    <AlertTriangle
                      x={BEAM.x2 - 14}
                      y={BEAM.y2 - 36}
                      size={28}
                      color={CI.warn}
                      strokeWidth={2}
                      fill={CI.white}
                    />
                  </g>
                </svg>
              </div>

              {/* 偵測狀態列:掃描 → 偵測 → 預警 */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4" style={{ borderTop: `1px solid ${CI.line}` }}>
                <span className="sg-alert sg-alert-2 flex items-center gap-1.5 text-sm font-semibold" style={{ color: CI.ink }}>
                  <AlertCircle size={16} color={CI.warn} strokeWidth={2} />
                  偵測到前方障礙物
                </span>
                <span
                  className="sg-alert sg-alert-3 ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
                  style={{
                    color: CI.mintInk,
                    backgroundColor: "rgba(95,194,164,0.14)",
                    border: "1px solid rgba(95,194,164,0.45)",
                  }}
                >
                  <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CI.mint }} />
                  已於跌倒前預警
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 信任數據列 */}
        <div className="relative mx-auto max-w-6xl px-5 pb-20 sm:px-6">
          <GlassCard innerClassName="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {trustData.map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-1 px-4 py-6 text-center" style={{ borderColor: CI.line }}>
                <span
                  className="text-lg font-semibold tabular-nums sm:text-xl"
                  style={{ color: CI.ink, fontFamily: MONO }}
                >
                  {t.value}
                </span>
                <span className="text-xs sm:text-sm">{t.label}</span>
              </div>
            ))}
          </GlassCard>
        </div>
      </section>

      {/* ───────────── 核心技術 ───────────── */}
      <section id="tech" className="py-24 md:py-32" style={{ backgroundColor: CI.white, borderTop: `1px solid ${CI.line}`, borderBottom: `1px solid ${CI.line}` }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <SectionHead eyebrow="CORE TECHNOLOGY" title="核心技術與產品特點">
              <p className="mt-5 max-w-3xl leading-relaxed">
                我們以「距離感測技術」取代傳統單純的 IMU 步態分析，從被動偵測跌倒，
                進化為<strong style={{ color: CI.ink }}>主動預防跌倒</strong>。
              </p>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {productsData.map((p) => {
              const Icon = iconMap[p.icon] || Shield;
              return (
                <Reveal key={p.title} className="h-full">
                  <GlassCard className="h-full" innerClassName="p-8">
                    <span
                      className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg"
                      style={{
                        border: "1px solid rgba(71,194,226,0.45)",
                        backgroundColor: "rgba(71,194,226,0.08)",
                      }}
                    >
                      <Icon size={22} color={CI.cyanInk} strokeWidth={1.8} />
                    </span>
                    <h3 className="mb-3 text-lg font-bold sm:text-xl" style={{ color: CI.ink }}>
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed sm:text-[15px]">{p.description}</p>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>

          {/* 差異化說明:左側論述,右側「實測原型 → 量產設計」影像敘事 */}
          <Reveal className="mt-16">
            <GlassCard innerClassName="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-bold leading-snug sm:text-2xl" style={{ color: CI.ink }}>
                  距離感測 ≠ 傳統 IMU
                  <br />
                  <span style={{ color: CI.cyanInk }}>預防，發生在跌倒之前</span>
                </h3>
                <ul className="mt-7 space-y-5 text-sm leading-relaxed">
                  <li className="flex gap-3">
                    <Eye size={18} color={CI.cyanInk} className="mt-0.5 shrink-0" />
                    即時掃描長者與環境間的空間距離，於碰撞風險形成前主動預警。
                  </li>
                  <li className="flex gap-3">
                    <Radio size={18} color={CI.mintInk} className="mt-0.5 shrink-0" />
                    不依賴跌倒後的姿態判讀，真正做到「事前防護」而非「事後通報」。
                  </li>
                  <li className="flex gap-3">
                    <HeartHandshake size={18} color={CI.cyanInk} className="mt-0.5 shrink-0" />
                    輕量無感配戴，讓守護自然融入長輩的每一步日常。
                  </li>
                </ul>
              </div>
              {/* 兩圖並排縮小呈現:原型照與設計圖不搶走左側論述的重心 */}
              <div className="grid grid-cols-2 gap-4 self-center sm:gap-5">
                <figure>
                  <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${CI.line}` }}>
                    <img
                      src={productMedia.prototype.src}
                      alt={productMedia.prototype.alt}
                      width={productMedia.prototype.width}
                      height={productMedia.prototype.height}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-2 flex flex-col gap-0.5 text-xs sm:flex-row sm:items-baseline sm:gap-2.5" style={{ color: CI.inkSoft }}>
                    <span className="font-medium tracking-[0.14em]" style={{ fontFamily: MONO, color: CI.cyanInk }}>
                      PROTOTYPE
                    </span>
                    {productMedia.prototype.caption}
                  </figcaption>
                </figure>
                <figure>
                  <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${CI.line}`, backgroundColor: "#EDF1F4" }}>
                    <img
                      src={productMedia.design.src}
                      alt={productMedia.design.alt}
                      width={productMedia.design.width}
                      height={productMedia.design.height}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-contain"
                    />
                  </div>
                  <figcaption className="mt-2 flex flex-col gap-0.5 text-xs sm:flex-row sm:items-baseline sm:gap-2.5" style={{ color: CI.inkSoft }}>
                    <span className="font-medium tracking-[0.14em]" style={{ fontFamily: MONO, color: CI.cyanInk }}>
                      DESIGN
                    </span>
                    {productMedia.design.caption}
                  </figcaption>
                </figure>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ───────────── 最新消息 / 榮譽專利 ───────────── */}
      <section id="news" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <SectionHead eyebrow="NEWS & HONORS" title="最新消息與榮譽" />
          </Reveal>

          {/* 垂直時間軸:由新到舊,順序本身就是資訊 */}
          <div className="relative mx-auto mt-14 max-w-3xl">
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[17px] top-6 w-px"
              style={{ backgroundColor: "rgba(19,36,46,0.14)" }}
            />
            {(showAllNews ? newsData : newsData.slice(0, 3)).map((n) => {
              const Icon = iconMap[n.icon] || Award;
              const hasLink = n.url && n.url !== "#";
              return (
                <Reveal key={n.title} className="relative flex gap-5 pb-7 last:pb-0 sm:gap-6">
                  {/* 時間軸節點 */}
                  <span
                    className="relative z-10 mt-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: CI.white,
                      border: "1px solid rgba(71,194,226,0.55)",
                    }}
                  >
                    <Icon size={16} color={CI.cyanInk} strokeWidth={1.8} />
                  </span>
                  <GlassCard
                    href={hasLink ? n.url : undefined}
                    target={hasLink ? "_blank" : undefined}
                    rel={hasLink ? "noopener noreferrer" : undefined}
                    className="flex-1"
                    innerClassName="p-6 sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <time
                          className="text-xs font-medium tracking-[0.14em]"
                          style={{ color: CI.cyanInk, fontFamily: MONO }}
                        >
                          {n.date}
                        </time>
                        <h3 className="mt-1.5 text-base font-bold leading-relaxed sm:text-lg" style={{ color: CI.ink }}>
                          {n.title}
                        </h3>
                      </div>
                      {hasLink && (
                        <ArrowUpRight
                          size={20}
                          className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: CI.cyanInk }}
                        />
                      )}
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>

          {newsData.length > 3 && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllNews((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors hover:border-current"
                style={{
                  color: CI.cyanInk,
                  border: "1px solid rgba(19,36,46,0.18)",
                  backgroundColor: CI.white,
                }}
              >
                {showAllNews ? "收合內容" : `查看更多（共 ${newsData.length} 則）`}
                <ChevronDown
                  size={16}
                  className="transition-transform duration-300"
                  style={{ transform: showAllNews ? "rotate(180deg)" : "none" }}
                />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ───────────── 關於我們 ───────────── */}
      <section id="about" className="py-24 md:py-32" style={{ backgroundColor: CI.white, borderTop: `1px solid ${CI.line}`, borderBottom: `1px solid ${CI.line}` }}>
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <Reveal>
            <div className="flex justify-center">
              <SectionHead eyebrow="ABOUT US" title="科技更有溫度 用智慧守護摯愛" />
            </div>

            <blockquote className="mx-auto mt-12 max-w-2xl text-base font-semibold leading-loose sm:text-lg" style={{ color: CI.ink }}>
              「智感先鋒科技的誕生，源於一個簡單卻深刻的初心——
              <br />
              我們希望能用最頂尖的科技，為家中的長者築起一道安心的防線。」
            </blockquote>

            <div className="mx-auto mt-10 max-w-2xl space-y-6 text-left text-sm leading-loose sm:text-base">
              <p>
                我們是一群來自工程與醫療科技領域的創新夥伴。我們深知，隨著高齡化社會到來，
                跌倒往往是長者健康最大的隱形威脅。因此，我們走進照護現場，
                將複雜的「距離感測技術」轉化為溫暖、輕量且無感的日常陪伴。
              </p>
              <p>
                我們不追求冰冷的數據，而是專注於「主動防護」的每一個細節。
                智感先鋒科技將持續秉持對生命的關懷，結合跨領域的研發實力，
                打造最懂長者、也最讓照護者安心的 AgeTech 智慧照護系統，
                讓每位長輩都能在科技的守護下，享受尊嚴、安全且自信的銀髮生活。
              </p>
            </div>
          </Reveal>

          {/* 團隊照片:桌機限寬置中,避免撐滿整個區塊 */}
          <Reveal className="mt-14">
            <GlassCard className="lg:mx-auto lg:max-w-2xl" innerClassName="p-3 sm:p-4">
              <img
                src={teamPhoto.src}
                alt={teamPhoto.alt}
                width={teamPhoto.width}
                height={teamPhoto.height}
                loading="lazy"
                className="w-full rounded-xl object-cover"
              />
              <p className="px-2 pb-1.5 pt-4 text-center text-xs leading-relaxed sm:text-sm" style={{ color: CI.inkSoft }}>
                {teamPhoto.caption}
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ───────────── 聯絡表單 ───────────── */}
      <section id="contact" className="py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <SectionHead eyebrow="CONTACT" title="商務合作與產品諮詢">
              <p className="mt-5 leading-relaxed">
                無論您是照護機構、通路夥伴或關心家中長輩的家屬，
                歡迎與我們聯繫，我們將於三個工作天內回覆。
              </p>
            </SectionHead>
            <ul className="mt-9 space-y-4 text-sm" style={{ fontFamily: MONO }}>
              <li className="flex items-center gap-3">
                <Mail size={17} color={CI.cyanInk} /> k3070447@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} color={CI.mintInk} /> 0966-312-546
              </li>
              <li className="flex items-center gap-3" style={{ fontFamily: SANS }}>
                <MapPin size={17} color={CI.cyanInk} /> 高雄市鼓山區蓮海路 70 號
              </li>
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-3">
            <GlassCard innerClassName="p-7 sm:p-10">
              {submitted ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
                  <CheckCircle2 size={48} color={CI.mintInk} />
                  <h3 className="text-xl font-bold" style={{ color: CI.ink }}>
                    已收到您的訊息
                  </h3>
                  <p className="text-sm">我們將於三個工作天內與您聯繫，感謝您的支持。</p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-2 flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold transition-colors"
                    style={{
                      color: CI.cyanInk,
                      border: "1px solid rgba(19,36,46,0.18)",
                      backgroundColor: CI.white,
                    }}
                  >
                    <RotateCcw size={15} /> 填寫新的訊息
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm font-semibold" style={{ color: CI.ink }}>
                    姓名 *
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="王小明"
                      autoComplete="name"
                      aria-invalid={!!fieldErrors.name}
                      className={`sg-input rounded-lg border bg-white px-4 py-3 text-sm font-normal transition-all ${fieldErrors.name ? "sg-input-error" : ""}`}
                      style={{ borderColor: "rgba(19,36,46,0.18)", color: CI.ink }}
                    />
                    {fieldErrors.name && (
                      <span role="alert" className="flex items-center gap-1 text-xs font-medium" style={{ color: "#D14343" }}>
                        <AlertCircle size={13} /> {fieldErrors.name}
                      </span>
                    )}
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-semibold" style={{ color: CI.ink }}>
                    單位 / 機構
                    <input
                      type="text"
                      value={form.org}
                      onChange={handleChange("org")}
                      placeholder="○○長照機構"
                      autoComplete="organization"
                      className="sg-input rounded-lg border bg-white px-4 py-3 text-sm font-normal transition-all"
                      style={{ borderColor: "rgba(19,36,46,0.18)", color: CI.ink }}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-semibold" style={{ color: CI.ink }}>
                    Email *
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={!!fieldErrors.email}
                      className={`sg-input rounded-lg border bg-white px-4 py-3 text-sm font-normal transition-all ${fieldErrors.email ? "sg-input-error" : ""}`}
                      style={{ borderColor: "rgba(19,36,46,0.18)", color: CI.ink }}
                    />
                    {fieldErrors.email && (
                      <span role="alert" className="flex items-center gap-1 text-xs font-medium" style={{ color: "#D14343" }}>
                        <AlertCircle size={13} /> {fieldErrors.email}
                      </span>
                    )}
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-semibold" style={{ color: CI.ink }}>
                    需求類別
                    <select
                      value={form.type}
                      onChange={handleChange("type")}
                      className="sg-input rounded-lg border bg-white px-4 py-3 text-sm font-normal transition-all"
                      style={{ borderColor: "rgba(19,36,46,0.18)", color: CI.ink }}
                    >
                      <option>產品諮詢</option>
                      <option>商務合作</option>
                      <option>媒體採訪</option>
                      <option>其他</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-semibold sm:col-span-2" style={{ color: CI.ink }}>
                    訊息內容
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={handleChange("message")}
                      placeholder="請簡述您的需求…"
                      className="sg-input resize-none rounded-lg border bg-white px-4 py-3 text-sm font-normal transition-all"
                      style={{ borderColor: "rgba(19,36,46,0.18)", color: CI.ink }}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="sg-btn flex items-center justify-center gap-2 rounded-lg py-3.5 text-base font-semibold text-white disabled:opacity-60 sm:col-span-2"
                    style={{ backgroundColor: CI.ink }}
                  >
                    <Send size={18} /> {submitting ? "送出中…" : "送出諮詢"}
                  </button>
                  {submitError && (
                    <p role="alert" className="flex items-center gap-1.5 text-sm sm:col-span-2" style={{ color: "#D14343" }}>
                      <AlertCircle size={15} className="shrink-0" /> {submitError}
                    </p>
                  )}
                </form>
              )}
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Footer ───────────── */}
      <footer
        className="relative"
        style={{
          backgroundColor: CI.white,
          borderTop: "1.5px solid transparent",
          borderImage: `${GRAD} 1`, // 全站唯一一條漸層線,呼應 Logo
        }}
      >
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <LogoMark size={32} />
              <div>
                <p className="text-sm font-bold" style={{ color: CI.ink }}>
                  智感先鋒科技 SmartGuard Technology
                </p>
                <p className="text-xs">智慧感測 主動守護</p>
              </div>
            </div>
            <nav aria-label="頁尾連結" className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="transition-opacity hover:opacity-60" style={{ color: CI.inkSoft }}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
          <div
            className="mt-10 flex flex-col gap-2 pt-6 text-xs sm:flex-row sm:justify-center"
            style={{ borderTop: `1px solid ${CI.line}` }}
          >
            <p>© {new Date().getFullYear()} 智感先鋒科技 SmartGuard Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

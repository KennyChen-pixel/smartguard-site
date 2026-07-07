import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  AlertCircle,
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
   ============================================================ */
const CI = {
  cyan: "#47C2E2",        // Logo 外框・天青藍
  cyanDeep: "#2BA8CC",    // 天青藍・深階
  mint: "#5FC2A4",        // Logo S 字・薄荷綠
  mintDeep: "#3FA98A",    // 薄荷綠・深階
  ink: "#13242E",         // 主文字・墨青
  inkSoft: "#46606E",     // 內文・霧灰青
  mist: "#F5FAFB",        // 主背景・晨霧白
  white: "#FFFFFF",
};
const GRAD = `linear-gradient(135deg, ${CI.cyan} 0%, ${CI.mint} 100%)`;
const GRAD_SOFT = `linear-gradient(135deg, rgba(71,194,226,0.45) 0%, rgba(95,194,164,0.45) 100%)`;

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

// 產品實照（拿到專業產品照後，將檔案放入 public 並填入路徑，例如 "/product.jpg"，
// 核心技術區塊會自動以照片取代波紋動畫佔位）
const productImage = "";

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

/* ── 毛玻璃漸層邊框卡片(可選 href 變成連結)── */
function GlassCard({ href, className = "", innerClassName = "", children, ...rest }) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      {...rest}
      className={`group relative block rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        href ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* 漸層邊框層:hover 時透出完整 Logo 漸層 */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl opacity-40 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: GRAD_SOFT }}
      />
      {/* 毛玻璃內層 */}
      <span
        aria-hidden="true"
        className="absolute rounded-3xl backdrop-blur-md"
        style={{
          inset: "1.5px",
          borderRadius: "22px",
          backgroundColor: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      />
      <div className={`relative ${innerClassName}`}>{children}</div>
    </Tag>
  );
}

/* ── 滾動進場動畫:區塊進入視窗時淡入上移(原生 IntersectionObserver,無需套件)── */
function Reveal({ className = "", delay = 0, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sg-reveal ${visible ? "sg-reveal-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

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
        fontFamily:
          "'Noto Sans TC','Inter',-apple-system,'PingFang TC','Microsoft JhengHei',sans-serif",
      }}
    >
      <style>{`
        /* 平滑捲動,並預留固定導覽列高度,避免錨點標題被遮住 */
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 84px; }

        @keyframes sg-ripple {
          0%   { transform: translate(-50%,-50%) scale(0.3); opacity: 0.5; }
          70%  { opacity: 0.15; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 0; }
        }
        .sg-ripple {
          position: absolute; left: 50%; top: 50%;
          border-radius: 9999px;
          border: 1.5px solid rgba(71,194,226,0.45);
          animation: sg-ripple 5.5s cubic-bezier(0.2,0.6,0.4,1) infinite;
          pointer-events: none;
        }
        @keyframes sg-fade-up {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sg-fade-up { animation: sg-fade-up 0.9s ease-out both; }
        .sg-d1 { animation-delay: .15s; } .sg-d2 { animation-delay: .3s; } .sg-d3 { animation-delay: .45s; }

        @keyframes sg-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-14px); }
        }
        .sg-float { animation: sg-float 7s ease-in-out infinite; }

        /* 滾動進場:初始隱藏,進入視窗後淡入上移 */
        .sg-reveal {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .sg-reveal-in { opacity: 1; transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .sg-ripple, .sg-fade-up, .sg-float { animation: none !important; opacity: 1; }
          .sg-reveal { opacity: 1; transform: none; transition: none; }
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
        .sg-grad-text {
          background: ${GRAD};
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      {/* ───────────── 導覽列 ───────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(71,194,226,0.18)",
        }}
      >
        <nav aria-label="主要導覽" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4">
          <a href="#hero" className="flex items-center gap-2.5" onClick={closeMenu}>
            <LogoMark size={34} />
            <span className="text-base font-bold tracking-wide" style={{ color: CI.ink, fontFamily: "'M PLUS Rounded 1c','Noto Sans TC',sans-serif" }}>
              智感先鋒科技
              <span className="ml-2 hidden text-xs font-semibold tracking-widest md:inline" style={{ color: CI.cyanDeep, fontFamily: "'Inter',sans-serif" }}>
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
              className="rounded-full px-5 py-2 font-bold text-white shadow-md transition-transform hover:scale-105"
              style={{ background: GRAD }}
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
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors md:hidden"
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
              borderColor: "rgba(71,194,226,0.15)",
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-base font-medium transition-colors"
                  style={{ color: CI.ink }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={closeMenu}
                className="mt-2 rounded-xl px-4 py-3 text-center text-base font-bold text-white"
                style={{ background: GRAD }}
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
      <section id="hero" className="relative overflow-hidden">
        {/* 品牌色柔光暈 */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(71,194,226,0.22) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(95,194,164,0.2) 0%, transparent 70%)", filter: "blur(70px)" }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-28 pt-36 sm:px-6 md:pb-36 md:pt-44 lg:grid-cols-2 lg:gap-10">
          <div>
            <p className="sg-fade-up mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.2em] sm:text-sm"
              style={{ color: CI.cyanDeep, backgroundColor: "rgba(71,194,226,0.1)", border: "1px solid rgba(71,194,226,0.25)" }}
            >
              SMARTGUARD・智慧銀髮跌倒防護系統
            </p>
            <h1
              className="sg-fade-up sg-d1 text-3xl font-black leading-snug sm:text-5xl lg:text-6xl sm:whitespace-nowrap"
              style={{ color: CI.ink, letterSpacing: "0.02em" }}
            >
              智慧感測 主動守護
            </h1>
            <p
              className="sg-fade-up sg-d1 sg-grad-text mt-3 text-lg font-bold sm:whitespace-nowrap sm:text-2xl lg:text-3xl"
              style={{ letterSpacing: "0.02em" }}
            >
              重新定義銀髮安全新標準
            </p>
            <p
              className="sg-fade-up sg-d1 mt-2 text-sm sm:text-base font-medium"
              style={{ color: CI.inkSoft }}
            >
              AI 驅動的主動防跌技術
            </p>
            <p className="sg-fade-up sg-d2 mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
              專為長者設計的跌倒預防設備，以獨家距離感測技術即時偵測環境風險，
              在跌倒發生「之前」就築起防線。
            </p>
            <div className="sg-fade-up sg-d3 mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="rounded-full px-8 py-3.5 text-base font-bold text-white transition-transform hover:scale-105"
                style={{ background: GRAD, boxShadow: "0 10px 32px rgba(71,194,226,0.4)" }}
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

          {/* 感測波紋 × 品牌標誌 */}
          <div className="relative mx-auto flex aspect-square w-64 items-center justify-center sm:w-80 lg:w-full lg:max-w-md">
            <span className="sg-ripple h-full w-full" />
            <span className="sg-ripple h-full w-full" style={{ animationDelay: "1.4s" }} />
            <span className="sg-ripple h-full w-full" style={{ animationDelay: "2.8s", borderColor: "rgba(95,194,164,0.4)" }} />
            <span className="sg-ripple h-full w-full" style={{ animationDelay: "4.2s" }} />
            <div
              className="sg-float relative flex h-36 w-36 items-center justify-center rounded-[2rem] sm:h-44 sm:w-44"
              style={{
                backgroundColor: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1.5px solid rgba(71,194,226,0.3)",
                boxShadow: "0 24px 60px rgba(71,194,226,0.25)",
              }}
            >
              <LogoMark size={86} />
            </div>
          </div>
        </div>

        {/* 信任數據列 */}
        <div className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-6">
          <GlassCard innerClassName="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          >
            {trustData.map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-1 px-4 py-7 text-center" style={{ borderColor: "rgba(71,194,226,0.12)" }}>
                <span
                  className="text-lg font-extrabold tracking-wide sm:text-xl"
                  style={{ color: CI.cyanDeep, fontFamily: "'Inter','Noto Sans TC',sans-serif" }}
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
      <section id="tech" className="relative py-28 md:py-36">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(95,194,164,0.14) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <p className="mb-3 text-xs font-bold tracking-[0.3em] sm:text-sm" style={{ color: CI.mintDeep }}>
              CORE TECHNOLOGY
            </p>
            <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl" style={{ color: CI.ink }}>
              核心技術與產品特點
            </h2>
            <p className="mt-5 max-w-3xl leading-relaxed">
              我們以「距離感測技術」取代傳統單純的 IMU 步態分析，從被動偵測跌倒，
              進化為<strong style={{ color: CI.ink }}>主動預防跌倒</strong>。
            </p>
          </Reveal>

          <div className="mt-16 grid gap-7 sm:grid-cols-2">
            {productsData.map((p, i) => {
              const Icon = iconMap[p.icon] || Shield;
              return (
                <Reveal key={p.title} delay={(i % 2) * 120} className="h-full">
                  <GlassCard className="h-full" innerClassName="p-8">
                    <span
                      className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: GRAD_SOFT }}
                    >
                      <Icon size={27} color={CI.ink} strokeWidth={1.8} />
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

          {/* 差異化說明 */}
          <Reveal className="mt-20">
            <GlassCard innerClassName="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-black leading-snug sm:text-2xl" style={{ color: CI.ink }}>
                  距離感測 ≠ 傳統 IMU
                  <br />
                  <span className="sg-grad-text">預防，發生在跌倒之前</span>
                </h3>
                <ul className="mt-7 space-y-5 text-sm leading-relaxed">
                  <li className="flex gap-3">
                    <Eye size={18} color={CI.cyanDeep} className="mt-0.5 shrink-0" />
                    即時掃描長者與環境間的空間距離，於碰撞風險形成前主動預警。
                  </li>
                  <li className="flex gap-3">
                    <Radio size={18} color={CI.mintDeep} className="mt-0.5 shrink-0" />
                    不依賴跌倒後的姿態判讀，真正做到「事前防護」而非「事後通報」。
                  </li>
                  <li className="flex gap-3">
                    <HeartHandshake size={18} color={CI.cyanDeep} className="mt-0.5 shrink-0" />
                    輕量無感配戴，讓守護自然融入長輩的每一步日常。
                  </li>
                </ul>
              </div>
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(71,194,226,0.12), rgba(95,194,164,0.12))" }}
              >
                {productImage ? (
                  <img
                    src={productImage}
                    alt="SmartGuard 穿戴式跌倒預防裝置產品實照，展示輕量化距離感測模組"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative flex h-32 w-32 items-center justify-center">
                    <span className="sg-ripple h-full w-full" />
                    <span className="sg-ripple h-full w-full" style={{ animationDelay: "2.7s" }} />
                    <Shield size={52} color={CI.mintDeep} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ───────────── 最新消息 / 榮譽專利 ───────────── */}
      <section id="news" className="relative py-28 md:py-36">
        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/3 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(71,194,226,0.14) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <p className="mb-3 text-xs font-bold tracking-[0.3em] sm:text-sm" style={{ color: CI.cyanDeep }}>
              NEWS & HONORS
            </p>
            <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl" style={{ color: CI.ink }}>
              最新消息與榮譽
            </h2>
          </Reveal>

          {/* 垂直時間軸:左側漸層軸線 + 年份節點,由新到舊 */}
          <div className="relative mx-auto mt-16 max-w-3xl">
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[23px] top-6 w-px sm:left-6"
              style={{ background: GRAD, opacity: 0.35 }}
            />
            {(showAllNews ? newsData : newsData.slice(0, 3)).map((n) => {
              const Icon = iconMap[n.icon] || Award;
              const hasLink = n.url && n.url !== "#";
              return (
                <Reveal key={n.title} className="relative flex gap-5 pb-8 last:pb-0 sm:gap-7">
                  {/* 時間軸節點 */}
                  <span
                    className="relative z-10 mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: CI.white,
                      backgroundImage: GRAD_SOFT,
                      border: "1.5px solid rgba(71,194,226,0.35)",
                      boxShadow: "0 4px 14px rgba(71,194,226,0.18)",
                    }}
                  >
                    <Icon size={22} color={CI.ink} strokeWidth={1.8} />
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
                          className="text-xs font-bold tracking-widest"
                          style={{ color: CI.mintDeep, fontFamily: "'Inter',sans-serif" }}
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
                          className="mt-1 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: CI.cyanDeep }}
                        />
                      )}
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>

          {newsData.length > 3 && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllNews((v) => !v)}
                className="flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-bold transition-transform hover:scale-105"
                style={{ color: CI.cyanDeep, border: `1.5px solid ${CI.cyan}`, backgroundColor: "rgba(71,194,226,0.06)" }}
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
      <section id="about" className="relative py-28 md:py-36">
        <div
          aria-hidden="true"
          className="absolute -right-32 top-0 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(95,194,164,0.16) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6">
          <Reveal>
            <p className="mb-3 text-xs font-bold tracking-[0.3em] sm:text-sm" style={{ color: CI.mintDeep }}>
              ABOUT US
            </p>
            <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl" style={{ color: CI.ink }}>
              科技更有溫度 用智慧守護摯愛
            </h2>

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

          {/* 團隊照片 */}
          <Reveal className="mt-14">
            <GlassCard innerClassName="p-3 sm:p-4">
              <img
                src={teamPhoto.src}
                alt={teamPhoto.alt}
                width={teamPhoto.width}
                height={teamPhoto.height}
                loading="lazy"
                className="w-full object-cover"
                style={{ borderRadius: "16px" }}
              />
              <p className="px-2 pb-1.5 pt-4 text-center text-xs leading-relaxed sm:text-sm" style={{ color: CI.inkSoft }}>
                {teamPhoto.caption}
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ───────────── 聯絡表單 ───────────── */}
      <section id="contact" className="relative py-28 md:py-36">
        <div
          aria-hidden="true"
          className="absolute left-1/4 bottom-0 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(71,194,226,0.16) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <p className="mb-3 text-xs font-bold tracking-[0.3em] sm:text-sm" style={{ color: CI.cyanDeep }}>
              CONTACT
            </p>
            <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl" style={{ color: CI.ink }}>
              商務合作與產品諮詢
            </h2>
            <p className="mt-5 leading-relaxed">
              無論您是照護機構、通路夥伴或關心家中長輩的家屬，
              歡迎與我們聯繫，我們將於三個工作天內回覆。
            </p>
            <ul className="mt-9 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={18} color={CI.cyanDeep} /> k3070447@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} color={CI.mintDeep} /> 0966-312-546
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} color={CI.cyanDeep} /> 高雄市鼓山區蓮海路 70 號
              </li>
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-3">
            <GlassCard innerClassName="p-7 sm:p-10">
              {submitted ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
                  <CheckCircle2 size={48} color={CI.mintDeep} />
                  <h3 className="text-xl font-bold" style={{ color: CI.ink }}>
                    已收到您的訊息
                  </h3>
                  <p className="text-sm">我們將於三個工作天內與您聯繫，感謝您的支持。</p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-2 flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold transition-transform hover:scale-105"
                    style={{ color: CI.cyanDeep, border: `1.5px solid ${CI.cyan}`, backgroundColor: "rgba(71,194,226,0.06)" }}
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
                      className={`sg-input rounded-xl border bg-white px-4 py-3 text-sm font-normal transition-all ${fieldErrors.name ? "sg-input-error" : ""}`}
                      style={{ borderColor: "rgba(71,194,226,0.3)", color: CI.ink }}
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
                      className="sg-input rounded-xl border bg-white px-4 py-3 text-sm font-normal transition-all"
                      style={{ borderColor: "rgba(71,194,226,0.3)", color: CI.ink }}
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
                      className={`sg-input rounded-xl border bg-white px-4 py-3 text-sm font-normal transition-all ${fieldErrors.email ? "sg-input-error" : ""}`}
                      style={{ borderColor: "rgba(71,194,226,0.3)", color: CI.ink }}
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
                      className="sg-input rounded-xl border bg-white px-4 py-3 text-sm font-normal transition-all"
                      style={{ borderColor: "rgba(71,194,226,0.3)", color: CI.ink }}
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
                      className="sg-input resize-none rounded-xl border bg-white px-4 py-3 text-sm font-normal transition-all"
                      style={{ borderColor: "rgba(71,194,226,0.3)", color: CI.ink }}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 sm:col-span-2"
                    style={{ background: GRAD, boxShadow: "0 8px 26px rgba(71,194,226,0.35)" }}
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
          backgroundColor: "rgba(255,255,255,0.6)",
          borderTop: "1.5px solid transparent",
          borderImage: `${GRAD} 1`,
        }}
      >
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <LogoMark size={32} />
              <div>
                <p className="text-sm font-bold" style={{ color: CI.ink, fontFamily: "'M PLUS Rounded 1c','Noto Sans TC',sans-serif" }}>
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
            style={{ borderTop: "1px solid rgba(71,194,226,0.18)" }}
          >
            <p>© {new Date().getFullYear()} 智感先鋒科技 SmartGuard Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

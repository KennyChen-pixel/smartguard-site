import React, { useState } from "react";
import {
  Shield,
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
      "精準偵測長者與周遭環境的空間距離,主動預警碰撞與跌倒風險。有別於傳統 IMU 步態分析,實現真正「事前預防」的主動防護。",
    icon: "Radio",
  },
  {
    title: "全天候主動防護",
    description:
      "輕量化穿戴設計,全天候無感配戴,即時守護不中斷。讓防護融入日常,自在生活零負擔。",
    icon: "Shield",
  },
  {
    title: "科技銀髮照護",
    description:
      "結合大數據與智慧演算,為長者及照護者提供最安心的防線,打造國際級 AgeTech 智慧照護體驗。",
    icon: "Cpu",
  },
];

// 最新消息 / 榮譽獎項(url 預留:之後填入新聞稿或公告連結)
const newsData = [
  {
    date: "2025",
    title: "榮獲國際發明展銀牌獎,技術實力獲國際肯定",
    icon: "Medal",
    url: "#",
  },
  {
    date: "2025",
    title: "取得中華民國新型專利(專利公告號:M656911)",
    icon: "FileBadge",
    url: "#",
  },
  {
    date: "2026",
    title: "全新相關專利技術進入實質審查,持續強化技術壁壘",
    icon: "Award",
    url: "#",
  },
];

// 信任數據列
const trustData = [
  { value: "國際發明展", label: "銀牌獎肯定" },
  { value: "M656911", label: "中華民國新型專利" },
  { value: "92%", label: "受測長者行走安心感提升" },
];

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
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="智感先鋒科技 SmartGuard 品牌標誌"
    >
      <defs>
        <linearGradient id="sgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={CI.mint} />
          <stop offset="100%" stopColor={CI.cyan} />
        </linearGradient>
      </defs>
      <path
        d="M50 4 L91 27 V73 L50 96 L9 73 V27 Z"
        stroke={CI.cyan}
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d="M71 30 H42 a13 13 0 0 0 0 26 h16 a13 13 0 0 1 0 26 H29"
        stroke="url(#sgGrad)"
        strokeWidth="13"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  );
}

/* ── 毛玻璃漸層邊框卡片(可選 href 變成連結)── */
function GlassCard({ href, className = "", innerClassName = "", children }) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
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

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    setSubmitted(true);
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap');

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

        @media (prefers-reduced-motion: reduce) {
          .sg-ripple, .sg-fade-up, .sg-float { animation: none !important; opacity: 1; }
        }
        .sg-input:focus {
          outline: none;
          border-color: ${CI.cyan};
          box-shadow: 0 0 0 3px rgba(71,194,226,0.18);
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
            <span className="text-base font-bold tracking-wide" style={{ color: CI.ink }}>
              智感先鋒科技
              <span className="ml-2 hidden text-xs font-semibold tracking-widest md:inline" style={{ color: CI.cyanDeep }}>
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
              className="sg-fade-up sg-d1 text-3xl font-black leading-snug sm:text-5xl lg:text-6xl"
              style={{ color: CI.ink, letterSpacing: "0.02em" }}
            >
              智慧感測,主動守護。
              <br />
              <span className="sg-grad-text">重新定義銀髮安全新標準。</span>
            </h1>
            <p className="sg-fade-up sg-d2 mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
              專為長者設計的穿戴式跌倒預防設備,以獨家距離感測技術即時偵測環境風險,
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
          <p className="mb-3 text-xs font-bold tracking-[0.3em] sm:text-sm" style={{ color: CI.mintDeep }}>
            CORE TECHNOLOGY
          </p>
          <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl" style={{ color: CI.ink }}>
            核心技術與產品特點
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed">
            我們以「距離感測技術」取代傳統單純的 IMU 步態分析,從被動偵測跌倒,
            進化為<strong style={{ color: CI.ink }}>主動預防跌倒</strong>。
          </p>

          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {productsData.map((p) => {
              const Icon = iconMap[p.icon] || Shield;
              return (
                <GlassCard key={p.title} innerClassName="p-8">
                  <span
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: GRAD_SOFT }}
                  >
                    <Icon size={27} color={CI.ink} strokeWidth={1.8} />
                  </span>
                  <h3 className="mb-3 text-lg font-bold sm:text-xl" style={{ color: CI.ink }}>
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed">{p.description}</p>
                </GlassCard>
              );
            })}
          </div>

          {/* 差異化說明 */}
          <div className="mt-20">
            <GlassCard innerClassName="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-black leading-snug sm:text-2xl" style={{ color: CI.ink }}>
                  距離感測 ≠ 傳統 IMU
                  <br />
                  <span className="sg-grad-text">預防,發生在跌倒之前</span>
                </h3>
                <ul className="mt-7 space-y-5 text-sm leading-relaxed">
                  <li className="flex gap-3">
                    <Eye size={18} color={CI.cyanDeep} className="mt-0.5 shrink-0" />
                    即時掃描長者與環境間的空間距離,於碰撞風險形成前主動預警。
                  </li>
                  <li className="flex gap-3">
                    <Radio size={18} color={CI.mintDeep} className="mt-0.5 shrink-0" />
                    不依賴跌倒後的姿態判讀,真正做到「事前防護」而非「事後通報」。
                  </li>
                  <li className="flex gap-3">
                    <HeartHandshake size={18} color={CI.cyanDeep} className="mt-0.5 shrink-0" />
                    輕量無感配戴,讓守護自然融入長輩的每一步日常。
                  </li>
                </ul>
              </div>
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(71,194,226,0.12), rgba(95,194,164,0.12))" }}
              >
                {/* 產品照片預留位置 */}
                <img
                  src=""
                  alt="SmartGuard 穿戴式跌倒預防裝置產品實照,展示輕量化距離感測模組"
                  className="hidden"
                />
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <span className="sg-ripple h-full w-full" />
                  <span className="sg-ripple h-full w-full" style={{ animationDelay: "2.7s" }} />
                  <Shield size={52} color={CI.mintDeep} strokeWidth={1.5} />
                </div>
              </div>
            </GlassCard>
          </div>
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
          <p className="mb-3 text-xs font-bold tracking-[0.3em] sm:text-sm" style={{ color: CI.cyanDeep }}>
            NEWS & HONORS
          </p>
          <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl" style={{ color: CI.ink }}>
            最新消息與榮譽專利
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed">
            技術實力,經得起國際舞台與專利審查的雙重驗證。
          </p>

          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {newsData.map((n) => {
              const Icon = iconMap[n.icon] || Award;
              return (
                <GlassCard key={n.title} href={n.url} innerClassName="flex h-full flex-col p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ background: GRAD_SOFT }}
                    >
                      <Icon size={23} color={CI.ink} strokeWidth={1.8} />
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: CI.cyanDeep }}
                    />
                  </div>
                  <time
                    className="text-xs font-bold tracking-widest"
                    style={{ color: CI.mintDeep, fontFamily: "'Inter',sans-serif" }}
                  >
                    {n.date}
                  </time>
                  <h3 className="mt-2 text-base font-bold leading-relaxed sm:text-lg" style={{ color: CI.ink }}>
                    {n.title}
                  </h3>
                </GlassCard>
              );
            })}
          </div>
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
          <p className="mb-3 text-xs font-bold tracking-[0.3em] sm:text-sm" style={{ color: CI.mintDeep }}>
            ABOUT US
          </p>
          <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl" style={{ color: CI.ink }}>
            讓科技更有溫度,用智慧守護摯愛
          </h2>

          <blockquote className="mx-auto mt-12 max-w-2xl text-base font-semibold leading-loose sm:text-lg" style={{ color: CI.ink }}>
            「智感先鋒科技的誕生,源於一個簡單卻深刻的初心——
            我們希望能用最頂尖的科技,為家中的長者築起一道安心的防線。」
          </blockquote>

          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-left text-sm leading-loose sm:text-base">
            <p>
              我們是一群來自材料工程與醫療科技領域的創新夥伴。我們深知,隨著高齡化社會到來,
              跌倒往往是長者健康最大的隱形威脅。因此,我們走進照護現場,
              將複雜的「距離感測技術」轉化為溫暖、輕量且無感的日常陪伴。
            </p>
            <p>
              我們不追求冰冷的數據,而是專注於「主動防護」的每一個細節。
              智感先鋒科技將持續秉持對生命的關懷,結合跨領域的研發實力,
              打造最懂長者、也最讓照護者安心的 AgeTech 智慧照護系統,
              讓每位長輩都能在科技的守護下,享受尊嚴、安全且自信的銀髮生活。
            </p>
          </div>

          {/* 團隊照片預留位置 */}
          <div className="mt-14">
            <GlassCard innerClassName="flex aspect-[21/9] items-center justify-center">
              <img
                src=""
                alt="智感先鋒科技團隊合照,來自材料工程與醫療科技領域的創新夥伴"
                className="hidden"
              />
              <span className="px-6 text-xs sm:text-sm">團隊照片預留位置(建議使用真實團隊合照)</span>
            </GlassCard>
          </div>
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
          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-bold tracking-[0.3em] sm:text-sm" style={{ color: CI.cyanDeep }}>
              CONTACT
            </p>
            <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl" style={{ color: CI.ink }}>
              商務合作與產品諮詢
            </h2>
            <p className="mt-5 leading-relaxed">
              無論您是照護機構、通路夥伴或關心家中長輩的家屬,
              歡迎與我們聯繫,我們將於三個工作天內回覆。
            </p>
            <ul className="mt-9 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={18} color={CI.cyanDeep} /> contact@smartguard-tech.tw
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} color={CI.mintDeep} /> (07) 000-0000
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} color={CI.cyanDeep} /> 高雄市鼓山區蓮海路 70 號
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <GlassCard innerClassName="p-7 sm:p-10">
              {submitted ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
                  <CheckCircle2 size={48} color={CI.mintDeep} />
                  <h3 className="text-xl font-bold" style={{ color: CI.ink }}>
                    已收到您的訊息
                  </h3>
                  <p className="text-sm">我們將於三個工作天內與您聯繫,感謝您的支持。</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm font-semibold" style={{ color: CI.ink }}>
                    姓名 *
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="王小明"
                      className="sg-input rounded-xl border bg-white px-4 py-3 text-sm font-normal transition-all"
                      style={{ borderColor: "rgba(71,194,226,0.3)", color: CI.ink }}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-semibold" style={{ color: CI.ink }}>
                    單位 / 機構
                    <input
                      type="text"
                      value={form.org}
                      onChange={handleChange("org")}
                      placeholder="○○長照機構"
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
                      className="sg-input rounded-xl border bg-white px-4 py-3 text-sm font-normal transition-all"
                      style={{ borderColor: "rgba(71,194,226,0.3)", color: CI.ink }}
                    />
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
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white transition-transform hover:scale-[1.02] sm:col-span-2"
                    style={{ background: GRAD, boxShadow: "0 8px 26px rgba(71,194,226,0.35)" }}
                  >
                    <Send size={18} /> 送出諮詢
                  </button>
                </div>
              )}
            </GlassCard>
          </div>
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
                <p className="text-sm font-bold" style={{ color: CI.ink }}>
                  智感先鋒科技 SmartGuard Technology
                </p>
                <p className="text-xs">智慧感測,主動守護。</p>
              </div>
            </div>
            <nav aria-label="頁尾連結" className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="transition-opacity hover:opacity-60" style={{ color: CI.inkSoft }}>
                  {l.label}
                </a>
              ))}
              <a href="#" className="transition-opacity hover:opacity-60" style={{ color: CI.inkSoft }}>
                隱私權政策
              </a>
            </nav>
          </div>
          <div
            className="mt-10 flex flex-col gap-2 pt-6 text-xs sm:flex-row sm:justify-between"
            style={{ borderTop: "1px solid rgba(71,194,226,0.18)" }}
          >
            <p>© {new Date().getFullYear()} 智感先鋒科技 SmartGuard Technology. All rights reserved.</p>
            <p>專利公告號:M656911|國際發明展銀牌獎</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

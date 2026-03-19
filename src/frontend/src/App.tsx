import {
  Binary,
  Brain,
  Check,
  Code2,
  Copy,
  Cpu,
  MapPin,
  Menu,
  Monitor,
  RefreshCw,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// --- Countdown Timer ---
function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return { h, m, s };
}

// --- Payment Timer (1 minute, resets on open) ---
function usePaymentTimer(active: boolean) {
  const [seconds, setSeconds] = useState(60);
  const prevActive = useRef(false);

  useEffect(() => {
    if (active && !prevActive.current) {
      setSeconds(60);
    }
    prevActive.current = active;
  }, [active]);

  useEffect(() => {
    if (!active || seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [active, seconds]);

  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  const expired = seconds <= 0;
  return { m, s, expired, seconds };
}

// --- Intersection Observer fade-in ---
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className={`fade-in-up ${className}`}>
      {children}
    </div>
  );
}

function handleHoverEnter(e: React.MouseEvent<HTMLElement>, color: string) {
  (e.currentTarget as HTMLElement).style.color = color;
}

function handleHoverLeave(e: React.MouseEvent<HTMLElement>, color: string) {
  (e.currentTarget as HTMLElement).style.color = color;
}

function handleCardEnter(
  e: React.MouseEvent<HTMLDivElement>,
  borderColor: string,
  shadow: string,
) {
  const el = e.currentTarget as HTMLDivElement;
  el.style.borderColor = borderColor;
  el.style.boxShadow = shadow;
}

function handleCardLeave(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget as HTMLDivElement;
  el.style.borderColor = "rgba(37,214,255,0.15)";
  el.style.boxShadow = "none";
}

// --- Payment Modal ---
function PaymentModal({ onClose }: { onClose: () => void }) {
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const { m, s, expired, seconds } = usePaymentTimer(true);
  const upiId = "romex097@ybl";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleComplete = useCallback(() => {
    if (!utr.trim()) return;
    setPaid(true);
  }, [utr]);

  // Close on backdrop click
  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      onClick={handleBackdrop}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 sm:p-8"
        style={{
          background:
            "linear-gradient(145deg, rgba(10,18,35,0.98) 0%, rgba(5,8,15,0.99) 100%)",
          border: "1px solid rgba(37,214,255,0.25)",
          boxShadow:
            "0 0 60px rgba(37,214,255,0.12), 0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#A7B0C0",
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {paid ? (
          // Success State
          <div className="text-center py-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(37,214,255,0.12)",
                border: "2px solid rgba(37,214,255,0.4)",
              }}
            >
              <Check size={32} style={{ color: "#25D6FF" }} strokeWidth={2.5} />
            </div>
            <h3
              className="font-display font-extrabold text-xl mb-2"
              style={{ color: "#F3F6FF" }}
            >
              Payment Submitted!
            </h3>
            <p className="text-sm mb-4" style={{ color: "#A7B0C0" }}>
              Your UTR has been received. We'll verify and grant access within a
              few minutes.
            </p>
            <a
              href="https://t.me/XEpay_2"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon-cyan w-full text-center py-3 text-sm inline-block"
            >
              📲 Contact Support on Telegram
            </a>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-5">
              <h3
                className="font-display font-extrabold text-xl mb-1"
                style={{ color: "#F3F6FF" }}
              >
                Complete Payment
              </h3>
              <p className="text-xs" style={{ color: "#8E9AAF" }}>
                Scan QR or pay via UPI ID below
              </p>
            </div>

            {/* Timer */}
            <div
              className="flex items-center justify-center gap-2 mb-5 px-4 py-2 rounded-xl"
              style={{
                background: expired
                  ? "rgba(255,50,50,0.1)"
                  : seconds <= 20
                    ? "rgba(255,122,24,0.12)"
                    : "rgba(37,214,255,0.07)",
                border: `1px solid ${
                  expired
                    ? "rgba(255,50,50,0.3)"
                    : seconds <= 20
                      ? "rgba(255,122,24,0.3)"
                      : "rgba(37,214,255,0.2)"
                }`,
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{
                  color: expired
                    ? "#FF5050"
                    : seconds <= 20
                      ? "#FF8A2A"
                      : "#8E9AAF",
                }}
              >
                {expired ? "⏰ Time Expired" : "⏱ Time Left:"}
              </span>
              {!expired && (
                <span
                  className="font-display font-extrabold text-2xl"
                  style={{
                    color: seconds <= 20 ? "#FF8A2A" : "#25D6FF",
                    letterSpacing: "0.04em",
                  }}
                >
                  {m}:{s}
                </span>
              )}
            </div>

            {expired ? (
              <div className="text-center py-4">
                <p className="text-sm mb-4" style={{ color: "#FF5050" }}>
                  Time limit reached. Please restart and try again.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-neon-orange w-full py-3 text-sm"
                >
                  Restart Payment
                </button>
              </div>
            ) : (
              <>
                {/* QR Code */}
                <div
                  className="rounded-2xl overflow-hidden mb-4 flex items-center justify-center"
                  style={{
                    background: "#fff",
                    padding: 10,
                    border: "1px solid rgba(37,214,255,0.15)",
                  }}
                >
                  <img
                    src="/assets/uploads/1773915324789-1.jpg"
                    alt="PhonePe Payment QR Code"
                    className="w-full max-w-[220px] block mx-auto"
                    style={{ borderRadius: 8 }}
                  />
                </div>

                {/* UPI ID */}
                <div className="mb-4">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: "#8E9AAF" }}
                  >
                    UPI ID
                  </p>
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(37,214,255,0.06)",
                      border: "1px solid rgba(37,214,255,0.2)",
                    }}
                  >
                    <span
                      className="flex-1 font-mono text-sm font-bold"
                      style={{ color: "#25D6FF" }}
                    >
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      style={{
                        background: copied
                          ? "rgba(37,214,255,0.2)"
                          : "rgba(37,214,255,0.1)",
                        color: "#25D6FF",
                        border: "1px solid rgba(37,214,255,0.3)",
                      }}
                    >
                      <Copy size={12} />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* UTR Input */}
                <div className="mb-5">
                  <label
                    htmlFor="utr-input"
                    className="text-xs font-bold uppercase tracking-widest mb-2 block"
                    style={{ color: "#8E9AAF" }}
                  >
                    Enter UTR / Transaction ID
                  </label>
                  <input
                    id="utr-input"
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 423156789012"
                    className="w-full rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: utr.trim()
                        ? "1px solid rgba(37,214,255,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                      color: "#F3F6FF",
                    }}
                  />
                  <p className="text-xs mt-1.5" style={{ color: "#8E9AAF" }}>
                    Find UTR in your UPI app after payment
                  </p>
                </div>

                {/* Complete Button */}
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={!utr.trim()}
                  className="w-full py-3.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: utr.trim()
                      ? "linear-gradient(135deg, #25D6FF, #0AA3FF)"
                      : "rgba(255,255,255,0.06)",
                    color: utr.trim() ? "#05080F" : "#4A5568",
                    cursor: utr.trim() ? "pointer" : "not-allowed",
                    boxShadow: utr.trim()
                      ? "0 0 20px rgba(37,214,255,0.3)"
                      : "none",
                    fontWeight: 700,
                  }}
                >
                  ✅ Complete Payment
                </button>

                {/* Telegram CTA */}
                <a
                  href="https://t.me/XEpay_2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mt-3 text-xs font-medium transition-colors"
                  style={{ color: "#8E9AAF" }}
                >
                  <span>Need help?</span>
                  <span style={{ color: "#25D6FF" }}>📲 t.me/XEpay_2</span>
                </a>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// --- Nav ---
function Navbar({ onBuyNow }: { onBuyNow: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Features", href: "#features" },
    { label: "Curriculum", href: "#curriculum" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <header className="navbar-glass sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2"
          data-ocid="nav.link"
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, #25D6FF 0%, #0AA3FF 50%, #FF7A18 100%)",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Code2 size={18} color="#05080F" strokeWidth={2.5} />
          </div>
          <span
            className="font-display font-bold text-lg"
            style={{ color: "#F3F6FF", letterSpacing: "-0.02em" }}
          >
            Code<span className="text-gradient-cyan">Master</span> Pro
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors"
              style={{ color: "#A7B0C0" }}
              onMouseEnter={(e) => handleHoverEnter(e, "#25D6FF")}
              onMouseLeave={(e) => handleHoverLeave(e, "#A7B0C0")}
              data-ocid="nav.link"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={onBuyNow}
            className="btn-neon-cyan text-sm px-6 py-2.5 inline-block"
            data-ocid="nav.primary_button"
          >
            Enroll Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "#A7B0C0" }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{
            borderColor: "rgba(37,214,255,0.1)",
            background: "rgba(5,8,15,0.97)",
          }}
        >
          <div className="px-4 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium"
                style={{ color: "#A7B0C0" }}
                onClick={handleClose}
                data-ocid="nav.link"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              className="btn-neon-cyan text-sm px-6 py-2.5 text-center mt-2"
              onClick={() => {
                handleClose();
                onBuyNow();
              }}
              data-ocid="nav.primary_button"
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// --- Hero ---
function Hero({ onBuyNow }: { onBuyNow: () => void }) {
  return (
    <section
      id="hero"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, rgba(37,214,255,0.08) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <FadeSection>
          {/* Live activity */}
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(37,214,255,0.08)",
              border: "1px solid rgba(37,214,255,0.2)",
            }}
          >
            <span
              className="pulse-dot w-2 h-2 rounded-full inline-block"
              style={{ background: "#25D6FF" }}
            />
            <span className="text-sm" style={{ color: "#A7B0C0" }}>
              🔥 23 people are viewing this right now
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-extrabold uppercase leading-tight mb-6"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
              letterSpacing: "-0.02em",
              color: "#F3F6FF",
            }}
          >
            Become a <span className="text-gradient-cyan">High-Income</span>{" "}
            <br className="hidden sm:block" />
            Programmer in 2026
          </h1>

          {/* Subheading */}
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto mb-8"
            style={{ color: "#A7B0C0", lineHeight: 1.7 }}
          >
            Master C++, Python, Data Structures &amp; Advanced Coding Skills —{" "}
            <span style={{ color: "#F3F6FF" }}>from zero to job-ready</span>
          </p>

          {/* Hero image */}
          <div className="hero-image-card mb-8 overflow-hidden">
            <img
              src="/assets/generated/hero-banner.dim_1200x500.jpg"
              alt="Futuristic AI technology banner"
              className="w-full object-cover"
              style={{ maxHeight: 420, display: "block" }}
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onBuyNow}
              className="btn-neon-cyan px-10 py-4 text-base inline-block"
              data-ocid="hero.primary_button"
            >
              🚀 Enroll Now
            </button>
          </div>

          {/* Trust */}
          <p className="mt-4 text-sm" style={{ color: "#8E9AAF" }}>
            ✅ 5000+ students already enrolled · No prior experience needed
          </p>
        </FadeSection>
      </div>
    </section>
  );
}

// --- Urgency Bar ---
function UrgencyBar() {
  const text =
    "⚡ Hurry Up! Offer Ending Soon — Limited Seats Available ⚡  ·  ⚡ Hurry Up! Offer Ending Soon — Limited Seats Available ⚡  ·  ";
  return (
    <div
      className="overflow-hidden py-3"
      style={{
        background:
          "linear-gradient(90deg, rgba(255,122,24,0.18) 0%, rgba(37,214,255,0.12) 50%, rgba(255,122,24,0.18) 100%)",
        borderTop: "1px solid rgba(255,122,24,0.3)",
        borderBottom: "1px solid rgba(37,214,255,0.2)",
      }}
    >
      <div className="marquee-inner">
        {([text, text] as const).map((t, i) => (
          <span
            key={i === 0 ? "a" : "b"}
            className="text-sm font-bold tracking-wide"
            style={{ color: "#FF8A2A", whiteSpace: "nowrap", paddingRight: 40 }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Features ---
const FEATURES = [
  {
    icon: <MapPin size={28} />,
    title: "Step-by-Step Roadmap",
    desc: "Beginner to Advanced structured curriculum — no confusion, just progress.",
  },
  {
    icon: <Monitor size={28} />,
    title: "Real-World Projects",
    desc: "Build practical apps and projects that employers actually care about.",
  },
  {
    icon: <Zap size={28} />,
    title: "Job-Ready Fast",
    desc: "Intensive training designed to land your first tech role in months.",
  },
  {
    icon: <RefreshCw size={28} />,
    title: "Lifetime Access",
    desc: "Get free future updates forever. Your investment never expires.",
  },
];

function Features() {
  return (
    <section id="features" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
      <FadeSection>
        <div className="text-center mb-12">
          <h2
            className="font-display font-extrabold uppercase mb-3"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
              color: "#F3F6FF",
              letterSpacing: "0.06em",
            }}
          >
            The NexCodEx Path
          </h2>
          <div className="heading-line mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="glass-card rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
              onMouseEnter={(e) =>
                handleCardEnter(
                  e,
                  "rgba(37,214,255,0.4)",
                  "0 0 24px rgba(37,214,255,0.15)",
                )
              }
              onMouseLeave={handleCardLeave}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(37,214,255,0.1)", color: "#25D6FF" }}
              >
                {f.icon}
              </div>
              <h3
                className="font-display font-bold text-base"
                style={{ color: "#F3F6FF" }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#8E9AAF" }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </FadeSection>
    </section>
  );
}

// --- Curriculum ---
const CURRICULUM = [
  {
    icon: <Cpu size={32} />,
    title: "C++ Programming",
    desc: "Master the language of performance — pointers, OOP, memory management, and competitive coding.",
    color: "#25D6FF",
  },
  {
    icon: <Code2 size={32} />,
    title: "Python Programming",
    desc: "From scripting to automation, web apps, and machine learning foundations.",
    color: "#FF7A18",
  },
  {
    icon: <Binary size={32} />,
    title: "Data Structures & Algorithms",
    desc: "Crack any coding interview with arrays, trees, graphs, DP, and sorting algorithms.",
    color: "#25D6FF",
  },
  {
    icon: <Brain size={32} />,
    title: "Basics of AI Models",
    desc: "Understand neural networks, LLMs, and how modern AI applications are built.",
    color: "#FF7A18",
  },
];

function Curriculum() {
  return (
    <section
      id="curriculum"
      className="py-20"
      style={{ background: "rgba(16,24,38,0.3)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeSection>
          <div className="text-center mb-12">
            <h2
              className="font-display font-extrabold uppercase mb-3"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
                color: "#F3F6FF",
                letterSpacing: "0.06em",
              }}
            >
              What You&apos;ll Learn
            </h2>
            <div className="heading-line mx-auto" />
            <p className="mt-4 text-sm" style={{ color: "#8E9AAF" }}>
              A complete roadmap covering everything modern companies hire for
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CURRICULUM.map((c) => (
              <div
                key={c.title}
                className="glass-card rounded-2xl p-7 flex gap-5 items-start transition-all duration-300"
                onMouseEnter={(e) =>
                  handleCardEnter(e, `${c.color}55`, `0 0 20px ${c.color}22`)
                }
                onMouseLeave={handleCardLeave}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${c.color}18`, color: c.color }}
                >
                  {c.icon}
                </div>
                <div>
                  <h3
                    className="font-display font-bold text-lg mb-1.5"
                    style={{ color: "#F3F6FF" }}
                  >
                    {c.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#8E9AAF" }}
                  >
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// --- Pricing ---
const PLAN_FEATURES = [
  "Complete C++, Python & DSA Curriculum",
  "Basics of AI Models & Applications",
  "50+ Real-World Projects",
  "Job Interview Preparation Kit",
  "Lifetime Access + Free Future Updates",
  "Certificate of Completion",
  "24/7 Community Support",
];

function Pricing({ onBuyNow }: { onBuyNow: () => void }) {
  const { h, m, s } = useCountdown(7199); // 1:59:59

  return (
    <section
      id="pricing"
      className="py-20"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(37,214,255,0.05) 0%, transparent 70%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeSection>
          <div className="text-center mb-10">
            <h2
              className="font-display font-extrabold uppercase mb-3"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
                color: "#F3F6FF",
                letterSpacing: "0.06em",
              }}
            >
              Exclusive Early Bird Offer
            </h2>
            <div className="heading-line mx-auto mb-5" />
            <p
              className="text-sm blink-text font-bold"
              style={{ color: "#FF8A2A" }}
            >
              ⚡ Hurry Up! Offer Ending Soon
            </p>
          </div>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#8E9AAF" }}
            >
              Ends In:
            </span>
            {[
              { value: h, label: "Hours" },
              { value: m, label: "Mins" },
              { value: s, label: "Secs" },
            ].map((unit, i, arr) => (
              <div key={unit.label} className="flex items-center gap-3">
                <div className="timer-box" data-ocid="pricing.panel">
                  <div className="font-display font-extrabold text-3xl text-gradient-cyan leading-none">
                    {unit.value}
                  </div>
                  <div
                    className="text-xs mt-1 uppercase tracking-wide"
                    style={{ color: "#8E9AAF" }}
                  >
                    {unit.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "#25D6FF", opacity: 0.6 }}
                  >
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Pricing card */}
          <div className="pricing-card-featured p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <p
                  className="text-sm uppercase tracking-widest mb-2"
                  style={{ color: "#8E9AAF" }}
                >
                  Full Course Bundle
                </p>
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-display font-extrabold"
                    style={{
                      fontSize: "clamp(2rem, 6vw, 3rem)",
                      color: "#25D6FF",
                    }}
                  >
                    ₹1,499
                  </span>
                  <span
                    className="text-lg line-through"
                    style={{ color: "#8E9AAF" }}
                  >
                    ₹15,999
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: "#8E9AAF" }}>
                  One-Time Payment · Lifetime Value
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="px-4 py-1.5 rounded-full text-sm font-extrabold text-center"
                  style={{
                    background: "linear-gradient(135deg, #FF7A18, #FF8A2A)",
                    color: "#fff",
                    boxShadow: "0 0 16px rgba(255,122,24,0.4)",
                  }}
                >
                  90% OFF
                </span>
                <span
                  className="px-4 py-1.5 rounded-full text-xs font-bold text-center blink-text"
                  style={{
                    background: "rgba(255,122,24,0.1)",
                    border: "1px solid rgba(255,122,24,0.3)",
                    color: "#FF8A2A",
                  }}
                >
                  Limited Time Offer
                </span>
              </div>
            </div>

            {/* Features list */}
            <ul className="flex flex-col gap-3 mb-8">
              {PLAN_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(37,214,255,0.15)",
                      color: "#25D6FF",
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm" style={{ color: "#A7B0C0" }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onBuyNow}
              className="btn-neon-orange w-full text-center py-4 text-base"
              data-ocid="pricing.primary_button"
            >
              🔥 Buy Now — ₹1,499 Only
            </button>
            <p
              className="text-center text-sm mt-4"
              style={{ color: "#8E9AAF" }}
            >
              One-Time Investment – Lifetime Value
            </p>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// --- Testimonials ---
const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer, TCS",
    quote:
      "This course changed my career completely! Got a job at a top IT firm within 4 months. The structured roadmap made everything crystal clear.",
    initials: "RS",
  },
  {
    name: "Priya Singh",
    role: "Junior Developer, Infosys",
    quote:
      "Best investment I ever made. The C++ and Python sections are incredibly detailed. I went from zero to building full projects confidently.",
    initials: "PS",
  },
  {
    name: "Amit Verma",
    role: "SDE Intern, Amazon",
    quote:
      "The DSA section helped me crack coding interviews at top companies! I cleared 5 interviews back-to-back. Truly life-changing content.",
    initials: "AV",
  },
  {
    name: "Neha Gupta",
    role: "Freelance Developer",
    quote:
      "Lifetime access is amazing. I keep coming back to revise concepts whenever I need. The future updates keep content fresh and relevant.",
    initials: "NG",
  },
  {
    name: "Rohan Patel",
    role: "Full Stack Developer",
    quote:
      "Real-world projects made all the difference. I built an actual portfolio and landed freelance clients before even finishing the course!",
    initials: "RP",
  },
];

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-20"
      style={{ background: "rgba(16,24,38,0.3)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeSection>
          <div className="text-center mb-12">
            <h2
              className="font-display font-extrabold uppercase mb-3"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
                color: "#F3F6FF",
                letterSpacing: "0.06em",
              }}
            >
              What Our Students Say
            </h2>
            <div className="heading-line mx-auto mb-3" />
            <p className="text-sm" style={{ color: "#8E9AAF" }}>
              5000+ students have transformed their careers
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`glass-card rounded-2xl p-6 flex flex-col gap-4 ${
                  i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
                data-ocid={`testimonials.item.${i + 1}`}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((si) => (
                    <Star key={si} size={14} fill="#FF8A2A" stroke="none" />
                  ))}
                </div>
                {/* Quote */}
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "#A7B0C0" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* Author */}
                <div
                  className="flex items-center gap-3 pt-2 border-t"
                  style={{ borderColor: "rgba(37,214,255,0.1)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #25D6FF, #0AA3FF)",
                      color: "#05080F",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#F3F6FF" }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "#8E9AAF" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// --- Final CTA ---
function FinalCTA({ onBuyNow }: { onBuyNow: () => void }) {
  return (
    <section
      className="py-24 text-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(37,214,255,0.07) 0%, rgba(255,122,24,0.04) 40%, transparent 70%)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <FadeSection>
          <h2
            className="font-display font-extrabold uppercase mb-4"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#F3F6FF",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Start Your{" "}
            <span className="text-gradient-cyan">Coding Journey</span> Today
          </h2>
          <p className="text-base mb-8" style={{ color: "#A7B0C0" }}>
            Join 5000+ students who are already building real skills and landing
            high-income tech jobs.
          </p>
          <button
            type="button"
            onClick={onBuyNow}
            className="btn-neon-orange px-12 py-5 text-lg inline-block"
            data-ocid="cta.primary_button"
          >
            🔥 Buy Now — ₹1,499
          </button>
          <p className="mt-5 text-sm" style={{ color: "#8E9AAF" }}>
            One-Time Investment – Lifetime Value · No subscription, no hidden
            fees
          </p>
        </FadeSection>
      </div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="py-12 border-t"
      style={{
        borderColor: "rgba(37,214,255,0.1)",
        background: "rgba(5,8,15,0.9)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #25D6FF 0%, #0AA3FF 50%, #FF7A18 100%)",
                  borderRadius: 8,
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Code2 size={16} color="#05080F" strokeWidth={2.5} />
              </div>
              <span
                className="font-display font-bold text-base"
                style={{ color: "#F3F6FF" }}
              >
                Code<span className="text-gradient-cyan">Master</span> Pro
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#8E9AAF", maxWidth: 300 }}
            >
              India&apos;s most comprehensive programming course. From beginner
              to job-ready in record time.
            </p>
            <p className="text-sm mt-4" style={{ color: "#8E9AAF" }}>
              📧{" "}
              <a
                href="mailto:support@codemasterpro.in"
                style={{ color: "#25D6FF" }}
              >
                support@codemasterpro.in
              </a>
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#8E9AAF" }}
            >
              Course
            </h4>
            <ul className="flex flex-col gap-2">
              {["Features", "Curriculum", "Pricing", "Testimonials"].map(
                (l) => (
                  <li key={l}>
                    <a
                      href={`#${l.toLowerCase()}`}
                      className="text-sm transition-colors"
                      style={{ color: "#8E9AAF" }}
                      onMouseEnter={(e) => handleHoverEnter(e, "#25D6FF")}
                      onMouseLeave={(e) => handleHoverLeave(e, "#8E9AAF")}
                    >
                      {l}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#8E9AAF" }}
            >
              Legal
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                "Terms of Service",
                "Privacy Policy",
                "Refund Policy",
                "Contact Us",
              ].map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    className="text-sm transition-colors"
                    style={{ color: "#8E9AAF" }}
                    onMouseEnter={(e) => handleHoverEnter(e, "#25D6FF")}
                    onMouseLeave={(e) => handleHoverLeave(e, "#8E9AAF")}
                    data-ocid="footer.link"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
          style={{
            borderColor: "rgba(37,214,255,0.08)",
            color: "#8E9AAF",
          }}
        >
          <p>&copy; {year} CodeMaster Pro. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#25D6FF" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// --- App ---
export default function App() {
  const [paymentOpen, setPaymentOpen] = useState(false);

  const openPayment = useCallback(() => setPaymentOpen(true), []);
  const closePayment = useCallback(() => setPaymentOpen(false), []);

  return (
    <div className="min-h-screen">
      <Navbar onBuyNow={openPayment} />
      <main>
        <Hero onBuyNow={openPayment} />
        <UrgencyBar />
        <Features />
        <Curriculum />
        <Pricing onBuyNow={openPayment} />
        <Testimonials />
        <FinalCTA onBuyNow={openPayment} />
      </main>
      <Footer />
      {paymentOpen && <PaymentModal onClose={closePayment} />}
    </div>
  );
}

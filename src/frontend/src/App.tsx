import {
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  Copy,
  Mail,
  MessageCircle,
  Send,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const currentYear = new Date().getFullYear();

function TelegramCTA() {
  return (
    <a
      href="https://t.me/XEpay_2"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 text-xs font-semibold transition-all hover:opacity-80"
      style={{ color: "#22D3FF" }}
    >
      <Send size={13} />
      Need help? Contact us on Telegram @XEpay_2
    </a>
  );
}

function GradientButton({
  children,
  className = "",
  size = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "default" | "lg" | "sm";
}) {
  const sizeClasses =
    size === "lg"
      ? "px-10 py-5 text-lg"
      : size === "sm"
        ? "px-5 py-2.5 text-sm"
        : "px-7 py-3.5 text-base";
  return (
    <button
      className={`btn-gradient btn-pulse rounded-full font-bold text-white cursor-pointer border-0 outline-none inline-flex items-center gap-2 ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function SectionTitle({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`text-3xl md:text-4xl font-bold text-center text-white uppercase tracking-wide mb-4 ${className}`}
    >
      {children}
    </h2>
  );
}

function ProductCard({
  icon,
  title,
  description,
  bullets,
  onBuyNow,
}: {
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  onBuyNow: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glow-border glow-border-hover rounded-2xl p-7 flex flex-col gap-4 flex-1 min-w-0 transition-all duration-300"
    >
      <div className="text-5xl mb-1">{icon}</div>
      <h3 className="text-xl font-bold text-white uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-sm" style={{ color: "#A7B0C0" }}>
        {description}
      </p>
      <ul className="flex flex-col gap-2 mt-1">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2 text-sm"
            style={{ color: "#C8D0E0" }}
          >
            <span className="mt-0.5 text-base">✅</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4">
        <button
          className="w-full rounded-full py-2.5 text-sm font-semibold border text-white transition-all duration-200 hover:bg-white/10"
          type="button"
          style={{ borderColor: "rgba(34,211,255,0.4)", color: "#22D3FF" }}
          onClick={onBuyNow}
        >
          Shop Now
        </button>
      </div>
    </motion.div>
  );
}

function TrustCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex flex-col items-center gap-3 p-6 rounded-2xl"
      style={{
        background: "rgba(11,21,38,0.8)",
        border: "1px solid rgba(59,130,255,0.2)",
      }}
    >
      <div className="text-3xl">{icon}</div>
      <span className="font-semibold text-white text-center text-sm">
        {label}
      </span>
    </div>
  );
}

function FAQItem({
  question,
  answer,
  index,
}: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      className="faq-item rounded-xl overflow-hidden cursor-pointer w-full text-left"
      onClick={() => setOpen(!open)}
      data-ocid={`faq.item.${index + 1}`}
    >
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <span className="font-semibold text-white text-sm md:text-base">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={20} style={{ color: "#22D3FF" }} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div
              className="px-6 pb-5 text-sm leading-relaxed"
              style={{ color: "#A7B0C0" }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function PaymentModal({ onClose }: { onClose: () => void }) {
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const upiId = "romex097@ybl";

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    if (utr.trim().length >= 6) {
      setSuccess(true);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="payment.modal"
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full max-w-md rounded-3xl p-7 flex flex-col gap-5"
        style={{
          background: "rgba(8,15,28,0.98)",
          border: "1.5px solid rgba(34,211,255,0.35)",
          boxShadow:
            "0 0 48px rgba(34,211,255,0.12), 0 8px 40px rgba(0,0,0,0.7)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-white/10"
          style={{ color: "#A7B0C0" }}
          data-ocid="payment.close_button"
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl font-black text-white">
                  Complete Your Payment
                </h2>
                <p className="text-sm mt-1" style={{ color: "#22D3FF" }}>
                  Pay ₹49 via UPI
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div
                  className="rounded-2xl p-3"
                  style={{
                    background: "white",
                    boxShadow: "0 0 24px rgba(34,211,255,0.2)",
                  }}
                >
                  <img
                    src="/assets/uploads/1773825122748-1.jpg"
                    alt="PhonePe QR Code"
                    width={220}
                    height={220}
                    className="rounded-xl block"
                    style={{ width: 220, height: 220, objectFit: "contain" }}
                  />
                </div>
              </div>

              {/* UPI ID */}
              <div
                className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                style={{
                  background: "rgba(34,211,255,0.07)",
                  border: "1px solid rgba(34,211,255,0.25)",
                }}
              >
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "#A7B0C0" }}>
                    UPI ID
                  </p>
                  <p className="font-bold text-white tracking-wide">{upiId}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: copied
                      ? "rgba(34,211,255,0.2)"
                      : "rgba(34,211,255,0.1)",
                    color: "#22D3FF",
                    border: "1px solid rgba(34,211,255,0.3)",
                  }}
                  data-ocid="payment.toggle"
                >
                  <Copy size={13} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Instructions */}
              <p
                className="text-xs text-center leading-relaxed"
                style={{ color: "#A7B0C0" }}
              >
                Scan QR or pay using UPI ID above, then enter your UTR /
                Transaction ID below
              </p>

              {/* UTR Input */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="utr-input"
                  className="text-xs font-semibold"
                  style={{ color: "#C8D0E0" }}
                >
                  Enter UTR / Transaction ID
                </label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="12-digit transaction reference"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border:
                      utr.length >= 6
                        ? "1.5px solid rgba(34,211,255,0.6)"
                        : "1.5px solid rgba(255,255,255,0.1)",
                  }}
                  id="utr-input"
                  data-ocid="payment.input"
                />
              </div>

              {/* Complete Button */}
              <button
                type="button"
                onClick={handleComplete}
                disabled={utr.trim().length < 6}
                className="w-full rounded-full py-4 font-bold text-base transition-all duration-200"
                style={{
                  background:
                    utr.trim().length >= 6
                      ? "linear-gradient(135deg, #22D3FF 0%, #7C4DFF 100%)"
                      : "rgba(255,255,255,0.07)",
                  color: utr.trim().length >= 6 ? "white" : "#555E70",
                  cursor: utr.trim().length >= 6 ? "pointer" : "not-allowed",
                  boxShadow:
                    utr.trim().length >= 6
                      ? "0 4px 24px rgba(34,211,255,0.25)"
                      : "none",
                }}
                data-ocid="payment.submit_button"
              >
                Complete Payment ✅
              </button>

              {/* Telegram Customer Service CTA */}
              <TelegramCTA />
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col items-center gap-5 py-6 text-center"
              data-ocid="payment.success_state"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: 0.1,
                }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(34,211,100,0.15)",
                  border: "2px solid rgba(34,211,100,0.5)",
                }}
              >
                <CheckCircle2 size={44} style={{ color: "#22D364" }} />
              </motion.div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  Payment Submitted!
                </h3>
                <p
                  className="text-sm mt-2 leading-relaxed"
                  style={{ color: "#A7B0C0" }}
                >
                  We've received your UTR. You'll get access via WhatsApp or
                  Email shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-full font-bold text-white text-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #22D3FF 0%, #7C4DFF 100%)",
                  boxShadow: "0 4px 24px rgba(34,211,255,0.25)",
                }}
                data-ocid="payment.close_button"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [paymentOpen, setPaymentOpen] = useState(false);

  const scrollToPrice = () => {
    document
      .getElementById("price-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const openPayment = () => setPaymentOpen(true);
  const closePayment = () => setPaymentOpen(false);

  return (
    <div
      className="min-h-screen font-poppins"
      style={{
        background:
          "linear-gradient(160deg, #05070B 0%, #080F1C 50%, #06090F 100%)",
      }}
    >
      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {paymentOpen && <PaymentModal onClose={closePayment} />}
      </AnimatePresence>

      {/* NAVBAR */}
      <header
        className="sticky top-0 z-50 w-full flex items-center justify-between px-5 md:px-10 py-4"
        style={{
          background: "rgba(5,7,11,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(59,130,255,0.1)",
        }}
        data-ocid="nav.panel"
      >
        <span
          className="text-xl font-extrabold"
          style={{
            background: "linear-gradient(135deg, #22D3FF, #7C4DFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DigitalLabs
        </span>
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium"
          style={{ color: "#A7B0C0" }}
        >
          <a
            href="#products"
            className="hover:text-white transition-colors"
            data-ocid="nav.link"
          >
            Products
          </a>
          <a
            href="#price-section"
            className="hover:text-white transition-colors"
            data-ocid="nav.link"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="hover:text-white transition-colors"
            data-ocid="nav.link"
          >
            FAQ
          </a>
        </nav>
        <GradientButton
          size="sm"
          onClick={scrollToPrice}
          data-ocid="nav.primary_button"
        >
          GET ACCESS NOW 🚀
        </GradientButton>
      </header>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center px-5 pt-24 pb-28 overflow-hidden">
        <div className="hero-aura" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-6 max-w-3xl"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(34,211,255,0.1)",
              border: "1px solid rgba(34,211,255,0.3)",
              color: "#22D3FF",
            }}
          >
            <Zap size={12} /> Limited Time Offer – Grab It Now!
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight tracking-tight">
            ALL EBOOKS &amp; COURSES{" "}
            <span className="text-gradient block md:inline">@₹49</span>
          </h1>
          <p
            className="text-base md:text-lg max-w-xl"
            style={{ color: "#A7B0C0" }}
          >
            Learn Trading, eCommerce, and AI Skills – Beginner Friendly
          </p>
          <GradientButton
            size="lg"
            onClick={scrollToPrice}
            data-ocid="hero.primary_button"
          >
            GET ACCESS NOW 🚀
          </GradientButton>
          <p
            className="text-sm flex items-center gap-1.5"
            style={{ color: "#A7B0C0" }}
          >
            <span style={{ color: "#22D3FF" }}>⚡</span> Instant access after
            payment
          </p>
        </motion.div>
      </section>

      {/* PRODUCT CARDS */}
      <section id="products" className="px-5 md:px-10 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>What You'll Get</SectionTitle>
          <p className="text-center mb-12 text-sm" style={{ color: "#A7B0C0" }}>
            Three powerful domains. One unbeatable price.
          </p>
          <div
            className="flex flex-col md:flex-row gap-6"
            data-ocid="products.list"
          >
            <ProductCard
              icon="📈"
              title="Stock Trading"
              description="Master the markets with step-by-step strategies designed for beginners."
              bullets={[
                "Learn candlestick patterns & strategies",
                "Beginner to advanced charts",
                "Risk management techniques",
              ]}
              onBuyNow={openPayment}
            />
            <ProductCard
              icon="🛒"
              title="eCommerce Mastery"
              description="Build and scale your online business from scratch, even as a beginner."
              bullets={[
                "Start your online store from zero",
                "Product research & selling strategies",
                "Scale with dropshipping & ads",
              ]}
              onBuyNow={openPayment}
            />
            <ProductCard
              icon="🤖"
              title="AI & Automation"
              description="Leverage the latest AI tools to automate work and build income streams."
              bullets={[
                "Master ChatGPT for business",
                "Automate tasks with AI tools",
                "Build income streams with AI",
              ]}
              onBuyNow={openPayment}
            />
          </div>
        </motion.div>
      </section>

      {/* PRICE SECTION */}
      <section id="price-section" className="px-5 md:px-10 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glow-border rounded-3xl max-w-4xl mx-auto p-8 md:p-12"
          style={{
            background: "linear-gradient(135deg, #080F1C 0%, #0A1525 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{
                  background: "rgba(184,75,255,0.15)",
                  color: "#B84BFF",
                  border: "1px solid rgba(184,75,255,0.3)",
                }}
              >
                ⏰ LIMITED TIME SPECIAL OFFER
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Everything you need to start earning online
              </h2>
              <ul className="flex flex-col gap-3">
                {[
                  "Beginner Friendly",
                  "Step-by-Step Learning",
                  "Practical Content",
                  "Easy to Understand",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: "#C8D0E0" }}
                  >
                    <CheckCircle2
                      size={18}
                      style={{ color: "#22D3FF", flexShrink: 0 }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center gap-5">
              <div
                className="rounded-2xl p-8 text-center"
                style={{
                  background: "rgba(5,7,11,0.8)",
                  border: "2px solid rgba(34,211,255,0.3)",
                }}
              >
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "#A7B0C0" }}
                >
                  Total Price
                </p>
                <div className="text-6xl md:text-7xl font-black text-gradient">
                  ₹49
                </div>
                <p className="text-xs mt-1" style={{ color: "#A7B0C0" }}>
                  Only
                </p>
              </div>
              {/* Telegram CTA above Buy Now button */}
              <TelegramCTA />
              <GradientButton
                size="lg"
                onClick={openPayment}
                data-ocid="price.primary_button"
              >
                BUY NOW 🚀
              </GradientButton>
              <p className="text-xs" style={{ color: "#A7B0C0" }}>
                ⚡ Instant access after payment
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TRUST SECTION */}
      <section className="px-5 md:px-10 py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>Why Choose Us?</SectionTitle>
          <p className="text-center mb-12 text-sm" style={{ color: "#A7B0C0" }}>
            Built for people who are just getting started
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TrustCard icon="🎯" label="Beginner Friendly" />
            <TrustCard icon="📚" label="Step-by-Step Learning" />
            <TrustCard icon="💡" label="Practical Content" />
            <TrustCard icon="✅" label="Easy to Understand" />
          </div>
        </motion.div>
      </section>

      {/* DELIVERY SECTION */}
      <section className="px-5 md:px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <SectionTitle>How Will You Get It?</SectionTitle>
          <div
            className="mt-8 rounded-2xl p-8 flex flex-col items-center gap-6"
            style={{
              background: "rgba(11,21,38,0.8)",
              border: "1px solid rgba(59,130,255,0.2)",
            }}
          >
            <BookOpen size={40} style={{ color: "#22D3FF" }} />
            <p className="text-lg font-semibold text-white">
              Get instant access after payment via WhatsApp or Email
            </p>
            <p className="text-sm" style={{ color: "#A7B0C0" }}>
              After completing your payment of ₹49, you'll immediately receive
              all the ebooks and course materials through your preferred
              channel.
            </p>
            <div className="flex gap-6 mt-2">
              <div
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "#22D3FF" }}
              >
                <MessageCircle size={20} />
                WhatsApp Delivery
              </div>
              <div
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "#7C4DFF" }}
              >
                <Mail size={20} />
                Email Delivery
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="px-5 md:px-10 py-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <p className="text-center mb-10 text-sm" style={{ color: "#A7B0C0" }}>
            Got questions? We've got answers.
          </p>
          <div className="flex flex-col gap-3">
            <FAQItem
              index={0}
              question="Is this beginner friendly?"
              answer="Yes! All content is designed for complete beginners. No prior knowledge required. We start from the very basics and gradually move to advanced concepts."
            />
            <FAQItem
              index={1}
              question="How will I receive my purchase?"
              answer="You'll get instant access via WhatsApp or Email right after payment. Just send us your payment confirmation and we'll deliver it to you immediately."
            />
            <FAQItem
              index={2}
              question="Is it worth ₹49?"
              answer="Absolutely! You get high-value learning content at an unbeatable price. The knowledge inside can help you build real income streams and skills worth thousands of rupees."
            />
            <FAQItem
              index={3}
              question="What topics are covered?"
              answer="Trading basics (candlestick patterns, strategies, risk management), eCommerce strategies (dropshipping, product research, ads), AI tools like ChatGPT, automation, and much more."
            />
          </div>
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 md:px-10 py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(59,130,255,0.12) 0%, rgba(124,77,255,0.08) 50%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-6"
        >
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "#22D3FF" }}
          >
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight">
            Start Learning Today <span className="text-gradient">@₹49</span>
          </h2>
          <p className="text-base" style={{ color: "#A7B0C0" }}>
            Join thousands of learners already growing their skills
          </p>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "#A7B0C0" }}
          >
            <Users size={16} style={{ color: "#22D3FF" }} />
            <span>5,000+ learners and growing</span>
          </div>
          <GradientButton
            size="lg"
            onClick={scrollToPrice}
            data-ocid="cta.primary_button"
          >
            GET ACCESS NOW 🚀
          </GradientButton>
          <p className="text-sm" style={{ color: "#A7B0C0" }}>
            <span style={{ color: "#22D3FF" }}>⚡</span> Instant access after
            payment
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-5 md:px-10 py-8 text-center"
        style={{
          borderTop: "1px solid rgba(59,130,255,0.1)",
          background: "rgba(5,7,11,0.9)",
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-sm" style={{ color: "#A7B0C0" }}>
            DigitalLabs © {currentYear} | All rights reserved
          </span>
          <span
            className="text-sm flex items-center gap-2"
            style={{ color: "#A7B0C0" }}
          >
            <MessageCircle size={14} style={{ color: "#22D3FF" }} />
            Contact us via WhatsApp or Email for support
          </span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors hover:text-white"
            style={{ color: "#555E70" }}
          >
            Built with ❤️ using{" "}
            <span className="text-gradient font-semibold">caffeine.ai</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

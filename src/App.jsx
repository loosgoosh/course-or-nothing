import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

const API_URL = "https://insurance-commission-tracker-production.up.railway.app/api/course/generate";

const STRIPE_MONTHLY = "https://buy.stripe.com/4gM8wQc548k3h2k6f6bZe08";
const STRIPE_LIFETIME = "https://buy.stripe.com/5kQbJ20mm2ZJfYg0UMbZe09";
const GUMROAD_COURSE = "https://guaschlabs.gumroad.com/l/ijqhs";
const SHOP_FORMSPREE = "https://formspree.io/f/mbdqyyly";

const FREE_LIMIT = 3;
const STORAGE_COUNT_KEY = "con_uses";
const STORAGE_PAID_KEY = "con_paid";
const STORAGE_RESET_KEY = "con_reset";

const getUsesLeft = () => {
  if (localStorage.getItem(STORAGE_PAID_KEY)) return 999;
  const reset = parseInt(localStorage.getItem(STORAGE_RESET_KEY) || "0", 10);
  const now = Date.now();
  if (now - reset > 24 * 60 * 60 * 1000) {
    localStorage.setItem(STORAGE_COUNT_KEY, "0");
    localStorage.setItem(STORAGE_RESET_KEY, String(now));
  }
  const count = parseInt(localStorage.getItem(STORAGE_COUNT_KEY) || "0", 10);
  return Math.max(0, FREE_LIMIT - count);
};

const glitchKeyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap');
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
  @keyframes glitch1 {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(-2px, 1px); }
    94% { transform: translate(2px, -1px); }
    96% { transform: translate(-1px, 2px); }
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes flicker { 0%, 95%, 100% { opacity: 1; } 96% { opacity: 0.4; } 97% { opacity: 1; } 98% { opacity: 0.2; } 99% { opacity: 1; } }
  @keyframes pulse-green { 0%, 100% { box-shadow: 0 0 0px #39ff14; } 50% { box-shadow: 0 0 12px #39ff14; } }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::selection { background: #39ff14; color: #000; }
`;

const C = {
  black: "#000000", white: "#ffffff", green: "#39ff14",
  greenDim: "#1a7a00", greenFaint: "#0a2a00", gray: "#888888",
  darkGray: "#111111", border: "#1f1f1f",
};

function PaywallModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: C.black, border: `1px solid ${C.green}`, maxWidth: "480px", width: "100%", animation: "modalIn 0.3s ease" }}>
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: C.green, fontSize: "10px", letterSpacing: "0.3em" }}>▶ FREE LIMIT REACHED</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.gray, cursor: "pointer", fontSize: "16px", fontFamily: "'Share Tech Mono', monospace" }}>✕</button>
        </div>
        <div style={{ padding: "32px 24px" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "42px", lineHeight: 1, color: C.white, marginBottom: "12px", letterSpacing: "0.02em" }}>
            YOU USED YOUR<br /><span style={{ color: C.green }}>3 FREE READS.</span>
          </div>
          <p style={{ color: C.gray, fontSize: "12px", letterSpacing: "0.1em", lineHeight: 1.8, textTransform: "uppercase", marginBottom: "32px" }}>
            Unlock unlimited course ideas.<br />All skills are monetizable — including yours.
          </p>
          <a href={STRIPE_MONTHLY} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ border: `1px solid ${C.green}`, padding: "20px 24px", marginBottom: "12px", cursor: "pointer", background: C.greenFaint, display: "flex", justifyContent: "space-between", alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.background = "#0f3800"}
              onMouseLeave={e => e.currentTarget.style.background = C.greenFaint}>
              <div>
                <div style={{ color: C.green, fontSize: "10px", letterSpacing: "0.3em", marginBottom: "6px" }}>MONTHLY ACCESS</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: C.white, letterSpacing: "0.03em" }}>$1.99 / MONTH</div>
                <div style={{ color: C.gray, fontSize: "10px", letterSpacing: "0.15em", marginTop: "4px" }}>CANCEL ANYTIME</div>
              </div>
              <span style={{ color: C.green, fontSize: "20px" }}>→</span>
            </div>
          </a>
          <a href={STRIPE_LIFETIME} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ border: `1px solid ${C.border}`, padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.green}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div>
                <div style={{ color: C.gray, fontSize: "10px", letterSpacing: "0.3em", marginBottom: "6px" }}>LIFETIME ACCESS ★ BEST VALUE</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: C.white, letterSpacing: "0.03em" }}>$20 ONE TIME</div>
                <div style={{ color: C.gray, fontSize: "10px", letterSpacing: "0.15em", marginTop: "4px" }}>PAY ONCE. USE FOREVER.</div>
              </div>
              <span style={{ color: C.gray, fontSize: "20px" }}>→</span>
            </div>
          </a>
          <div style={{ marginTop: "20px", textAlign: "center", color: "#444", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}>Secure payment via Stripe</div>
        </div>
      </div>
    </div>
  );
}

function ShopPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await fetch(SHOP_FORMSPREE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "CON Shop Waitlist" }),
    });
    setSent(true);
    setLoading(false);
  };

  const items = [
    { name: "CON HOODIE", desc: "Black. Neon green. Heavy.", tag: "DROPPING SOON" },
    { name: "CON TEE", desc: "Oversized. All skills. Monetizable.", tag: "DROPPING SOON" },
    { name: "CON SOCKS", desc: "You know what they say.", tag: "DROPPING SOON" },
    { name: "CON HAT", desc: "Structured. Clean. Unhinged.", tag: "DROPPING SOON" },
  ];

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px 100px" }}>
      <div style={{ marginBottom: "48px" }}>
        <div style={{ fontSize: "11px", color: C.green, letterSpacing: "0.3em", marginBottom: "20px", textTransform: "uppercase" }}>▶ CON STORE</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 14vw, 100px)", lineHeight: 0.9, letterSpacing: "0.02em", color: C.white, marginBottom: "24px" }}>
          COMING<br /><span style={{ color: C.green }}>SOON</span>
        </h1>
        <p style={{ color: C.gray, fontSize: "13px", letterSpacing: "0.1em", lineHeight: 1.8, textTransform: "uppercase" }}>
          The merch is coming.<br />
          <span style={{ color: C.green }}>Drop your email to be first in line.</span>
        </p>
      </div>

      {/* Email capture */}
      <div style={{ border: `1px solid ${C.green}`, marginBottom: "48px", background: C.greenFaint }}>
        <div style={{ padding: "10px 24px", borderBottom: `1px solid ${C.greenDim}`, fontSize: "10px", color: C.green, letterSpacing: "0.3em" }}>▶ JOIN THE WAITLIST</div>
        <div style={{ padding: "24px" }}>
          {sent ? (
            <div style={{ color: C.green, fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase" }}>✓ YOU'RE ON THE LIST. WE'LL HIT YOU FIRST.</div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="YOUR EMAIL"
                style={{ flex: 1, padding: "14px 16px", background: "transparent", border: `1px solid ${C.greenDim}`, color: C.white, fontSize: "12px", letterSpacing: "0.2em", fontFamily: "'Share Tech Mono', monospace", outline: "none" }} />
              <button onClick={submit} disabled={loading} style={{ padding: "14px 24px", background: C.green, border: "none", color: C.black, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer", fontWeight: "700" }}>
                {loading ? "..." : "JOIN"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product previews */}
      <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "20px" }}>▶ PREVIEW</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ border: `1px solid ${C.border}`, padding: "24px", background: i % 2 === 0 ? C.black : "#080808", position: "relative" }}>
            <div style={{ position: "absolute", top: "12px", right: "12px", background: "#111", border: `1px solid ${C.border}`, padding: "3px 8px", fontSize: "8px", color: C.gray, letterSpacing: "0.2em", animation: "pulse 2s infinite" }}>
              {item.tag}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", color: C.white, letterSpacing: "0.03em", marginBottom: "8px", lineHeight: 1 }}>{item.name}</div>
            <div style={{ fontSize: "11px", color: C.gray, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.desc}</div>
            <div style={{ marginTop: "16px", fontSize: "10px", color: "#333", letterSpacing: "0.2em" }}>PRICE TBD</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "48px", padding: "20px 24px", border: `1px solid ${C.border}`, background: "#050505" }}>
        <div style={{ fontSize: "10px", color: C.gray, letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1.8 }}>
          Questions? Hit us at{" "}
          <a href="mailto:CONsupport@guaschlabs.net" style={{ color: C.green, textDecoration: "none" }}>CONsupport@guaschlabs.net</a>
        </div>
      </div>
    </div>
  );
}

export default function CourseOrNothing() {
  const [page, setPage] = useState("home");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [usesLeft, setUsesLeft] = useState(FREE_LIMIT);
  const [sharedTo, setSharedTo] = useState("");

  useEffect(() => { const t = setInterval(() => setTick((v) => !v), 530); return () => clearInterval(t); }, []);
  useEffect(() => { setUsesLeft(getUsesLeft()); }, []);

  const isPaid = () => !!localStorage.getItem(STORAGE_PAID_KEY);
  const incrementUse = () => {
    const reset = localStorage.getItem(STORAGE_RESET_KEY);
    if (!reset) localStorage.setItem(STORAGE_RESET_KEY, String(Date.now()));
    const count = parseInt(localStorage.getItem(STORAGE_COUNT_KEY) || "0", 10);
    const next = count + 1;
    localStorage.setItem(STORAGE_COUNT_KEY, String(next));
    setUsesLeft(Math.max(0, FREE_LIMIT - next));
  };

  const generate = async () => {
    if (!input.trim() || loading) return;
    if (!isPaid()) {
      const count = parseInt(localStorage.getItem(STORAGE_COUNT_KEY) || "0", 10);
      if (count >= FREE_LIMIT) { setShowPaywall(true); return; }
    }
    setLoading(true); setError(null); setResult(null); setSharedTo("");
    try {
      const res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input }) });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      if (!isPaid()) incrementUse();
    } catch (err) { setError("SIGNAL LOST. THE MARKET WAS NOT READY."); }
    finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); } };
  const shareText = result ? `just found out i should sell a course called "${result.courseTitle}" for ${result.price}\n\ncourseornothing.com` : "";
  const copyShare = () => { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const shareToX = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank"); setSharedTo("x"); };
  const shareToInstagram = () => { navigator.clipboard.writeText(shareText); window.open("https://www.instagram.com/", "_blank"); setSharedTo("ig"); setTimeout(() => setSharedTo(""), 3000); };
  const shareToTikTok = () => { navigator.clipboard.writeText(shareText); window.open("https://www.tiktok.com/", "_blank"); setSharedTo("tt"); setTimeout(() => setSharedTo(""), 3000); };
  const submitEmail = async () => {
    if (!emailValue.trim()) return;
    await fetch("https://formspree.io/f/xgoplldq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emailValue, course: result?.courseTitle }) });
    setEmailSent(true); setEmailValue("");
  };

  const paid = isPaid();

  const TopBar = () => (
    <div style={{ borderBottom: `1px solid ${C.border}`, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", animation: "flicker 8s infinite" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", color: C.green, fontSize: "11px", letterSpacing: "0.2em", fontFamily: "'Share Tech Mono', monospace" }}>
        COURSEORNOTHING.COM
      </button>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <button onClick={() => setPage("shop")} style={{ background: "none", border: "none", cursor: "pointer", color: page === "shop" ? C.green : C.gray, fontSize: "11px", letterSpacing: "0.2em", fontFamily: "'Share Tech Mono', monospace", textTransform: "uppercase" }}>
          SHOP
        </button>
        {page === "home" && (
          <span style={{ color: paid ? C.green : C.gray, fontSize: "11px", letterSpacing: "0.1em" }}>
            {paid ? "✓ UNLIMITED" : `${usesLeft} FREE ${usesLeft === 1 ? "USE" : "USES"} LEFT`}
          </span>
        )}
      </div>
    </div>
  );

  const Footer = () => (
    <div style={{ marginTop: "80px", paddingTop: "24px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
        <span>COURSE OR NOTHING™ — ALL SKILLS ARE MONETIZABLE</span>
        <a href="https://www.guaschlabs.net" target="_blank" rel="noopener noreferrer" style={{ color: "#555", textDecoration: "none" }}
          onMouseEnter={e => e.target.style.color = C.green} onMouseLeave={e => e.target.style.color = "#555"}>
          BUILT BY GUASCH LABS
        </a>
      </div>
      <div style={{ display: "flex", gap: "16px" }}>
        <a href="https://instagram.com/courseornothing" target="_blank" rel="noopener noreferrer" style={{ color: "#555", textDecoration: "none" }}
          onMouseEnter={e => e.currentTarget.style.color = C.green} onMouseLeave={e => e.currentTarget.style.color = "#555"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a href="https://x.com/courseornothing" target="_blank" rel="noopener noreferrer" style={{ color: "#555", textDecoration: "none" }}
          onMouseEnter={e => e.currentTarget.style.color = C.green} onMouseLeave={e => e.currentTarget.style.color = "#555"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://www.tiktok.com/@courseornothing" target="_blank" rel="noopener noreferrer" style={{ color: "#555", textDecoration: "none" }}
          onMouseEnter={e => e.currentTarget.style.color = C.green} onMouseLeave={e => e.currentTarget.style.color = "#555"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
        </a>
      </div>
    </div>
  );

  return (
    <>
      <style>{glitchKeyframes}</style>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      <div style={{ minHeight: "100vh", width: "100%", maxWidth: "100%", background: C.black, color: C.white, fontFamily: "'Share Tech Mono', monospace", position: "relative", overflowX: "hidden" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: "rgba(57,255,20,0.08)", animation: "scanline 6s linear infinite", pointerEvents: "none", zIndex: 998 }} />
        <TopBar />

        {page === "shop" ? (
          <>
            <ShopPage />
            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px 80px" }}>
              <Footer />
            </div>
          </>
        ) : (
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px 100px" }}>
            <div style={{ marginBottom: "56px" }}>
              <div style={{ fontSize: "11px", color: C.green, letterSpacing: "0.3em", marginBottom: "20px", textTransform: "uppercase" }}>▶ MONETIZATION INTELLIGENCE SYSTEM v1.0</div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 14vw, 100px)", lineHeight: 0.9, letterSpacing: "0.02em", color: C.white, animation: "glitch1 7s infinite", marginBottom: "24px" }}>
                COURSE<br /><span style={{ color: C.green, WebkitTextStroke: "1px #39ff14" }}>OR</span><br />NOTHING
              </h1>
              <p style={{ color: C.gray, fontSize: "13px", letterSpacing: "0.1em", lineHeight: 1.8, maxWidth: "480px", textTransform: "uppercase" }}>
                Tell us one thing about yourself.<br />We will identify your course.{" "}
                <span style={{ color: C.green }}>There are no wrong answers.</span>
              </p>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <div style={{ border: `1px solid ${loading ? C.green : C.border}`, transition: "border-color 0.2s", animation: loading ? "pulse-green 1s infinite" : "none" }}>
                <div style={{ padding: "8px 16px", borderBottom: `1px solid ${C.border}`, fontSize: "10px", color: C.green, letterSpacing: "0.2em", display: "flex", justifyContent: "space-between" }}>
                  <span>INPUT_TERMINAL</span><span style={{ opacity: tick ? 1 : 0 }}>█</span>
                </div>
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder={`> i make really good scrambled eggs_\n> i parallel parked on my first try_\n> i know every trail in the appalachians_`}
                  rows={4} disabled={loading}
                  style={{ width: "100%", background: "transparent", border: "none", padding: "20px", color: C.white, fontSize: "14px", fontFamily: "'Share Tech Mono', monospace", resize: "none", outline: "none", lineHeight: 1.7, letterSpacing: "0.05em" }} />
              </div>
              <button onClick={generate} disabled={loading || !input.trim()} style={{
                width: "100%", padding: "18px",
                background: loading ? C.black : (input.trim() ? C.green : C.darkGray),
                color: loading ? C.green : (input.trim() ? C.black : C.gray),
                border: `1px solid ${loading ? C.green : (input.trim() ? C.green : C.border)}`,
                borderTop: "none", fontSize: "13px", fontWeight: "700", fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.3em", textTransform: "uppercase", cursor: loading || !input.trim() ? "not-allowed" : "pointer", transition: "all 0.15s",
              }}>
                {loading ? `> PROCESSING${tick ? "..." : "   "}` : "> IDENTIFY MY COURSE"}
              </button>
              {!paid && usesLeft <= 1 && usesLeft > 0 && (
                <div style={{ marginTop: "8px", textAlign: "center", color: "#ff4444", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>⚠ LAST FREE USE</div>
              )}
            </div>

            {error && <div style={{ border: `1px solid #ff0000`, padding: "20px", color: "#ff4444", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", animation: "fadeUp 0.3s ease" }}>✕ {error}</div>}

            {result && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ border: `1px solid ${C.green}`, marginBottom: "1px", padding: "32px", background: C.greenFaint }}>
                  <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>▶ COURSE IDENTIFIED</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 6vw, 48px)", lineHeight: 1.05, color: C.white, letterSpacing: "0.03em", marginBottom: "14px" }}>{result.courseTitle}</div>
                  <div style={{ fontSize: "13px", color: C.green, letterSpacing: "0.1em", marginBottom: "20px", textTransform: "uppercase" }}>{result.tagline}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "52px", color: C.green, letterSpacing: "0.05em", lineHeight: 1 }}>{result.price}</div>
                </div>

                <div style={{ border: `1px solid ${C.border}`, borderTop: "none", marginBottom: "1px", padding: "24px 32px" }}>
                  <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>▶ CURRICULUM</div>
                  {result.modules?.map((mod, i) => (
                    <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "10px", fontSize: "13px", color: C.gray, lineHeight: 1.6, letterSpacing: "0.05em" }}>
                      <span style={{ color: C.green, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                      <span>{mod.replace(/^Module \d+:\s*/i, "")}</span>
                    </div>
                  ))}
                </div>

                {result.bonuses && (
                  <div style={{ border: `1px solid ${C.border}`, borderTop: "none", marginBottom: "1px", padding: "24px 32px", background: "#080808" }}>
                    <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>▶ BONUSES (FREE)</div>
                    {result.bonuses.map((b, i) => (
                      <div key={i} style={{ fontSize: "13px", color: C.gray, marginBottom: "8px", letterSpacing: "0.05em" }}><span style={{ color: C.green }}>+ </span>{b}</div>
                    ))}
                  </div>
                )}

                {result.testimonial && (
                  <div style={{ border: `1px solid ${C.border}`, borderTop: "none", marginBottom: "1px", padding: "24px 32px" }}>
                    <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>▶ STUDENT RESULTS</div>
                    <div style={{ borderLeft: `2px solid ${C.green}`, paddingLeft: "16px", color: C.gray, fontSize: "13px", lineHeight: 1.7, letterSpacing: "0.04em", fontStyle: "italic" }}>"{result.testimonial}"</div>
                  </div>
                )}

                {result.urgency && (
                  <div style={{ border: `1px solid #ff0000`, borderTop: "none", marginBottom: "1px", padding: "14px 32px", background: "#0d0000" }}>
                    <span style={{ color: "#ff4444", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>⚠ {result.urgency}</span>
                  </div>
                )}

                <div style={{ border: `1px solid ${C.border}`, borderTop: "none", marginBottom: "1px", padding: "24px 32px", background: "#080808" }}>
                  <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>▶ SHARE YOUR RESULTS</div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={shareToX} style={{ flex: 1, minWidth: "80px", padding: "12px 8px", background: sharedTo === "x" ? C.white : "transparent", border: `1px solid ${C.border}`, color: sharedTo === "x" ? C.black : C.white, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = C.white} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      POST
                    </button>
                    <button onClick={shareToInstagram} style={{ flex: 1, minWidth: "80px", padding: "12px 8px", background: sharedTo === "ig" ? "#e1306c" : "transparent", border: `1px solid ${C.border}`, color: C.white, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#e1306c"} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      {sharedTo === "ig" ? "COPIED — PASTE IN IG" : "INSTAGRAM"}
                    </button>
                    <button onClick={shareToTikTok} style={{ flex: 1, minWidth: "80px", padding: "12px 8px", background: sharedTo === "tt" ? "#ff0050" : "transparent", border: `1px solid ${C.border}`, color: C.white, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#ff0050"} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
                      {sharedTo === "tt" ? "COPIED — PASTE IN TT" : "TIKTOK"}
                    </button>
                  </div>
                </div>

                <div style={{ border: `1px solid ${C.border}`, borderTop: "none", padding: "24px 32px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button onClick={copyShare} style={{ flex: 1, padding: "14px", background: copied ? C.green : "transparent", border: `1px solid ${copied ? C.green : C.border}`, color: copied ? C.black : C.white, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer", transition: "all 0.15s" }}>
                    {copied ? "✓ COPIED" : "> COPY TO SHARE"}
                  </button>
                  <button onClick={() => { setResult(null); setInput(""); setEmailSent(false); setEmailValue(""); setSharedTo(""); }} style={{ flex: 1, padding: "14px", background: "transparent", border: `1px solid ${C.border}`, color: C.gray, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer" }}>
                    TRY ANOTHER
                  </button>
                </div>

                <div style={{ border: `1px solid ${C.border}`, borderTop: "none", padding: "24px 32px", background: "#050505" }}>
                  <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>▶ WANT TO ACTUALLY MAKE THIS A REALITY?</div>
                  {emailSent ? (
                    <div style={{ color: C.green, fontSize: "12px", letterSpacing: "0.2em" }}>✓ WE'LL BE IN TOUCH.</div>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input type="email" value={emailValue} onChange={e => setEmailValue(e.target.value)} placeholder="YOUR EMAIL" style={{ flex: 1, padding: "12px 16px", background: "transparent", border: `1px solid ${C.border}`, color: C.white, fontSize: "11px", letterSpacing: "0.2em", fontFamily: "'Share Tech Mono', monospace", outline: "none" }} />
                      <button onClick={submitEmail} style={{ padding: "12px 20px", background: C.green, border: "none", color: C.black, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer", fontWeight: "700" }}>SEND</button>
                    </div>
                  )}
                </div>

                <div style={{ border: `1px solid #ff0000`, borderTop: "none", background: "#0d0000" }}>
                  <div style={{ borderBottom: "1px solid #330000", padding: "10px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#ff4444", fontSize: "10px", letterSpacing: "0.3em" }}>▶ NOW AVAILABLE</span>
                    <span style={{ background: "#ff0000", color: C.white, fontSize: "9px", letterSpacing: "0.2em", padding: "3px 8px" }}>ON SALE</span>
                  </div>
                  <div style={{ padding: "28px 32px" }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", color: C.white, letterSpacing: "0.03em", lineHeight: 1.1, marginBottom: "8px" }}>HOW TO SELL YOUR COURSE</div>
                    <div style={{ fontSize: "12px", color: C.gray, letterSpacing: "0.1em", lineHeight: 1.7, marginBottom: "20px", textTransform: "uppercase" }}>
                      You know what to sell. Now learn how to sell it.<br />5 modules. No fluff. Instant download.
                    </div>
                    <div style={{ marginBottom: "24px" }}>
                      {["Finding Your Course Idea", "Validation", "Build It Fast", "Pricing", "Marketing"].map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "6px", fontSize: "11px", color: "#555", letterSpacing: "0.05em" }}>
                          <span style={{ color: "#ff4444", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginBottom: "20px" }}>
                      <div>
                        <div style={{ fontSize: "12px", color: "#444", letterSpacing: "0.1em", textDecoration: "line-through", marginBottom: "2px" }}>$1,999</div>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "52px", color: "#ff4444", letterSpacing: "0.05em", lineHeight: 1 }}>$297</div>
                      </div>
                      <div style={{ paddingBottom: "8px", fontSize: "10px", color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1.6 }}>ONE TIME<br />INSTANT DOWNLOAD</div>
                    </div>
                    <a href={GUMROAD_COURSE} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                      <button onMouseEnter={e => e.currentTarget.style.background = "#cc0000"} onMouseLeave={e => e.currentTarget.style.background = "#ff0000"}
                        style={{ width: "100%", padding: "18px", background: "#ff0000", border: "none", color: C.white, fontSize: "13px", fontWeight: "700", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>
                        ▶ GET THE COURSE — $297
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            )}

            <Footer />
          </div>
        )}
      </div>
      <Analytics />
    </>
  );
}
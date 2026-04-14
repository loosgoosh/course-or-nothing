import { useState, useEffect } from "react";

const API_URL = "https://insurance-commission-tracker-production.up.railway.app/api/course/generate";

const STRIPE_MONTHLY = "https://buy.stripe.com/28E28s9WWcAjh2k32UbZe07";
const STRIPE_LIFETIME = "https://buy.stripe.com/00weVe7OO43NdQ846YbZe06";
const GUMROAD_COURSE = "https://guaschlabs.gumroad.com/l/ijqhs";

const FREE_LIMIT = 3;
const STORAGE_COUNT_KEY = "con_uses";
const STORAGE_PAID_KEY = "con_paid";

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
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: C.white, letterSpacing: "0.03em" }}>$4 / MONTH</div>
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
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: C.white, letterSpacing: "0.03em" }}>$29 ONE TIME</div>
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

export default function CourseOrNothing() {
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

  useEffect(() => { const t = setInterval(() => setTick((v) => !v), 530); return () => clearInterval(t); }, []);
  useEffect(() => {
    const paid = localStorage.getItem(STORAGE_PAID_KEY);
    if (!paid) {
      const count = parseInt(localStorage.getItem(STORAGE_COUNT_KEY) || "0", 10);
      setUsesLeft(Math.max(0, FREE_LIMIT - count));
    } else { setUsesLeft(999); }
  }, []);

  const isPaid = () => !!localStorage.getItem(STORAGE_PAID_KEY);
  const incrementUse = () => {
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
    setLoading(true); setError(null); setResult(null);
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
  const copyShare = () => {
    navigator.clipboard.writeText(`just found out i should sell a course called "${result.courseTitle}" for ${result.price}\n\ncourseornothing.com`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const submitEmail = async () => {
    if (!emailValue.trim()) return;
    await fetch("https://formspree.io/f/xgoplldq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emailValue, course: result?.courseTitle }) });
    setEmailSent(true); setEmailValue("");
  };

  const paid = isPaid();

  return (
    <>
      <style>{glitchKeyframes}</style>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      <div style={{ minHeight: "100vh", width: "100%", maxWidth: "100%", background: C.black, color: C.white, fontFamily: "'Share Tech Mono', monospace", position: "relative", overflowX: "hidden" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: "rgba(57,255,20,0.08)", animation: "scanline 6s linear infinite", pointerEvents: "none", zIndex: 998 }} />
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", animation: "flicker 8s infinite" }}>
          <span style={{ color: C.green, fontSize: "11px", letterSpacing: "0.2em" }}>COURSEORNOTHING.COM</span>
          <span style={{ color: paid ? C.green : C.gray, fontSize: "11px", letterSpacing: "0.1em" }}>
            {paid ? "✓ UNLIMITED ACCESS" : `${usesLeft} FREE ${usesLeft === 1 ? "USE" : "USES"} LEFT`}
          </span>
        </div>

        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px 100px" }}>

          {/* Header */}
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

          {/* Input */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ border: `1px solid ${loading ? C.green : C.border}`, transition: "border-color 0.2s", animation: loading ? "pulse-green 1s infinite" : "none" }}>
              <div style={{ padding: "8px 16px", borderBottom: `1px solid ${C.border}`, fontSize: "10px", color: C.green, letterSpacing: "0.2em", display: "flex", justifyContent: "space-between" }}>
                <span>INPUT_TERMINAL</span><span style={{ opacity: tick ? 1 : 0 }}>█</span>
              </div>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
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

              <div style={{ border: `1px solid ${C.border}`, borderTop: "none", padding: "24px 32px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={copyShare} style={{ flex: 1, padding: "14px", background: copied ? C.green : "transparent", border: `1px solid ${copied ? C.green : C.border}`, color: copied ? C.black : C.white, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer", transition: "all 0.15s" }}>
                  {copied ? "✓ COPIED" : "> COPY TO SHARE"}
                </button>
                <button onClick={() => { setResult(null); setInput(""); setEmailSent(false); setEmailValue(""); }} style={{ flex: 1, padding: "14px", background: "transparent", border: `1px solid ${C.border}`, color: C.gray, fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer" }}>
                  TRY ANOTHER
                </button>
              </div>

              <div style={{ border: `1px solid ${C.border}`, borderTop: "none", padding: "24px 32px", background: "#050505" }}>
                <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>▶ WANT TO ACTUALLY MAKE THIS A REALITY?</div>
                {emailSent ? (
                  <div style={{ color: C.green, fontSize: "12px", letterSpacing: "0.2em" }}>✓ WE'LL BE IN TOUCH.</div>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} placeholder="YOUR EMAIL" style={{ flex: 1, padding: "12px 16px", background: "transparent", border: `1px solid ${C.border}`, color: C.white, fontSize: "11px", letterSpacing: "0.2em", fontFamily: "'Share Tech Mono', monospace", outline: "none" }} />
                    <button onClick={submitEmail} style={{ padding: "12px 20px", background: C.green, border: "none", color: C.black, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", cursor: "pointer", fontWeight: "700" }}>SEND</button>
                  </div>
                )}
              </div>

              {/* ── COURSE UPSELL ── */}
              <div style={{ border: `1px solid #ff0000`, borderTop: "none", background: "#0d0000" }}>
                <div style={{ borderBottom: "1px solid #330000", padding: "10px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#ff4444", fontSize: "10px", letterSpacing: "0.3em" }}>▶ NOW AVAILABLE</span>
                  <span style={{ background: "#ff0000", color: C.white, fontSize: "9px", letterSpacing: "0.2em", padding: "3px 8px" }}>ON SALE</span>
                </div>
                <div style={{ padding: "28px 32px" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", color: C.white, letterSpacing: "0.03em", lineHeight: 1.1, marginBottom: "8px" }}>
                    HOW TO SELL YOUR COURSE
                  </div>
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
                    <div style={{ paddingBottom: "8px", fontSize: "10px", color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1.6 }}>
                      ONE TIME<br />INSTANT DOWNLOAD
                    </div>
                  </div>
                  <a href={GUMROAD_COURSE} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                    <button
                      onMouseEnter={e => e.currentTarget.style.background = "#cc0000"}
                      onMouseLeave={e => e.currentTarget.style.background = "#ff0000"}
                      style={{ width: "100%", padding: "18px", background: "#ff0000", border: "none", color: C.white, fontSize: "13px", fontWeight: "700", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>
                      ▶ GET THE COURSE — $297
                    </button>
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: "80px", paddingTop: "24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#555", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            <span>COURSE OR NOTHING™ — ALL SKILLS ARE MONETIZABLE</span>
            <a href="https://www.guaschlabs.net" target="_blank" rel="noopener noreferrer" style={{ color: "#555", textDecoration: "none", letterSpacing: "0.2em" }}
              onMouseEnter={(e) => e.target.style.color = "#39ff14"}
              onMouseLeave={(e) => e.target.style.color = "#555"}>
              BUILT BY GUASCH LABS
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
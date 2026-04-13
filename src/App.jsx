import { useState, useEffect } from "react";

// ─── CHANGE THIS TO YOUR RAILWAY URL BEFORE DEPLOYING ───
const API_URL = "https://insurance-commission-tracker-production.up.railway.app/api/course/generate";
// ────────────────────────────────────────────────────────

const glitchKeyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap');

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes glitch1 {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(-2px, 1px); }
    94% { transform: translate(2px, -1px); }
    96% { transform: translate(-1px, 2px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes flicker {
    0%, 95%, 100% { opacity: 1; }
    96% { opacity: 0.4; }
    97% { opacity: 1; }
    98% { opacity: 0.2; }
    99% { opacity: 1; }
  }
  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0px #39ff14; }
    50% { box-shadow: 0 0 12px #39ff14; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::selection { background: #39ff14; color: #000; }
`;

const C = {
  black: "#000000",
  white: "#ffffff",
  green: "#39ff14",
  greenDim: "#1a7a00",
  greenFaint: "#0a2a00",
  gray: "#888888",
  darkGray: "#111111",
  border: "#1f1f1f",
};

export default function CourseOrNothing() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  const generate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError("SIGNAL LOST. THE MARKET WAS NOT READY.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  const shareText = result
    ? `just found out i should sell a course called "${result.courseTitle}" for ${result.price}\n\ncourseornothing.com`
    : "";

  const copyShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{glitchKeyframes}</style>
            <div style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        background: C.black,
        color: C.white,
        fontFamily: "'Share Tech Mono', monospace",
        position: "relative",
        overflowX: "hidden",
      }}>


        {/* Scanline effect */}
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: "2px",
          background: "rgba(57,255,20,0.08)",
          animation: "scanline 6s linear infinite",
          pointerEvents: "none",
          zIndex: 999,
        }} />

        {/* Top bar */}
        <div style={{
          borderBottom: `1px solid ${C.border}`,
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          animation: "flicker 8s infinite",
        }}>
          <span style={{ color: C.green, fontSize: "11px", letterSpacing: "0.2em" }}>
            COURSEORNOTHING.COM
          </span>
          <span style={{ color: C.gray, fontSize: "11px" }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
          </span>
        </div>

        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px 100px" }}>

          {/* Header */}
          <div style={{ marginBottom: "56px" }}>
            <div style={{
              fontSize: "11px",
              color: C.green,
              letterSpacing: "0.3em",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}>
              ▶ MONETIZATION INTELLIGENCE SYSTEM v1.0
            </div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(52px, 14vw, 100px)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              color: C.white,
              animation: "glitch1 7s infinite",
              marginBottom: "24px",
            }}>
              COURSE<br />
              <span style={{ color: C.green, WebkitTextStroke: "1px #39ff14" }}>OR</span><br />
              NOTHING
            </h1>
            <p style={{
              color: C.gray,
              fontSize: "13px",
              letterSpacing: "0.1em",
              lineHeight: 1.8,
              maxWidth: "480px",
              textTransform: "uppercase",
            }}>
              Tell us one thing about yourself.<br />
              We will identify your course.{" "}
              <span style={{ color: C.green }}>There are no wrong answers.</span>
            </p>
          </div>

          {/* Input area */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              border: `1px solid ${loading ? C.green : C.border}`,
              borderRadius: "0",
              transition: "border-color 0.2s",
              animation: loading ? "pulse-green 1s infinite" : "none",
            }}>
              <div style={{
                padding: "8px 16px",
                borderBottom: `1px solid ${C.border}`,
                fontSize: "10px",
                color: C.green,
                letterSpacing: "0.2em",
                display: "flex",
                justifyContent: "space-between",
              }}>
                <span>INPUT_TERMINAL</span>
                <span style={{ opacity: tick ? 1 : 0 }}>█</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`> i make really good scrambled eggs_\n> i parallel parked on my first try_\n> i know every trail in the appalachians_`}
                rows={4}
                disabled={loading}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  padding: "20px",
                  color: C.white,
                  fontSize: "14px",
                  fontFamily: "'Share Tech Mono', monospace",
                  resize: "none",
                  outline: "none",
                  lineHeight: 1.7,
                  letterSpacing: "0.05em",
                }}
              />
            </div>

            <button
              onClick={generate}
              disabled={loading || !input.trim()}
              style={{
                width: "100%",
                marginTop: "0",
                padding: "18px",
                background: loading ? C.black : (input.trim() ? C.green : C.darkGray),
                color: loading ? C.green : (input.trim() ? C.black : C.gray),
                border: `1px solid ${loading ? C.green : (input.trim() ? C.green : C.border)}`,
                borderTop: "none",
                fontSize: "13px",
                fontWeight: "700",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {loading ? `> PROCESSING${tick ? "..." : "   "}` : "> IDENTIFY MY COURSE"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              border: `1px solid #ff0000`,
              padding: "20px",
              color: "#ff4444",
              fontSize: "13px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              animation: "fadeUp 0.3s ease",
            }}>
              ✕ {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>

              {/* Course title block */}
              <div style={{
                border: `1px solid ${C.green}`,
                marginBottom: "1px",
                padding: "32px",
                background: C.greenFaint,
              }}>
                <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>
                  ▶ COURSE IDENTIFIED
                </div>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(28px, 6vw, 48px)",
                  lineHeight: 1.05,
                  color: C.white,
                  letterSpacing: "0.03em",
                  marginBottom: "14px",
                }}>
                  {result.courseTitle}
                </div>
                <div style={{
                  fontSize: "13px",
                  color: C.green,
                  letterSpacing: "0.1em",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                }}>
                  {result.tagline}
                </div>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "52px",
                  color: C.green,
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                }}>
                  {result.price}
                </div>
              </div>

              {/* Modules */}
              <div style={{
                border: `1px solid ${C.border}`,
                borderTop: "none",
                marginBottom: "1px",
                padding: "24px 32px",
              }}>
                <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>
                  ▶ CURRICULUM
                </div>
                {result.modules?.map((mod, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: "14px",
                    marginBottom: "10px",
                    fontSize: "13px",
                    color: C.gray,
                    lineHeight: 1.6,
                    letterSpacing: "0.05em",
                  }}>
                    <span style={{ color: C.green, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span>{mod.replace(/^Module \d+:\s*/i, "")}</span>
                  </div>
                ))}
              </div>

              {/* Bonuses */}
              {result.bonuses && (
                <div style={{
                  border: `1px solid ${C.border}`,
                  borderTop: "none",
                  marginBottom: "1px",
                  padding: "24px 32px",
                  background: "#080808",
                }}>
                  <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>
                    ▶ BONUSES (FREE)
                  </div>
                  {result.bonuses.map((b, i) => (
                    <div key={i} style={{
                      fontSize: "13px",
                      color: C.gray,
                      marginBottom: "8px",
                      letterSpacing: "0.05em",
                    }}>
                      <span style={{ color: C.green }}>+ </span>{b}
                    </div>
                  ))}
                </div>
              )}

              {/* Testimonial */}
              {result.testimonial && (
                <div style={{
                  border: `1px solid ${C.border}`,
                  borderTop: "none",
                  marginBottom: "1px",
                  padding: "24px 32px",
                }}>
                  <div style={{ fontSize: "10px", color: C.green, letterSpacing: "0.3em", marginBottom: "16px" }}>
                    ▶ STUDENT RESULTS
                  </div>
                  <div style={{
                    borderLeft: `2px solid ${C.green}`,
                    paddingLeft: "16px",
                    color: C.gray,
                    fontSize: "13px",
                    lineHeight: 1.7,
                    letterSpacing: "0.04em",
                    fontStyle: "italic",
                  }}>
                    "{result.testimonial}"
                  </div>
                </div>
              )}

              {/* Urgency */}
              {result.urgency && (
                <div style={{
                  border: `1px solid #ff0000`,
                  borderTop: "none",
                  marginBottom: "1px",
                  padding: "14px 32px",
                  background: "#0d0000",
                }}>
                  <span style={{ color: "#ff4444", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    ⚠ {result.urgency}
                  </span>
                </div>
              )}

              {/* Share + Reset */}
              <div style={{
                border: `1px solid ${C.border}`,
                borderTop: "none",
                padding: "24px 32px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}>
                <button
                  onClick={copyShare}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: copied ? C.green : "transparent",
                    border: `1px solid ${copied ? C.green : C.border}`,
                    color: copied ? C.black : C.white,
                    fontSize: "11px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontFamily: "'Share Tech Mono', monospace",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {copied ? "✓ COPIED" : "> COPY TO SHARE"}
                </button>
                <button
                  onClick={() => { setResult(null); setInput(""); }}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    color: C.gray,
                    fontSize: "11px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontFamily: "'Share Tech Mono', monospace",
                    cursor: "pointer",
                  }}
                >
                   TRY ANOTHER
                </button>
              </div>
            </div>
          )}

        {/* Footer */}
<div style={{
  marginTop: "80px",
  paddingTop: "24px",
  borderTop: `1px solid ${C.border}`,
  display: "flex",
  justifyContent: "space-between",
  fontSize: "10px",
  color: "#333",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
}}>
  <span>COURSE OR NOTHING™</span>
  <a
    href="https://www.guaschlabs.net"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#333", textDecoration: "none", letterSpacing: "0.2em" }}
    onMouseEnter={(e) => e.target.style.color = "#39ff14"}
    onMouseLeave={(e) => e.target.style.color = "#333"}
  >
    BUILT BY GUASCH LABS
  </a>
</div>

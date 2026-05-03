"use client";

import { useState, useEffect, useRef } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────
const MOVES = [
  {
    id: "situation", number: "01", label: "Situation", subtitle: "Where you are today", accent: "#4a9eff",
    listening: ["Data you have but don't fully use", "How revenue is currently generated", "Where your capacity goes"],
    questions: [
      { id: "s1", text: "Describe how your business currently acquires new customers — what does that motion look like?", hint: "This maps your growth engine", placeholder: "e.g. Mostly through my own network, some referrals, occasional outbound but nothing structured..." },
      { id: "s2", text: "Where does most of your revenue come from — existing clients, new logos, or a mix?", hint: "Identifies where you're exposed", placeholder: "e.g. About 80% from 5 existing clients — very dependent on renewals..." },
      { id: "s3", text: "What data does your business capture that you feel you're not fully using?", hint: "This is where AI assets hide", placeholder: "e.g. CRM activity, customer usage data, support tickets, email history..." }
    ]
  },
  {
    id: "problem", number: "02", label: "Problem", subtitle: "What's holding you back", accent: "#f59e0b",
    listening: ["Revenue you know you're leaving behind", "Segments too expensive to serve today", "What you'd do with more capacity"],
    questions: [
      { id: "p1", text: "Where do you feel like you're leaving revenue on the table — things you know you should be doing but just can't get to?", hint: "This is your clearest AI opportunity signal", placeholder: "e.g. Warm leads going cold, customers we never upsell, market segments we can't afford to serve..." },
      { id: "p2", text: null, hint: "Surfaces untapped market potential", placeholder: "Describe the situation..." },
      { id: "p3", text: null, hint: "This becomes your AI brief", placeholder: "Be as specific as you can..." }
    ]
  },
  {
    id: "implication", number: "03", label: "Implication", subtitle: "The real cost of standing still", accent: "#ef4444",
    listening: ["Revenue numbers you can put a figure on", "What inaction is actually costing you", "Competitive risk on the horizon"],
    questions: [
      { id: "i1", text: null, hint: "Putting a number on the opportunity", placeholder: "Give your best estimate..." },
      { id: "i2", text: null, hint: "Making the cost of inaction concrete", placeholder: "Think about what's slipping through..." },
      { id: "i3", text: null, hint: "The urgency behind acting now", placeholder: "What changes if a competitor gets there first..." }
    ]
  },
  {
    id: "value", number: "04", label: "Value", subtitle: "What the future looks like", accent: "#10b981",
    listening: ["Your vision of the outcome", "What success means in your language", "The strategic shift you're after"],
    questions: [
      { id: "v1", text: null, hint: "You describing the outcome you want", placeholder: "Paint the picture of what changes..." },
      { id: "v2", text: null, hint: "The revenue or growth impact in your words", placeholder: "What does success look like in numbers or milestones..." },
      { id: "v3", text: null, hint: "The bigger strategic shift", placeholder: "How does this change your position..." }
    ]
  }
];

const TYPE_COLORS = { "New Revenue": "#4a9eff", "Revenue Recovery": "#10b981", "Market Expansion": "#f59e0b", "Retention & Expansion": "#a78bfa" };
const EFFORT_COLORS = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };
const LOADING_STAGES = ["Reading your answers", "Identifying revenue patterns", "Scoring opportunities", "Building your map"];
const FALLBACK_QUESTIONS = {
  p2: "Are there customer segments you've had to walk away from because they weren't economical to serve?",
  p3: "What would you prioritise if you had three times your current capacity?",
  i1: "If you could unlock that opportunity — what would it mean for revenue over the next 2-3 years?",
  i2: "What do you think you're losing by not being able to act on this right now?",
  i3: "If a competitor solved this before you — what's the risk to your position?",
  v1: "If you could remove that constraint without adding headcount — what would that change for your business?",
  v2: "What would it mean if that untapped resource was actively generating revenue?",
  v3: "How would solving this shift your relationship with customers or your market position?"
};

// ── API CALLS (to our own server routes — key stays server-side) ─────────────
async function fetchDynamicQuestion(questionKey, priorQA, businessContext) {
  const res = await fetch("/api/generate-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionKey, priorQA, businessContext }),
  });
  if (!res.ok) throw new Error(`Question API error ${res.status}`);
  const data = await res.json();
  return data.question;
}

async function fetchResults(answers, resolvedQuestions, name, company, industry, businessDescription, websiteContent) {
  const res = await fetch("/api/generate-results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, resolvedQuestions, name, company, industry, businessDescription, websiteContent }),
  });
  if (!res.ok) throw new Error(`Results API error ${res.status}`);
  return res.json();
}

async function fetchSendEmail(name, company, email, results) {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, company, email, results }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `Email API error ${res.status}`);
  }
  return res.json();
}

// ── UI ATOMS ─────────────────────────────────────────────────────────────────
function BG() {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(74,158,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />
  );
}

function Spinner({ accent, size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${accent}20`, borderTop: `2px solid ${accent}`, animation: "spin 0.9s linear infinite", flexShrink: 0 }} />
  );
}

function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [text]);
  return <span>{displayed}{displayed.length < (text?.length || 0) ? "|" : ""}</span>;
}

function ScoreBar({ value, color, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, color: "#475569", fontFamily: "Helvetica Neue, sans-serif" }}>
        <span>Opportunity strength</span>
        <span style={{ color, fontWeight: 700, fontFamily: "monospace" }}>{value}/100</span>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 4, height: 5, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 4, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Discovery() {
  const [phase, setPhase] = useState("intro");
  const [moveIndex, setMoveIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [questionReady, setQuestionReady] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [resolvedTexts, setResolvedTexts] = useState({});
  const [industry, setIndustry] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [websiteContent, setWebsiteContent] = useState("");
  const [fetchingWebsite, setFetchingWebsite] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [loadingStageIdx, setLoadingStageIdx] = useState(0);
  const [loadingDots, setLoadingDots] = useState(0);
  const textareaRef = useRef(null);

  const currentMove = MOVES[moveIndex];
  const currentQuestion = currentMove?.questions[questionIndex];
  const currentResolved = currentQuestion ? (resolvedTexts[currentQuestion.id] || currentQuestion.text) : null;
  const totalQuestions = MOVES.reduce((s, m) => s + m.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const globalQ = MOVES.slice(0, moveIndex).reduce((s, m) => s + m.questions.length, 0) + questionIndex + 1;
  const allQFlat = MOVES.flatMap(m => m.questions).map(q => ({ ...q, resolvedText: resolvedTexts[q.id] || q.text }));

  // Loading screen animation
  useEffect(() => {
    if (phase !== "loading") return;
    setLoadingStageIdx(0); setLoadingDots(0);
    const dotsT = setInterval(() => setLoadingDots(d => (d + 1) % 4), 400);
    const stageT = setInterval(() => setLoadingStageIdx(i => Math.min(i + 1, LOADING_STAGES.length - 1)), 2200);
    return () => { clearInterval(dotsT); clearInterval(stageT); };
  }, [phase]);

  // Dynamic question generation
  useEffect(() => {
    if (phase !== "discovery" || !currentQuestion) return;
    if (currentQuestion.text !== null) {
      setQuestionReady(false); setShowHint(false);
      setTimeout(() => setQuestionReady(true), 300);
      return;
    }
    if (resolvedTexts[currentQuestion.id]) {
      setQuestionReady(false); setShowHint(false);
      setTimeout(() => setQuestionReady(true), 200);
      return;
    }
    setGeneratingQuestion(true); setQuestionReady(false); setShowHint(false);
    const priorQA = allQFlat.filter(q => answers[q.id]).map(q => `Q: ${q.resolvedText || q.text}\nA: ${answers[q.id]}`).join("\n\n");
    const businessContext = [
      `Name: ${name || "Unknown"}`,
      `Company: ${company || "Unknown"}`,
      `Industry: ${industry || "Unknown"}`,
      `What they do: ${businessDescription || "Unknown"}`,
      websiteContent ? `Website content (homepage): ${websiteContent.slice(0, 2000)}` : null,
    ].filter(Boolean).join("\n");
    fetchDynamicQuestion(currentQuestion.id, priorQA, businessContext)
      .then(text => {
        setResolvedTexts(prev => ({ ...prev, [currentQuestion.id]: text || FALLBACK_QUESTIONS[currentQuestion.id] }));
        setGeneratingQuestion(false);
        setTimeout(() => setQuestionReady(true), 200);
      })
      .catch(() => {
        setResolvedTexts(prev => ({ ...prev, [currentQuestion.id]: FALLBACK_QUESTIONS[currentQuestion.id] }));
        setGeneratingQuestion(false);
        setTimeout(() => setQuestionReady(true), 200);
      });
  }, [moveIndex, questionIndex, phase]);

  function handleNext() {
    if (!currentAnswer.trim() || generatingQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");
    setTransitioning(true);
    setTimeout(() => {
      setTransitioning(false);
      if (questionIndex < currentMove.questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else if (moveIndex < MOVES.length - 1) {
        setMoveIndex(moveIndex + 1); setQuestionIndex(0);
      } else {
        setPhase("capture");
      }
    }, 400);
  }

  async function handlePrescreen() {
    if (!name.trim() || !industry.trim() || !businessDescription.trim()) return;

    // If website entered, fetch content first — fail gracefully if it errors
    if (website.trim()) {
      setFetchingWebsite(true);
      try {
        const res = await fetch("/api/fetch-website", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: website.trim() }),
        });
        const data = await res.json();
        if (data.content) setWebsiteContent(data.content);
      } catch {
        // Silently continue without website content
      } finally {
        setFetchingWebsite(false);
      }
    }

    setPhase("discovery");
  }

  function handleCapture() {
    if (!email.trim()) return;
    setPhase("loading");
    const flatResolved = MOVES.flatMap(m => m.questions).map(q => ({ ...q, resolvedText: resolvedTexts[q.id] || q.text }));
    fetchResults(answers, flatResolved, name, company, industry, businessDescription, websiteContent)
      .then(r => { setAiResults(r); setPhase("results"); })
      .catch(e => { setAiError(e.message); setPhase("results"); });
  }

  async function handleSendEmail() {
    if (!aiResults || !email || sendingEmail || emailSent) return;
    setSendingEmail(true); setEmailError(null);
    try {
      await fetchSendEmail(name, company, email, aiResults);
      setEmailSent(true);
    } catch (e) {
      setEmailError(e.message || "Could not send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  }

  function reset() {
    setPhase("intro"); setAnswers({}); setMoveIndex(0); setQuestionIndex(0);
    setCurrentAnswer(""); setAiResults(null); setAiError(null);
    setResolvedTexts({}); setGeneratingQuestion(false);
    setName(""); setCompany(""); setEmail("");
    setIndustry(""); setBusinessDescription("");
    setWebsite(""); setWebsiteContent(""); setFetchingWebsite(false);
    setEmailSent(false); setEmailError(null);
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", padding: 24, position: "relative", overflow: "hidden" }}>
      <BG />
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 480, height: 480, background: "radial-gradient(circle, rgba(74,158,255,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ maxWidth: 560, width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <img src="/predicta-logo.svg" alt="Predicta" style={{ height: 48, width: "auto" }} />
        </div>
        <h1 style={{ fontSize: "clamp(34px,5vw,54px)", fontWeight: 400, color: "#f1f5f9", lineHeight: 1.12, marginBottom: 18, letterSpacing: "-0.02em" }}>
          Discover where AI can<br /><span style={{ color: "#4a9eff", fontStyle: "italic" }}>unlock new revenue.</span>
        </h1>
        <p style={{ color: "#f1f5f9", fontSize: 15, lineHeight: 1.75, marginBottom: 28, fontFamily: "Helvetica Neue, sans-serif" }}>
          Most AI conversations are about cutting costs. This one is different.<br /><br />
          Answer 12 questions and get a personalised map of where AI can <em style={{ color: "#4a9eff" }}>generate new revenue</em> — specific to your situation, not a generic playbook.
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {MOVES.map(m => (
            <div key={m.id} style={{ flex: 1, background: "#0a1628", border: `1px solid ${m.accent}20`, borderRadius: 10, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, color: m.accent, fontFamily: "monospace", marginBottom: 6 }}>{m.number}</div>
              <div style={{ fontSize: 10, color: "#f1f5f9", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "Helvetica Neue, sans-serif", lineHeight: 1.3 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, padding: "14px 18px", marginBottom: 28, display: "flex", gap: 12 }}>
          <div style={{ color: "#10b981", fontSize: 16, flexShrink: 0, marginTop: 2 }}>✦</div>
          <div>
            <p style={{ margin: "0 0 4px 0", fontSize: 13, color: "#f1f5f9", fontFamily: "Helvetica Neue, sans-serif", lineHeight: 1.5 }}>Questions adapt in real time based on what you share — nothing is scripted or assumed.</p>
            <p style={{ margin: 0, fontSize: 12, color: "#cbd5e1", fontFamily: "Helvetica Neue, sans-serif" }}>Takes ~15 minutes · Your map is emailed to you at the end</p>
          </div>
        </div>
        <button
          onClick={() => setPhase("prescreen")}
          style={{ width: "100%", padding: "17px 24px", background: "#4a9eff", border: "none", borderRadius: 8, color: "#050d1a", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif" }}
        >
          Discover My Revenue Opportunities →
        </button>
        <p style={{ textAlign: "center", color: "#1e293b", fontSize: 12, marginTop: 14, fontFamily: "Helvetica Neue, sans-serif" }}>Free · No credit card · Results emailed to you</p>
      </div>
    </div>
  );

  // ── PRE-SCREEN ─────────────────────────────────────────────────────────────
  if (phase === "prescreen") return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", padding: 24, position: "relative", overflow: "hidden" }}>
      <BG />
      <div style={{ maxWidth: 520, width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <img src="/predicta-logo.svg" alt="Predicta" style={{ height: 40, width: "auto" }} />
        </div>
        <div style={{ fontSize: 11, color: "#4a9eff", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif", marginBottom: 10 }}>Before we begin</div>
        <h2 style={{ fontSize: "clamp(22px,4vw,34px)", color: "#f1f5f9", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 10 }}>Tell us about your business</h2>
        <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, fontFamily: "Helvetica Neue, sans-serif", marginBottom: 28 }}>
          This helps the AI tailor every question to your specific situation — not a generic playbook.
        </p>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 11, color: "#475569", fontFamily: "Helvetica Neue, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Your name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah Johnson" style={{ width: "100%", background: "#050d1a", border: `1px solid ${name.trim() ? "#4a9eff40" : "#1e293b"}`, borderRadius: 8, padding: "13px 16px", color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "Helvetica Neue, sans-serif", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#475569", fontFamily: "Helvetica Neue, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Business name</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Acme Corp" style={{ width: "100%", background: "#050d1a", border: "1px solid #1e293b", borderRadius: 8, padding: "13px 16px", color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "Helvetica Neue, sans-serif", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#475569", fontFamily: "Helvetica Neue, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Industry *</label>
              <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Professional Services, SaaS, Retail, Consulting, Finance..." style={{ width: "100%", background: "#050d1a", border: `1px solid ${industry.trim() ? "#4a9eff40" : "#1e293b"}`, borderRadius: 8, padding: "13px 16px", color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "Helvetica Neue, sans-serif", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#475569", fontFamily: "Helvetica Neue, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>What does your business do? *</label>
              <textarea value={businessDescription} onChange={e => setBusinessDescription(e.target.value)} placeholder="e.g. We provide HR software to mid-size companies in Australia, helping them manage payroll and compliance. Our main customers are businesses with 50–500 employees..." rows={3} style={{ width: "100%", background: "#050d1a", border: `1px solid ${businessDescription.trim() ? "#4a9eff40" : "#1e293b"}`, borderRadius: 8, padding: "13px 16px", color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "Helvetica Neue, sans-serif", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#475569", fontFamily: "Helvetica Neue, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                Company website <span style={{ color: "#334155", textTransform: "none", letterSpacing: 0 }}>(optional — helps AI personalise your results)</span>
              </label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="e.g. predicta.au or https://predicta.au" style={{ width: "100%", background: "#050d1a", border: `1px solid ${website.trim() ? "#4a9eff40" : "#1e293b"}`, borderRadius: 8, padding: "13px 16px", color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "Helvetica Neue, sans-serif", boxSizing: "border-box" }} />
              {website.trim() && <p style={{ margin: "6px 0 0", fontSize: 11, color: "#334155", fontFamily: "Helvetica Neue, sans-serif" }}>✦ We'll read your homepage to tailor every question to your business</p>}
            </div>
          </div>
          <button onClick={handlePrescreen} disabled={!name.trim() || !industry.trim() || !businessDescription.trim() || fetchingWebsite} style={{ width: "100%", padding: "15px 24px", background: name.trim() && industry.trim() && businessDescription.trim() && !fetchingWebsite ? "#4a9eff" : "#0f1f35", border: `1px solid ${name.trim() && industry.trim() && businessDescription.trim() && !fetchingWebsite ? "#4a9eff" : "#1e293b"}`, borderRadius: 8, color: name.trim() && industry.trim() && businessDescription.trim() && !fetchingWebsite ? "#050d1a" : "#334155", fontSize: 14, fontWeight: 700, cursor: name.trim() && industry.trim() && businessDescription.trim() && !fetchingWebsite ? "pointer" : "default", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {fetchingWebsite ? <><Spinner accent="#334155" size={16} /> Reading your website…</> : "Start My Discovery →"}
          </button>
          <p style={{ textAlign: "center", color: "#1e293b", fontSize: 11, marginTop: 12, fontFamily: "Helvetica Neue, sans-serif" }}>Fields marked * are required</p>
        </div>
        <div style={{ marginTop: 20, background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ color: "#334155", fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</div>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b", fontFamily: "Helvetica Neue, sans-serif", lineHeight: 1.6 }}>
              <span style={{ color: "#94a3b8", fontWeight: 600 }}>Your data is never stored.</span> Answers are processed in memory to generate your results, then discarded. Nothing is saved to a database. We recommend using directional figures rather than exact financials.
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#334155", fontFamily: "Helvetica Neue, sans-serif" }}>
              Processed securely via Vercel · Anthropic · Resend — all SOC 2 certified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ── EMAIL CAPTURE ──────────────────────────────────────────────────────────
  if (phase === "capture") return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", padding: 24, position: "relative", overflow: "hidden" }}>
      <BG />
      <div style={{ maxWidth: 480, width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#10b98115", border: "1px solid #10b98140", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>✓</div>
          <div style={{ fontSize: 11, color: "#10b981", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif", marginBottom: 10 }}>Discovery Complete</div>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", color: "#f1f5f9", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12 }}>Your map is ready to generate</h2>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, fontFamily: "Helvetica Neue, sans-serif", maxWidth: 380, margin: "0 auto" }}>
            Enter your details below. Claude will analyse your answers and build a personalised AI revenue opportunity map — emailed directly to you.
          </p>
        </div>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 28 }}>
          {name && <p style={{ color: "#475569", fontSize: 13, fontFamily: "Helvetica Neue, sans-serif", marginBottom: 16 }}>Generating map for <span style={{ color: "#f1f5f9" }}>{name}{company ? ` · ${company}` : ""}</span></p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address — where should we send your map? *" type="email" style={{ background: "#050d1a", border: `1px solid ${email.trim() ? "#4a9eff40" : "#1e293b"}`, borderRadius: 8, padding: "13px 16px", color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "Helvetica Neue, sans-serif" }} />
          </div>
          <button onClick={handleCapture} disabled={!email.trim()} style={{ width: "100%", padding: "15px 24px", background: email.trim() ? "#4a9eff" : "#0f1f35", border: `1px solid ${email.trim() ? "#4a9eff" : "#1e293b"}`, borderRadius: 8, color: email.trim() ? "#050d1a" : "#334155", fontSize: 14, fontWeight: 700, cursor: email.trim() ? "pointer" : "default", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif" }}>
            Generate My Opportunity Map →
          </button>
          <p style={{ textAlign: "center", color: "#1e293b", fontSize: 11, marginTop: 12, fontFamily: "Helvetica Neue, sans-serif" }}>Your details are used only to personalise and send your report</p>
        </div>
      </div>
    </div>
  );

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <BG />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#4a9eff", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif", marginBottom: 14 }}>Analysing your discovery</div>
        <h2 style={{ fontSize: 28, color: "#f1f5f9", fontWeight: 400, fontFamily: "Georgia, serif", letterSpacing: "-0.02em", marginBottom: 40 }}>Building your opportunity map…</h2>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}><Spinner accent="#4a9eff" size={52} /></div>
        <p style={{ color: "#64748b", fontSize: 14, fontFamily: "Helvetica Neue, sans-serif", marginBottom: 6 }}>{LOADING_STAGES[loadingStageIdx]}{".".repeat(loadingDots)}</p>
        <p style={{ color: "#334155", fontSize: 12, fontFamily: "Helvetica Neue, sans-serif", marginBottom: 28 }}>Claude is reading your specific answers</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {LOADING_STAGES.map((_, i) => <div key={i} style={{ width: i <= loadingStageIdx ? 22 : 6, height: 4, borderRadius: 2, background: i <= loadingStageIdx ? "#4a9eff" : "#1e293b", transition: "all 0.4s" }} />)}
        </div>
      </div>
    </div>
  );

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (phase === "results") {
    const opps = aiResults?.opportunities || [];
    return (
      <div style={{ minHeight: "100vh", background: "#050d1a", fontFamily: "Georgia, serif", padding: "40px 24px", position: "relative" }}>
        <BG />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 28, height: 2, background: "#10b981" }} />
            <span style={{ color: "#10b981", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif" }}>Your AI Revenue Opportunity Map</span>
          </div>
          <h2 style={{ fontSize: "clamp(24px,4vw,42px)", color: "#f1f5f9", fontWeight: 400, marginBottom: 4, letterSpacing: "-0.02em" }}>
            {company ? `${company}'s` : name ? `${name}'s` : "Your"} Opportunity Map
          </h2>
          <p style={{ color: "#475569", fontSize: 13, marginBottom: 28, fontFamily: "Helvetica Neue, sans-serif" }}>
            {name}{name && company && " · "}{company}
            <span style={{ marginLeft: 10, color: "#1e293b" }}>· Personalised by Claude AI</span>
          </p>

          {aiError && <div style={{ background: "#1a0a0a", border: "1px solid #ef444430", borderRadius: 10, padding: 16, marginBottom: 24, color: "#ef4444", fontSize: 13, fontFamily: "Helvetica Neue, sans-serif" }}>⚠ {aiError}</div>}

          {aiResults?.executiveSummary && (
            <div style={{ background: "#0a1628", border: "1px solid #4a9eff20", borderRadius: 12, padding: 24, marginBottom: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #4a9eff, transparent)" }} />
              <div style={{ fontSize: 10, color: "#4a9eff", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "Helvetica Neue, sans-serif" }}>Key Insight</div>
              <p style={{ color: "#cbd5e1", fontSize: 16, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>{aiResults.executiveSummary}</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            {opps.map((opp, i) => {
              const color = TYPE_COLORS[opp.type] || "#4a9eff";
              return (
                <div key={i} style={{ background: "#0a1628", border: `1px solid ${color}25`, borderRadius: 12, padding: 24, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, fontFamily: "Helvetica Neue, sans-serif", background: `${color}15`, color, padding: "2px 9px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{opp.type}</span>
                        {opp.effort && <span style={{ fontSize: 10, fontFamily: "Helvetica Neue, sans-serif", background: `${EFFORT_COLORS[opp.effort]}15`, color: EFFORT_COLORS[opp.effort], padding: "2px 9px", borderRadius: 4 }}>{opp.effort} effort</span>}
                        {opp.timeToRevenue && <span style={{ fontSize: 10, color: "#334155", fontFamily: "Helvetica Neue, sans-serif" }}>· {opp.timeToRevenue}</span>}
                      </div>
                      <h3 style={{ fontSize: 19, color: "#f1f5f9", fontWeight: 400, margin: 0, letterSpacing: "-0.01em" }}>{opp.title}</h3>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 52 }}>
                      <div style={{ fontSize: 30, color, fontFamily: "monospace", lineHeight: 1 }}>{opp.score}</div>
                      <div style={{ fontSize: 9, color: "#334155", letterSpacing: "0.1em", fontFamily: "Helvetica Neue, sans-serif" }}>SIGNAL</div>
                    </div>
                  </div>
                  {opp.headline && <p style={{ color: "#94a3b8", fontSize: 14, fontStyle: "italic", marginBottom: 10, lineHeight: 1.5, fontFamily: "Helvetica Neue, sans-serif" }}>{opp.headline}</p>}
                  <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.65, margin: 0, fontFamily: "Helvetica Neue, sans-serif" }}>{opp.description}</p>
                  {opp.immediacy && (
                    <div style={{ marginTop: 12, padding: "8px 12px", background: `${color}08`, borderLeft: `2px solid ${color}40`, borderRadius: "0 6px 6px 0" }}>
                      <span style={{ fontSize: 11, color, fontFamily: "Helvetica Neue, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Why now · </span>
                      <span style={{ fontSize: 12, color: "#64748b", fontFamily: "Helvetica Neue, sans-serif" }}>{opp.immediacy}</span>
                    </div>
                  )}
                  <ScoreBar value={opp.score} color={color} delay={i * 250 + 300} />
                </div>
              );
            })}
          </div>

          {(aiResults?.biggestRisk || aiResults?.recommendedFirstMove) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginBottom: 20 }}>
              {aiResults.biggestRisk && (
                <div style={{ background: "#0a1628", border: "1px solid #ef444420", borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Helvetica Neue, sans-serif" }}>⚠ Biggest Risk</div>
                  <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, margin: 0, fontFamily: "Helvetica Neue, sans-serif" }}>{aiResults.biggestRisk}</p>
                </div>
              )}
              {aiResults.recommendedFirstMove && (
                <div style={{ background: "#0a1628", border: "1px solid #10b98120", borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 10, color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Helvetica Neue, sans-serif" }}>→ Your First Move (30 days)</div>
                  <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, margin: 0, fontFamily: "Helvetica Neue, sans-serif" }}>{aiResults.recommendedFirstMove}</p>
                </div>
              )}
            </div>
          )}

          {aiResults?.closingThought && (
            <div style={{ background: "#0a1628", border: "1px solid #f59e0b20", borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <p style={{ color: "#cbd5e1", fontSize: 16, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{aiResults.closingThought}"</p>
            </div>
          )}

          {/* Email send */}
          <div style={{ background: "#0a1628", border: "1px solid #4a9eff20", borderRadius: 12, padding: 24, marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: "#4a9eff", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Helvetica Neue, sans-serif" }}>📩 Send This Report to Your Inbox</div>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 16, fontFamily: "Helvetica Neue, sans-serif" }}>Get a formatted copy to share with your team, board, or investors.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" style={{ flex: 1, minWidth: 200, background: "#050d1a", border: "1px solid #1e293b", borderRadius: 8, padding: "11px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "Helvetica Neue, sans-serif" }} />
              <button onClick={handleSendEmail} disabled={sendingEmail || emailSent || !email.trim()} style={{ padding: "11px 22px", background: emailSent ? "#10b981" : email.trim() ? "#4a9eff" : "#0f1f35", border: "none", borderRadius: 8, color: emailSent || email.trim() ? "#050d1a" : "#334155", fontSize: 13, fontWeight: 700, cursor: email.trim() && !emailSent ? "pointer" : "default", fontFamily: "Helvetica Neue, sans-serif", letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                {sendingEmail ? <><Spinner accent="#050d1a" size={14} /> Sending…</> : emailSent ? "✓ Sent!" : "Send Report →"}
              </button>
            </div>
            {emailError && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8, fontFamily: "Helvetica Neue, sans-serif" }}>{emailError}</p>}
            {emailSent && <p style={{ color: "#10b981", fontSize: 12, marginTop: 8, fontFamily: "Helvetica Neue, sans-serif" }}>Check your inbox — your opportunity map is on its way.</p>}
          </div>

          {/* Book CTA */}
          <div style={{ background: "linear-gradient(135deg, #0f1f35, #0a1628)", border: "1px solid #4a9eff25", borderRadius: 12, padding: 28, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: "#4a9eff", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "Helvetica Neue, sans-serif" }}>Ready to go deeper?</div>
            <h3 style={{ fontSize: 22, color: "#f1f5f9", fontWeight: 400, marginBottom: 10, letterSpacing: "-0.01em" }}>AI Revenue Diagnostic Session</h3>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, marginBottom: 22, maxWidth: 460, margin: "0 auto 22px", fontFamily: "Helvetica Neue, sans-serif" }}>
              A focused 90-minute session with Louis to map your top opportunities in detail, build the business case, and identify your first 30-day implementation play.
            </p>
            <a href="https://api.leadconnectorhq.com/widget/booking/JXRkn6UXi7wJN7Uv2kOM" style={{ display: "inline-block", background: "#4a9eff", borderRadius: 8, padding: "14px 32px", color: "#050d1a", fontSize: 14, fontWeight: 700, textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif" }}>
              Book a Session with Louis →
            </a>
          </div>

          <div style={{ textAlign: "center" }}>
            <button onClick={reset} style={{ background: "none", border: "none", color: "#1e293b", cursor: "pointer", fontSize: 13, fontFamily: "Helvetica Neue, sans-serif" }}>← Start a new discovery</button>
          </div>
        </div>
      </div>
    );
  }

  // ── DISCOVERY ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column", fontFamily: "Georgia, serif", position: "relative", overflow: "hidden" }}>
      <BG />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 500, height: 500, background: `radial-gradient(circle, ${currentMove.accent}04 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, height: 2, background: "#0f1f35" }}>
        <div style={{ height: "100%", width: `${(answeredCount / totalQuestions) * 100}%`, background: currentMove.accent, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>

      <div style={{ padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {MOVES.map((m, i) => (
            <div key={m.id} style={{ width: 26, height: 26, borderRadius: "50%", background: i < moveIndex ? `${m.accent}20` : i === moveIndex ? `${m.accent}15` : "transparent", border: `1px solid ${i <= moveIndex ? m.accent : "#1e293b"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: i <= moveIndex ? m.accent : "#334155", fontFamily: "monospace", transition: "all 0.4s" }}>{m.number}</div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {generatingQuestion && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Spinner accent={currentMove.accent} size={14} />
              <span style={{ fontSize: 10, color: "#334155", fontFamily: "Helvetica Neue, sans-serif" }}>Adapting…</span>
            </div>
          )}
          <span style={{ color: "#334155", fontSize: 11, fontFamily: "monospace" }}>{globalQ} / {totalQuestions}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px 40px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 640, width: "100%", opacity: transitioning ? 0 : 1, transform: transitioning ? "translateY(8px)" : "translateY(0)", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 15, fontFamily: "monospace", background: `${currentMove.accent}15`, color: currentMove.accent, padding: "5px 14px", borderRadius: 4, letterSpacing: "0.08em" }}>Question {globalQ} of {totalQuestions}</span>
            <span style={{ fontSize: 15, color: "#cbd5e1", fontFamily: "Helvetica Neue, sans-serif" }}>{currentMove.subtitle}</span>
            {currentQuestion?.text === null && resolvedTexts[currentQuestion?.id] && (
              <span style={{ fontSize: 9, color: "#4a9eff", fontFamily: "Helvetica Neue, sans-serif", background: "#4a9eff10", border: "1px solid #4a9eff20", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.06em" }}>ADAPTED</span>
            )}
          </div>

          <div style={{ marginBottom: 24, minHeight: 90 }}>
            {generatingQuestion ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0" }}>
                <Spinner accent={currentMove.accent} size={26} />
                <span style={{ color: "#334155", fontSize: 15, fontFamily: "Helvetica Neue, sans-serif", fontStyle: "italic" }}>Adapting to what you've shared…</span>
              </div>
            ) : (
              <>
                <p style={{ fontSize: "clamp(17px,2.8vw,25px)", color: "#f1f5f9", lineHeight: 1.45, fontWeight: 400, letterSpacing: "-0.01em", marginBottom: 14 }}>
                  {questionReady && currentResolved && <TypewriterText text={currentResolved} />}
                </p>
                <button onClick={() => setShowHint(!showHint)} style={{ background: "none", border: `1px solid ${showHint ? currentMove.accent + "40" : "#1e293b"}`, borderRadius: 6, padding: "4px 12px", color: showHint ? currentMove.accent : "#334155", fontSize: 11, cursor: "pointer", fontFamily: "Helvetica Neue, sans-serif" }}>
                  {showHint ? "↑ hide hint" : "→ why this question?"}
                </button>
                {showHint && (
                  <div style={{ marginTop: 10, padding: "10px 14px", background: `${currentMove.accent}08`, borderLeft: `2px solid ${currentMove.accent}`, borderRadius: "0 6px 6px 0", color: "#94a3b8", fontSize: 13, fontFamily: "Helvetica Neue, sans-serif", lineHeight: 1.5 }}>
                    {currentQuestion?.hint}
                  </div>
                )}
              </>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder={generatingQuestion ? "" : (currentQuestion?.placeholder || "Type your answer...")}
            disabled={generatingQuestion}
            onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleNext(); }}
            rows={4}
            style={{ width: "100%", background: "#0a1628", border: `1px solid ${currentAnswer.trim() ? currentMove.accent + "40" : "#1e293b"}`, borderRadius: 10, padding: "16px 18px", color: "#f1f5f9", fontSize: 15, lineHeight: 1.6, resize: "vertical", outline: "none", fontFamily: "Helvetica Neue, sans-serif", boxSizing: "border-box", caretColor: currentMove.accent, opacity: generatingQuestion ? 0.4 : 1 }}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
            <span style={{ fontSize: 11, color: "#1e293b", fontFamily: "Helvetica Neue, sans-serif" }}>⌘ + Enter to continue</span>
            <button onClick={handleNext} disabled={!currentAnswer.trim() || generatingQuestion} style={{ padding: "12px 28px", background: currentAnswer.trim() && !generatingQuestion ? currentMove.accent : "#0f1f35", border: `1px solid ${currentAnswer.trim() && !generatingQuestion ? currentMove.accent : "#1e293b"}`, borderRadius: 8, color: currentAnswer.trim() && !generatingQuestion ? "#050d1a" : "#334155", fontSize: 13, fontWeight: 700, cursor: currentAnswer.trim() && !generatingQuestion ? "pointer" : "default", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif" }}>
              {answeredCount === totalQuestions - 1 ? "See My Map →" : "Next →"}
            </button>
          </div>

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #0f1f35" }}>
            <span style={{ fontSize: 10, color: "#1e293b", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Helvetica Neue, sans-serif" }}>This section surfaces</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
              {currentMove.listening.map((l, i) => (
                <span key={i} style={{ fontSize: 11, color: "#334155", fontFamily: "Helvetica Neue, sans-serif", background: "#0a1628", border: "1px solid #0f1f35", borderRadius: 20, padding: "4px 12px" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

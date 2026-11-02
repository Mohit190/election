
import React, { useState, useRef } from "react";
import {
  Home, FileText, Search, LayoutDashboard, MessageCircle,
  Mic, Volume2, Send, Menu, X, CheckCircle, AlertCircle,
  Languages, Phone, ShieldCheck, MicOff
} from "lucide-react";
import "./styles.css";

const API = "https://election-1-63ee.onrender.com/api";

const translations = {
  en: {
    brand: "Kyvex.ai",
    subtitle: "AI Powered Digital Platform",
    home: "Home",
    complaint: "Register Complaint",
    track: "Track Complaint",
    dashboard: "Dashboard",
    hero: "Your Voice Matters.",
    heroText: "A simple and transparent platform to connect citizens with government services.",
    register: "Register a Complaint",
    trackBtn: "Track Your Complaint",
    area: "Your Area",
    category: "Complaint Category",
    title: "Complaint Title",
    description: "Describe Your Complaint",
    submit: "Submit Complaint",
    reference: "Reference Number",
    search: "Search Complaint",
    chatTitle: "Kyvex AI Assistant",
    chatPlaceholder: "Type or speak your message...",
    send: "Send",
    success: "Complaint submitted successfully!",
    total: "Total Complaints",
    received: "Received",
    language: "Language"
  },
  hi: {
    brand: "Kyvex.ai",
    subtitle: "AI आधारित डिजिटल प्लेटफ़ॉर्म",
    home: "होम",
    complaint: "शिकायत दर्ज करें",
    track: "शिकायत ट्रैक करें",
    dashboard: "डैशबोर्ड",
    hero: "आपकी आवाज़ महत्वपूर्ण है।",
    heroText: "नागरिकों और सरकार को जोड़ने का एक सरल और पारदर्शी मंच।",
    register: "शिकायत दर्ज करें",
    trackBtn: "शिकायत ट्रैक करें",
    area: "आपका क्षेत्र",
    category: "शिकायत की श्रेणी",
    title: "शिकायत का शीर्षक",
    description: "अपनी शिकायत बताएं",
    submit: "शिकायत जमा करें",
    reference: "रेफरेंस नंबर",
    search: "शिकायत खोजें",
    chatTitle: "Kyvex AI सहायक",
    chatPlaceholder: "अपना संदेश लिखें या बोलें...",
    send: "भेजें",
    success: "शिकायत सफलतापूर्वक दर्ज हुई!",
    total: "कुल शिकायतें",
    received: "प्राप्त",
    language: "भाषा"
  },
  pa: {
    brand: "Kyvex.ai",
    subtitle: "AI ਅਧਾਰਿਤ ਡਿਜੀਟਲ ਪਲੇਟਫਾਰਮ",
    home: "ਮੁੱਖ ਪੰਨਾ",
    complaint: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    track: "ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ ਕਰੋ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    hero: "ਤੁਹਾਡੀ ਆਵਾਜ਼ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
    heroText: "ਨਾਗਰਿਕਾਂ ਅਤੇ ਸਰਕਾਰ ਨੂੰ ਜੋੜਨ ਲਈ ਇੱਕ ਸੌਖਾ ਮੰਚ।",
    register: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    trackBtn: "ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ ਕਰੋ",
    area: "ਤੁਹਾਡਾ ਇਲਾਕਾ",
    category: "ਸ਼ਿਕਾਇਤ ਦੀ ਕਿਸਮ",
    title: "ਸ਼ਿਕਾਇਤ ਦਾ ਸਿਰਲੇਖ",
    description: "ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਦੱਸੋ",
    submit: "ਸ਼ਿਕਾਇਤ ਜਮ੍ਹਾਂ ਕਰੋ",
    reference: "ਰੈਫਰੈਂਸ ਨੰਬਰ",
    search: "ਸ਼ਿਕਾਇਤ ਲੱਭੋ",
    chatTitle: "Kyvex AI ਸਹਾਇਕ",
    chatPlaceholder: "ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ ਜਾਂ ਬੋਲੋ...",
    send: "ਭੇਜੋ",
    success: "ਸ਼ਿਕਾਇਤ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਈ!",
    total: "ਕੁੱਲ ਸ਼ਿਕਾਇਤਾਂ",
    received: "ਪ੍ਰਾਪਤ",
    language: "ਭਾਸ਼ਾ"
  }
};

function App() {
  const [language, setLanguage] = useState("en");
  const [page, setPage] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [form, setForm] = useState({
    area: "",
    category: "Water Supply",
    title: "",
    description: ""
  });

  const [reference, setReference] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const t = translations[language];

  const navigate = (newPage) => {
    setPage(newPage);
    setMobileMenu(false);
    setNotice("");

    if (newPage === "dashboard") loadDashboard();
  };

  const loadDashboard = async () => {
    try {
      const response = await fetch(API + "/dashboard");
      if (!response.ok) throw new Error("Dashboard unavailable");
      setDashboard(await response.json());
    } catch {
      setNotice("Could not connect to backend. Please start the API server.");
    }
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice("");

    try {
      const response = await fetch(API + "/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not submit complaint");

      setNotice(t.success + " Reference: " + data.reference);
      setReference(data.reference);
      setComplaint(data);
      setForm({
        area: "",
        category: "Water Supply",
        title: "",
        description: ""
      });
      setPage("track");
    } catch (error) {
      setNotice(error.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const trackComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setComplaint(null);
    setNotice("");

    try {
      const response = await fetch(
        API + "/complaints/" + encodeURIComponent(reference.trim())
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Complaint not found");
      setComplaint(data);
    } catch (error) {
      setNotice(error.message || "Unable to track complaint.");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      setNotice("Speech output is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = language === "hi" ? "hi-IN" :
      language === "pa" ? "pa-IN" : "en-IN";

    speech.onstart = () => setSpeaking(true);
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  const stopVoiceBot = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    window.speechSynthesis?.cancel();
    setVoiceActive(false);
    setSpeaking(false);
    setVoiceText("Voice assistant stopped.");
  };

  const toggleChat = () => {
    if (isChatOpen) {
      stopVoiceBot();
      setIsChatOpen(false);
    } else {
      setIsChatOpen(true);
    }
  };

  const sendToBot = async (userMessage) => {
    if (!userMessage.trim()) return;

    setChatMessages(old => [
      ...old,
      { sender: "user", text: userMessage }
    ]);

    setLoading(true);
    setVoiceText("Assistant is thinking...");

    try {
      const response = await fetch(API + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, language })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Assistant request failed");

      const reply = data.reply || data.response || data.message || "Please try again.";

      setChatMessages(old => [
        ...old,
        { sender: "bot", text: reply }
      ]);

      setVoiceText("Assistant: " + reply);
      speakText(reply);
    } catch {
      const reply = "Server se connection nahi ho pa raha. Please try again.";

      setChatMessages(old => [
        ...old,
        { sender: "bot", text: reply }
      ]);

      setVoiceText(reply);
      speakText(reply);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const currentMessage = message.trim();
    setMessage("");
    await sendToBot(currentMessage);
  };

  const startVoiceBot = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setNotice("Voice bot ke liye Chrome browser use karein.");
      return;
    }

    if (voiceActive) {
      stopVoiceBot();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language === "hi" ? "hi-IN" :
      language === "pa" ? "pa-IN" : "en-IN";

    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setVoiceActive(true);
      setVoiceText("Listening... Speak now");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setVoiceText("You: " + transcript);

      const lastResult = event.results[event.results.length - 1];

      if (lastResult.isFinal) {
        recognitionRef.current = null;
        setVoiceActive(false);
        sendToBot(transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      setVoiceActive(false);
      recognitionRef.current = null;
      setVoiceText("Voice error: " + event.error);
    };

    recognition.onend = () => {
      setVoiceActive(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setVoiceActive(false);
      setVoiceText("Microphone could not start. Please try again.");
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setNotice("Voice input ke liye Chrome browser use karein.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language === "hi" ? "hi-IN" :
      language === "pa" ? "pa-IN" : "en-IN";

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;

      setForm(old => ({
        ...old,
        description: old.description
          ? old.description + " " + spokenText
          : spokenText
      }));
    };

    recognition.onerror = () => {
      setNotice("Voice input failed. Please try again.");
    };

    try {
      recognition.start();
    } catch {
      setNotice("Microphone could not start.");
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand" onClick={() => navigate("home")} aria-label="Kyvex.ai home">
          <img className="brand-logo" src="/kyvex-symbol.png" alt="Kyvex logo" />
          <span className="brand-domain">Kyvex.ai</span>
        </div>

        <button className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>

        <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
          <button onClick={() => navigate("home")}><Home size={17} /> {t.home}</button>
          <button onClick={() => navigate("register")}><FileText size={17} /> {t.complaint}</button>
          <button onClick={() => navigate("track")}><Search size={17} /> {t.track}</button>
          <button onClick={() => navigate("dashboard")}><LayoutDashboard size={17} /> {t.dashboard}</button>
        </nav>

        <div className="language-select">
          <Languages size={17} />
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>
        </div>
      </header>

      <main>
        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="hero-tag">KYVEX.AI DIGITAL PLATFORM</span>
                <h1>{t.hero}</h1>
                <p>{t.heroText}</p>

                <div className="hero-buttons">
                  <button className="primary-btn" onClick={() => navigate("register")}>
                    <FileText size={18} /> {t.register}
                  </button>
                  <button className="secondary-btn" onClick={() => navigate("track")}>
                    <Search size={18} /> {t.trackBtn}
                  </button>
                </div>
              </div>

              <div className="hero-art">
                <div className="art-circle">
                  <img className="hero-logo" src="/kyvex-symbol.png" alt="Kyvex symbol" />
                  <h3>Kyvex.ai</h3>
                  <p>AI POWERED DIGITAL PLATFORM</p>
                </div>
              </div>
            </section>

            <section className="features">
              <div className="section-heading">
                <span>OUR SERVICES</span>
                <h2>How Can We Help You?</h2>
              </div>

              <div className="feature-grid">
                <div className="feature-card" onClick={() => navigate("register")}>
                  <div className="feature-icon"><FileText /></div>
                  <h3>Register Complaint</h3>
                  <p>Submit your public grievance quickly and easily.</p>
                </div>

                <div className="feature-card" onClick={() => navigate("track")}>
                  <div className="feature-icon"><Search /></div>
                  <h3>Track Complaint</h3>
                  <p>Check the current status of your submitted complaint.</p>
                </div>

                <div className="feature-card" onClick={() => navigate("dashboard")}>
                  <div className="feature-icon"><LayoutDashboard /></div>
                  <h3>Public Dashboard</h3>
                  <p>View complaint statistics and public information.</p>
                </div>
              </div>
            </section>

            <section className="trust-strip">
              <div><ShieldCheck /><strong>Transparent Process</strong></div>
              <div><Languages /><strong>Multilingual Support</strong></div>
              <div><Phone /><strong>Citizen Friendly</strong></div>
            </section>
          </>
        )}

        {page === "register" && (
          <section className="page-section">
            <div className="section-heading">
              <span>CITIZEN SERVICES</span>
              <h2>{t.complaint}</h2>
              <p>Fill in the details below to submit your grievance.</p>
            </div>

            <form className="form-card" onSubmit={submitComplaint}>
              <label>{t.area}</label>
              <input required minLength={2} maxLength={120}
                placeholder="Enter your village, town or locality"
                value={form.area}
                onChange={e => setForm({ ...form, area: e.target.value })} />

              <label>{t.category}</label>
              <select value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                <option>Water Supply</option>
                <option>Roads and Transport</option>
                <option>Electricity</option>
                <option>Sanitation</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Public Safety</option>
                <option>Other</option>
              </select>

              <label>{t.title}</label>
              <input required minLength={4} maxLength={160}
                placeholder="Enter a short complaint title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />

              <label>{t.description}</label>
              <textarea required minLength={10} maxLength={3000}
                rows={5} placeholder="Explain your issue in detail..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />

              <button type="button" className="voice-btn" onClick={startVoiceInput}>
                <Mic size={17} /> Speak Your Complaint
              </button>

              <button className="primary-btn submit-btn" disabled={loading}>
                {loading ? "Submitting..." : t.submit}
              </button>
            </form>
          </section>
        )}

        {page === "track" && (
          <section className="page-section">
            <div className="section-heading">
              <span>COMPLAINT STATUS</span>
              <h2>{t.track}</h2>
              <p>Enter your reference number to check your complaint.</p>
            </div>

            <form className="track-card" onSubmit={trackComplaint}>
              <label>{t.reference}</label>
              <input required placeholder="Example: DJS-XXXXXXXXXX"
                value={reference}
                onChange={e => setReference(e.target.value)} />
              <button className="primary-btn" disabled={loading}>
                <Search size={17} /> {loading ? "Searching..." : t.search}
              </button>
            </form>

            {complaint && (
              <div className="result-card">
                <div className="result-success">
                  <CheckCircle size={30} /><h3>Complaint Found</h3>
                </div>
                {[
                  ["Reference Number", complaint.reference],
                  ["Title", complaint.title || "Submitted complaint"],
                  ["Area", complaint.area || "Not available"],
                  ["Category", complaint.category || "Not available"],
                  ["Status", complaint.status || "Received"],
                  ["Created At", complaint.created_at
                    ? new Date(complaint.created_at).toLocaleString()
                    : "Not available"]
                ].map(([label, value]) => (
                  <div className="result-row" key={label}>
                    <span>{label}</span><strong>{value}</strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {page === "dashboard" && (
          <section className="page-section dashboard-page">
            <div className="dashboard-topline">
              <div>
                <span className="dashboard-eyebrow">KYVEX.AI / ANALYTICS</span>
                <h1 className="dashboard-title">Public Service <span>Insights</span></h1>
                <p className="dashboard-subtitle">A live overview of citizen complaints and service activity.</p>
              </div>
              <button className="dashboard-refresh" onClick={loadDashboard}>
                <span className="refresh-symbol">↻</span> Refresh data
              </button>
            </div>

            {dashboard ? (
              <>
                <div className="dashboard-livebar">
                  <span className="live-indicator" />
                  <span>Dashboard connected</span>
                  <span className="live-divider">/</span>
                  <span>Data from your backend</span>
                </div>

                <div className="dashboard-kpis">
                  <div className="dashboard-kpi kpi-blue">
                    <div className="kpi-top"><span>Total complaints</span><span className="kpi-icon">▤</span></div>
                    <div className="kpi-number">{dashboard.total ?? 0}</div>
                    <div className="kpi-foot"><span className="kpi-dot blue-dot" /> All submitted complaints</div>
                  </div>
                  <div className="dashboard-kpi kpi-cyan">
                    <div className="kpi-top"><span>Tracked statuses</span><span className="kpi-icon">◉</span></div>
                    <div className="kpi-number">{(dashboard.statuses || []).reduce((sum, item) => sum + Number(item.count || 0), 0)}</div>
                    <div className="kpi-foot"><span className="kpi-dot cyan-dot" /> Complaints represented by status</div>
                  </div>
                  <div className="dashboard-kpi kpi-violet">
                    <div className="kpi-top"><span>Categories</span><span className="kpi-icon">▦</span></div>
                    <div className="kpi-number">{(dashboard.categories || []).length}</div>
                    <div className="kpi-foot"><span className="kpi-dot violet-dot" /> Service areas reported</div>
                  </div>
                  <div className="dashboard-kpi kpi-orange">
                    <div className="kpi-top"><span>Top category</span><span className="kpi-icon">↗</span></div>
                    <div className="kpi-number kpi-category-name">
                      {(dashboard.categories || []).length
                        ? [...dashboard.categories].sort((a, b) => Number(b.count || 0) - Number(a.count || 0))[0].category
                        : "—"}
                    </div>
                    <div className="kpi-foot"><span className="kpi-dot orange-dot" /> Highest reported volume</div>
                  </div>
                </div>

                <div className="dashboard-main-grid">
                  <div className="dashboard-panel category-panel">
                    <div className="panel-heading">
                      <div>
                        <span className="panel-kicker">BREAKDOWN</span>
                        <h2>Complaints by category</h2>
                        <p>Compare the volume reported across service areas.</p>
                      </div>
                      <span className="panel-badge">CATEGORY VIEW</span>
                    </div>
                    {(dashboard.categories || []).length ? (
                      <div className="category-chart">
                        {[...dashboard.categories]
                          .sort((a, b) => Number(b.count || 0) - Number(a.count || 0))
                          .map((item, index) => {
                            const total = Number(dashboard.total || 0);
                            const count = Number(item.count || 0);
                            const percent = total > 0 ? Math.min(100, count / total * 100) : 0;
                            return (
                              <div className="category-chart-row" key={item.category}>
                                <div className="category-row-top">
                                  <span className="category-label"><i className={`category-index category-index-${index % 5}`} />{item.category}</span>
                                  <strong>{count}<small>{`  ${percent.toFixed(0)}%`}</small></strong>
                                </div>
                                <div className="category-track">
                                  <div className={`category-fill category-fill-${index % 5}`} style={{ width: `${percent}%` }} />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="dashboard-empty"><span>▤</span><strong>No category data yet</strong><p>Category statistics will appear when complaints are submitted.</p></div>
                    )}
                  </div>

                  <div className="dashboard-panel status-panel">
                    <div className="panel-heading">
                      <div>
                        <span className="panel-kicker">MONITORING</span>
                        <h2>Complaint status</h2>
                        <p>Current distribution by recorded status.</p>
                      </div>
                    </div>
                    {(dashboard.statuses || []).length ? (
                      <div className="status-list">
                        {[...dashboard.statuses].sort((a, b) => Number(b.count || 0) - Number(a.count || 0)).map((item, index) => {
                          const allStatuses = (dashboard.statuses || []).reduce((sum, row) => sum + Number(row.count || 0), 0);
                          const percent = allStatuses > 0 ? Number(item.count || 0) / allStatuses * 100 : 0;
                          return (
                            <div className="status-item" key={item.status}>
                              <div className="status-item-top">
                                <span><i className={`status-indicator status-indicator-${index % 4}`} />{item.status}</span>
                                <strong>{item.count}</strong>
                              </div>
                              <div className="status-track"><div className={`status-fill status-fill-${index % 4}`} style={{ width: `${percent}%` }} /></div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="dashboard-empty compact-empty"><span>◉</span><strong>No status data yet</strong><p>Status distribution will show here.</p></div>
                    )}
                    <div className="status-panel-note"><span className="note-icon">i</span><span>Counts reflect the latest response returned by your backend API.</span></div>
                  </div>
                </div>

                <div className="dashboard-visual-grid">
                  <div className="dashboard-panel donut-panel">
                    <div className="panel-heading">
                      <div><span className="panel-kicker">STATUS MIX</span><h2>Complaint distribution</h2><p>Share of complaints by current status.</p></div>
                      <span className="panel-badge">LIVE SPLIT</span>
                    </div>
                    {(() => {
                      const rows = [...(dashboard.statuses || [])].sort((a, b) => Number(b.count || 0) - Number(a.count || 0));
                      const total = rows.reduce((sum, row) => sum + Number(row.count || 0), 0);
                      const colors = ['#4b8dff', '#36d6cf', '#a78bfa', '#ffad5e', '#f472b6', '#8bd17c'];
                      let cursor = 0;
                      const segments = rows.map((row, index) => {
                        const start = cursor;
                        cursor += total ? Number(row.count || 0) / total * 100 : 0;
                        return `${colors[index % colors.length]} ${start}% ${cursor}%`;
                      });
                      return rows.length ? (
                        <div className="donut-layout">
                          <div className="donut-chart" style={{ background: `conic-gradient(${segments.join(', ')})` }}>
                            <div className="donut-hole"><strong>{total}</strong><span>COMPLAINTS</span></div>
                          </div>
                          <div className="donut-legend">
                            {rows.map((row, index) => <div className="donut-legend-row" key={row.status}>
                              <span className="legend-name"><i style={{ background: colors[index % colors.length] }} />{row.status}</span>
                              <strong>{total ? Math.round(Number(row.count || 0) / total * 100) : 0}%</strong>
                            </div>)}
                          </div>
                        </div>
                      ) : <div className="dashboard-empty compact-empty"><strong>No status data yet</strong><p>The chart will appear when status data is available.</p></div>;
                    })()}
                  </div>

                  <div className="dashboard-panel ranking-panel">
                    <div className="panel-heading">
                      <div><span className="panel-kicker">PRIORITY RADAR</span><h2>Service area ranking</h2><p>Find categories contributing the most complaints.</p></div>
                      <span className="panel-badge">TOP AREAS</span>
                    </div>
                    <div className="ranking-list">
                      {[...(dashboard.categories || [])].sort((a, b) => Number(b.count || 0) - Number(a.count || 0)).map((item, index) => {
                        const max = Math.max(1, ...((dashboard.categories || []).map(row => Number(row.count || 0))));
                        const count = Number(item.count || 0);
                        const share = Number(dashboard.total || 0) ? Math.round(count / Number(dashboard.total) * 100) : 0;
                        return <div className="ranking-row" key={item.category}>
                          <span className={`ranking-number ranking-number-${index % 5}`}>{String(index + 1).padStart(2, '0')}</span>
                          <div className="ranking-main"><div className="ranking-title"><strong>{item.category}</strong><span>{count} cases · {share}%</span></div><div className="ranking-track"><div className={`ranking-fill ranking-fill-${index % 5}`} style={{ width: `${count / max * 100}%` }} /></div></div>
                        </div>;
                      })}
                      {!(dashboard.categories || []).length && <div className="dashboard-empty compact-empty"><strong>No category data yet</strong></div>}
                    </div>
                  </div>
                </div>

                <div className="dashboard-bottom-strip">
                  <div className="bottom-strip-icon">✦</div>
                  <div><strong>Make decisions with clear data.</strong><p>Use the category and status breakdowns to spot where citizen support may be needed most.</p></div>
                  <div className="bottom-strip-tag">CITIZEN SERVICE ANALYTICS</div>
                </div>
              </>
            ) : (
              <div className="dashboard-connect-card">
                <div className="connect-graphic">▤</div>
                <h2>Your analytics are getting ready</h2>
                <p>Connect the backend API to load complaint totals, category breakdowns and status monitoring.</p>
                <button className="dashboard-refresh" onClick={loadDashboard}>↻ Try again</button>
              </div>
            )}
          </section>
        )}

        {notice && (
          <div className="notice">
            <AlertCircle size={18} />
            <span>{notice}</span>
            <button onClick={() => setNotice("")}><X size={16} /></button>
          </div>
        )}
      </main>

      {/* CHATBOT WINDOW */}
      {isChatOpen && (
        <section className="chat-widget">
          <div className="chat-header">
            <div>
              <MessageCircle size={20} />
              <strong>{t.chatTitle}</strong>
            </div>

            <div className="chat-header-actions">
              <span className="online-dot">● Online</span>

              {/* CLOSE CROSS BUTTON */}
              <button
                type="button"
                className="chat-close"
                onClick={toggleChat}
                aria-label="Close chatbot"
                title="Close chatbot"
              >
                <X size={23} />
              </button>
            </div>
          </div>

          <div className="chat-body">
            {chatMessages.length === 0 && (
              <div className="bot-message">
                Hello! I can help you register a complaint or track its status.
                <button className="speak-btn"
                  onClick={() => speakText("Hello! I can help you register a complaint or track its status.")}>
                  <Volume2 size={15} /> Listen
                </button>
              </div>
            )}

            {chatMessages.map((item, index) => (
              <div key={index}
                className={item.sender === "user" ? "user-message" : "bot-message"}>
                {item.text}
                {item.sender === "bot" && (
                  <button className="speak-btn" onClick={() => speakText(item.text)}>
                    <Volume2 size={15} /> Listen
                  </button>
                )}
              </div>
            ))}
          </div>

          {voiceText && <div className="voice-status">{voiceText}</div>}

          <form className="chat-input" onSubmit={sendMessage}>
            <input value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t.chatPlaceholder} />

            <button type="button"
              className={voiceActive ? "voice-mic active" : "voice-mic"}
              onClick={startVoiceBot}
              title={voiceActive ? "Stop voice assistant" : "Talk to voice assistant"}>
              {voiceActive ? <MicOff size={19} /> : <Mic size={19} />}
            </button>

            <button type="submit" aria-label="Send message" disabled={loading}>
              <Send size={18} />
            </button>
          </form>

          {speaking && (
            <button className="stop-speaking" onClick={stopVoiceBot}>
              Stop speaking
            </button>
          )}
        </section>
      )}

      {/* FLOATING OPEN / CLOSE BUTTON */}
      <button
        type="button"
        className="chatbot-floating-btn"
        onClick={toggleChat}
        aria-label={isChatOpen ? "Close chatbot" : "Open chatbot"}
        title={isChatOpen ? "Close chatbot" : "Open Kyvex AI Assistant"}
      >
        {isChatOpen ? <X size={27} /> : <MessageCircle size={27} />}
      </button>

      <footer className="footer">
        <div className="footer-brand">Kyvex.ai</div>
        <p>Smart Technology. Better Digital Experiences.</p>
        <small>© 2026 Kyvex.ai. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default App;

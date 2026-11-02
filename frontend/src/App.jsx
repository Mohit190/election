
import React, { useState, useRef } from "react";
import {
  Home, FileText, Search, LayoutDashboard, MessageCircle,
  Mic, Volume2, Send, Menu, X, CheckCircle, AlertCircle,
  Languages, Phone, ShieldCheck, MicOff
} from "lucide-react";
import "./styles.css";

const API = "http://127.0.0.1:8000/api";

const translations = {
  en: {
    brand: "Digital Jan Samvad",
    subtitle: "Your Voice, Your Government",
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
    chatTitle: "Jan Samvad Voice Assistant",
    chatPlaceholder: "Type or speak your message...",
    send: "Send",
    success: "Complaint submitted successfully!",
    total: "Total Complaints",
    received: "Received",
    language: "Language"
  },
  hi: {
    brand: "डिजिटल जन संवाद",
    subtitle: "आपकी आवाज़, आपकी सरकार",
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
    chatTitle: "जन संवाद वॉइस सहायक",
    chatPlaceholder: "अपना संदेश लिखें या बोलें...",
    send: "भेजें",
    success: "शिकायत सफलतापूर्वक दर्ज हुई!",
    total: "कुल शिकायतें",
    received: "प्राप्त",
    language: "भाषा"
  },
  pa: {
    brand: "ਡਿਜੀਟਲ ਜਨ ਸੰਵਾਦ",
    subtitle: "ਤੁਹਾਡੀ ਆਵਾਜ਼, ਤੁਹਾਡੀ ਸਰਕਾਰ",
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
    chatTitle: "ਜਨ ਸੰਵਾਦ ਵੌਇਸ ਸਹਾਇਕ",
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
        <div className="brand" onClick={() => navigate("home")}>
          <div className="brand-icon"><ShieldCheck size={26} /></div>
          <div>
            <h2>{t.brand}</h2>
            <small>{t.subtitle}</small>
          </div>
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
                <span className="hero-tag">🇮🇳 Digital India Initiative</span>
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
                  <div className="art-icon">🏛️</div>
                  <h3>जन संवाद</h3>
                  <p>People First Governance</p>
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
          <section className="page-section">
            <div className="section-heading">
              <span>PUBLIC INFORMATION</span>
              <h2>{t.dashboard}</h2>
              <p>Complaint statistics from the backend database.</p>
            </div>

            <button className="secondary-btn refresh-btn" onClick={loadDashboard}>
              Refresh Dashboard
            </button>

            {dashboard ? (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span>Total Complaints</span>
                    <h2>{dashboard.total}</h2>
                  </div>
                  <div className="stat-card">
                    <span>{t.received}</span>
                    <h2>{(dashboard.statuses || []).reduce((sum, item) => sum + item.count, 0)}</h2>
                  </div>
                  <div className="stat-card">
                    <span>Categories</span>
                    <h2>{(dashboard.categories || []).length}</h2>
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3>Complaints by Category</h3>
                  {(dashboard.categories || []).length ? (
                    dashboard.categories.map(item => (
                      <div className="bar-row" key={item.category}>
                        <span>{item.category}</span>
                        <div className="bar-track">
                          <div className="bar-fill"
                            style={{
                              width: dashboard.total > 0
                                ? (item.count / dashboard.total * 100) + "%"
                                : "0%"
                            }} />
                        </div>
                        <strong>{item.count}</strong>
                      </div>
                    ))
                  ) : <p>No complaints have been submitted yet.</p>}
                </div>

                <div className="dashboard-card">
                  <h3>Complaint Status</h3>
                  {(dashboard.statuses || []).map(item => (
                    <div className="result-row" key={item.status}>
                      <span>{item.status}</span><strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="empty-message">
                Dashboard data will appear here when the backend is connected.
              </p>
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
        title={isChatOpen ? "Close chatbot" : "Open Jan Samvad Assistant"}
      >
        {isChatOpen ? <X size={27} /> : <MessageCircle size={27} />}
      </button>

      <footer className="footer">
        <div className="footer-brand">{t.brand}</div>
        <p>Connecting Citizens with Government Services</p>
        <small>© 2026 Digital Jan Samvad. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default App;

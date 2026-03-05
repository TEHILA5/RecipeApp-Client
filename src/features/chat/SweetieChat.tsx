import axiosInstance from "../../api/axiosConfig";
import { useState, useRef, useEffect } from "react";
import sweety from '../../assets/images/sweety.png';
import sweetyTip from '../../assets/images/sweety-tip.png';

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "🎂 Chocolate cake recipe",
  "🍪 Gluten-free cookies",
  "🧁 Perfect whipped cream tips",
  "🥚 Why did my cake sink?",
  "🍰 Vegan butter substitute",
  "⚖️ Convert cups to grams",
  "⏱️ Quick dessert under 30 min",
  "🧊 How to store cheesecake",
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "14px 18px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "#d4547a",
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function SweetieChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length > 0 || loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: userText };
    const newMessages: Message[] = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/chat", { messages: newMessages });
      const assistantText: string = data.reply || "Something went wrong 🍰";
      setMessages([...newMessages, { role: "assistant", content: assistantText }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again 🍰" }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .sweetie-msg { animation: fadeUp 0.3s ease both; }
        .send-btn:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 6px 20px rgba(212,84,122,0.45) !important; }
        .send-btn:active:not(:disabled) { transform: scale(0.96); }
        .suggestion-chip { transition: all 0.18s ease !important; }
        .suggestion-chip:hover { background: #fce7f3 !important; border-color: #d4547a !important; transform: translateY(-2px); color: #b03060 !important; }
        .chat-input:focus { outline: none; border-color: #d4547a !important; box-shadow: 0 0 0 3px rgba(212,84,122,0.12) !important; }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-thumb { background: #fce7f3; border-radius: 4px; }
      `}</style>

      <div style={{
        fontFamily: "'Nunito', sans-serif",
        maxWidth: 700, margin: "0 auto",
        height: "calc(100vh - var(--nav-height, 70px))",
        marginTop: "var(--nav-height, 70px)", display: "flex",
        flexDirection: "column", background: "#fdf2f8",
      }}>

        {/* ✅ Header - fixed */}
        <div style={{
          background: "linear-gradient(135deg, #e8799a, #d4547a)",
          padding: "16px 24px", display: "flex",
          alignItems: "center", gap: 14,
          boxShadow: "0 4px 20px rgba(212,84,122,0.25)", flexShrink: 0,
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, border: "2px solid rgba(255,255,255,0.35)",
            overflow: "hidden",
          }}>
            <img src={sweety} alt="Sweety" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "white", lineHeight: 1 }}>
              Sweetie
            </div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", fontWeight: 600, letterSpacing: "0.05em" }}>
              Dessert Recipe Assistant
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#86efac", boxShadow: "0 0 6px #86efac" }} />
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area" style={{
          flex: 1, overflowY: "auto", padding: "20px 16px",
          display: "flex", flexDirection: "column", gap: 12,
        }}>

          {/* ✅ Welcome screen - fixed */}
          {messages.length === 0 && (
            <div className="sweetie-msg" style={{ textAlign: "center", marginTop: "30px", padding: "16px 0 8px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <img style={{ width: 150 }} src={sweetyTip} alt="Sweety" />
              </div>
              <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.9rem", color: "#d4547a", marginBottom: 8 }}>
                Hi, I'm Sweetie!
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: 1.65, maxWidth: 420, margin: "0 auto 20px" }}>
                Your personal dessert assistant. Ask me for recipes, baking tips,
                ingredient swaps, quantity conversions, and more! 🎂
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="suggestion-chip"
                    onClick={() => sendMessage(s.replace(/^[^\s]+\s/, ""))}
                    style={{
                      padding: "8px 16px", borderRadius: 999,
                      border: "2px solid #fce7f3", background: "white", color: "#d4547a",
                      fontFamily: "'Nunito', sans-serif", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages list */}
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i} className="sweetie-msg" style={{
                display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
                gap: 8, alignItems: "flex-end",
              }}>
                {!isUser && (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "linear-gradient(135deg, #e8799a, #d4547a)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, flexShrink: 0,
                  }}>🍰</div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "11px 16px",
                  borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  background: isUser ? "linear-gradient(135deg, #e8799a, #d4547a)" : "white",
                  color: isUser ? "white" : "#1f2937",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  fontSize: "0.9rem", lineHeight: 1.65, whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
                {isUser && (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", background: "#fce7f3",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, flexShrink: 0,
                  }}>👤</div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <div className="sweetie-msg" style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, #e8799a, #d4547a)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              }}>🍰</div>
              <div style={{ background: "white", borderRadius: "4px 18px 18px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: "12px 16px 16px", background: "white", borderTop: "1px solid #fce7f3", flexShrink: 0 }}>
          {messages.length > 0 && messages.length < 5 && (
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              {SUGGESTIONS.slice(0, 4).map((s) => (
                <button key={s} className="suggestion-chip"
                  onClick={() => sendMessage(s.replace(/^[^\s]+\s/, ""))}
                  style={{
                    padding: "5px 12px", borderRadius: 999, border: "1.5px solid #fce7f3",
                    background: "#fdf2f8", color: "#d4547a",
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                  }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input ref={inputRef} className="chat-input" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask me about desserts..."
              style={{
                flex: 1, padding: "12px 18px", borderRadius: 999, border: "2px solid #fce7f3",
                fontFamily: "'Nunito', sans-serif", fontSize: "0.92rem",
                background: "#fdf2f8", color: "#1f2937", transition: "all 0.2s",
              }}
            />
            <button className="send-btn" onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 46, height: 46, borderRadius: "50%", border: "none",
                background: loading || !input.trim() ? "#fce7f3" : "linear-gradient(135deg, #e8799a, #d4547a)",
                color: loading || !input.trim() ? "#d4547a" : "white",
                fontSize: "1.1rem", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", flexShrink: 0,
                boxShadow: loading || !input.trim() ? "none" : "0 4px 14px rgba(212,84,122,0.35)",
              }}>
              ➤
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

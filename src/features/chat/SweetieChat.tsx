import { useState, useRef, useEffect } from "react";
import { useSendChatMessageMutation } from '../../api/chatApi';
import type { ChatMessage } from '../../api/chatApi';
import sweety from '../../assets/images/sweety.png';
import sweetyTip from '../../assets/images/sweety-tip.png';
import userIcon from '../../assets/icons/profile-avatar.png';
import './SweetieChat.css';

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
    <div className="typing-dots">
      {[0, 1, 2].map((i) => (
        <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

export default function SweetieChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      const container = bottomRef.current?.parentElement;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;
    setInput("");

    const userMsg: ChatMessage = { role: "user", content: userText };
    const updated: ChatMessage[] = [...messages, userMsg];
    setMessages(updated);

    try {
      const result = await sendChatMessage({ messages: updated }).unwrap();
      setMessages([...updated, { role: "assistant", content: result.reply || "Something went wrong" }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Connection error. Please try again" }]);
    } finally {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const sendSuggestion = (s: string) => sendMessage(s.replace(/^[^\s]+\s/, ""));
  const canSend = !isLoading && !!input.trim();

  return (
    <div className="sc-page">
      <div className="sc-header">
        <div className="sc-avatar">
          <img src={sweety} alt="Sweety" className="sc-avatar-img" />
        </div>
        <div>
          <div className="sc-name">Sweetie</div>
          <div className="sc-role">Dessert Recipe Assistant</div>
        </div>
        <div className="sc-status">
          <div className="sc-status-dot" />
          <span className="sc-status-text">Online</span>
        </div>
      </div>

      <div className="sc-messages messages-area">
        {messages.length === 0 && (
          <div className="sc-welcome sweetie-msg">
            <img src={sweetyTip} alt="Sweety" className="sc-welcome-img" />
            <h2 className="sc-welcome-title">Hi, I'm Sweetie!</h2>
            <p className="sc-welcome-desc">
              Your personal dessert assistant. Ask me for recipes, baking tips,
              ingredient swaps, quantity conversions, and more! 🎂
            </p>
            <div className="sc-chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="suggestion-chip" onClick={() => sendSuggestion(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} className={`sc-msg-row sweetie-msg ${isUser ? 'sc-msg-row--user' : ''}`}>
              {!isUser && <div className="sc-bot-icon">
                <img src={sweety} alt="Sweety" className="sc-bot-icon-img" />
              </div>}
              <div className={`sc-bubble ${isUser ? 'sc-bubble--user' : 'sc-bubble--bot'}`}>
                {msg.content}
              </div>
              {isUser && <div className="sc-user-icon">
                <img src={userIcon} alt="User" className="sc-user-icon-img" />
              </div>}
            </div>
          );
        })}

        {isLoading && (
          <div className="sc-msg-row sweetie-msg">
            <div className="sc-bot-icon">
              <img src={sweety} alt="Sweety" className="sc-bot-icon-img" />
            </div>
            <div className="sc-bubble sc-bubble--bot sc-bubble--typing">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="sc-input-area">
        {messages.length > 0 && messages.length < 5 && (
          <div className="sc-chips sc-chips--sm">
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <button key={s} className="suggestion-chip suggestion-chip--sm" onClick={() => sendSuggestion(s)}>{s}</button>
            ))}
          </div>
        )}
        <div className="sc-input-row">
          <input
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask me about desserts..."
          />
          <button
            className={`send-btn ${canSend ? 'send-btn--active' : ''}`}
            onClick={() => sendMessage()}
            disabled={!canSend}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

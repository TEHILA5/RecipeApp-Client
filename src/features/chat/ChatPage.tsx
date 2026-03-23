// ===============================================
// ChatPage.tsx — src/features/chat/ChatPage.tsx
// ===============================================
import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { useChat, conversationKey, type ChatMessage } from './hooks/useChat';

type ChatMode = 'public' | 'private';

function Badge({ count }: { count: number }) {
  return count > 0 ? (
    <span style={{ background: '#ef4444', color: 'white', borderRadius: '999px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 800, minWidth: '18px', textAlign: 'center', display: 'inline-block', marginLeft: '6px' }}>
      {count > 99 ? '99+' : count}
    </span>
  ) : null;
}

export default function ChatPage() {
  const { user } = useAppSelector((s) => s.auth);
  const userName = user?.name ?? 'Anonymous';

  const {
    publicMessages, onlineUsers, connected, error,
    sendPublic, sendPrivate,
    getConversation, markAsRead, getUnread, publicUnread,
  } = useChat(userName);

  const [mode, setMode]               = useState<ChatMode>('public');
  const [input, setInput]             = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const activeMessages: ChatMessage[] =
    mode === 'public'
      ? publicMessages
      : getConversation(selectedUser);

  // Auto-scroll
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeMessages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [activeMessages]);

  // ✅ מסמן כנקרא כשנכנסים לשיחה
  useEffect(() => {
    if (mode === 'public') {
      markAsRead('public');
    } else if (selectedUser) {
      markAsRead(conversationKey(userName, selectedUser));
    }
  }, [mode, selectedUser, markAsRead, userName]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (mode === 'public') {
      await sendPublic(input);
    } else {
      if (!selectedUser) return;
      await sendPrivate(selectedUser, input);
    }
    setInput('');
  };

  const handleSelectUser = (u: string) => {
    setSelectedUser(u);
    setMode('private');
    markAsRead(conversationKey(userName, u));
  };


  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #d4547a, #e8799a)', padding: '28px 24px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2rem', margin: 0 }}>Sweet Chat 🍰</h1>
            <p style={{ opacity: 0.85, margin: '4px 0 0', fontSize: '0.88rem' }}>Chat with bakers, share tips, ask questions!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '999px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: connected ? '#4ade80' : '#f87171', flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              {connected ? `${onlineUsers.length + 1} online` : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: '24px', display: 'flex', gap: '20px', boxSizing: 'border-box' }}>

        {/* ── Sidebar ── */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Mode switcher */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '12px', boxShadow: '0 2px 12px rgba(212,84,122,0.08)' }}>
            {/* Public button */}
            <button onClick={() => { setMode('public'); setSelectedUser(''); }}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
                background: mode === 'public' ? 'linear-gradient(135deg, #d4547a, #e8799a)' : '#f9fafb',
                color: mode === 'public' ? 'white' : '#6b7280',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer', marginBottom: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              🌍 Public Chat
              {mode !== 'public' && <Badge count={publicUnread} />}
            </button>

            {/* Private button */}
            <button onClick={() => setMode('private')} disabled={onlineUsers.length === 0}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
                background: mode === 'private' ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : '#f9fafb',
                color: mode === 'private' ? 'white' : '#6b7280',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.85rem',
                cursor: onlineUsers.length === 0 ? 'not-allowed' : 'pointer',
                opacity: onlineUsers.length === 0 ? 0.5 : 1 }}>
              🔒 Private Chat
            </button>
          </div>

          {/* Online users */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(212,84,122,0.08)' }}>
            <h3 style={{ fontWeight: 800, fontSize: '0.88rem', color: '#374151', marginBottom: '12px' }}>
              🟢 Online ({onlineUsers.length + 1})
            </h3>

            {/* Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px', marginBottom: '4px', background: '#fdf2f8' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d4547a' }}>{userName} (you)</span>
            </div>

            {/* Others */}
            {onlineUsers.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '8px' }}>No other users online</p>
            ) : (
              onlineUsers.map((u) => {
                const unread = getUnread(u);
                const isSelected = selectedUser === u && mode === 'private';
                return (
                  <button key={u} onClick={() => handleSelectUser(u)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '10px', border: 'none',
                      background: isSelected ? '#fce7f3' : 'transparent',
                      cursor: 'pointer', marginBottom: '2px', transition: 'background 0.15s', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{u}</span>
                    </div>
                    {/* ✅ Badge הודעות שלא נקראו */}
                    {unread > 0 && (
                      <span style={{ background: '#ef4444', color: 'white', borderRadius: '999px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                        {unread > 99 ? '99+' : unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Main Chat ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Chat header */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', boxShadow: '0 2px 12px rgba(212,84,122,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {mode === 'public' ? (
              <>
                <span style={{ fontSize: '1.2rem' }}>🌍</span>
                <span style={{ fontWeight: 800, color: '#374151' }}>Public Chat</span>
                <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>— everyone can see this</span>
                {/* ✅ Badge בצ'אט הכללי */}
                {publicUnread > 0 && (
                  <span style={{ background: '#ef4444', color: 'white', borderRadius: '999px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 800, marginLeft: 'auto' }}>
                    {publicUnread} new
                  </span>
                )}
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
                <span style={{ fontWeight: 800, color: '#7c3aed' }}>
                  {selectedUser ? `Private with ${selectedUser}` : 'Select a user to chat'}
                </span>
                {selectedUser && getUnread(selectedUser) > 0 && (
                  <span style={{ background: '#ef4444', color: 'white', borderRadius: '999px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 800, marginLeft: 'auto' }}>
                    {getUnread(selectedUser)} new
                  </span>
                )}
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '10px 16px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Messages */}
          <div ref={messagesContainerRef} style={{ flex: 1, background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(212,84,122,0.08)', overflowY: 'auto', minHeight: '400px', maxHeight: '480px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeMessages.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
                  {mode === 'public' ? '🍰' : '💬'}
                </div>
                <p style={{ fontWeight: 600, margin: 0 }}>
                  {mode === 'public'
                    ? 'Be the first to say something!'
                    : selectedUser
                      ? `Start a conversation with ${selectedUser}`
                      : 'Select a user from the sidebar'}
                </p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMe = msg.sender === userName;
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isMe ? 'linear-gradient(135deg, #d4547a, #e8799a)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                      {msg.sender.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ maxWidth: '65%' }}>
                      {!isMe && (
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', marginBottom: '3px', paddingLeft: '4px' }}>
                          {msg.sender}
                        </div>
                      )}
                      <div style={{ background: isMe ? 'linear-gradient(135deg, #d4547a, #e8799a)' : '#f9fafb', color: isMe ? 'white' : '#374151', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '10px 14px', fontSize: '0.9rem', lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        {msg.message}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '3px', textAlign: isMe ? 'right' : 'left', paddingLeft: isMe ? 0 : '4px', paddingRight: isMe ? '4px' : 0 }}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 16px', boxShadow: '0 2px 12px rgba(212,84,122,0.08)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            {mode === 'private' && !selectedUser ? (
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>Select a user to start a private chat</p>
            ) : (
              <>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={mode === 'public' ? 'Say something sweet... 🍰' : `Message ${selectedUser}...`}
                  disabled={!connected}
                  style={{ flex: 1, padding: '10px 14px', border: '2px solid #fce7f3', borderRadius: '12px', fontFamily: "'Nunito',sans-serif", fontSize: '0.92rem', outline: 'none', color: '#374151' }}
                />
                <button onClick={handleSend} disabled={!connected || !input.trim()}
                  style={{ padding: '10px 20px', borderRadius: '12px', border: 'none',
                    background: mode === 'public' ? 'linear-gradient(135deg, #d4547a, #e8799a)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem',
                    cursor: !connected || !input.trim() ? 'not-allowed' : 'pointer',
                    opacity: !connected || !input.trim() ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                  Send 🚀
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

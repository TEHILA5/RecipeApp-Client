import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { useChat, conversationKey, type ChatMessage } from './hooks/useChat';
import './ChatPage.css';

type ChatMode = 'public' | 'private';

function Badge({ count }: { count: number }) {
  return count > 0 ? (
    <span className="chat-badge">
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

  const [mode, setMode] = useState<ChatMode>('public');
  const [input, setInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const activeMessages: ChatMessage[] =
    mode === 'public'
      ? publicMessages
      : getConversation(selectedUser);

  useEffect(() => {
    if (activeMessages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }, [activeMessages]);

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
    <div className="cp-page">

      <div className="cp-header">
        <div className="cp-header-inner">
          <div>
            <h1 className="cp-header-title">
              Sweet Chat
              <img src="/src/assets/icons/chat-bubble.png" alt="" className="cp-icon-lg" />
            </h1>
            <p className="cp-header-sub">Chat with bakers, share tips, ask questions!</p>
          </div>
          <div className="cp-status">
            <div className={`cp-status-dot${connected ? ' cp-status-dot--on' : ' cp-status-dot--off'}`} />
            <span className="cp-status-label">
              {connected ? `${onlineUsers.length + 1} online` : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      <div className="cp-body">

        <div className="cp-sidebar">

          <div className="cp-panel">
            <button
              onClick={() => { setMode('public'); setSelectedUser(''); }}
              className={`cp-mode-btn${mode === 'public' ? ' cp-mode-btn--public-active' : ''}`}
            >
              <img src="/src/assets/icons/content-globe.png" alt="" className="cp-icon-sm" />
              Public Chat
              {mode !== 'public' && <Badge count={publicUnread} />}
            </button>

            <button
              onClick={() => setMode('private')}
              disabled={onlineUsers.length === 0}
              className={`cp-mode-btn${mode === 'private' ? ' cp-mode-btn--private-active' : ''} ${onlineUsers.length === 0 ? 'cp-mode-btn--disabled' : ''}`}
            >
              <img src="/src/assets/icons/page-privacy.png" alt="" className="cp-icon-sm" />
              Private Chat
            </button>
          </div>

          <div className="cp-panel">
            <h3 className="cp-online-title">🟢 Online ({onlineUsers.length + 1})</h3>

            <div className="cp-user-row cp-user-row--me">
              <div className="cp-dot cp-dot--green" />
              <span className="cp-user-me">{userName} (you)</span>
            </div>

            {onlineUsers.length === 0 ? (
              <p className="cp-no-users">No other users online</p>
            ) : (
              onlineUsers.map((u) => {
                const unread = getUnread(u);
                const isSelected = selectedUser === u && mode === 'private';
                return (
                  <button
                    key={u}
                    onClick={() => handleSelectUser(u)}
                    className={`cp-user-btn${isSelected ? ' cp-user-btn--selected' : ''}`}
                  >
                    <div className="cp-user-btn-left">
                      <div className="cp-dot cp-dot--green" />
                      <span className="cp-user-name">{u}</span>
                    </div>
                    {unread > 0 && (
                      <span className="cp-badge-inline">{unread > 99 ? '99+' : unread}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="cp-main">

          <div className="cp-chat-header">
            {mode === 'public' ? (
              <>
                <img src="/src/assets/icons/content-globe.png" alt="" className="cp-icon-sm" />
                <span className="cp-chat-header-name">Public Chat</span>
                <span className="cp-chat-header-hint">— everyone can see this</span>
                {publicUnread > 0 && (
                  <span className="cp-new-badge cp-new-badge--auto">{publicUnread} new</span>
                )}
              </>
            ) : (
              <>
                <img src="/src/assets/icons/page-privacy.png" alt="" className="cp-icon-sm" />
                <span className="cp-chat-header-name cp-chat-header-name--private">
                  {selectedUser ? `Private with ${selectedUser}` : 'Select a user to chat'}
                </span>
                {selectedUser && getUnread(selectedUser) > 0 && (
                  <span className="cp-new-badge cp-new-badge--auto">{getUnread(selectedUser)} new</span>
                )}
              </>
            )}
          </div>

          {error && (
            <div className="cp-error">
              <img src="/src/assets/icons/profile-warning.png" alt="" className="cp-icon-xs" />
              {error}
            </div>
          )}

          <div ref={messagesContainerRef} className="cp-messages">
            {activeMessages.length === 0 ? (
              <div className="cp-empty">
                <div className="cp-empty-icon">
                  {mode === 'public'
                    ? <img src="/src/assets/icons/chat-bubble.png" alt="" className="cp-icon-lg" />
                    : <img src="/src/assets/icons/chat-empty.png" alt="" className="cp-icon-lg" />
                  }
                </div>
                <p className="cp-empty-text">
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
                  <div key={msg.id} className={`cp-msg-row${isMe ? ' cp-msg-row--me' : ''}`}>
                    <div className={`cp-avatar${isMe ? ' cp-avatar--me' : ' cp-avatar--other'}`}>
                      {msg.sender.charAt(0).toUpperCase()}
                    </div>
                    <div className="cp-msg-body">
                      {!isMe && <div className="cp-msg-sender">{msg.sender}</div>}
                      <div className={`cp-bubble${isMe ? ' cp-bubble--me' : ' cp-bubble--other'}`}>
                        {msg.message}
                      </div>
                      <div className={`cp-msg-time${isMe ? ' cp-msg-time--me' : ''}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="cp-input-bar">
            {mode === 'private' && !selectedUser ? (
              <p className="cp-input-hint">Select a user to start a private chat</p>
            ) : (
              <>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={mode === 'public' ? 'Say something sweet...' : `Message ${selectedUser}...`}
                  disabled={!connected}
                  className="cp-input"
                />
                <button
                  onClick={handleSend}
                  disabled={!connected || !input.trim()}
                  className={`cp-send-btn${mode === 'private' ? ' cp-send-btn--private' : ''} ${!connected || !input.trim() ? 'cp-send-btn--disabled' : ''}`}
                >
                  <img src="/src/assets/icons/newsletter-sending.png" alt="" className="cp-icon-md" />
                  Send
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
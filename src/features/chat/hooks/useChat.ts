// ===============================================
// useChat.ts — src/features/chat/hooks/useChat.ts
// ===============================================
import { useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

export interface ChatMessage {
  id: string;
  sender: string;
  recipient?: string;
  message: string;
  timestamp: string;
  isPrivate?: boolean;
}
 
export function conversationKey(a: string, b: string) {
  return [a, b].sort().join('::');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HUB_URL = (import.meta as any).env?.VITE_API_BASE_URL?.replace('/api', '') || 'https://localhost:7244';

export function useChat(currentUserName: string) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [publicMessages, setPublicMessages]   = useState<ChatMessage[]>([]);
  const [privateConversations, setPrivateConversations] = useState<Record<string, ChatMessage[]>>({});
  const [unreadCounts, setUnreadCounts]       = useState<Record<string, number>>({});
  const [onlineUsers, setOnlineUsers]         = useState<string[]>([]);
  const [connected, setConnected]             = useState(false);
  const [error, setError]                     = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${HUB_URL}/hubs/chat`, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // ── Public ──
    connection.on('ReceivePublicMessage', (msg: Omit<ChatMessage, 'id'>) => {
      setPublicMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID() }]);
      if (msg.sender !== currentUserName) {
        setUnreadCounts((prev) => ({ ...prev, public: (prev['public'] ?? 0) + 1 }));
      }
    });

    // ── Private ──
    connection.on('ReceivePrivateMessage', (msg: Omit<ChatMessage, 'id'> & { recipient?: string }) => {
      // קובע מי הצד השני מנקודת מבטי
      const otherUser = msg.sender === currentUserName
        ? (msg.recipient ?? '')
        : msg.sender;

      const key = conversationKey(currentUserName, otherUser);
      setPrivateConversations((prev) => ({
        ...prev,
        [key]: [...(prev[key] ?? []), { ...msg, id: crypto.randomUUID() }],
      }));

      // ספירת הודעות שלא נקראו — רק אם הגיעו אלי
      if (msg.sender !== currentUserName) {
        setUnreadCounts((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
      }
    });

    // ── Online Users ──
    connection.on('UsersUpdated', (users: string[]) => {
      setOnlineUsers(users.filter((u) => u !== currentUserName));
    });

    // ── Errors ──
    connection.on('ReceiveError', (msg: string) => {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    });

    connection.onreconnecting(() => setConnected(false));
    connection.onreconnected(() => setConnected(true));
    connection.onclose(() => setConnected(false));

    connection.start()
      .then(() => setConnected(true))
      .catch(() => setConnected(false));

    connectionRef.current = connection;
    return () => { connection.stop(); };
  }, [currentUserName]);

  const sendPublic = useCallback(async (message: string) => {
    if (!connectionRef.current || !message.trim()) return;
    await connectionRef.current.invoke('SendPublicMessage', message.trim());
  }, []);

  const sendPrivate = useCallback(async (targetUser: string, message: string) => {
    if (!connectionRef.current || !message.trim()) return;
    await connectionRef.current.invoke('SendPrivateMessage', targetUser, message.trim());
  }, []);

  // הודעות שיחה ספציפית
  const getConversation = useCallback((otherUser: string): ChatMessage[] => {
    return privateConversations[conversationKey(currentUserName, otherUser)] ?? [];
  }, [privateConversations, currentUserName]);

  // מסמן שיחה כנקראה
  const markAsRead = useCallback((key: string) => {
    setUnreadCounts((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  // כמה הודעות שלא נקראו משיחה ספציפית
  const getUnread = useCallback((otherUser: string): number => {
    return unreadCounts[conversationKey(currentUserName, otherUser)] ?? 0;
  }, [unreadCounts, currentUserName]);

  return {
    publicMessages,
    onlineUsers,
    connected,
    error,
    sendPublic,
    sendPrivate,
    getConversation,
    markAsRead,
    getUnread,
    publicUnread: unreadCounts['public'] ?? 0,
  };
}

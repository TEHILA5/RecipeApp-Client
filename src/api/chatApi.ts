import { baseApi } from './baseApi';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation<ChatResponse, ChatRequest>({
      query: (body) => ({
        url: '/chat',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendChatMessageMutation } = chatApi;

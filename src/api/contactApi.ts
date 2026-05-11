import { baseApi } from './baseApi';

export interface ContactMessageDto {
  name: string;
  email: string;
  category: string;
  recipeName: string | null;
  message: string;
  urgency: string;
}

export interface NewsletterSubscribeDto {
  email: string;
  name: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<void, ContactMessageDto>({
      query: (body) => ({ url: '/contact/send', method: 'POST', body }),
    }),

    subscribeNewsletter: builder.mutation<void, NewsletterSubscribeDto>({
      query: (body) => ({ url: '/newsletter/subscribe', method: 'POST', body }),
    }),
  }),
});

export const {
  useSendContactMessageMutation,
  useSubscribeNewsletterMutation,
} = contactApi; 

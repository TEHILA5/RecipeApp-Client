import { baseApi } from './baseApi';

export interface ContactFormDto {
  name: string;
  email: string;
  category: string;
  recipeName: string | null;
  message: string;
  urgency: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<void, ContactFormDto>({
      query: (payload) => ({
        url: '/contact/send',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;

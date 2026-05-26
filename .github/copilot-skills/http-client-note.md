# HTTP Client: Fetch API (Not Axios)

**Important clarification for all API-related work.**

## What We Use

- **Abstraction**: RTK Query (Redux Toolkit Query)
- **HTTP Client**: Browser's native **Fetch API** (via `fetchBaseQuery`)
- **NOT axios** — axios is not used in this project

See [src/api/baseApi.ts](../../src/api/baseApi.ts) for the configuration.

## Why Fetch API?

RTK Query's `fetchBaseQuery` provides:
- ✅ Built-in browser Fetch API support
- ✅ Automatic Bearer token injection via `prepareHeaders()`
- ✅ 401 logout handling
- ✅ Smaller bundle size than axios
- ✅ Native promise/async-await support

## When Adding API Endpoints

Use this pattern in [src/api/[domain]Api.ts](../../src/api):

```typescript
import { baseApi } from './baseApi';

export const myApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchData: builder.query<DataDto[], void>({
      query: () => '/endpoint',  // Fetch API handles HTTP automatically
      providesTags: ['Data'],
    }),
  }),
});
```

The HTTP call is made via Fetch API under the hood—no axios needed!

## Common Fetch API Patterns in RTK Query

### Query (GET)
```typescript
builder.query<ResponseDto, void>({
  query: () => '/items',  // GET request
})
```

### Mutation (POST, PUT, DELETE)
```typescript
builder.mutation<ResponseDto, PayloadDto>({
  query: (payload) => ({
    url: '/items',
    method: 'POST',  // Or 'PUT', 'DELETE'
    body: payload,    // Automatically JSON.stringify'd
  }),
})
```

### With Query Parameters
```typescript
builder.query<ResponseDto, { id: number }>({
  query: ({ id }) => `/items/${id}?filter=active`,
})
```

---

**Reference**: See [src/api/baseApi.ts](../../src/api/baseApi.ts) for full configuration including auth injection and logout handling.

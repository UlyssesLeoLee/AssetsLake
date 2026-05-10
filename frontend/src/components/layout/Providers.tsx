'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#22263a',
            color: '#e2e8f0',
            border: '1px solid #2d3147',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#22263a' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#22263a' } },
        }}
      />
    </QueryClientProvider>
  );
}

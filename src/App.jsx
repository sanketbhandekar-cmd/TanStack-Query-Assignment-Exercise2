import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="container">
        <h1>Exercise 2: User Management</h1>
        <p className="hint">
          Manage users using TanStack Query mutations, cache invalidation, and optimistic updates.
        </p>

        <UserForm />
        <UserList />
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

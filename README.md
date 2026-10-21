# Exercise 2: User Management with Mutations, Invalidation, and Optimistic Updates

## Run
```bash
npm install
npm run dev
```

## Objective
Build a React application that displays users and supports creation and deletion using TanStack Query mutations.

## Requirements
1. Create a `useUsers()` custom hook using `useQuery()` with `['users']` as the query key.
2. Create a `useCreateUser()` custom hook using `useMutation()`.
3. Create a form containing Name, Email, and Role.
4. On submit, execute the create-user mutation and show pending/error states.
5. After successful creation, invalidate `['users']` and allow the list to refresh with latest server data.
6. Add Delete User functionality using another `useMutation()`.
7. Implement optimistic deletion:
   - Immediately remove the user from the UI.
   - Cancel relevant in-flight queries.
   - Update cached `['users']` data using `setQueryData()`.
   - Restore previous cached data if the server request fails.
   - Invalidate the users query after the mutation settles.
8. Display pending, success, and error mutation states.

## Verification Steps
1. Verify the user list is retrieved through `useQuery()`.
2. Create a new user and verify the mutation executes.
3. Open React Query DevTools and verify `['users']` becomes stale after successful creation.
4. Verify the newly created user appears after the query is refreshed.
5. Delete an existing user and verify it disappears immediately.
6. Simulate a failed delete request and verify the user is restored automatically.
7. Verify the final cache is synchronized with the server after the mutation settles.
8. Confirm no manual `useEffect()` is used to refetch users after mutations.

## Implemented Changes Based on Requirements

- **Requirement 1 (`useUsers` Hook):**
  - Created custom hook `useUsers()` in `src/hooks/useUsers.js` using `useQuery()` with query key `['users']`.
  - Configured global query defaults in `src/App.jsx` with `staleTime` and `gcTime`.

- **Requirement 2 (`useCreateUser` Hook):**
  - Created custom hook `useCreateUser()` in `src/hooks/useCreateUser.js` using `useMutation()`.
  - Added user persistence logic in `src/api/users.js`.

- **Requirement 3 (User Form):**
  - Created `UserForm` component in `src/components/UserForm.jsx` with input fields for **Name**, **Email**, and **Role** (free-text input allowing any custom role).

- **Requirement 4 (Form Submission & Pending/Error States):**
  - Form submission triggers `createUserMutation.mutate()`.
  - Displays pending feedback (`"Adding user to server..."`) and disables the submit button while the mutation is running.
  - Displays error banner if the mutation fails, and validates required fields.

- **Requirement 5 (Query Invalidation & Server Refresh):**
  - Added `queryClient.invalidateQueries({ queryKey: ['users'] })` inside the `onSuccess` callback of `useCreateUser()`.
  - Invalidates the `['users']` query so the list automatically refetches latest data from the server without manual page refresh.

- **Requirement 6 (Delete User Functionality):**
  - Created custom hook `useDeleteUser()` in `src/hooks/useDeleteUser.js` using `useMutation()` to delete a user by ID.

- **Requirement 7 (Optimistic Deletion with Rollback):**
  - **Immediate UI Update:** In `onMutate`, immediately removes the user from cache using `queryClient.setQueryData(['users'], ...)`.
  - **Query Cancellation:** Cancels outgoing queries using `await queryClient.cancelQueries({ queryKey: ['users'] })` so background refetches don't overwrite optimistic data.
  - **Snapshot & Rollback:** Takes a snapshot of `previousUsers` in `onMutate` and restores it in `onError` if the server request fails.
  - **Server Synchronization:** In `onSettled`, runs `queryClient.invalidateQueries({ queryKey: ['users'] })` to ensure final cache is synchronized with the server.

- **Requirement 8 (Mutation States):**
  - Displays appropriate pending, success, and error states for both create and delete mutations.
  - Shows clear rollback alerts when simulated deletion fails.

- **Additional Features:**
  - Added a **"Simulate delete failure (test optimistic rollback)"** checkbox to test and demonstrate rollback behavior (Verification Step 6).
  - Added a **"Reset Users"** button to restore default user data and re-sync the cache.
  - Integrated **`<ReactQueryDevtools />`** for inspecting query cache status.
  - Ensured **zero manual `useEffect()`** is used for fetching or refetching server data.


import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUsers } from '../hooks/useUsers';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { setSimulateDeleteError, resetUsers } from '../api/users';

export function UserList() {
  const queryClient = useQueryClient();
  const { data: users, isPending, isFetching, isError, error } = useUsers();
  const deleteMutation = useDeleteUser();
  const [failDelete, setFailDelete] = useState(false);

  const handleToggleFail = (e) => {
    const checked = e.target.checked;
    setFailDelete(checked);
    setSimulateDeleteError(checked);
  };

  const handleReset = () => {
    resetUsers();
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  return (
    <section>
      <div className="controls-bar">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={failDelete}
            onChange={handleToggleFail}
          />
          <span>Simulate delete failure (test optimistic rollback)</span>
        </label>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleReset}
        >
          Reset Users
        </button>
      </div>

      <div className="list-header">
        <h2>Users ({users ? users.length : 0})</h2>
        {isFetching && !isPending && (
          <span className="updating-text">Updating...</span>
        )}
      </div>

      {deleteMutation.isError && (
        <div className="error error-banner" style={{ marginBottom: '12px' }}>
          <strong>Error:</strong> {deleteMutation.error.message} (User has been restored)
        </div>
      )}

      {isPending && <p>Loading users...</p>}

      {isError && (
        <div className="error error-banner">
          Failed to load users: {error.message}
        </div>
      )}

      {!isPending && !isError && users && (
        <div className="list">
          {users.length === 0 ? (
            <p className="hint">No users found. Click "Reset Users" to reload the list.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="user">
                <div>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                  <span className="user-role">{user.role}</span>
                </div>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => deleteMutation.mutate(user.id)}
                  disabled={deleteMutation.isPending && deleteMutation.variables === user.id}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

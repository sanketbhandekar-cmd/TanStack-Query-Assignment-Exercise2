import React, { useState } from 'react';
import { useCreateUser } from '../hooks/useCreateUser';

export function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [validationError, setValidationError] = useState('');

  const createUserMutation = useCreateUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim() || !email.trim() || !role.trim()) {
      setValidationError('Please enter name, email, and role.');
      return;
    }

    createUserMutation.mutate(
      { name, email, role },
      {
        onSuccess: () => {
          setName('');
          setEmail('');
          setRole('');
        },
      }
    );
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h3 style={{ margin: '0 0 4px 0' }}>Add New User</h3>

      <div className="form-row">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={createUserMutation.isPending}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={createUserMutation.isPending}
        />
        <input
          type="text"
          placeholder="Role (e.g. Developer, QA, Lead)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={createUserMutation.isPending}
        />
      </div>

      {validationError && <p className="error">{validationError}</p>}

      {createUserMutation.isPending && (
        <div className="message">Adding user to server...</div>
      )}

      {createUserMutation.isSuccess && (
        <div className="message success">User added successfully!</div>
      )}

      {createUserMutation.isError && (
        <div className="error error-banner">{createUserMutation.error.message}</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          className="btn-primary"
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending ? 'Adding...' : 'Add User'}
        </button>
      </div>
    </form>
  );
}

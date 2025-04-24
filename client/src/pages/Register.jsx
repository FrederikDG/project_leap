// client/src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api.js';

export default function Register() {
  const [user, setUser] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', {
        username: user.username,
        password: user.password,
      });
      // on success, send them to login
      navigate('/login');
    } catch (err) {
      // show any error returned by the server
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-form">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={user.username}
          onChange={e => setUser(u => ({ ...u, username: e.target.value }))}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={user.password}
          onChange={e => setUser(u => ({ ...u, password: e.target.value }))}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

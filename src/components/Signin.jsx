import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../global.css';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle signin logic
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        background: '#fff',
        padding: '3rem',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{ textAlign: 'center' }}>RememberME</h1>
        <h2 style={{ textAlign: 'center' }}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <label><strong>Email:</strong></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label><strong>Password:</strong></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign In</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}

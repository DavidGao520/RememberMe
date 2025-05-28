import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../firebase');
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-sm p-5" style={{ maxWidth: '480px', width: '100%' }}>
        <h1 className="text-center text-primary mb-3">RememberME</h1>
        <h3 className="text-center mb-4">Sign In</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>

        <div className="text-center mt-4">
          <span>Don't have an account? </span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </main>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './index.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Account created!');
      navigate('/signin');
    } catch (error) {
      alert(error.message || 'Registration failed.');
    }
  };

  return (
    <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-sm p-5" style={{ maxWidth: '480px', width: '100%' }}>
        <h1 className="text-center text-primary mb-3">RememberME</h1>
        <h3 className="text-center mb-4">Register</h3>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
          </div>

          <button type="submit" className="btn btn-success w-100">Create Account</button>
        </form>
      </div>
    </main>
  );
}

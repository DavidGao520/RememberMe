import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const user = { email, password };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Account created!");
    navigate('/signin');
  };

  return (
    <main className="container mt-5">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label>Password:</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}

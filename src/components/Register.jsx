import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else {
        setError(error.message || 'Registration failed');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Floating decorations */}
      <motion.div 
        className="floating-decoration decoration-1"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        ✨
      </motion.div>
      <motion.div 
        className="floating-decoration decoration-2"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🎉
      </motion.div>
      <motion.div 
        className="floating-decoration decoration-3"
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        🎊
      </motion.div>

      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="auth-card glass-card">
          <motion.div 
            className="auth-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="logo-icon">🎂</div>
            <h1 className="text-gradient">Join RememberMe</h1>
            <p>Start remembering what matters</p>
          </motion.div>

          <motion.form 
            onSubmit={handleRegister}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="input-group">
              <label className="input-label">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input" 
                placeholder="your@email.com"
                required 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input" 
                placeholder="At least 6 characters"
                required 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="input" 
                placeholder="Confirm your password"
                required 
              />
            </div>

            <motion.button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%' }}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  Create Account
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>
              Already have an account? <Link to="/signin">Sign in</Link>
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="register-benefits"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Why join RememberMe?</h3>
          <ul className="benefits-list">
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="check-icon">✓</span>
              Track unlimited friends' birthdays
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <span className="check-icon">✓</span>
              Get AI-powered gift recommendations
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <span className="check-icon">✓</span>
              Beautiful countdown timers
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <span className="check-icon">✓</span>
              Free forever, no credit card required
            </motion.li>
          </ul>
        </motion.div>
      </motion.div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .floating-decoration {
          position: absolute;
          font-size: 4rem;
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }

        .decoration-1 { top: 10%; left: 10%; }
        .decoration-2 { top: 20%; right: 15%; }
        .decoration-3 { bottom: 15%; left: 20%; }

        .auth-container {
          display: flex;
          gap: 4rem;
          align-items: center;
          max-width: 1000px;
          width: 100%;
          z-index: 1;
        }

        .auth-card {
          flex: 1;
          max-width: 440px;
          padding: 3rem;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 4px 20px rgba(255, 107, 107, 0.3));
        }

        .auth-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .error-message {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: var(--accent-primary);
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--glass-border);
        }

        .auth-footer p {
          color: var(--text-muted);
        }

        .auth-footer a {
          color: var(--accent-primary);
          font-weight: 600;
        }

        .register-benefits {
          flex: 1;
        }

        .register-benefits h3 {
          font-family: var(--font-body);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: var(--text-primary);
        }

        .benefits-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .benefits-list li {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .check-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-warm);
          color: #1a1a1a;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .auth-container {
            flex-direction: column;
            gap: 3rem;
          }

          .register-benefits {
            width: 100%;
            max-width: 440px;
          }

          .floating-decoration {
            font-size: 3rem;
          }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 2rem;
          }

          .auth-header h1 {
            font-size: 1.75rem;
          }

          .floating-decoration {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

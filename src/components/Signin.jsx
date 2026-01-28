import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../firebase');
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
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
        🎂
      </motion.div>
      <motion.div 
        className="floating-decoration decoration-2"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🎁
      </motion.div>
      <motion.div 
        className="floating-decoration decoration-3"
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        🎈
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
            <h1 className="text-gradient">RememberMe</h1>
            <p>Never forget a birthday again</p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit}
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
                placeholder="••••••••"
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
                  Sign In
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
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
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="auth-features"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="feature-item">
            <div className="feature-icon">🗓️</div>
            <div className="feature-text">
              <h4>Track Birthdays</h4>
              <p>Never miss an important date</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎁</div>
            <div className="feature-text">
              <h4>Smart Gift Ideas</h4>
              <p>AI-powered recommendations</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⏰</div>
            <div className="feature-text">
              <h4>Timely Reminders</h4>
              <p>Get notified before it's too late</p>
            </div>
          </div>
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
          font-size: 2.5rem;
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

        .auth-features {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          transition: var(--transition-base);
        }

        .feature-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(10px);
        }

        .feature-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-elevated);
          border-radius: var(--radius-md);
        }

        .feature-text h4 {
          font-family: var(--font-body);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .feature-text p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .auth-container {
            flex-direction: column;
            gap: 3rem;
          }

          .auth-features {
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
            font-size: 2rem;
          }

          .floating-decoration {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

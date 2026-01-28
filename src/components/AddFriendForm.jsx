import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const interestSuggestions = [
  '📚 Reading', '🎮 Gaming', '🎵 Music', '🎨 Art', '🏃 Fitness',
  '🍳 Cooking', '📸 Photography', '✈️ Travel', '🎬 Movies', '💻 Tech',
  '🌿 Plants', '🧘 Yoga', '⚽ Sports', '👗 Fashion', '🎭 Theater'
];

export default function AddFriendForm() {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [interest, setInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const friendData = {
        name,
        birthday: birthdate,
        gender,
        interest,
      };

      await addDoc(collection(db, 'users', user.uid, 'friends'), friendData);

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      alert(err.message || "Failed to save data.");
      setIsLoading(false);
    }
  };

  const handleInterestSuggestion = (suggestion) => {
    const cleanSuggestion = suggestion.split(' ').slice(1).join(' ');
    setInterest(prev => {
      if (prev) return `${prev}, ${cleanSuggestion}`;
      return cleanSuggestion;
    });
  };

  if (showSuccess) {
    return (
      <div className="form-page">
        <motion.div 
          className="success-container glass-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <motion.div 
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            🎉
          </motion.div>
          <h2>Friend Added!</h2>
          <p>{name}'s birthday has been saved</p>
          <motion.div 
            className="success-confetti"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ✨ 🎂 ✨
          </motion.div>
        </motion.div>
        
        <style>{`
          .form-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          
          .success-container {
            text-align: center;
            padding: 3rem;
            max-width: 400px;
          }
          
          .success-icon {
            font-size: 5rem;
            margin-bottom: 1.5rem;
          }
          
          .success-container h2 {
            font-size: 1.75rem;
            margin-bottom: 0.5rem;
          }
          
          .success-container p {
            color: var(--text-muted);
            margin-bottom: 1rem;
          }
          
          .success-confetti {
            font-size: 2rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="form-page">
      <motion.div 
        className="form-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Link */}
        <Link to="/dashboard" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Dashboard
        </Link>

        <div className="form-card glass-card">
          <div className="form-header">
            <div className="form-icon">👤</div>
            <h1>Add a Friend</h1>
            <p>Never forget their special day again</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="input-group">
              <label className="input-label">Friend's Name</label>
              <input 
                className="input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter their name"
                required 
              />
            </div>

            {/* Birthday Input */}
            <div className="input-group">
              <label className="input-label">Birthday</label>
              <input 
                className="input" 
                type="date" 
                value={birthdate} 
                onChange={(e) => setBirthdate(e.target.value)} 
                required 
              />
            </div>

            {/* Gender Select */}
            <div className="input-group">
              <label className="input-label">Gender</label>
              <select 
                className="input select" 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                required
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Interest Input */}
            <div className="input-group">
              <label className="input-label">Interests (for gift ideas)</label>
              <input 
                className="input" 
                value={interest} 
                onChange={(e) => setInterest(e.target.value)} 
                placeholder="e.g., Reading, Gaming, Music"
                required 
              />
              
              <div className="interest-suggestions">
                {interestSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="interest-chip"
                    onClick={() => handleInterestSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  Add Friend
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      <style>{`
        .form-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .form-container {
          width: 100%;
          max-width: 520px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          transition: var(--transition-base);
        }

        .back-link:hover {
          color: var(--text-primary);
        }

        .form-card {
          padding: 2.5rem;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .form-header h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: var(--text-muted);
        }

        .interest-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .interest-chip {
          padding: 0.375rem 0.75rem;
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition-base);
        }

        .interest-chip:hover {
          background: var(--gradient-warm);
          color: #1a1a1a;
          border-color: transparent;
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

        @media (max-width: 600px) {
          .form-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

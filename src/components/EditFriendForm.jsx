import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const interestSuggestions = [
  '📚 Reading', '🎮 Gaming', '🎵 Music', '🎨 Art', '🏃 Fitness',
  '🍳 Cooking', '📸 Photography', '✈️ Travel', '🎬 Movies', '💻 Tech',
  '🌿 Plants', '🧘 Yoga', '⚽ Sports', '👗 Fashion', '🎭 Theater'
];

export default function EditFriendForm() {
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchFriend = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const friendRef = doc(db, "users", uid, "friends", id);
      const friendSnap = await getDoc(friendRef);

      if (friendSnap.exists()) {
        setFriend(friendSnap.data());
        setLoading(false);
      } else {
        alert("Friend not found");
        navigate("/dashboard");
      }
    };

    fetchFriend();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFriend({ ...friend, [e.target.name]: e.target.value });
  };

  const handleInterestSuggestion = (suggestion) => {
    const cleanSuggestion = suggestion.split(' ').slice(1).join(' ');
    setFriend(prev => ({
      ...prev,
      interest: prev.interest ? `${prev.interest}, ${cleanSuggestion}` : cleanSuggestion
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const friendRef = doc(db, "users", uid, "friends", id);
      await updateDoc(friendRef, friend);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      alert("Failed to update friend");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-page">
        <div className="loading-container glass-card">
          <div className="loading-spinner large"></div>
          <p>Loading friend details...</p>
        </div>
        
        <style>{`
          .form-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          
          .loading-container {
            text-align: center;
            padding: 3rem;
          }
          
          .loading-spinner.large {
            width: 48px;
            height: 48px;
            border: 3px solid var(--glass-border);
            border-top-color: var(--accent-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
            ✅
          </motion.div>
          <h2>Updated!</h2>
          <p>{friend.name}'s info has been saved</p>
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
            <div className="form-icon">✏️</div>
            <h1>Edit Friend</h1>
            <p>Update {friend.name}'s information</p>
          </div>

          <form onSubmit={handleUpdate}>
            {/* Name Input */}
            <div className="input-group">
              <label className="input-label">Friend's Name</label>
              <input 
                className="input"
                name="name"
                value={friend.name || ''}
                onChange={handleChange}
                placeholder="Enter their name"
                required
              />
            </div>

            {/* Birthday Input */}
            <div className="input-group">
              <label className="input-label">Birthday</label>
              <input 
                className="input"
                name="birthday"
                type="date"
                value={friend.birthday || ''}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gender Select */}
            <div className="input-group">
              <label className="input-label">Gender</label>
              <select
                className="input select"
                name="gender"
                value={friend.gender || ''}
                onChange={handleChange}
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
                name="interest"
                value={friend.interest || ''}
                onChange={handleChange}
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
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isSubmitting ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  Save Changes
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
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

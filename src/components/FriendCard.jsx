import { useState } from 'react';
import { motion } from 'framer-motion';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarGradient(name) {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ];
  
  const index = name ? name.charCodeAt(0) % gradients.length : 0;
  return gradients[index];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getUrgencyBadge(days) {
  if (days === 0) return { text: "TODAY! 🎉", class: "badge-urgent" };
  if (days === 1) return { text: "Tomorrow!", class: "badge-urgent" };
  if (days <= 7) return { text: `${days} days`, class: "badge-urgent" };
  if (days <= 30) return { text: `${days} days`, class: "badge-soon" };
  return { text: `${days} days`, class: "badge-upcoming" };
}

export default function FriendCard({ 
  friend, 
  index, 
  daysUntil, 
  giftData, 
  isLoadingGift,
  onGetGift, 
  onEdit, 
  onDelete 
}) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isGiftExpanded, setIsGiftExpanded] = useState(false);
  
  const badge = getUrgencyBadge(daysUntil);
  const isUrgent = daysUntil <= 7;

  const handleDelete = () => {
    if (showConfirmDelete) {
      onDelete();
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  return (
    <motion.div
      className={`friend-card ${isUrgent ? 'urgent' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      {/* Urgency glow effect */}
      {isUrgent && <div className="urgency-glow"></div>}
      
      {/* Card Header */}
      <div className="card-header">
        <div className="avatar" style={{ background: getAvatarGradient(friend.name) }}>
          {getInitials(friend.name)}
        </div>
        
        <div className="friend-info">
          <h3 className="friend-name">{friend.name}</h3>
          <div className="friend-meta">
            <span className={`badge ${badge.class}`}>{badge.text}</span>
          </div>
        </div>
        
        <div className="card-actions">
          <button 
            className="action-btn" 
            onClick={onEdit}
            title="Edit"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button 
            className={`action-btn delete ${showConfirmDelete ? 'confirming' : ''}`}
            onClick={handleDelete}
            title={showConfirmDelete ? "Click again to confirm" : "Delete"}
          >
            {showConfirmDelete ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Birthday Countdown */}
      <div className="countdown-section">
        <div className="countdown-ring">
          <svg viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="var(--bg-elevated)" 
              strokeWidth="8"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${Math.max(0, (365 - daysUntil) / 365 * 283)} 283`}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-primary)" />
                <stop offset="100%" stopColor="var(--accent-secondary)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="countdown-center">
            <span className="countdown-number">{daysUntil}</span>
            <span className="countdown-label">days</span>
          </div>
        </div>
        
        <div className="birthday-info">
          <div className="info-row">
            <span className="info-icon">🎂</span>
            <span className="info-label">Birthday</span>
            <span className="info-value">{formatDate(friend.birthday)}</span>
          </div>
          <div className="info-row">
            <span className="info-icon">💫</span>
            <span className="info-label">Interest</span>
            <span className="info-value">{friend.interest || 'Not set'}</span>
          </div>
          <div className="info-row">
            <span className="info-icon">👤</span>
            <span className="info-label">Gender</span>
            <span className="info-value">{friend.gender || 'Not set'}</span>
          </div>
        </div>
      </div>

      {/* Gift Section */}
      <div className="gift-section">
        {!giftData ? (
          <motion.button 
            className="gift-btn"
            onClick={onGetGift}
            disabled={isLoadingGift}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoadingGift ? (
              <>
                <span className="loading-spinner"></span>
                Finding perfect gift...
              </>
            ) : (
              <>
                <span className="gift-icon">🎁</span>
                Get Gift Recommendation
              </>
            )}
          </motion.button>
        ) : (
          <motion.div 
            className="gift-result"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="gift-header" onClick={() => setIsGiftExpanded(!isGiftExpanded)}>
              <span className="gift-icon">🎁</span>
              <span className="gift-title">Recommended Gift</span>
              <svg 
                className={`expand-icon ${isGiftExpanded ? 'expanded' : ''}`} 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            
            <motion.div 
              className="gift-content"
              initial={false}
              animate={{ height: isGiftExpanded ? 'auto' : '60px', overflow: 'hidden' }}
            >
              <div className="gift-name">{giftData.gift}</div>
              <div className="gift-price">
                <span className="price-label">Budget:</span>
                <span className="price-value">{giftData['price range']}</span>
              </div>
            </motion.div>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={onGetGift}
              disabled={isLoadingGift}
              style={{ marginTop: '0.75rem', width: '100%' }}
            >
              {isLoadingGift ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  Get Another Idea
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>

      <style>{`
        .friend-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: var(--transition-base);
        }

        .friend-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .friend-card.urgent {
          border-color: rgba(255, 107, 107, 0.4);
        }

        .urgency-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-warm);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        /* Card Header */
        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .avatar {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          flex-shrink: 0;
        }

        .friend-info {
          flex: 1;
          min-width: 0;
        }

        .friend-name {
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.375rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: var(--bg-elevated);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-base);
        }

        .action-btn:hover {
          color: var(--text-primary);
          background: var(--glass-bg);
        }

        .action-btn.delete:hover,
        .action-btn.delete.confirming {
          background: rgba(255, 107, 107, 0.15);
          color: var(--accent-primary);
        }

        .action-btn.confirming {
          animation: pulse 0.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Countdown Section */
        .countdown-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: var(--bg-elevated);
          border-radius: var(--radius-md);
        }

        .countdown-ring {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }

        .countdown-ring svg {
          transform: rotate(-90deg);
        }

        .countdown-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .countdown-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .countdown-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .birthday-info {
          flex: 1;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0;
          font-size: 0.9rem;
        }

        .info-icon {
          font-size: 1rem;
        }

        .info-label {
          color: var(--text-muted);
          min-width: 60px;
        }

        .info-value {
          color: var(--text-primary);
          font-weight: 500;
        }

        /* Gift Section */
        .gift-section {
          margin-top: auto;
        }

        .gift-btn {
          width: 100%;
          padding: 0.875rem 1.25rem;
          background: var(--glass-bg);
          border: 1px dashed var(--glass-border);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: var(--transition-base);
        }

        .gift-btn:hover:not(:disabled) {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: rgba(255, 107, 107, 0.05);
        }

        .gift-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .gift-icon {
          font-size: 1.25rem;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Gift Result */
        .gift-result {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 1rem;
        }

        .gift-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          margin-bottom: 0.75rem;
        }

        .gift-title {
          flex: 1;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .expand-icon {
          color: var(--text-muted);
          transition: var(--transition-base);
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .gift-content {
          overflow: hidden;
        }

        .gift-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .gift-price {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .price-label {
          color: var(--text-muted);
        }

        .price-value {
          color: var(--accent-success);
          font-weight: 600;
        }
      `}</style>
    </motion.div>
  );
}


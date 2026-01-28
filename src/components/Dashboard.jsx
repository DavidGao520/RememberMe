import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import FriendCard from './FriendCard';

function getDaysUntilBirthday(birthdayStr) {
  if (!birthdayStr) return Infinity;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const bday = new Date(birthdayStr);
  bday.setFullYear(today.getFullYear());
  bday.setHours(0, 0, 0, 0);
  
  if (bday < today) {
    bday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = bday - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giftData, setGiftData] = useState({});
  const [loadingGifts, setLoadingGifts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userFriendsRef = collection(db, 'users', user.uid, 'friends');
        const unsubscribeSnapshot = onSnapshot(userFriendsRef, (querySnapshot) => {
          const loadedFriends = [];
          querySnapshot.forEach((doc) => {
            loadedFriends.push({ id: doc.id, ...doc.data() });
          });
          setFriends(loadedFriends);
          setLoading(false);
        }, (error) => {
          console.error("Error getting real-time updates:", error);
          setLoading(false);
        });

        return unsubscribeSnapshot;
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleGiftRecommend = async (friend) => {
    const promptAPI = "https://api.promptjoy.com/api/jQGCwq";
    const token = "sk-17c4f2e94891fae6423fde005b9064d74372a564";

    setLoadingGifts(prev => ({ ...prev, [friend.id]: true }));

    try {
      const res = await fetch(promptAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          interest: friend.interest,
          budget: "$50"
        })
      });

      const data = await res.json();
      setGiftData(prev => ({
        ...prev,
        [friend.id]: data
      }));
    } catch (error) {
      console.error("Failed to fetch gift recommendation:", error);
    } finally {
      setLoadingGifts(prev => ({ ...prev, [friend.id]: false }));
    }
  };

  const handleDelete = async (friendId) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'friends', friendId));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signin');
  };

  // Sort and filter friends
  const processedFriends = useMemo(() => {
    let filtered = [...friends];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.interest?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (filterType !== 'all') {
      filtered = filtered.filter(f => {
        const days = getDaysUntilBirthday(f.birthday);
        if (filterType === 'urgent') return days <= 7;
        if (filterType === 'soon') return days > 7 && days <= 30;
        if (filterType === 'upcoming') return days > 30;
        return true;
      });
    }
    
    // Sort by upcoming birthday
    return filtered.sort((a, b) => {
      const daysA = getDaysUntilBirthday(a.birthday);
      const daysB = getDaysUntilBirthday(b.birthday);
      return daysA - daysB;
    });
  }, [friends, searchTerm, filterType]);

  // Stats
  const stats = useMemo(() => {
    const urgent = friends.filter(f => getDaysUntilBirthday(f.birthday) <= 7).length;
    const thisMonth = friends.filter(f => getDaysUntilBirthday(f.birthday) <= 30).length;
    return { total: friends.length, urgent, thisMonth };
  }, [friends]);

  // Next birthday
  const nextBirthday = useMemo(() => {
    if (friends.length === 0) return null;
    const sorted = [...friends].sort((a, b) => 
      getDaysUntilBirthday(a.birthday) - getDaysUntilBirthday(b.birthday)
    );
    return sorted[0];
  }, [friends]);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎂</span>
            <span className="logo-text text-gradient">RememberMe</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Dashboard
          </Link>
          <Link to="/add" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Add Friend
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-ghost" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Welcome Back!</h1>
            <p>Here's what's happening with your friends' birthdays</p>
          </div>
          <Link to="/add" className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Friend
          </Link>
        </header>

        {/* Stats Cards */}
        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              👥
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Friends</span>
            </div>
          </div>
          
          <div className="stat-card urgent">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)' }}>
              🔥
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.urgent}</span>
              <span className="stat-label">This Week</span>
            </div>
            {stats.urgent > 0 && <div className="stat-pulse"></div>}
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #feca57 0%, #f9a826 100%)' }}>
              📅
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.thisMonth}</span>
              <span className="stat-label">This Month</span>
            </div>
          </div>
          
          {nextBirthday && (
            <div className="stat-card featured">
              <div className="stat-icon" style={{ background: 'var(--gradient-warm)' }}>
                🎉
              </div>
              <div className="stat-info">
                <span className="stat-value">{getDaysUntilBirthday(nextBirthday.birthday)}</span>
                <span className="stat-label">Days until {nextBirthday.name}'s birthday</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Search and Filter */}
        <div className="controls-bar">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search friends..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-tabs">
            {['all', 'urgent', 'soon', 'upcoming'].map((type) => (
              <button 
                key={type}
                className={`filter-tab ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' && 'All'}
                {type === 'urgent' && '🔥 This Week'}
                {type === 'soon' && '📅 This Month'}
                {type === 'upcoming' && '🗓️ Later'}
              </button>
            ))}
          </div>
        </div>

        {/* Friends Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-avatar"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-text short"></div>
                </div>
              ))}
            </div>
          </div>
        ) : processedFriends.length === 0 ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-icon">
              {searchTerm || filterType !== 'all' ? '🔍' : '🎈'}
            </div>
            <h3>{searchTerm || filterType !== 'all' ? 'No friends found' : 'No friends yet'}</h3>
            <p>
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first friend to track their birthday!'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <Link to="/add" className="btn btn-primary">
                Add Your First Friend
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="friends-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="popLayout">
              {processedFriends.map((friend, index) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  index={index}
                  daysUntil={getDaysUntilBirthday(friend.birthday)}
                  giftData={giftData[friend.id]}
                  isLoadingGift={loadingGifts[friend.id]}
                  onGetGift={() => handleGiftRecommend(friend)}
                  onEdit={() => navigate(`/edit/${friend.id}`)}
                  onDelete={() => handleDelete(friend.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <style>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 100;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          font-size: 1.75rem;
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 600;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          transition: var(--transition-base);
          text-decoration: none;
        }

        .nav-item:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: var(--gradient-warm);
          color: #1a1a1a;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--glass-border);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 260px;
          padding: 2rem;
          min-height: 100vh;
        }

        /* Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-left h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }

        .header-left p {
          color: var(--text-muted);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          transition: var(--transition-base);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .stat-card.urgent {
          border-color: rgba(255, 107, 107, 0.3);
        }

        .stat-card.featured {
          grid-column: span 2;
          background: var(--glass-bg);
          border-color: rgba(255, 107, 107, 0.2);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .stat-pulse {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 12px;
          height: 12px;
          background: var(--accent-primary);
          border-radius: 50%;
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        /* Controls Bar */
        .controls-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-elevated);
          border: 2px solid transparent;
          border-radius: var(--radius-full);
          padding: 0 1.25rem;
          transition: var(--transition-base);
        }

        .search-box:focus-within {
          border-color: var(--accent-primary);
        }

        .search-box svg {
          color: var(--text-muted);
        }

        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.875rem 0;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .search-box input::placeholder {
          color: var(--text-muted);
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          background: var(--bg-elevated);
          padding: 0.375rem;
          border-radius: var(--radius-full);
        }

        .filter-tab {
          padding: 0.625rem 1rem;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition-base);
          white-space: nowrap;
        }

        .filter-tab:hover {
          color: var(--text-primary);
        }

        .filter-tab.active {
          background: var(--gradient-warm);
          color: #1a1a1a;
        }

        /* Friends Grid */
        .friends-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        /* Loading State */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .skeleton-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }

        .skeleton-avatar {
          width: 64px;
          height: 64px;
          margin-bottom: 1rem;
        }

        .skeleton-text {
          height: 16px;
          margin-bottom: 0.75rem;
        }

        .skeleton-text.short {
          width: 60%;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .main-content {
            margin-left: 0;
          }

          .stat-card.featured {
            grid-column: span 1;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .controls-bar {
            flex-direction: column;
          }

          .filter-tabs {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .friends-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

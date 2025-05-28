// No changes to imports or functions
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import './index.css';
import './Dashboard.css';

function getCardColorClass(birthdayStr) {
  if (!birthdayStr) return "";

  const today = new Date();
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  const bday = new Date(birthdayStr);
  bday.setFullYear(today.getFullYear());

  if (bday < today) {
    bday.setFullYear(today.getFullYear() + 1);
  }

  const bdayUTC = Date.UTC(bday.getFullYear(), bday.getMonth(), bday.getDate());
  const diffDays = Math.ceil((bdayUTC - todayUTC) / (1000 * 60 * 60 * 24));
  const isSameMonth = bday.getMonth() === today.getMonth();

  if (diffDays < 0) return "card-past";
  if (diffDays <= 7) return "card-pink";
  if (isSameMonth) return "card-yellow";
  return "card-green";
}

export default function Dashboard() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giftData, setGiftData] = useState({});
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
    }
  };

  const handleDelete = async (friendId) => {
    const confirmed = window.confirm("Are you sure you want to delete this friend?");
    if (!confirmed) return;

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    await deleteDoc(doc(db, 'users', uid, 'friends', friendId));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signin');
  };

  return (
    <main className="container my-5">
      {/* Flexbox Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title"> RememberME</h1>
        <div className="dashboard-actions">
          <button className="btn btn-outline-danger me-2" onClick={handleLogout}>
            Log Out
          </button>
          <Link to="/add" className="btn btn-primary">Add Friend</Link>
        </div>
      </div>

      {loading ? (
        <p>Loading friends...</p>
      ) : friends.length === 0 ? (
        <p className="text-muted">No friends added yet.</p>
      ) : (
        // Grid Layout
        <div className="friend-grid">
          {[...friends]
            .sort((a, b) => {
              const today = new Date();
              const dateA = new Date(a.birthday);
              const dateB = new Date(b.birthday);
              dateA.setFullYear(today.getFullYear());
              dateB.setFullYear(today.getFullYear());

              const isPastA = dateA < today;
              const isPastB = dateB < today;

              if (isPastA && !isPastB) return 1;
              if (!isPastA && isPastB) return -1;
              return dateA - dateB;
            })
            .map((friend) => (
              <div className={`card shadow-sm friend-card position-relative ${getCardColorClass(friend.birthday)}`} key={friend.id}>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(friend.id)}
                  title="Delete"
                >
                  ✖
                </button>

                <div className="card-body">
                  <h5 className="card-title">{friend.name}</h5>
                  <p className="card-text">
                    <strong>🎂 Birthday:</strong> {friend.birthday}<br />
                    <strong>🎯 Hobby:</strong> {friend.interest}<br />
                    <strong>🧬 Gender:</strong> {friend.gender}
                  </p>

                  <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-outline-success btn-sm" onClick={() => handleGiftRecommend(friend)}>
                      🎁 Gift
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/edit/${friend.id}`)}>
                      ✏️ Edit
                    </button>
                  </div>

                  {giftData[friend.id] && (
                    <div className="mt-3">
                      <strong> Recommended Gift:</strong><br />
                      {giftData[friend.id].gift} — {giftData[friend.id]['price range']}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}

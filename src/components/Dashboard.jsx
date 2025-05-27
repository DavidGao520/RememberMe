import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../global.css';

export default function Dashboard() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('friends')) || [];
    setFriends(saved);
  }, []);

  return (
    <main className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>RememberME</h1>
        <Link to="/add" className="btn btn-add-friend px-4 py-2">Add Friend</Link>
      </div>

      <div className="mt-4 d-flex flex-wrap justify-content-start">
        {friends.length === 0 ? (
          <p className="text-muted">No friends yet.</p>
        ) : (
          friends.map((friend, i) => {
            const cardColor =
              friend.gender === 'Male'
                ? 'sticker-male'
                : friend.gender === 'Female'
                ? 'sticker-female'
                : 'sticker-other';

            return (
              <div key={i} className={`friend-sticker ${cardColor}`}>
                <div className="sticker-header">
                  <button className="btn btn-light btn-sm">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
                <div className="sticker-body">
                  <h5>{friend.name}</h5>
                  <p>🎂 {friend.birthday}</p>
                  <p>📚 {friend.interest}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

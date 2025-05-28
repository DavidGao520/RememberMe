import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditFriendForm() {
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const friendRef = doc(db, "users", uid, "friends", id);
    await updateDoc(friendRef, friend);
    alert("Friend updated!");
    navigate("/dashboard");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow p-4" style={{ maxWidth: '550px', width: '100%' }}>
        <h2 className="text-center text-primary mb-4">Edit Friend</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              name="name"
              value={friend.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Birthdate</label>
            <input
              className="form-control"
              name="birthday"
              type="date"
              value={friend.birthday}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              name="gender"
              value={friend.gender}
              onChange={handleChange}
              required
            >
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Interest</label>
            <input
              className="form-control"
              name="interest"
              value={friend.interest}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Update Friend</button>
        </form>
      </div>
    </main>
  );
}

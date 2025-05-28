import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import './index.css';

export default function AddFriendForm() {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [interest, setInterest] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const today = new Date();
      const bday = new Date(birthdate);
      bday.setFullYear(today.getFullYear());
      const diffDays = Math.ceil((bday - today) / (1000 * 60 * 60 * 24));

      if (diffDays === 7) {
        await emailjs.send(
          'service_vptvxg9',              // service ID
          'template_yourtemplateid',      // template ID
          {
            to_email: user.email,
            friend_name: name,
            friend_birthday: birthdate,
          },
          'aUKV9bzxgZrJ11MY7'             // public key
        );
      }

      setConfirmation(`${name}'s birthday added!`);
      await new Promise(res => setTimeout(res, 200));
      navigate('/dashboard');

    } catch (err) {
      alert(err.message || "Failed to save data.");
    }
  };

  return (
    <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow p-4" style={{ maxWidth: '550px', width: '100%' }}>
        <h2 className="text-center text-primary mb-4">Add a Friend</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Birthdate</label>
            <input className="form-control" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Interest</label>
            <input className="form-control" value={interest} onChange={(e) => setInterest(e.target.value)} required />
          </div>

          <button className="btn btn-success w-100" type="submit">Add Friend</button>
        </form>

        {confirmation && (
          <div className="alert alert-success mt-3 text-center">{confirmation}</div>
        )}
      </div>
    </main>
  );
}

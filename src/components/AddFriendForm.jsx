import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddFriend.css'

export default function AddFriendForm() {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [interest, setInterest] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFriend = { name, birthday: birthdate, gender, interest };

    const existing = JSON.parse(localStorage.getItem("friends")) || [];
    existing.push(newFriend);
    localStorage.setItem("friends", JSON.stringify(existing));

    setConfirmation(`${name}'s birthday added!`);
    
    // Optional: Redirect after a delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <main className="container mt-5">
      <h1 className="mb-4">Add a Friend's Birthday</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name:</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Birthdate:</label>
          <input className="form-control" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Gender:</label>
          <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="" disabled>Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Interest:</label>
          <input className="form-control" value={interest} onChange={(e) => setInterest(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary">Add Friend</button>
      </form>

      {confirmation && <p className="mt-3 text-success">{confirmation}</p>}
    </main>
  );
}

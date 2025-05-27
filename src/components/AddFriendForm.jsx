import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddFriend.css';

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

    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <main>
      <h1>Add a Friend's Birthday</h1>

      <form id="add-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Birthdate:
          <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
        </label>

        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="" disabled>Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Interest:
          <input type="text" value={interest} onChange={(e) => setInterest(e.target.value)} required />
        </label>

        <button type="submit">Add Friend</button>
      </form>

      {confirmation && <p id="confirmation">{confirmation}</p>}
    </main>
  );
}

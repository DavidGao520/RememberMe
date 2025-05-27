import './global.css'; // 👈 This is critical!
import { Routes, Route } from 'react-router-dom';
import Signin from './components/Signin';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddFriendForm from './components/AddFriendForm';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add" element={<AddFriendForm />} />
    </Routes>
  );
}

export default App;


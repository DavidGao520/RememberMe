import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddFriendForm from './components/AddFriendForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/add" element={<AddFriendForm />} />
        {/* Add other routes here like /dashboard or / */}
      </Routes>
    </Router>
  );
}

export default App;

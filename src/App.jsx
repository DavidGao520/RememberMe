import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/Signin';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddFriendForm from './components/AddFriendForm';
import EditFriendForm from './components/EditFriendForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddFriendForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditFriendForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import StoreBrowser from './pages/StoreBrowser';
import OwnerDashboard from './pages/OwnerDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/stores" element={<StoreBrowser />} />
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
    </Routes>
  );
}

export default App;
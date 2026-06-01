import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StoreBrowser from './pages/StoreBrowser';

// --- Temporary Placeholders ---
const AdminDashboard = () => <div className="p-10 text-2xl font-bold">Admin Dashboard Coming Soon...</div>;
const OwnerDashboard = () => <div className="p-10 text-2xl font-bold">Store Owner Dashboard Coming Soon...</div>;
// -------------------------------------------------------

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
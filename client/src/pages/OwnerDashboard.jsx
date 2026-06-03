import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ChangePasswordModal from '../components/ChangePasswordModal';

const OwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/owner/dashboard');
                setDashboardData(response.data);
            } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    handleLogout();
                } else {
                    setError(err.response?.data?.error || 'Failed to load dashboard');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-400">Loading Dashboard...</div>;

    if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
            <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white tracking-wide">StoreScore <span className="text-indigo-500">Owner</span></h1>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-md transition-colors border border-slate-700"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-md transition-colors border border-slate-700"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{dashboardData.store.name}</h2>
                            <p className="text-slate-400 mb-1">{dashboardData.store.email}</p>
                            <p className="text-slate-500">{dashboardData.store.address}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-extrabold text-white mb-1">
                                {dashboardData.averageRating} <span className="text-yellow-400 text-3xl">⭐</span>
                            </div>
                            <p className="text-sm text-slate-400">{dashboardData.totalRatings} Total Ratings</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
                        <h3 className="text-lg font-bold text-white">Recent Ratings</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Customer Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium text-right">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {dashboardData.ratings.map((rating) => (
                                    <tr key={rating.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{rating.user_name}</td>
                                        <td className="px-6 py-4 text-slate-400">{rating.user_email}</td>
                                        <td className="px-6 py-4 font-bold text-right text-yellow-400">{rating.rating} ⭐</td>
                                    </tr>
                                ))}

                                {dashboardData.ratings.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No ratings yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default OwnerDashboard;
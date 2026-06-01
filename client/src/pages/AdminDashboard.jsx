import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, usersRes, storesRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/users'),
                    api.get('/admin/stores')
                ]);

                setStats(statsRes.data);
                setUsers(usersRes.data);
                setStores(storesRes.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-400">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
            <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white tracking-wide">StoreScore <span className="text-indigo-500">Admin</span></h1>
                <button
                    onClick={handleLogout}
                    className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-md transition-colors border border-slate-700"
                >
                    Sign Out
                </button>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Total Users</h3>
                        <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Total Stores</h3>
                        <p className="text-3xl font-bold text-white">{stats.totalStores}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Total Ratings</h3>
                        <p className="text-3xl font-bold text-white">{stats.totalRatings}</p>
                    </div>
                </div>

                <div className="flex gap-8 mb-6 border-b border-slate-800 pb-2">
                    <button
                        className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'users' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Manage Users
                    </button>
                    <button
                        className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'stores' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                        onClick={() => setActiveTab('stores')}
                    >
                        Manage Stores
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs">
                                {activeTab === 'users' ? (
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium">Address</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Store Name</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Address</th>
                                        <th className="px-6 py-4 font-medium text-right">Avg Rating</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {activeTab === 'users' && users.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{user.address}</td>
                                    </tr>
                                ))}

                                {activeTab === 'stores' && stores.map(store => (
                                    <tr key={store.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{store.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{store.email}</td>
                                        <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{store.address}</td>
                                        <td className="px-6 py-4 font-bold text-right text-indigo-400">{store.average_rating} ⭐</td>
                                    </tr>
                                ))}

                                {(activeTab === 'users' && users.length === 0) || (activeTab === 'stores' && stores.length === 0) ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No data available yet.</td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
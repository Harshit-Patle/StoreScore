import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CreateUserModal from '../components/CreateUserModal';
import CreateStoreModal from '../components/CreateStoreModal';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

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
            if (err.response?.status === 401 || err.response?.status === 403) handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const getProcessedData = (data, type) => {
        let filtered = data.filter(item => {
            const search = searchTerm.toLowerCase();
            if (type === 'users') {
                return item.name.toLowerCase().includes(search) ||
                    item.email.toLowerCase().includes(search) ||
                    item.address.toLowerCase().includes(search) ||
                    item.role.toLowerCase().includes(search);
            } else {
                return item.name.toLowerCase().includes(search) ||
                    item.email.toLowerCase().includes(search) ||
                    item.address.toLowerCase().includes(search);
            }
        });

        filtered.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    };

    const processedUsers = useMemo(() => getProcessedData(users, 'users'), [users, searchTerm, sortConfig]);
    const processedStores = useMemo(() => getProcessedData(stores, 'stores'), [stores, searchTerm, sortConfig]);

    const SortableHeader = ({ label, sortKey }) => (
        <th
            className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors"
            onClick={() => handleSort(sortKey)}
        >
            <div className="flex items-center space-x-1">
                <span>{label}</span>
                {sortConfig.key === sortKey && (
                    <span className="text-indigo-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
            </div>
        </th>
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-400">Loading Dashboard...</div>;

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

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder={`Search ${activeTab} by name, email, address...`}
                        className="w-full md:w-1/2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-2">
                    <div className="flex gap-8">
                        <button
                            className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'users' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                            onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
                        >
                            Manage Users
                        </button>
                        <button
                            className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'stores' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                            onClick={() => { setActiveTab('stores'); setSearchTerm(''); }}
                        >
                            Manage Stores
                        </button>
                    </div>

                    <button
                        onClick={() => activeTab === 'users' ? setIsUserModalOpen(true) : setIsStoreModalOpen(true)}
                        className="mb-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                        + Add {activeTab === 'users' ? 'User' : 'Store'}
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs select-none">
                                {activeTab === 'users' ? (
                                    <tr>
                                        <SortableHeader label="Name" sortKey="name" />
                                        <SortableHeader label="Email" sortKey="email" />
                                        <SortableHeader label="Role" sortKey="role" />
                                        <SortableHeader label="Address" sortKey="address" />
                                        <SortableHeader label="Owner Rating" sortKey="owner_rating" />
                                    </tr>
                                ) : (
                                    <tr>
                                        <SortableHeader label="Store Name" sortKey="name" />
                                        <SortableHeader label="Email" sortKey="email" />
                                        <SortableHeader label="Address" sortKey="address" />
                                        <SortableHeader label="Avg Rating" sortKey="average_rating" />
                                    </tr>
                                )}
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {activeTab === 'users' && processedUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : user.role === 'STORE_OWNER' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{user.address}</td>
                                        <td className="px-6 py-4 font-medium text-yellow-400">
                                            {user.role === 'STORE_OWNER' ? (user.owner_rating > 0 ? `${user.owner_rating} ⭐` : 'New') : '-'}
                                        </td>
                                    </tr>
                                ))}

                                {activeTab === 'stores' && processedStores.map(store => (
                                    <tr key={store.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{store.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{store.email}</td>
                                        <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{store.address}</td>
                                        <td className="px-6 py-4 font-bold text-indigo-400">{store.average_rating > 0 ? `${store.average_rating} ⭐` : 'New'}</td>
                                    </tr>
                                ))}

                                {(activeTab === 'users' && processedUsers.length === 0) || (activeTab === 'stores' && processedStores.length === 0) ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No data found matching your search.</td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <CreateUserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSuccess={fetchDashboardData}
            />
            <CreateStoreModal
                isOpen={isStoreModalOpen}
                onClose={() => setIsStoreModalOpen(false)}
                onSuccess={fetchDashboardData}
                owners={users.filter(u => u.role === 'STORE_OWNER')}
            />
        </div>
    );
};

export default AdminDashboard;
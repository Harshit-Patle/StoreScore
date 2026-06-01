import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const StoreBrowser = () => {
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStores = async () => {
        try {
            const response = await api.get('/stores');
            setStores(response.data);
        } catch (err) {
            if (err.response?.status === 401) handleLogout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleRating = async (storeId, ratingValue) => {
        try {
            setStores(stores.map(store =>
                store.id === storeId ? { ...store, user_rating: ratingValue } : store
            ));

            await api.post('/ratings', { storeId, rating: ratingValue });
            fetchStores();
        } catch (err) {
            console.error('Failed to submit rating');
        }
    };

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-400">Loading Stores...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
            <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold text-white tracking-wide">StoreScore</h1>
                <button
                    onClick={handleLogout}
                    className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-md transition-colors border border-slate-700"
                >
                    Sign Out
                </button>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search stores by name or address..."
                        className="w-full md:w-1/2 px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 shadow-sm transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map(store => (
                        <div key={store.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-lg font-bold text-white truncate pr-2">{store.name}</h2>
                                    <div className="flex items-center bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                                        <span className="text-yellow-400 text-sm mr-1">⭐</span>
                                        <span className="font-bold text-sm text-slate-200">{store.average_rating > 0 ? store.average_rating : 'New'}</span>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{store.address}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                                    {store.user_rating ? 'Your Rating' : 'Submit a Rating'}
                                </p>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRating(store.id, star)}
                                            className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${(store.user_rating || 0) >= star ? 'text-yellow-400' : 'text-slate-700 hover:text-yellow-400/50'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredStores.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 border border-slate-800 rounded-xl border-dashed">
                            No stores found matching your search.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StoreBrowser;
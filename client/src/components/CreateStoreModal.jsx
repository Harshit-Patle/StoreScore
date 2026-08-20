import { useState } from 'react';
import api from '../utils/api';

const CreateStoreModal = ({ isOpen, onClose, onSuccess, owners }) => {
    const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerId: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/admin/stores', formData);
            setStatus({ type: 'success', message: 'Store created successfully!' });
            setTimeout(() => {
                onSuccess();
                onClose();
                setFormData({ name: '', email: '', address: '', ownerId: '' });
                setStatus({ type: '', message: '' });
            }, 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to create store.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-white mb-6">Add New Store</h2>

                {status.message && (
                    <div className={`px-4 py-3 rounded-md mb-6 text-sm ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" required placeholder="Store Name" className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white" value={formData.name} onChange={handleChange} />
                    <input type="email" name="email" required placeholder="Business Email" className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white" value={formData.email} onChange={handleChange} />
                    <textarea name="address" required placeholder="Store Address" rows={2} className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white resize-none" value={formData.address} onChange={handleChange} />

                    <select name="ownerId" required className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white" value={formData.ownerId} onChange={handleChange}>
                        <option value="" disabled>Assign a Store Owner...</option>
                        {owners.map(owner => (
                            <option key={owner.id} value={owner.id}>{owner.name}</option>
                        ))}
                    </select>

                    <button type="submit" disabled={loading} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold">
                        {loading ? 'Creating...' : 'Create Store'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateStoreModal;
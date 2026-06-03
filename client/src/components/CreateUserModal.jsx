import { useState } from 'react';
import api from '../utils/api';

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/admin/users', formData);
            setStatus({ type: 'success', message: 'User created successfully!' });
            setTimeout(() => {
                onSuccess();
                onClose();
                setFormData({ name: '', email: '', password: '', address: '', role: 'USER' });
                setStatus({ type: '', message: '' });
            }, 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to create user.' });
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
                <h2 className="text-2xl font-bold text-white mb-6">Add New User</h2>

                {status.message && (
                    <div className={`px-4 py-3 rounded-md mb-6 text-sm ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" required minLength={20} maxLength={60} placeholder="Full Name (Min 20 chars)" className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white" value={formData.name} onChange={handleChange} />
                    <input type="email" name="email" required placeholder="Email Address" className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white" value={formData.email} onChange={handleChange} />
                    <input type="password" name="password" required minLength={8} maxLength={16} placeholder="Password (1 Uppercase, 1 Special)" className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white" value={formData.password} onChange={handleChange} />
                    <textarea name="address" required maxLength={400} placeholder="Home Address" rows={2} className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white resize-none" value={formData.address} onChange={handleChange} />
                    <select name="role" className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white" value={formData.role} onChange={handleChange}>
                        <option value="USER">Normal User</option>
                        <option value="STORE_OWNER">Store Owner</option>
                        <option value="ADMIN">System Administrator</option>
                    </select>
                    <button type="submit" disabled={loading} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold">
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
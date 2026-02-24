import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Users, Trash2, Shield, User as UserIcon, Mail, Calendar } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const UserListAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useContext(AuthContext);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/auth/users', {
                headers: { Authorization: `Bearer ${currentUser.token}` },
            });
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.role === 'admin') {
            fetchUsers();
        }
    }, [currentUser]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/auth/users/${id}`, {
                    headers: { Authorization: `Bearer ${currentUser.token}` },
                });
                fetchUsers();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep_blue"></div>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto p-8 text-dark_charcoal font-sans">
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-deep_blue p-4 rounded-2xl shadow-xl shadow-deep_blue/20">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-dark_charcoal tracking-tight">User Management</h1>
                    <p className="text-text_secondary font-medium">View and manage all registered customers</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] uppercase text-text_secondary tracking-[0.2em]">
                                <th className="px-8 py-5 font-black">User Details</th>
                                <th className="px-8 py-5 font-black">Role</th>
                                <th className="px-8 py-5 font-black">Joined</th>
                                <th className="px-8 py-5 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-deep_blue/10 flex items-center justify-center text-deep_blue font-black shadow-sm group-hover:scale-110 transition-transform">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-dark_charcoal">{user.name}</span>
                                                    {user._id === currentUser._id && (
                                                        <span className="text-[10px] bg-sky_blue text-white px-2 py-0.5 rounded-full font-black tracking-tighter">YOU</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-text_secondary font-bold mt-0.5">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {user.role === 'admin' ? (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl uppercase tracking-tighter">
                                                <Shield className="w-3 h-3" />
                                                Administrator
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-black px-3 py-1.5 bg-sky_blue/10 text-sky_blue rounded-xl uppercase tracking-tighter">
                                                Customer
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs text-text_secondary font-bold">
                                            <Calendar className="w-3.5 h-3.5 opacity-40 ml-1" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {user._id !== currentUser._id && (
                                            <button
                                                onClick={() => deleteHandler(user._id)}
                                                className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserListAdmin;

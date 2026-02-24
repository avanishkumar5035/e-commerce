import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Shield, Clock, User, Activity as ActivityIcon, ChevronRight } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const ActivityLogAdmin = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const { data } = await axios.get('/api/activity', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setActivities(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchActivities();
        }
    }, [user]);

    <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep_blue"></div>
    </div>

    const getActionColor = (action) => {
        switch (action) {
            case 'LOGIN': return 'text-emerald-600 bg-emerald-50';
            case 'LOGOUT': return 'text-orange-600 bg-orange-50';
            case 'PURCHASE': return 'text-deep_blue bg-deep_blue/10';
            case 'ADD_TO_CART': return 'text-sky_blue bg-sky_blue/10';
            case 'REMOVE_FROM_CART': return 'text-red-600 bg-red-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto p-6">
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-deep_blue p-4 rounded-2xl shadow-xl shadow-deep_blue/20">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-dark_charcoal tracking-tight">Activity Logs</h1>
                    <p className="text-text_secondary font-medium">Monitor real-time user activity across the store</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="font-black text-dark_charcoal flex items-center gap-2">
                        <ActivityIcon className="w-5 h-5 text-deep_blue" />
                        Live Feed
                    </h2>
                    <span className="text-[10px] font-black px-3 py-1 bg-deep_blue/10 text-deep_blue rounded-full uppercase tracking-tighter">
                        Real-time Tracking
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs uppercase text-text_secondary tracking-wider">
                                <th className="px-6 py-4 font-bold">Timestamp</th>
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Action</th>
                                <th className="px-6 py-4 font-bold">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {activities.map((activity) => (
                                <tr key={activity._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-xs text-text_secondary">
                                            <Clock className="w-3.5 h-3.5 opacity-60" />
                                            {new Date(activity.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 rounded-xl bg-deep_blue/10 flex items-center justify-center text-deep_blue font-black shadow-sm group-hover:scale-110 transition-transform">
                                                {activity.userName.charAt(0)}
                                            </div>
                                            <span className="text-sm font-black text-dark_charcoal">{activity.userName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${getActionColor(activity.action)}`}>
                                            {activity.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-text_secondary">{activity.details}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {activities.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-text_secondary">No activities recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogAdmin;

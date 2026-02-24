import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Activity as ActivityIcon,
    TrendingUp,
    Users,
    ShoppingBag,
    RefreshCcw,
    Zap,
    Globe,
    ShieldCheck,
    AlertCircle,
    ArrowUpRight,
    Search,
    Monitor
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const MonitorAdmin = () => {
    const { user } = useContext(AuthContext);
    const [activities, setActivities] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        activeUsers: 0,
        totalRevenue: 0,
        conversionRate: '3.2%'
    });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    const fetchMonitorData = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const [activitiesRes, ordersRes, usersRes] = await Promise.all([
                axios.get('/api/activity', config),
                axios.get('/api/orders', config),
                axios.get('/api/auth/users', config)
            ]);

            setActivities(activitiesRes.data);
            const revenue = ordersRes.data.reduce((acc, o) => acc + o.totalPrice, 0);

            setStats({
                totalOrders: ordersRes.data.length,
                activeUsers: usersRes.data.length,
                totalRevenue: revenue,
                conversionRate: '4.8%'
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonitorData();
        const interval = setInterval(fetchMonitorData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [user]);

    const filteredActivities = filter === 'ALL'
        ? activities
        : activities.filter(a => a.action === filter);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-bg_soft_gray">
            <div className="flex flex-col items-center gap-4">
                <RefreshCcw className="w-12 h-12 text-deep_blue animate-spin" />
                <p className="font-black text-deep_blue/40 tracking-widest uppercase text-xs">Initializing Monitor...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white p-6 font-sans selection:bg-sky_blue selection:text-deep_blue">
            {/* Header Area */}
            <div className="max-w-[1600px] mx-auto mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#121216] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-deep_blue/10 blur-[100px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky_blue/5 blur-[100px] -z-10" />

                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-deep_blue to-sky_blue rounded-2xl flex items-center justify-center shadow-lg shadow-deep_blue/20">
                            <Monitor className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black tracking-tighter">Live Monitor</h1>
                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Active
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm font-medium">Real-time store telemetry & activity surveillance</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block font-mono">
                            <p className="text-[10px] text-gray-500 uppercase font-black">System Load</p>
                            <p className="text-sky_blue font-bold">Optimal (0.42)</p>
                        </div>
                        <button
                            onClick={() => { setLoading(true); fetchMonitorData(); }}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-95"
                        >
                            <RefreshCcw className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400' },
                    { label: 'Live Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-sky_blue' },
                    { label: 'Customer Base', value: stats.activeUsers, icon: Users, color: 'text-deep_blue' },
                    { label: 'Conversion', value: stats.conversionRate, icon: Zap, color: 'text-orange-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#121216] p-6 rounded-[2rem] border border-white/5 flex items-center justify-between hover:border-white/10 transition-all group">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                            <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Feed */}
                <div className="lg:col-span-2 bg-[#121216] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-[700px] shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <ActivityIcon className="w-6 h-6 text-deep_blue" />
                            <h2 className="text-xl font-black tracking-tight uppercase">Intelligence Feed</h2>
                        </div>
                        <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
                            {['ALL', 'LOGIN', 'PURCHASE', 'PAYMENT'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${filter === t ? 'bg-deep_blue text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
                        {filteredActivities.map((a, idx) => (
                            <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between hover:bg-white/[0.08] transition-all group animate-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c1c22] to-black flex items-center justify-center font-black text-sky_blue shadow-xl">
                                        {a.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="text-sm font-black text-gray-200">{a.userName}</p>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${a.action === 'PURCHASE' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    a.action === 'PAYMENT' ? 'bg-sky_blue/10 text-sky_blue' :
                                                        a.action === 'LOGIN' ? 'bg-orange-500/10 text-orange-400' :
                                                            'bg-white/10 text-gray-400'
                                                }`}>
                                                {a.action}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium italic">{a.details}</p>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-mono text-gray-500">{new Date(a.createdAt).toLocaleTimeString()}</p>
                                    <p className="text-[10px] font-black text-deep_blue uppercase tracking-tighter">{new Date(a.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Store Status */}
                    <div className="bg-[#121216] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 bg-white rounded-bl-[2rem] transition-all group-hover:opacity-10">
                            <ShieldCheck className="w-16 h-16" />
                        </div>
                        <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-sky_blue" />
                            System Armor
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Auth Gateway', status: 'Secure', icon: Globe },
                                { label: 'DB Connection', status: 'Stable', icon: AlertCircle },
                                { label: 'Stripe API', status: 'Operational', icon: Zap },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-[1.5rem] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs font-bold text-gray-400">{item.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Analytics */}
                    <div className="bg-gradient-to-br from-deep_blue to-deep_blue_dark rounded-[2.5rem] p-8 text-white shadow-2xl shadow-deep_blue/20">
                        <h3 className="text-xl font-black mb-6 tracking-tight flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            Market Pulse
                        </h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-white/60 uppercase">Daily Goal</span>
                                <span className="text-lg font-black">74%</span>
                            </div>
                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[74%] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/10 rounded-2xl flex flex-col justify-between h-24">
                                <p className="text-[10px] font-black uppercase text-white/50">Sessions</p>
                                <p className="text-xl font-black">1.8k</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl flex flex-col justify-between h-24">
                                <p className="text-[10px] font-black uppercase text-white/50">Bounce</p>
                                <p className="text-xl font-black">12%</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert Banner */}
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-[2rem] p-6 flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-orange-400 shrink-0" />
                        <div>
                            <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Advisory</p>
                            <p className="text-xs text-orange-200/60 font-medium">Inventory for 'Air Jordan High' is falling below threshold (5 left).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonitorAdmin;

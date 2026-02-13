import { useEffect, useState } from "react";
import { FaCar, FaDownload } from "react-icons/fa";
import { getDashboardSummary } from "../../api/carService";
import { useCurrency } from "../../context/CurrencyContext";
import toast from "react-hot-toast";

const CustomerDashboard = () => {
    const { symbol, rate } = useCurrency();
    const [stats, setStats] = useState({
        active_bookings: 0,
        wishlist_count: 0,
        total_spent: 0,
        recent_activity: [] as any[]
    });
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("Guest");

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const userObj = JSON.parse(savedUser);
            setUserName(userObj.first_name || userObj.username || "User");
        }

        const fetchStats = async () => {
            try {
                const res = await getDashboardSummary();
                setStats(res.data);
            }
            catch (err) {
                toast.error("Could not sync dashboard data");
            }
            finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-20 text-center animate-pulse text-indigo-500 font-black italic">LOADING YOUR EXPERIENCE...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-15">
            <header>
                <h1 className="text-3xl font-black dark:text-white">
                    Welcome Back, <span className="text-indigo-600">{userName}!</span>
                </h1>
                <p className="text-slate-500 text-sm italic">Here's what's happening with your garage today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Active Bookings</p>
                        <h2 className="text-4xl font-black mt-2">{stats.active_bookings.toString().padStart(2, '0')}</h2>
                    </div>
                    <FaCar className="absolute -right-4 -bottom-4 text-white/10 text-8xl group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Wishlist Items</p>
                    <h2 className="text-4xl font-black dark:text-white mt-2">{stats.wishlist_count}</h2>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Spent</p>
                    <h2 className="text-4xl font-black dark:text-white mt-2">
                        {symbol}{(stats.total_spent * rate).toLocaleString()}
                    </h2>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-white/5 p-8">
                <div className="flex justify-between items-center mb-8 px-2">
                    <h3 className="font-black dark:text-white uppercase tracking-tighter">Recent Activity</h3>
                    <button className="text-[10px] bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full text-indigo-600 font-black hover:bg-indigo-600 hover:text-white transition-all">
                        VIEW ALL ORDERS
                    </button>
                </div>
                
                <div className="space-y-4">
                    {stats.recent_activity.length > 0 ? (
                        stats.recent_activity.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-indigo-500/20 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <FaCar size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold dark:text-white">Order #{order.order_number}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                            {order.order_type} • {order.payment_status}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-black text-indigo-600">{symbol}{(order.total_amount * rate).toLocaleString()}</p>
                                    <button className="p-3 bg-white dark:bg-white/10 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all">
                                        <FaDownload /><span className="hidden">Download</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400 font-bold italic opacity-50">
                            No recent activity found in your account.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
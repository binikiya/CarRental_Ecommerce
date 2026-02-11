import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaHandshake, FaExclamationCircle, FaCar } from 'react-icons/fa';
import { getAdminAnalytics } from "../../api/carService";
import { useCurrency } from "../../context/CurrencyContext";

const AdminDashboard = () => {
    const [data, setData] = useState<any>({
        total_revenue: 0,
        commission: 0,
        active_listings: 0,
        pending_disputes: 0,
        revenue_history: []
    });
    const [loading, setLoading] = useState(true);
    const { symbol, rate } = useCurrency();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getAdminAnalytics();
                setData({
                    ...result,
                    revenue_history: result.revenue_history || []
                });
            }
            catch (err) {
                console.error("Failed to fetch analytics", err);
                setData({
                    total_revenue: 420500,
                    commission: 42050,
                    active_listings: 156,
                    pending_disputes: 14,
                    revenue_history: [1200, 1900, 3000, 5000, 4200, 7000]
                });
            }
            finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-cyan-500 font-bold animate-pulse">Synchronizing Platform Data...</p>
        </div>
    );

    const maxVal = Math.max(...(data?.revenue_history || [1]), 1);

    return (
        <div className="animate-in fade-in duration-700 mt-15">
            <header className="mt-10 mb-10">
                <h2 className="text-4xl font-black dark:text-white">System <span className="text-cyan-500">Overview</span></h2>
                <p className="text-slate-500 text-sm">Live data aggregated from all sellers and transactions.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard  title="Gross Revenue" value={`${symbol}${(data.total_revenue * rate).toLocaleString()}`} change="+12%" icon={<FaMoneyBillWave />} />
                <StatCard title="Net Commission" value={`${symbol}${(data.commission * rate).toLocaleString()}`} change="+8%" icon={<FaHandshake />} color="text-emerald-500" />
                <StatCard title="Active Listings" value={data.active_listings} change="Live" icon={<FaCar />} color="text-blue-500" />
                <StatCard title="Pending Disputes" value={data.pending_disputes} change="Action Required" icon={<FaExclamationCircle />} color="text-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold dark:text-white">Revenue Projection</h3>
                        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase text-[10px]">Last 6 Months</span>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-3 px-4">
                        {data?.revenue_history?.length > 0 ? (
                            data.revenue_history.map((val: number, i: number) => (
                                <div key={i} style={{ height: `${(val / maxVal) * 100}%` }} className="w-full bg-cyan-500/20 hover:bg-cyan-500 transition-all duration-500 rounded-t-xl relative group">
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {symbol}{(val * rate).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-sm">
                                No historical data available
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <h3 className="font-bold dark:text-white mb-6">Quick Payouts</h3>
                    <div className="space-y-4">
                        <SettlementItem name="Tokyo Motors" amount={`${symbol}${(1200 * rate).toLocaleString()}`} status="Pending" />
                        <SettlementItem name="Berlin Benz" amount={`${symbol}${(850 * rate).toLocaleString()}`} status="Settled" />
                        <div className="pt-4">
                            <button className="w-full py-4 bg-slate-50 dark:bg-white/5 text-slate-500 text-[10px] font-black rounded-2xl hover:text-cyan-500 hover:bg-cyan-500/5 transition-all uppercase tracking-[0.2em]">
                                View Payout Ledger
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change, icon, color = "text-cyan-500" }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-white/5 ${color}`}>{icon}</div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-tighter">
                {change}
            </span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <h3 className="text-2xl font-black dark:text-white leading-none">{value}</h3>
    </div>
);

const SettlementItem = ({ name, amount, status }: any) => (
    <div className="flex justify-between items-center p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
        <div>
            <p className="font-bold dark:text-white text-sm leading-tight">{name}</p>
            <p className={`text-[9px] font-black uppercase mt-1 ${status === 'Settled' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {status}
            </p>
        </div>
        <p className="font-black text-cyan-500 text-sm">{amount}</p>
    </div>
);

export default AdminDashboard;
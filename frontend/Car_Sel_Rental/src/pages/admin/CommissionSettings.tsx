import { useEffect, useState } from "react";
import { FaClock, FaCheckCircle, FaWallet, FaHandHoldingUsd, FaCloudDownloadAlt } from "react-icons/fa";
import { getCommissions, markCommissionPaid, exportCommissionCSV } from "../../api/carService";
import { useCurrency } from "../../context/CurrencyContext";
import toast from "react-hot-toast";

const CommissionSettings = () => {
    const [commissions, setCommissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { symbol, rate } = useCurrency();

    useEffect(() => {
        fetchCommissions();
    }, []);

    const fetchCommissions = async () => {
        try {
            const res = await getCommissions();
            setCommissions(res.data);
        } finally {
            setLoading(false);
        }
    };

    const handlePayout = async (id: number) => {
        try {
            await markCommissionPaid(id);
            toast.success("Payout confirmed!");
            fetchCommissions();
        } catch (err) {
            toast.error("Failed to update payout");
        }
    };

    const handleExport = async () => {
        try {
            const response = await exportCommissionCSV();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'commissions_report.csv');
            document.body.appendChild(link);
            link.click();
            toast.success("Report downloaded");
        }
        catch (err) {
            toast.error("Export failed");
        }
    };

    const totalEarned = commissions.filter(c => c.paid).reduce((acc, c) => acc + Number(c.amount), 0);
    const totalPending = commissions.filter(c => !c.paid).reduce((acc, c) => acc + Number(c.amount), 0);

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-emerald-500">CALCULATING EARNINGS...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 mt-15">
            <header>
                <h1 className="text-4xl font-black dark:text-white">Revenue <span className="text-emerald-500">& Settlements</span></h1>
                <p className="text-slate-500 text-sm">Track platform fees and manage seller payouts.</p>
            </header>

            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold rounded-xl hover:scale-105 transition-all">
                <FaCloudDownloadAlt /> Export CSV
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                    <FaWallet className="absolute right-[-20px] top-[-20px] text-white/10 text-9xl rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-80">Total Collected</p>
                    <h2 className="text-4xl font-black">{symbol}{(totalEarned * rate).toLocaleString()}</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                    <FaClock className="absolute right-[-20px] top-[-20px] text-slate-100 dark:text-white/5 text-9xl rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-slate-400">Pending Payouts</p>
                    <h2 className="text-4xl font-black dark:text-white">{symbol}{(totalPending * rate).toLocaleString()}</h2>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/5 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 dark:border-white/5">
                            <th className="p-6">Seller / Order</th>
                            <th className="p-6">Fee %</th>
                            <th className="p-6">Amount</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {commissions.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                <td className="p-6">
                                    <p className="font-bold dark:text-white">{c.seller_name || `Seller #${c.seller}`}</p>
                                    <p className="text-[10px] text-slate-500 font-mono">ORDER ID: {c.order}</p>
                                </td>
                                <td className="p-6">
                                    <span className="text-xs font-black text-slate-400">{c.percentage}%</span>
                                </td>
                                <td className="p-6 font-black dark:text-white text-sm">
                                    {symbol}{(c.amount * rate).toLocaleString()}
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 w-fit ${
                                        c.paid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {c.paid ? <FaCheckCircle /> : <FaClock />} {c.paid ? 'Paid' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    {!c.paid && (
                                        <button 
                                            onClick={() => handlePayout(c.id)}
                                            className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-xl hover:bg-emerald-600 transition-all flex items-center gap-2 ml-auto shadow-lg shadow-emerald-500/20"
                                        >
                                            <FaHandHoldingUsd /> Settle
                                        </button>
                                    )}
                                    {c.paid && (
                                        <span className="text-[10px] font-bold text-slate-400 italic">
                                            Processed on {new Date(c.paid_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CommissionSettings;
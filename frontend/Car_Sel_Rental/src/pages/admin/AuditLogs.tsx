import { useEffect, useState } from "react";
import { FaFingerprint, FaShieldAlt, FaGlobe, FaDesktop, FaClock, FaTrash } from "react-icons/fa";
import { getAuditLogs } from "../../api/carService";
import { format } from "date-fns";

const AuditLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuditLogs().then(res => {
            setLogs(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const getActionColor = (action: string) => {
        switch (action) {
            case 'delete': return 'text-red-500 bg-red-500/10';
            case 'payment': case 'order': return 'text-emerald-500 bg-emerald-500/10';
            case 'create': return 'text-cyan-500 bg-cyan-500/10';
            case 'login': return 'text-blue-500 bg-blue-500/10';
            default: return 'text-slate-500 bg-slate-500/10';
        }
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400">LOADING SECURITY TRAIL...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700 mt-15">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black dark:text-white">Security <span className="text-cyan-500">Audit Logs</span></h1>
                    <p className="text-slate-500 text-sm">Every administrative and system-level action recorded in real-time.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/5">
                    <FaShieldAlt className="text-cyan-500" />
                    <span className="text-[10px] font-black uppercase dark:text-white tracking-widest">Encrypted Ledger</span>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-white/5 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 dark:border-white/5">
                                <th className="p-6">Event</th>
                                <th className="p-6">User / Actor</th>
                                <th className="p-6">IP Address</th>
                                <th className="p-6">Source Device</th>
                                <th className="p-6 text-right">Timestamp</th>
                                <th className="p-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                    <td className="p-6">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 w-fit ${getActionColor(log.action)}`}>
                                            <FaFingerprint /> {log.action}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-sm font-bold dark:text-white">{log.user_email || "System/Anonymous"}</p>
                                        <p className="text-[9px] text-slate-500 uppercase font-black">ID: #{log.user || 'N/A'}</p>
                                    </td>
                                    <td className="p-6 text-sm dark:text-slate-300 font-mono italic">
                                        <div className="flex items-center gap-2">
                                            <FaGlobe className="text-slate-400" /> {log.ip_address}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 truncate max-w-[150px]">
                                            <FaDesktop /> {log.user_agent || "Unknown Agent"}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-xs font-bold dark:text-white">
                                            <FaClock className="text-cyan-500 text-[10px]" />
                                            {format(new Date(log.created_at), 'MMM dd, HH:mm:ss')}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="text-red-500 hover:text-red-400 transition-colors">
                                            <FaTrash />
                                        </button>
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

export default AuditLogs;
const AuditLogs = () => {
    const logs = [
        { id: 1, user: "Admin (Sajid)", action: "Changed Commission Rate", target: "System", time: "10 mins ago" },
        { id: 2, user: "Seller (Tokyo Motors)", action: "Deleted Product", target: "Nissan GTR", time: "1 hour ago" },
        { id: 3, user: "System", action: "User Suspension", target: "BadActor_99", time: "4 hours ago" },
    ];

    return (
        <div className="space-y-6 mt-15">
            <h1 className="text-3xl font-black dark:text-white">System <span className="text-cyan-500">Audit Logs</span></h1>
            
            <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-200 dark:border-white/5 divide-y divide-slate-100 dark:divide-white/5">
                {logs.map((log) => (
                    <div key={log.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400">
                                {log.id}
                            </div>
                            <div>
                                <p className="text-sm dark:text-white">
                                    <span className="font-bold text-cyan-500">{log.user}</span> {log.action}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Target: {log.target}</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditLogs;
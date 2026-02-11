import { useEffect, useState } from "react";
import { FaGavel, FaExclamationTriangle, FaCheckCircle, FaHistory } from "react-icons/fa";
import { getDisputes, resolveDispute } from "../../api/carService";
import toast from "react-hot-toast";

const ManageDisputes = () => {
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        try {
            const res = await getDisputes();
            setDisputes(res.data);
        }
        finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id: number) => {
        try {
            await resolveDispute(id);
            toast.success("Dispute marked as resolved");
            fetchDisputes();
        }
        catch (err) {
            toast.error("Failed to resolve dispute");
        }
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-red-500">SCANNING DISPUTES...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 mt-15">
            <header>
                <h1 className="text-4xl font-black dark:text-white">Conflict <span className="text-red-500">Resolution</span></h1>
                <p className="text-slate-500 text-sm italic">Mediate issues between buyers and sellers.</p>
            </header>

            <div className="grid gap-6">
                {disputes.map((dispute) => (
                    <div key={dispute.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-6 items-start">
                            <div className={`p-4 rounded-2xl ${dispute.status === 'open' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                <FaExclamationTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold dark:text-white text-lg">Order #{dispute.order}</h3>
                                <p className="text-slate-500 text-sm mt-1">"{dispute.reason}"</p>
                                <p className="text-[10px] font-black uppercase text-slate-400 mt-3 flex items-center gap-2">
                                    <FaHistory /> Filed on {new Date(dispute.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {dispute.status === 'open' ? (
                            <button 
                                onClick={() => handleResolve(dispute.id)}
                                className="px-8 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <FaGavel /> Resolve Case
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-500 font-black uppercase text-xs">
                                <FaCheckCircle /> Case Resolved
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageDisputes;
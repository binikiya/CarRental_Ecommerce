import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaHourglassHalf, FaStore, FaEnvelope, FaPhone } from "react-icons/fa";
import { getSellers, updateSellerStatus } from "../../api/carService";
import toast from "react-hot-toast";

const ManageSellers = () => {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const res = await getSellers();
            setSellers(res.data);
        }
        catch (err) {
            toast.error("Failed to load sellers");
        }
        finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: number, status: 'approved' | 'rejected') => {
        try {
            await updateSellerStatus(id, status);
            toast.success(`Seller ${status} successfully`);
            fetchSellers();
        }
        catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-20 text-center text-cyan-500 font-bold animate-pulse">Fetching Merchant Data...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-15">
            <header>
                <h1 className="text-4xl font-black dark:text-white">Seller <span className="text-cyan-500">Verification</span></h1>
                <p className="text-slate-500 text-sm mt-2">Manage business applications and marketplace trust levels.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {sellers.map((seller) => (
                    <div key={seller.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                            <div className="flex gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                    <FaStore size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black dark:text-white leading-tight">{seller.company_name}</h3>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-slate-500 flex items-center gap-2"><FaEnvelope className="text-cyan-500" /> {seller.business_email}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-2"><FaPhone className="text-cyan-500" /> {seller.business_phone}</p>
                                    </div>
                                </div>
                            </div>

                            <StatusBadge status={seller.verification_status} />
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-3">
                            {seller.verification_status !== 'approved' && (
                                <button 
                                    onClick={() => handleStatusChange(seller.id, 'approved')}
                                    className="flex-1 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <FaCheck /> Approve
                                </button>
                            )}
                            {seller.verification_status !== 'rejected' && (
                                <button 
                                    onClick={() => handleStatusChange(seller.id, 'rejected')}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <FaTimes /> Reject
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const icons: any = {
        pending: <FaHourglassHalf className="animate-spin-slow" />,
        approved: <FaCheck />,
        rejected: <FaTimes />,
    };

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border flex items-center gap-2 ${styles[status]}`}>
            {icons[status]} {status}
        </span>
    );
};

export default ManageSellers;
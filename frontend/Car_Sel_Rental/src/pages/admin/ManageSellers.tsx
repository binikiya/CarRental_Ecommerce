import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaStore, FaEnvelope, FaBan, FaUserCheck } from "react-icons/fa";
import { getSellers, toggleSellerVerify, toggleSellerStatus } from "../../api/carService";
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
        } catch (err) {
            toast.error("Failed to load sellers");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: number) => {
        try {
            await toggleSellerVerify(id);
            toast.success("Verification status updated");
            fetchSellers(); // Refresh list
        } catch (err) {
            toast.error("Action failed");
        }
    };

    const handleBan = async (id: number) => {
        if (!window.confirm("Are you sure you want to change this seller's status?")) return;
        try {
            await toggleSellerStatus(id);
            toast.success("Seller status updated");
            fetchSellers();
        } catch (err) {
            toast.error("Action failed");
        }
    };

    if (loading) return <div className="p-10 text-cyan-500 animate-pulse">Loading Global Sellers...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8">
                <h2 className="text-3xl font-black dark:text-white">Seller <span className="text-cyan-500">Management</span></h2>
                <p className="text-slate-500 text-sm italic">Review dealer credentials and account standing.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sellers.map((seller) => (
                    <div key={seller.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-4xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-xl transition-all">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 text-2xl">
                                <FaStore />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                                    {seller.shop_name || seller.user.username}
                                    {seller.is_verified && <FaCheckCircle className="text-emerald-500 text-sm" />}
                                </h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <FaEnvelope size={10} /> {seller.user.email}
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${seller.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {seller.status}
                                    </span>
                                    <span className="text-[9px] font-black uppercase px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500">
                                        ID: #{seller.id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-white/5">
                            <button 
                                onClick={() => handleVerify(seller.id)}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                    seller.is_verified 
                                    ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white' 
                                    : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                                }`}
                            >
                                <FaUserCheck /> {seller.is_verified ? 'Unverify' : 'Verify'}
                            </button>
                            
                            <button 
                                onClick={() => handleBan(seller.id)}
                                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                            >
                                <FaBan /> {seller.status === 'active' ? 'Ban' : 'Activate'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageSellers;
import { useEffect, useState } from "react";
import { FaCreditCard, FaTrash, FaPlus, FaCheckCircle, FaCcVisa, FaCcMastercard, FaCcPaypal, FaSync } from "react-icons/fa";
import { getPayments, deletePayment, setDefaultPayment } from "../../api/carService";
import AddPaymentModal from "../../components/AddPaymentModal";
import toast from "react-hot-toast";

const ManagePayments = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await getPayments();
            setPayments(res.data);
        } catch (err) {
            toast.error("Failed to load payment methods");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Remove this payment method?")) return;
        try {
            await deletePayment(id);
            toast.success("Card removed");
            setPayments(payments.filter(p => p.id !== id));
        } catch (err) {
            toast.error("Error removing card");
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultPayment(id);
            toast.success("Default payment updated");
            fetchPayments();
        } catch (err) {
            toast.error("Failed to update default");
        }
    };

    const getIcon = (brand: string = "") => {
        const b = brand.toLowerCase();
        if (b.includes('visa')) return <FaCcVisa size={32} className="text-blue-600" />;
        if (b.includes('mastercard')) return <FaCcMastercard size={32} className="text-red-500" />;
        if (b.includes('paypal')) return <FaCcPaypal size={32} className="text-blue-400" />;
        return <FaCreditCard size={32} className="text-slate-400" />;
    };

    if (loading) return (
        <div className="p-20 text-center animate-pulse">
            <FaSync className="animate-spin inline-block text-indigo-600 mb-4" size={32} />
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing Secure Vault...</p>
        </div>
    );

    return (
        <div className="space-y-8 mt-15 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black dark:text-white">Payment <span className="text-indigo-600">Methods</span></h1>
                    <p className="text-slate-500 text-sm italic">Securely manage your saved cards and accounts.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
                    <FaPlus /> Add Card
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {payments.length > 0 ? payments.map(method => (
                    <div key={method.id} className={`group p-8 rounded-[2.5rem] border relative overflow-hidden transition-all ${
                        method.is_default 
                        ? 'bg-indigo-600 border-transparent shadow-xl shadow-indigo-500/20' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5'
                    }`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div className={method.is_default ? "text-white" : ""}>
                                {getIcon(method.card_brand)}
                            </div>
                            {method.is_default ? (
                                <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">Primary</span>
                            ) : (
                                <button 
                                    onClick={() => handleSetDefault(method.id)}
                                    className="text-[8px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest"
                                >
                                    Set Default
                                </button>
                            )}
                        </div>
                        
                        <div className="mt-12 relative z-10">
                            <p className={`text-xl font-mono font-black tracking-[0.2em] italic ${method.is_default ? 'text-white' : 'dark:text-white'}`}>
                                •••• •••• •••• {method.last4}
                            </p>
                            
                            <div className="flex justify-between items-end mt-6">
                                <div>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${method.is_default ? 'text-white/60' : 'text-slate-400'}`}>Card Holder</p>
                                    <p className={`text-xs font-bold uppercase ${method.is_default ? 'text-white' : 'dark:text-white'}`}>
                                        {method.provider} User
                                    </p>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <div>
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${method.is_default ? 'text-white/60' : 'text-slate-400'}`}>Expires</p>
                                        <p className={`text-xs font-bold ${method.is_default ? 'text-white' : 'dark:text-white'}`}>
                                            {method.expiry_month}/{method.expiry_year}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(method.id)}
                                        className={`p-3 rounded-xl transition-all ${
                                            method.is_default 
                                            ? 'bg-white/10 text-white hover:bg-white/30' 
                                            : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                                        }`}
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {method.is_default && (
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                        )}
                    </div>
                )) : (
                    <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                        <FaCreditCard className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-400 font-bold italic">No payment methods saved yet.</p>

                        <div>
                            <AddPaymentModal 
                                isOpen={isModalOpen} 
                                onClose={() => setIsModalOpen(false)} 
                                onRefresh={fetchPayments} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePayments;
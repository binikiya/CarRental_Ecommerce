import { FaCreditCard, FaTrash, FaPlus, FaCheckCircle, FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";

const ManagePayments = () => {
    // ... logic for fetch and delete similar to addresses ...
    const payments = [
        { id: 1, provider: 'stripe', card_brand: 'Visa', last4: '4242', expiry_month: 12, expiry_year: 2028, is_default: true }
    ];

    const getIcon = (brand: string) => {
        if (brand.toLowerCase() === 'visa') return <FaCcVisa size={32} className="text-blue-600" />;
        if (brand.toLowerCase() === 'mastercard') return <FaCcMastercard size={32} className="text-red-500" />;
        return <FaCreditCard size={32} className="text-slate-400" />;
    };

    return (
        <div className="space-y-8 mt-15">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black dark:text-white">Payment <span className="text-indigo-600">Methods</span></h1>
                    <p className="text-slate-500 text-sm italic">Securely manage your saved cards and accounts.</p>
                </div>
                <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all">
                    <FaPlus /> Add Card
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {payments.map(method => (
                    <div key={method.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                            {getIcon(method.card_brand)}
                            {method.is_default && (
                                <span className="bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">Default</span>
                            )}
                        </div>
                        
                        <div className="mt-8">
                            <p className="text-lg font-mono font-black dark:text-white tracking-widest italic">
                                **** **** **** {method.last4}
                            </p>
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Expires</p>
                                    <p className="text-xs font-bold dark:text-white">{method.expiry_month}/{method.expiry_year}</p>
                                </div>
                                <button className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagePayments;
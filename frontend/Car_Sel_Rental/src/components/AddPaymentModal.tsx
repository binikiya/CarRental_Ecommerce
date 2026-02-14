import { useState, useEffect } from "react";
import { FaLock, FaTimes, FaCreditCard } from "react-icons/fa";
import { addPayments, getProfile } from "../api/carService";
import toast from "react-hot-toast";

const AddPaymentModal = ({ isOpen, onClose, onRefresh }: any) => {
    const [formData, setFormData] = useState({
        user: '',
        provider: 'stripe',
        card_brand: 'Visa',
        last4: '',
        expiry_month: '',
        expiry_year: '',
        is_default: false
    });

    useEffect(() => {
        getProfile().then(res => setFormData({...formData, user: res.data.id}));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                payment_token: `tok_mock_${Math.random().toString(36).substr(2, 9)}`
            };
            await addPayments(payload);
            toast.success("Payment method secured!");
            onRefresh();
            onClose();
        }
        catch (err) {
            toast.error("Failed to save card. Check expiry date.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
                <div className="p-8 space-y-6">
                    <header className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                                <FaLock size={18} />
                            </div>
                            <h2 className="text-xl font-black dark:text-white">Add <span className="text-indigo-600">Secure</span> Card</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors"><FaTimes /></button>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Card Brand</label>
                            <select 
                                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={e => setFormData({...formData, card_brand: e.target.value})}
                            >
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Last 4 Digits</label>
                            <input 
                                maxLength={4} placeholder="4242"
                                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={e => setFormData({...formData, last4: e.target.value})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Exp Month (MM)</label>
                                <input 
                                    placeholder="12" maxLength={2}
                                    className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none"
                                    onChange={e => setFormData({...formData, expiry_month: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Exp Year (YYYY)</label>
                                <input 
                                    placeholder="2028" maxLength={4}
                                    className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none"
                                    onChange={e => setFormData({...formData, expiry_year: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2">
                            <input 
                                type="checkbox" id="is_default"
                                onChange={e => setFormData({...formData, is_default: e.target.checked})}
                                className="w-5 h-5 accent-indigo-600 rounded-lg"
                            />
                            <label htmlFor="is_default" className="text-sm font-bold text-slate-500">Set as Primary Card</label>
                        </div>

                        <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 mt-4 flex items-center justify-center gap-2">
                            <FaCreditCard /> SAVE ENCRYPTED CARD
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPaymentModal;
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTimes, FaSave } from "react-icons/fa";
import { addAddress, getProfile } from "../api/carService";
import toast from "react-hot-toast";

const AddAddressModal = ({ isOpen, onClose, onRefresh }: any) => {
    const [formData, setFormData] = useState({
        user: '',
        full_name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'United States',
        address_type: 'billing',
        is_default: false
    });

    useEffect(() => {
        getProfile().then(res => setFormData({...formData, user: res.data.id}));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addAddress(formData);
            toast.success("Address saved successfully!");
            onRefresh();
            onClose();
        } catch (err) {
            toast.error("Failed to save address. Please check all fields.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
                <div className="p-8 space-y-6">
                    <header className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                                <FaMapMarkerAlt size={18} />
                            </div>
                            <h2 className="text-xl font-black dark:text-white">Add <span className="text-indigo-600">New</span> Address</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                            <FaTimes />
                        </button>
                    </header>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
                            <input 
                                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={e => setFormData({...formData, full_name: e.target.value})}
                                required placeholder="John Doe"
                            />
                        </div>

                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Phone Number</label>
                            <input 
                                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                required placeholder="+1 234 567 890"
                            />
                        </div>

                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Street Address</label>
                            <input 
                                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={e => setFormData({...formData, street: e.target.value})}
                                required placeholder="123 Luxury Lane"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">City</label>
                            <input 
                                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                required placeholder="Miami"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">State / Province</label>
                            <input 
                                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={e => setFormData({...formData, state: e.target.value})}
                                required placeholder="Florida"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Postal Code</label>
                            <input 
                                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={e => setFormData({...formData, postal_code: e.target.value})}
                                required placeholder="33101"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Address Type</label>
                            <select 
                                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={e => setFormData({...formData, address_type: e.target.value})}
                            >
                                <option value="billing">Billing</option>
                                <option value="shipping">Shipping</option>
                            </select>
                        </div>

                        <div className="col-span-2 flex items-center gap-3 p-2">
                            <input 
                                type="checkbox" id="is_default_addr"
                                onChange={e => setFormData({...formData, is_default: e.target.checked})}
                                className="w-5 h-5 accent-indigo-600 rounded-lg"
                            />
                            <label htmlFor="is_default_addr" className="text-sm font-bold text-slate-500">Set as Default Billing Address</label>
                        </div>

                        <button className="col-span-2 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 mt-4 flex items-center justify-center gap-2">
                            <FaSave /> SAVE ADDRESS
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAddressModal;
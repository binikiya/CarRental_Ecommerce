import { useEffect, useState } from "react";
import { FaSave, FaShieldAlt } from "react-icons/fa";
import { getSellerProfile, updateSellerProfile } from "../../api/carService";
import toast from "react-hot-toast";

const ShopSettings = () => {
    const [formData, setFormData] = useState({
        company_name: "",
        business_email: "",
        business_phone: "",
        verification_status: ""
    });

    useEffect(() => {
        getSellerProfile().then(res => setFormData(res.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSellerProfile(formData);
            toast.success("Shop profile updated!");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="max-w-2xl animate-in fade-in duration-700 mt-15">
            <header className="mb-10">
                <h1 className="text-4xl font-black dark:text-white">Shop <span className="text-emerald-500">Settings</span></h1>
                <p className="text-slate-500 text-sm mt-2">Update your public business profile and contact info.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-4 mb-6 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                    <FaShieldAlt className="text-emerald-500" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-emerald-600">Verification Status</p>
                        <p className="font-bold dark:text-white uppercase text-sm">{formData.verification_status}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Business Name</label>
                    <input 
                        type="text" 
                        value={formData.company_name}
                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Support Email</label>
                        <input 
                            type="email" 
                            value={formData.business_email}
                            onChange={(e) => setFormData({...formData, business_email: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Contact Phone</label>
                        <input 
                            type="text" 
                            value={formData.business_phone}
                            onChange={(e) => setFormData({...formData, business_phone: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 mt-4">
                    <FaSave /> Save Changes
                </button>
            </form>
        </div>
    );
};

export default ShopSettings;
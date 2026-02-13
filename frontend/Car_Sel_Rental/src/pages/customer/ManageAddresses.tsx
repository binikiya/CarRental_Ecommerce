import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPlus, FaTrash, FaCheckCircle, FaHome } from "react-icons/fa";
import { getAddresses, deleteAddress, setDefaultAddress } from "../../api/carService";
import toast from "react-hot-toast";

const ManageAddresses = () => {
    const [addresses, setAddresses] = useState<any[]>([]);
    
    useEffect(() => { fetchAddresses(); }, []);

    const fetchAddresses = async () => {
        const res = await getAddresses();
        setAddresses(res.data);
    };

    const handleSetDefault = async (id: number) => {
        await setDefaultAddress(id);
        toast.success("Default address updated");
        fetchAddresses();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 mt-15">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black dark:text-white">Saved <span className="text-indigo-600">Addresses</span></h1>
                    <p className="text-slate-500 text-sm italic">Manage your shipping and billing destinations.</p>
                </div>
                <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                    <FaPlus /> Add New
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                    <div key={addr.id} className={`p-6 rounded-[2rem] border-2 transition-all ${
                        addr.is_default ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/5' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900'
                    }`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${addr.is_default ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                                <FaHome size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full text-slate-500">
                                {addr.address_type}
                            </span>
                        </div>
                        
                        <div className="space-y-1">
                            <h3 className="font-black dark:text-white">{addr.full_name}</h3>
                            <p className="text-sm text-slate-500">{addr.street}</p>
                            <p className="text-sm text-slate-500">{addr.city}, {addr.state} {addr.postal_code}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{addr.country}</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                            {!addr.is_default ? (
                                <button onClick={() => handleSetDefault(addr.id)} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">
                                    Set as Default
                                </button>
                            ) : (
                                <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1">
                                    <FaCheckCircle /> Default
                                </span>
                            )}
                            <button onClick={() => deleteAddress(addr.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <FaTrash size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageAddresses;
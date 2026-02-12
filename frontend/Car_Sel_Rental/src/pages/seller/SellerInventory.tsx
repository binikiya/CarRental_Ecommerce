import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaCarSide, FaEye } from "react-icons/fa";
import { getMyCars, deleteCar, updateCarStatus } from "../../api/carService";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SellerInventory = () => {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchInventory(); }, []);

    const fetchInventory = async () => {
        try {
            const res = await getMyCars();
            setCars(res.data);
        } finally { setLoading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this vehicle permanently?")) return;
        await deleteCar(id);
        toast.success("Vehicle removed");
        fetchInventory();
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-emerald-500 font-black">FETCHING FLEET...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-15">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black dark:text-white">My <span className="text-emerald-500">Fleet</span></h1>
                    <p className="text-slate-500 text-sm italic">Manage your active listings and vehicle status.</p>
                </div>
                <Link to="/seller/add-car" className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                    <FaPlus /> Add New Vehicle
                </Link>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {cars.map(car => (
                    <div key={car.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-500/50 transition-all">
                        <div className="flex items-center gap-6 w-full">
                            <div className="w-24 h-16 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden flex items-center justify-center">
                                {car.main_image ? <img src={car.main_image} className="object-cover w-full h-full" /> : <FaCarSide className="text-slate-300" size={24}/>}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold dark:text-white">{car.brand} {car.model}</h3>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{car.year} • {car.category}</p>
                            </div>
                            <div className="hidden lg:block text-right px-8 border-x border-slate-100 dark:border-white/5">
                                <p className="text-[10px] font-black text-slate-400 uppercase">Daily Rate</p>
                                <p className="font-bold text-emerald-500">${car.price}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Link to={`/cars/${car.id}`} className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-500 hover:text-cyan-500 transition-all"><FaEye /></Link>
                            <Link to={`/seller/edit-car/${car.id}`} className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-500 hover:text-blue-500 transition-all"><FaEdit /></Link>
                            <button onClick={() => handleDelete(car.id)} className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerInventory;
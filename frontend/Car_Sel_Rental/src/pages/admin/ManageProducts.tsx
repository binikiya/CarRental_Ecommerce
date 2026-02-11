import { useState, useEffect } from "react";
import { FaTrash, FaExternalLinkAlt, FaStar, FaShieldAlt, FaFilter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getFilteredCars } from "../../api/carService";
import type { Car } from "../../data/cars";

const ManageProducts = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetching all cars for moderation
        getFilteredCars({}).then(data => {
            setCars(data);
            setLoading(false);
        });
    }, []);

    const handleDelete = (id: number) => {
        if(window.confirm("Are you sure you want to remove this listing?")) {
            // api.delete(`/cars/car/${id}/`);
            setCars(cars.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-8 mt-15">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black dark:text-white">Global <span className="text-cyan-500">Inventory</span></h1>
                    <p className="text-slate-500 text-sm">Moderate and manage all vehicle listings on the platform.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold dark:text-white hover:bg-slate-50 transition-all">
                        <FaFilter /> Filter Status
                    </button>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/5 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                            <th className="p-6">Vehicle Details</th>
                            <th className="p-6">Seller</th>
                            <th className="p-6">Pricing</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-10 text-center dark:text-slate-400">Loading inventory...</td></tr>
                        ) : (
                            cars.map((car: any) => (
                                <tr key={car.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5">
                                                <img 
                                                    src={car.images?.[0]?.image_file ? `http://localhost:8000${car.images[0].image_file}` : "/placeholder.png"} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold dark:text-white text-sm">{car.title}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold">{car.category_name} • {car.model_year}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 text-[10px]">
                                                <FaShieldAlt size={10} />
                                            </div>
                                            <span className="text-sm dark:text-slate-300 font-medium">{car.seller_name || "Unknown Seller"}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <p className="font-black dark:text-white text-sm">
                                            ${car.car_type === 'rent' ? `${car.price_per_day}/d` : car.price_sell?.toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                                            car.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                            {car.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/car/${car.id}`} className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 hover:text-cyan-500 transition-all">
                                                <FaExternalLinkAlt size={12} />
                                            </Link>
                                            <button className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 hover:text-amber-500 transition-all">
                                                <FaStar size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(car.id)}
                                                className="p-2.5 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;
import { useEffect, useState } from "react";
import { getCars, deleteCar } from "../api/carService";
import type { Car } from "../data/cars";
import { FaTrash, FaEdit, FaPlus, FaCar, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const SellerDashboard = () => {
    const [myCars, setMyCars] = useState<Car[]>([]);
    const navigate = useNavigate();

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            try {
                await deleteCar(id);
                setMyCars(myCars.filter(car => car.id !== id));
            }
            catch (error) {
                console.error("Failed to delete car", error);
                alert("Error deleting car.");
            }
        }
    };

    useEffect(() => {
        const fetchMyCars = async () => {
            const data = await getCars();
            setMyCars(data);
        };
        fetchMyCars();
    }, []);

    return (
        <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen mt-15">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black dark:text-white">Seller <span className="text-cyan-500">Hub</span></h1>
                    <Link to="/seller/add-car" className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-2xl font-bold transition-all">
                        <FaPlus /> List New Car
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard icon={<FaCar />} label="Active Listings" value={myCars.length} />
                    <StatCard icon={<FaEye />} label="Total Views" value={myCars.reduce((acc, car) => acc + (car.views_count || 0), 0)} />
                    <StatCard icon={<FaPlus />} label="Sold" value={myCars.filter(c => c.status === 'sold').length} />
                </div>

                {/* Listing Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-white/5 text-[10px] uppercase font-bold text-slate-500">
                            <tr>
                                <th className="p-6">Car Details</th>
                                <th className="p-6">Price</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {myCars.map((car) => (
                                <tr key={car.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={car.displayImage} className="w-12 h-12 rounded-xl object-cover" />
                                            <div>
                                                <p className="font-bold dark:text-white">{car.title}</p>
                                                <p className="text-xs text-slate-400">{car.category_name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 dark:text-white font-medium">
                                        {car.car_type === 'rent' ? `$${car.price_per_day}/day` : `$${car.price_sell}`}
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            car.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {car.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button onClick={() => navigate(`/seller/edit-car/${car.id}`)}className="p-2 mr-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-all" title="Edit Listing">
                                            <FaEdit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(car.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="Delete Listing">
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5">
        <div className="text-cyan-500 mb-2">{icon}</div>
        <p className="text-slate-500 text-xs font-bold uppercase">{label}</p>
        <p className="text-3xl font-black dark:text-white">{value}</p>
    </div>
);

export default SellerDashboard;
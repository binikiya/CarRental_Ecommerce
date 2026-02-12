import { useEffect, useState } from "react";
import { getCars, deleteCar } from "../../api/carService";
import type { Car } from "../../data/cars";
import { FaTrash, FaEdit, FaPlus, FaCar, FaSearch, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";

const SellerDashboard = () => {
    const [myCars, setMyCars] = useState<Car[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [carToDelete, setCarToDelete] = useState<number | null>(null);
    const [toast, setToast] = useState({ show: false, message: "" });
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const openDeleteModal = (id: number) => {
        setCarToDelete(id);
        setIsModalOpen(true);
    };

    const stats = {
        totalListings: myCars.length,
        activeListings: myCars.filter(car => car.status === 'active').length,
        soldListings: myCars.filter(car => car.status === 'sold').length,
        totalRevenue: myCars
            .filter(car => car.status === 'sold')
            .reduce((sum, car) => sum + (Number(car.price_sell) || 0), 0)
    };

    const handleConfirmDelete = async () => {
        if (carToDelete) {
            try {
                await deleteCar(carToDelete);
                setMyCars(myCars.filter(car => car.id !== carToDelete));
                setIsModalOpen(false);

                setToast({ show: true, message: "Vehicle listing removed successfully!" });
            }
            catch (error) {
                alert("Error deleting car");
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

    useEffect(() => {
        let results = myCars.filter((car) =>
            car.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (statusFilter !== "all") {
            results = results.filter((car) => car.status === statusFilter);
        }

        setFilteredCars(results);
    }, [searchQuery, statusFilter, myCars]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-15">
            <header className="flex justify-between items-center mt-10 mb-10">
                <div>
                    <h1 className="text-4xl font-black dark:text-white">My <span className="text-emerald-500">Fleet</span></h1>
                    <p className="text-slate-500 text-sm italic">Manage your active listings and vehicle status.</p>
                </div>
                <Link to="/seller/add-car" className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                    <FaPlus /> Add New Vehicle
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard  title="Total Cars" value={stats.totalListings} icon={<FaCar />} />
                <StatCard  title="Active" value={stats.activeListings} icon={<FaCheckCircle />} />
                <StatCard  title="Revenue" value={'$'+stats.totalRevenue.toLocaleString()} icon={'$'} />
                <StatCard  title="Sold" value={stats.soldListings} icon={<FaPlus />} />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search your inventory..." className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                        {['all', 'active', 'sold'].map((status) => (
                            <button key={status} onClick={() => setStatusFilter(status)} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                    statusFilter === status 
                                    ? "bg-white dark:bg-slate-800 text-cyan-500 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                {filteredCars.length > 0 ? (
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
                                        <button onClick={() => openDeleteModal(car.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                            <FaTrash size={16} />
                                        </button>

                                        <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} title="Delete Listing?" message="Are you sure you want to remove this vehicle? This action will permanently delete all photos and data associated with it." />
                                        <Toast isOpen={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 mb-4 text-slate-400">
                            <FaCar size={24} />
                        </div>
                        <h3 className="text-lg font-bold dark:text-white">No vehicles found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
                        <button 
                            onClick={() => {setSearchQuery(""); setStatusFilter("all");}}
                            className="mt-4 text-cyan-500 text-sm font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">{icon}</div>
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">{title}</p>
                <h3 className="text-2xl font-black dark:text-white">{value}</h3>
            </div>
        </div>
    </div>
);


export default SellerDashboard;
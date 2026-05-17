import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGasPump, FaRegHeart, FaArrowRight } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { GiGearStickPattern } from "react-icons/gi";
import { getCars } from "../api/carService";
import type { Car } from "../data/cars";

const categories = ["All", "Electric", "Hybrid", "Luxury", "Sport"];

const FeaturedCars = () => {
    const [filter, setFilter] = useState("All");
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getCars();
                setCars(data);
            }
            catch (error) {
                console.error("Failed to load cars", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const filteredCars = filter === "All" 
        ? cars 
        : cars.filter(car => car.category_name === filter);

    if (loading) {
        return (
            <div className="py-24 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                <p className="dark:text-white font-bold">Scanning Inventory...</p>
            </div>
        );
    }

    return (
        <section className="py-24 bg-white dark:bg-slate-950 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                            Featured <span className="text-cyan-500">Inventory</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md">
                            Explore our meticulously inspected collection of premium vehicles. 
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl w-fit">
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    filter === cat 
                                    ? "bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-lg" 
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-4xl">
                            <p className="dark:text-slate-400 font-medium">No cars found matching these filters.</p>
                            <button onClick={() => setFilter("All")} className="mt-4 text-cyan-500 font-bold hover:underline">Clear category filter</button>
                        </div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <Link to="/cars" className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold group">
                        Explore Full Catalog 
                        <span className="p-2 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                            <FaArrowRight />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

const CarCard = ({ car }: { car: any }) => {
    const isSoldOut = car.quantity === 0;

    return (
        <div className="animate-fade-in group relative rounded-4xl border transition-all duration-500
            bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 hover:border-cyan-500/50 overflow-hidden shadow-sm hover:shadow-2xl">
            
            <div className="relative h-64 overflow-hidden m-3 rounded-3xl">
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                    {car.tag}
                </div>

                {!isSoldOut && (
                    <button className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-red-500 transition-colors">
                        <FaRegHeart size={14} />
                    </button>
                )}

                {isSoldOut && (
                    <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-6 py-2 bg-red-600 text-white font-black uppercase tracking-widest rounded-full shadow-xl shadow-red-500/40 border-2 border-white/20 scale-110">
                            Sold Out
                        </span>
                    </div>
                )}

                <img 
                    src={car.displayImage} 
                    alt={car.title} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${isSoldOut ? 'grayscale' : 'group-hover:scale-110'}`} 
                />
            </div>

            <div className="p-6 pt-2">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-tighter">{car.category_name}</span>
                        <p className={`text-[10px] font-bold mt-1 ${isSoldOut ? 'text-red-500' : 'text-green-500'}`}>
                            {isSoldOut ? 'Out of Stock' : `Stock: ${car.quantity} available`}
                        </p>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-none mt-1">{car.title}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Price</p>
                        <p className={`text-lg font-black ${isSoldOut ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                            {car.price_sell 
                                ? `$${Number(car.price_sell).toLocaleString()}` 
                                : `$${Number(car.price_per_day).toLocaleString()}/day`
                            }
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 mb-6">
                    <div className="flex flex-col items-center gap-1">
                        <IoSpeedometerOutline className="text-cyan-500" size={16} />
                        <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400">{car.speed} KM/H</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-slate-200 dark:border-white/10">
                        <FaGasPump className="text-cyan-500" size={14} />
                        <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">{car.fuel_type}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <GiGearStickPattern className="text-cyan-500" size={16} />
                        <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">{car.transmission}</span>
                    </div>
                </div>

                {isSoldOut ? (
                    <div className="w-full py-4 text-center rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
                        Unavailable
                    </div>
                ) : (
                    <Link to={`/car/${car.id}`} className="block w-full py-4 text-center rounded-2xl font-bold transition-all duration-300
                        bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-cyan-500 dark:hover:bg-cyan-400">
                        View Details
                    </Link>
                )}
            </div>
        </div>
    );
};

export default FeaturedCars;
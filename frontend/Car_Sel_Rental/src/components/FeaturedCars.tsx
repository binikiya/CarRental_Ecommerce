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
        : cars.filter(car => car.category === filter);

    if (loading) {
        return <div className="py-24 text-center dark:text-white">Loading Inventory...</div>;
    }

    return (
        <section className="py-24 transition-colors duration-500 bg-white dark:bg-slate-950 px-6">
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
                        <div className="col-span-full text-center py-10 dark:text-slate-400">
                            No cars found in this category.
                        </div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <button className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold group">
                        Explore Full Catalog 
                        <span className="p-2 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                            <FaArrowRight />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

const CarCard = ({ car }: { car: any }) => (
    <div className="animate-fade-in group relative rounded-4xl border transition-all duration-500
        bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 hover:border-cyan-500/50 overflow-hidden shadow-sm hover:shadow-2xl">
        <div className="relative h-64 overflow-hidden m-3 rounded-3xl">
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                {car.tag}
            </div>
            <button className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-red-500 transition-colors">
                <FaRegHeart size={14} /> <span className="sr-only">Add to Wishlist</span>
            </button>
            <img src={car.displayImage} alt={car.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>

        <div className="p-6 pt-2">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-tighter">{car.category_name}</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-none mt-1">{car.title}</h3>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Price</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">${car.price_sell}</p>
                </div>
            </div>

            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 mb-6">
                <div className="flex flex-col items-center gap-1">
                    <IoSpeedometerOutline className="text-cyan-500" size={18} />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{car.speed} KM/H</span>
                </div>
                <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10" />
                    <div className="flex flex-col items-center gap-1">
                        <FaGasPump className="text-cyan-500" size={16} />
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">{car.fuel_type}</span>
                    </div>
                <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10" />
                <div className="flex flex-col items-center gap-1">
                    <GiGearStickPattern className="text-cyan-500" size={18} />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">{car.transmission}</span>
                </div>
            </div>

            <Link to={`/car/${car.id}`} className="block w-full py-4 text-center rounded-2xl font-bold transition-all duration-300
                bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-cyan-500 dark:hover:bg-cyan-400">
                View Details
            </Link>
        </div>
    </div>
);

export default FeaturedCars;
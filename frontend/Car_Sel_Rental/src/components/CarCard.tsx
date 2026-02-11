import { Link } from "react-router-dom";
import { FaGasPump, FaCogs, FaTachometerAlt } from "react-icons/fa";

interface CarCardProps {
    car: any;
}

const CarCard = ({ car }: CarCardProps) => {
    const mainImage = car.images && car.images.length > 0 
        ? cars 
        : cars.filter(car => car.category_name === filter);

    return (
        <Link to={`/car/${car.id}`} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2">
            <div className="relative h-64 overflow-hidden">
                <img src={mainImage} alt={car.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                    For {car.car_type === 'rent' ? 'Rent' : 'Sale'}
                </div>

                <div className="absolute bottom-4 right-4 px-5 py-2 rounded-2xl bg-cyan-500 text-slate-950 font-black text-lg shadow-xl">
                    ${car.car_type === 'rent' ? `${car.price_per_day}/d` : car.price_sell?.toLocaleString()}
                </div>
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-black dark:text-white group-hover:text-cyan-500 transition-colors truncate">
                        {car.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium capitalize">{car.category_name} • {car.model_year}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex flex-col items-center gap-1">
                        <FaGasPump className="text-cyan-500" size={14} />
                        <span className="text-[10px] font-bold dark:text-slate-400 uppercase">{car.fuel_type}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-slate-100 dark:border-white/5">
                        <FaCogs className="text-cyan-500" size={14} />
                        <span className="text-[10px] font-bold dark:text-slate-400 uppercase">{car.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <FaTachometerAlt className="text-cyan-500" size={14} />
                        <span className="text-[10px] font-bold dark:text-slate-400 uppercase">{car.mileage}km</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Available Now
                    </span>
                    <div className="text-cyan-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
                        View Details →
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;
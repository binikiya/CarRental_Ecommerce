import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCarById } from "../api/carService";
import type { Car } from "../data/cars";


const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState<Car | null>(null);
    const [activeImage, setActiveImage] = useState<string>("");

    useEffect(() => {
        const fetchDetails = async () => {
            if (id) {
                const data = await getCarById(id);
                setCar(data);
                setActiveImage(data.displayImage);
            }
        };
        fetchDetails();
    }, [id]);

    if (!car) return <div className="p-20 text-center">Loading details...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10 bg-slate-100">
            <div className="space-y-4">
                <div className="h-[500px] rounded-3xl overflow-hidden bg-slate-100">
                    <img 
                        src={activeImage} 
                        className="w-full h-full object-cover transition-all duration-500" 
                        alt={car.title} 
                    />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {car.images?.map((img, index) => (
                        <button key={index} onClick={() => setActiveImage(img.image_url)}
                            className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                                activeImage === img.image_url ? "border-cyan-500 scale-95" : "border-transparent"
                            }`}>
                            <img alt="" src={img.image_url} className="w-full h-full object-cover" />
                            <span className="sr-only">Thumbnail {index + 1}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold uppercase">
                        {car.category_details?.name}
                    </span>
                    <h1 className="text-4xl font-black mt-2 dark:text-white">{car.title}</h1>
                </div>

                <div className="flex items-center gap-4 text-2xl font-bold text-slate-900 dark:text-white">
                    {car.car_type === 'rent' ? (
                        <span>${car.price_per_day} <span className="text-sm font-normal text-slate-500">/ Day</span></span>
                    ) : (
                        <span>${car.price_sell}</span>
                    )}
                </div>

                <p className="text-slate-500 leading-relaxed">{car.description}</p>

                <div className="grid grid-cols-2 gap-4">
                    <SpecItem label="Year" value={car.model_year} />
                    <SpecItem label="Transmission" value={car.transmission} />
                    <SpecItem label="Fuel" value={car.fuel_type} />
                    <SpecItem label="Mileage" value={`${car.mileage} km`} />
                </div>
            </div>
        </div>
    );
};

const SpecItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-center">
        <div className="text-cyan-500 text-xl flex justify-center mb-1">{icon}</div>
        <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
);

export default CarDetails;
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCarById } from "../api/carService";
import { getCarDetails } from "../api/carService";
import { FaGasPump, FaCogs, FaTachometerAlt, FaCalendarAlt, FaEnvelope } from "react-icons/fa";
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

    useEffect(() => {
        getCarDetails(id!).then(data => {
            setCar(data);
            setActiveImage(data.displayImage || "");
        });
    }, [id]);

    if (!car) return <div className="p-20 text-center">Loading details...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <div className="rounded-4xl overflow-hidden bg-slate-200 dark:bg-slate-900 aspect-video mb-4">
                        <img src={activeImage} className="w-full h-full object-cover" alt={car.title} />
                    </div>
                    
                    <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
                        {car.images?.map((img, index) => (
                            <button key={index} onClick={() => setActiveImage(img.image_url)}
                                className={`w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 
                                    ${activeImage === img.image_url  ? 'border-cyan-500' : 'border-transparent'}`}
                            >
                                <img alt="" src={img.image_url} className="w-full h-full object-cover" />
                                <span className="sr-only">Thumbnail {index + 1}</span>
                            </button>
                        ))}
                    </div>

                    <h1 className="text-4xl font-black dark:text-white mb-4">{car.title}</h1>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        <SpecItem icon={<FaGasPump />} label="Fuel" value={car.fuel_type} />
                        <SpecItem icon={<FaCogs />} label="Transmission" value={car.transmission} />
                        <SpecItem icon={<FaTachometerAlt />} label="Mileage" value={`${car.mileage} km`} />
                        <SpecItem icon={<FaCalendarAlt />} label="Year" value={car.model_year} />
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-xl font-bold mb-4">Description</h3>
                        <p className="text-slate-500 leading-relaxed">{car.description}</p>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-28 p-8 rounded-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-xl">
                        <div className="mb-6">
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Price</p>
                            <h2 className="text-4xl font-black text-cyan-500">
                                ${car.car_type === 'rent' ? `${Number(car.price_per_day).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}/day` : `${Number(car.price_sell).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <button className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/20">
                                Book This Car
                            </button>
                            <a href={`mailto:${car.seller_email}`} className="w-full py-4 flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                                <FaEnvelope /> Contact Seller
                            </a>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Listed By</p>
                            <p className="font-bold dark:text-white">{car.seller_name || "DriveX Verified Seller"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SpecItem = ({ icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
        <div className="text-cyan-500 mb-2 flex justify-center">{icon}</div>
        <p className="text-[10px] text-slate-400 uppercase font-bold">{label}</p>
        <p className="text-sm font-bold dark:text-white capitalize">{value}</p>
    </div>
);

export default CarDetails;
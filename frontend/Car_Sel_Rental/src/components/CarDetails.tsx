import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaGasPump, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { IoSpeedometerOutline, IoLocationOutline } from "react-icons/io5";
import { GiGearStickPattern } from "react-icons/gi";
import { MdOutlineSecurity } from "react-icons/md";
import { carData } from "../data/cars";

const CarDetails = () => {
    const { id } = useParams(); // Gets the ID from the URL

    const car = carData.find((c) => c.id === Number(id));

    const [selectedImage, setSelectedImage] = useState(car?.image);
    const navigate = useNavigate();

    if (!car) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <button onClick={() => navigate('/')} className="text-cyan-500">Car not found. Return Home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cyan-500 transition-colors mb-8 group">
                    <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Inventory
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-slate-100 dark:bg-slate-900">
                            <img src={selectedImage} alt="Car Detail" className="w-full h-full object-cover animate-fade-in" />
                            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-widest">
                                Premium Listing
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">
                                        {car.name} <span className="text-cyan-500">2026</span>
                                    </h1>
                                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1 text-sm">
                                            <IoLocationOutline className="text-cyan-500" /> Berlin, Germany
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <FaCalendarAlt className="text-cyan-500" /> 2026 Model
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">$45,095</p>
                                    <p className="text-sm text-cyan-600 dark:text-cyan-400 font-bold">Excl. Taxes</p>
                                </div>
                            </div>

                            <hr className="border-slate-200 dark:border-white/10" />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <SpecItem icon={<IoSpeedometerOutline />} label="Top Speed" value="160 km/h" />
                                <SpecItem icon={<FaGasPump />} label="Engine" value="Electric" />
                                <SpecItem icon={<GiGearStickPattern />} label="Transmission" value="Automatic" />
                                <SpecItem icon={<MdOutlineSecurity />} label="Warranty" value="5 Years" />
                            </div>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Vehicle Description</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    The 2026 ID.4 represents a major leap in electric mobility. With an upgraded battery 
                                    architecture and the latest software suite, it offers unparalleled comfort and 
                                    range. This specific model comes with the premium "Obsidian" package, 
                                    featuring exclusive interior finishes and advanced drive assist.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Sidebar (1 Column) */}
                    <div className="space-y-6">
                        <div className="sticky top-28 p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Inquiry & Booking</h3>
                            
                            <form className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Full Name</label>
                                    <input type="text" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 outline-none focus:border-cyan-500 transition-colors dark:text-white" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Email Address</label>
                                    <input type="email" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 outline-none focus:border-cyan-500 transition-colors dark:text-white" placeholder="john@example.com" />
                                </div>
                                <button type="button" className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                                    Request a Test Drive
                                </button>
                            </form>

                            <div className="mt-8 space-y-3">
                                <FeatureCheck text="Verified Seller" />
                                <FeatureCheck text="Accident Free" />
                                <FeatureCheck text="Full Service History" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Sub-components for cleaner code
const SpecItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-center">
        <div className="text-cyan-500 text-xl flex justify-center mb-1">{icon}</div>
        <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
);

const FeatureCheck = ({ text }: { text: string }) => (
    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <FaCheckCircle className="text-cyan-500" />
        {text}
    </div>
);

export default CarDetails;
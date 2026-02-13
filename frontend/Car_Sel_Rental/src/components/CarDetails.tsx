import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { getCarDetails, bookCar, contactSeller } from "../api/carService";
import { FaGasPump, FaCogs, FaTachometerAlt, FaCalendarAlt, FaEnvelope, FaSpinner, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState<any | null>(null);
    const [activeImage, setActiveImage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [showInquiry, setShowInquiry] = useState(false);
    const [message, setMessage] = useState("Is this car still available? I'm interested.");

    useEffect(() => {
        if (id) {
            getCarDetails(id).then(data => {
                setCar(data);
                setActiveImage(data.displayImage || (data.images?.[0]?.image_url) || "");
            }).catch(() => toast.error("Could not load car details."));
        }
    }, [id]);

    const handleBooking = async () => {
        setLoading(true);
        try {
            const res = await bookCar(Number(id));
            toast.success(`Order ${res.data.order_number} created!`);
            navigate(`/customer/orders`); 
        }
        catch (err: any) {
            toast.error(err.response?.data?.error || "Please login to book this car.");
        }
        finally {
            setLoading(false);
        }
    };

    const handleContactSubmit = async () => {
        try {
            await contactSeller(Number(id), message);
            toast.success("Message sent to seller!");
            setShowInquiry(false);
        }
        catch (err) {
            toast.error("Failed to send message.");
        }
    };

    if (!car) return (
        <div className="p-40 text-center animate-pulse text-cyan-500 font-black tracking-widest">
            SYNCHRONIZING DATA...
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-24 animate-in fade-in duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <div className="rounded-[3rem] overflow-hidden bg-slate-200 dark:bg-slate-900 aspect-video mb-6 shadow-2xl group">
                        <img src={activeImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={car.title} />
                    </div>
                    
                    <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
                        {car.images?.map((img: any, index: number) => (
                            <button key={index} onClick={() => setActiveImage(img.image_url)}
                                className={`w-28 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 shadow-sm
                                    ${activeImage === img.image_url ? 'border-cyan-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img alt="" src={img.image_url} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <h1 className="text-5xl font-black dark:text-white mb-6 tracking-tighter">{car.title}</h1>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <SpecItem icon={<FaGasPump />} label="Fuel" value={car.fuel_type} />
                        <SpecItem icon={<FaCogs />} label="Transmission" value={car.transmission} />
                        <SpecItem icon={<FaTachometerAlt />} label="Mileage" value={`${car.mileage} km`} />
                        <SpecItem icon={<FaCalendarAlt />} label="Year" value={car.model_year} />
                    </div>

                    <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                        <h3 className="text-xl font-black mb-4 dark:text-white uppercase tracking-widest text-xs text-cyan-500">Full Description</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">{car.description}</p>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-28 p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-2xl">
                        <div className="mb-8">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Asking Price</p>
                            <h2 className="text-5xl font-black text-cyan-500 tracking-tighter">
                                ${car.car_type === "rent"
                                    ? `${Number(car.price_per_day).toLocaleString()}/day` 
                                    : `${Number(car.price_sell).toLocaleString()}`
                                }
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={handleBooking}
                                disabled={loading}
                                className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-[1.5rem] transition-all shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                {car.is_for_rent ? "BOOK RENTAL" : "BUY THIS CAR"}
                            </button>

                            <button 
                                onClick={() => setShowInquiry(!showInquiry)}
                                className="w-full py-5 flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-[1.5rem] hover:opacity-90 transition-all shadow-lg"
                            >
                                <FaEnvelope /> {showInquiry ? "CANCEL MESSAGE" : "CONTACT SELLER"}
                            </button>

                            {/* Inquiry Form Toggle */}
                            {showInquiry && (
                                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl mt-4 space-y-4 animate-in slide-in-from-top-4 duration-300">
                                    <textarea 
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl text-sm dark:text-white border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-cyan-500"
                                        placeholder="Type your message..."
                                    />
                                    <button 
                                        onClick={handleContactSubmit}
                                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
                                    >
                                        SEND ENQUIRY
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">DriveX Verified Dealer</p>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-bold">
                                    {car.seller_name?.charAt(0) || "S"}
                                </div>
                                <p className="font-black dark:text-white">{car.seller_name || "DriveX Premium Seller"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SpecItem = ({ icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center hover:border-cyan-500/30 transition-colors">
        <div className="text-cyan-500 mb-2 flex justify-center text-xl">{icon}</div>
        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black dark:text-white capitalize">{value}</p>
    </div>
);

export default CarDetails;
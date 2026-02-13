import { useEffect, useState } from "react";
import { FaHeart, FaTrash, FaShoppingCart } from "react-icons/fa";
import { getWishlist, toggleWishlist } from "../../api/carService";
import { useCurrency } from "../../context/CurrencyContext";
import toast from "react-hot-toast";

const WishlistPage = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { symbol, rate } = useCurrency();

    useEffect(() => { fetchWishlist(); }, []);

    const fetchWishlist = async () => {
        try {
            const res = await getWishlist();
            setItems(res.data);
        } finally { setLoading(false); }
    };

    const handleRemove = async (carId: number) => {
        await toggleWishlist(carId);
        toast.success("Removed from wishlist");
        fetchWishlist();
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-indigo-500 font-black italic">SEARCHING YOUR GARAGE...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 mt-15">
            <header>
                <h1 className="text-4xl font-black dark:text-white">My <span className="text-indigo-600">Wishlist</span></h1>
                <p className="text-slate-500 text-sm italic">Cars you’re keeping an eye on.</p>
            </header>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5">
                    <FaHeart className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-bold">Your wishlist is empty. Start exploring!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                            <div className="relative h-48 bg-slate-100 dark:bg-white/5">
                                <img src={item.car_details.main_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <button 
                                    onClick={() => handleRemove(item.car)}
                                    className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-2xl text-red-500 shadow-xl"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="font-black dark:text-white text-lg">{item.car_details.brand} {item.car_details.model}</h3>
                                <p className="text-indigo-600 font-black text-xl mt-2">{symbol}{(item.car_details.price * rate).toLocaleString()}</p>
                                <button className="w-full mt-6 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                                    <FaShoppingCart /> View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
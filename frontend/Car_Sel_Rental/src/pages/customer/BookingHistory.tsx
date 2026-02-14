import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaFilePdf, FaBan, FaSync } from "react-icons/fa";
import { MdIncompleteCircle } from "react-icons/md";
import { getOrders, requestOrderCancel } from "../../api/carService";
import { useCurrency } from "../../context/CurrencyContext";
import toast from "react-hot-toast";

const BookingHistory = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { symbol, rate } = useCurrency();
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await getOrders();
            setOrders(res.data);
        }
        catch (err) {
            toast.error("Failed to load booking history");
        }
        finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: number) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        
        try {
            await requestOrderCancel(id);
            toast.success("Cancellation request submitted.");
            fetchHistory();
        } catch (err) {
            toast.error("Unable to cancel at this time.");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <FaSync className="animate-spin text-indigo-600 text-3xl" />
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Fetching your history...</p>
        </div>
    );

    return (
        <div className="space-y-6 mt-15 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <h2 className="text-4xl font-black dark:text-white">Booking <span className="text-indigo-600">History</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase pb-1">{orders.length} total records</p>
            </div>
            
            <div className="space-y-4">
                {orders.length > 0 ? orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <span className={`w-2 h-12 rounded-full shrink-0 ${order.order_type === 'rent' ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'}`}></span>

                            <div>
                                <h4 className="font-bold dark:text-white text-lg">
                                    {order.items && order.items.length > 0 ? order.items[0].car_name : `Order #${order.order_number}`}
                                </h4>
                                <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 mt-1">
                                    <FaCalendarAlt className="text-indigo-500" /> {new Date(order.created_at).toLocaleDateString()} • {order.order_number}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                            <div className="text-left md:text-right">
                                <p className="font-black text-xl dark:text-white">
                                    {symbol}{(order.total_amount * rate).toLocaleString()}
                                </p>
                                <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${
                                    order.payment_status === 'paid' || order.payment_status === 'completed' 
                                    ? 'text-emerald-500' 
                                    : order.payment_status === 'canceled' ? 'text-red-500' : 'text-indigo-500'
                                }`}>
                                    {order.payment_status}
                                </p>
                            </div>
                            
                            <div className="flex gap-2">
                                {order.payment_status === 'pending' && (
                                    <button title="Complete Payment"
                                        onClick={() => navigate(`/customer/checkout/${order.id}`)}
                                        className="px-4 py-2 bg-indigo-50 dark:bg-white/5 text-blue-400 rounded-2xl hover:text-green-600 hover:bg-blue-200 font-black rounded-lg uppercase"
                                    >
                                        <MdIncompleteCircle  size={18}/>
                                    </button>
                                )}

                                <button 
                                    title="Download Invoice" 
                                    className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                                >
                                    <FaFilePdf size={18} />
                                </button>

                                {['pending', 'paid'].includes(order.payment_status) && (
                                    <button 
                                        onClick={() => handleCancel(order.id)}
                                        title="Request Cancellation" 
                                        className="p-4 bg-red-500/5 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <FaBan size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-slate-400 font-bold italic text-sm">You haven't made any bookings yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
import { useEffect, useState } from "react";
import { FaBoxOpen, FaCalendarAlt, FaCreditCard, FaShippingFast, FaCheckDouble } from "react-icons/fa";
import { getOrders, updateOrderStatus } from "../../api/carService";
import { useCurrency } from "../../context/CurrencyContext";
import toast from "react-hot-toast";

const ManageOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { symbol, rate } = useCurrency();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await getOrders();
            setOrders(res.data);
        }
        finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await updateOrderStatus(id, status);
            toast.success(`Order marked as ${status}`);
            fetchOrders();
        }
        catch (err) {
            toast.error("Status update failed");
        }
    };

    if (loading) return <div className="p-20 text-center text-cyan-500 font-black animate-pulse">ORGANIZING ORDERS...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 mt-15">
            <header>
                <h1 className="text-4xl font-black dark:text-white">Order <span className="text-cyan-500">Fullfillment</span></h1>
                <p className="text-slate-500 text-sm italic">Manage sales and rental schedules.</p>
            </header>

            <div className="grid gap-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 dark:bg-white/5">
                            <div>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Order ID</span>
                                <h3 className="font-bold dark:text-white uppercase">#{order.order_number}</h3>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                                    order.order_type === 'rent' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                    {order.order_type}
                                </span>
                                <span className="text-lg font-black dark:text-white">{symbol}{(order.total_amount * rate).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Items Part */}
                        <div className="p-6 space-y-4">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" /> {/* Placeholder for image */}
                                        <div>
                                            <p className="font-bold dark:text-white text-sm">{item.car_name}</p>
                                            {order.order_type === 'rent' && (
                                                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                                                    <FaCalendarAlt className="text-cyan-500" /> {item.rental_start_date} → {item.rental_end_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="font-black text-cyan-500 text-sm">{symbol}{(item.price_snapshot * rate).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 flex flex-wrap justify-between items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="text-xs">
                                    <p className="text-slate-500 uppercase font-black text-[9px]">Customer</p>
                                    <p className="font-bold dark:text-white">{order.customer_email}</p>
                                </div>
                                <div className="text-xs">
                                    <p className="text-slate-500 uppercase font-black text-[9px]">Payment via</p>
                                    <p className="font-bold dark:text-white uppercase flex items-center gap-1"><FaCreditCard size={10}/> {order.payment_provider}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {order.payment_status === 'paid' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                                        className="px-6 py-2.5 bg-emerald-500 text-white text-[10px] font-black rounded-xl hover:bg-emerald-600 transition-all flex items-center gap-2"
                                    >
                                        <FaCheckDouble /> COMPLETE ORDER
                                    </button>
                                )}
                                {order.payment_status === 'pending' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(order.id, 'canceled')}
                                        className="px-6 py-2.5 bg-red-500/10 text-red-500 text-[10px] font-black rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        CANCEL
                                    </button>
                                )}
                                <StatusLabel status={order.payment_status} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StatusLabel = ({ status }: { status: string }) => {
    const colors: any = {
        pending: "text-amber-500",
        paid: "text-emerald-500",
        completed: "text-cyan-500",
        canceled: "text-slate-400"
    };
    return (
        <div className={`px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest ${colors[status]}`}>
            {status}
        </div>
    );
};

export default ManageOrders;
import { useEffect, useState } from "react";
import { FaDownload, FaHeadset, FaChevronRight } from "react-icons/fa";
import { getOrders } from "../../api/carService";
import { useCurrency } from "../../context/CurrencyContext";

const MyOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const { symbol, rate } = useCurrency();

    useEffect(() => {
        getOrders().then(res => setOrders(res.data));
    }, []);

    const getStatusStyle = (status: string) => {
        const base = "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ";
        switch (status) {
            case 'paid': return base + "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case 'pending': return base + "bg-amber-500/10 text-amber-500 border-amber-500/20";
            default: return base + "bg-slate-500/10 text-slate-500 border-slate-500/20";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 mt-15">
            <header>
                <h1 className="text-4xl font-black dark:text-white">Order <span className="text-indigo-600">History</span></h1>
                <p className="text-slate-500 text-sm italic">Track your deliveries and rental periods.</p>
            </header>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 dark:border-white/5 flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                                <p className="font-bold dark:text-white uppercase">#{order.order_number}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={getStatusStyle(order.payment_status)}>{order.payment_status}</span>
                                <p className="font-black text-lg dark:text-white">{symbol}{(order.total_amount * rate).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                    <div className="w-16 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
                                        {item.car_image && <img src={item.car_image} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm dark:text-white">{item.car_name}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{order.order_type}</p>
                                    </div>
                                    <button className="text-indigo-600 hover:text-indigo-700 p-2"><FaChevronRight /></button>
                                </div>
                            ))}
                        </div>

                        <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
                            <button className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 hover:text-indigo-600 transition-colors">
                                <FaDownload /> Invoice PDF
                            </button>
                            <button className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 hover:text-indigo-600 transition-colors">
                                <FaHeadset /> Support
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
import { FaCalendarAlt, FaFilePdf, FaBan } from "react-icons/fa";

const BookingHistory = () => {
    const history = [
        { id: 'ORD-5521', car: "Tesla Model S", type: "sell", date: "Jan 12, 2026", price: 85000, status: "completed" },
        { id: 'ORD-9902', car: "Range Rover Sport", type: "rent", date: "Feb 01, 2026", price: 450, status: "active" }
    ];

    return (
        <div className="space-y-6 mt-15">
            <h2 className="text-4xl font-black dark:text-white">Booking <span className="text-indigo-600">History</span></h2>
            
            <div className="space-y-4">
                {history.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <span className={`w-2 h-12 rounded-full ${item.type === 'rent' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                            <div>
                                <h4 className="font-bold dark:text-white">{item.car}</h4>
                                <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                                    <FaCalendarAlt /> {item.date} • {item.id}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-black dark:text-white">${item.price.toLocaleString()}</p>
                                <p className={`text-[9px] font-black uppercase ${item.status === 'active' ? 'text-indigo-500' : 'text-emerald-500'}`}>
                                    {item.status}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button title="Download Invoice" className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-indigo-600"><FaFilePdf /></button>
                                {item.status === 'active' && <button title="Request Cancellation" className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><FaBan /></button>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingHistory;
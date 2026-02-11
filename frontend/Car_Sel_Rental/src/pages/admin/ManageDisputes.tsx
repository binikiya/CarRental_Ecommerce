import { useState } from "react";
import { FaBalanceScale, FaInfoCircle, FaCheck, FaTimes } from "react-icons/fa";

const ManageDisputes = () => {
    const [disputes, setDisputes] = useState([
        { id: "DIS-101", buyer: "Alice Smith", seller: "Berlin Benz", reason: "Engine issues not disclosed", status: "open", amount: 15000 },
        { id: "DIS-102", buyer: "Mark Ross", seller: "Tokyo Motors", reason: "Late rental return fee dispute", status: "resolved", amount: 200 }
    ]);

    return (
        <div className="space-y-8 mt-15">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black dark:text-white">Dispute <span className="text-red-500">Management</span></h1>
                    <p className="text-slate-500">Review and resolve transaction conflicts.</p>
                </div>
                <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-2xl text-xs font-bold border border-red-500/20">
                    {disputes.filter(d => d.status === 'open').length} Open Cases
                </div>
            </header>

            <div className="grid gap-4">
                {disputes.map((dispute) => (
                    <div key={dispute.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                                <FaBalanceScale />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-cyan-500">{dispute.id}</span>
                                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                                        dispute.status === 'open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                        {dispute.status}
                                    </span>
                                </div>
                                <h3 className="font-bold dark:text-white text-lg">{dispute.reason}</h3>
                                <p className="text-xs text-slate-500">Buyer: {dispute.buyer} | Seller: {dispute.seller}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Disputed Amount</p>
                                <p className="font-black dark:text-white text-lg">${dispute.amount.toLocaleString()}</p>
                            </div>
                            
                            <div className="flex gap-2">
                                <button className="p-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl hover:text-cyan-500 transition-all" title="View Details">
                                    <FaInfoCircle />
                                </button>
                                {dispute.status === 'open' && (
                                    <>
                                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-2">
                                            <FaCheck size={10} /> Settle to Seller
                                        </button>
                                        <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all flex items-center gap-2">
                                            <FaTimes size={10} /> Refund Buyer
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageDisputes;
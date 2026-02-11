import { useState } from "react";
import { FaPercentage, FaSave, FaHistory } from "react-icons/fa";

const CommissionSettings = () => {
    const [commission, setCommission] = useState(10); // 10%

    return (
        <div className="max-w-4xl space-y-8 mt-15">
            <h1 className="text-3xl font-black dark:text-white">Commission <span className="text-cyan-500">Management</span></h1>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-4xl border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center text-2xl">
                        <FaPercentage />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Global Platform Fee</h3>
                        <p className="text-sm text-slate-500">This percentage is deducted from every successful transaction.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <input 
                        type="number" 
                        value={commission}
                        onChange={(e) => setCommission(Number(e.target.value))}
                        className="w-32 px-6 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-2xl font-black dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                    <span className="text-2xl font-black dark:text-slate-500">%</span>
                    <button className="ml-auto flex items-center gap-2 px-8 py-4 bg-cyan-500 text-slate-950 font-bold rounded-2xl hover:bg-cyan-400 transition-all">
                        <FaSave /> Update Rate
                    </button>
                </div>
            </div>

            {/* Recent Payout History */}
            <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <h3 className="font-bold dark:text-white flex items-center gap-2"><FaHistory className="text-cyan-500"/> Recent Payouts</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 text-[10px] uppercase text-slate-500 font-black">
                        <tr>
                            <th className="p-6">Transaction ID</th>
                            <th className="p-6">Total Amount</th>
                            <th className="p-6">Your Cut (10%)</th>
                            <th className="p-6">Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm dark:text-white">
                        <tr className="border-t border-slate-100 dark:border-white/5">
                            <td className="p-6 font-mono text-xs">#TX-9902</td>
                            <td className="p-6">$45,000.00</td>
                            <td className="p-6 text-emerald-500 font-bold">$4,500.00</td>
                            <td className="p-6 text-slate-500">Feb 10, 2026</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CommissionSettings;
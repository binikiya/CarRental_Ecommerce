import { useEffect, useState } from "react";
import { FaPiggyBank, FaArrowCircleUp, FaFileInvoiceDollar, FaChartLine } from "react-icons/fa";
import { getCommissions } from "../../api/carService";
import { useCurrency } from "../../context/CurrencyContext";

const SellerEarnings = () => {
    const [myCommissions, setMyCommissions] = useState<any[]>([]);
    const { symbol, rate } = useCurrency();

    useEffect(() => {
        getCommissions().then(res => setMyCommissions(res.data));
    }, []);

    const totalNet = myCommissions.reduce((acc, c) => acc + (Number(c.order_total || 0) - Number(c.amount)), 0);
    const pendingPayouts = myCommissions.filter(c => !c.paid).length;

    return (
        <div className="space-y-8 mt-15">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black dark:text-white">Revenue <span className="text-emerald-500">Center</span></h1>
                    <p className="text-slate-500 text-sm">Track your sales performance and platform settlements.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Balance</p>
                    <h2 className="text-3xl font-black text-emerald-500">{symbol}{(totalNet * rate).toLocaleString()}</h2>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EarningsCard title="Total Sales" value={myCommissions.length} icon={<FaChartLine />} color="bg-blue-500" />
                <EarningsCard title="Net Profit" value={`${symbol}${(totalNet * rate).toLocaleString()}`} icon={<FaPiggyBank />} color="bg-emerald-500" />
                <EarningsCard title="Pending" value={pendingPayouts} icon={<FaArrowCircleUp />} color="bg-amber-500" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8">
                <h3 className="font-bold dark:text-white mb-6 flex items-center gap-2">
                    <FaFileInvoiceDollar className="text-emerald-500" /> Recent Settlements
                </h3>
                <div className="space-y-4">
                    {myCommissions.map(c => (
                        <div key={c.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                            <div>
                                <p className="font-bold text-sm dark:text-white">Order #{c.order}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Fee Deducted: {c.percentage}%</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-emerald-500">{symbol}{((Number(c.order_total || 0) - Number(c.amount)) * rate).toLocaleString()}</p>
                                <span className={`text-[9px] font-black uppercase ${c.paid ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {c.paid ? 'Settled' : 'Processing'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EarningsCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 flex items-center gap-4 shadow-sm">
        <div className={`p-4 rounded-2xl text-white ${color} shadow-lg shadow-current/20`}>{icon}</div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            <p className="text-xl font-black dark:text-white">{value}</p>
        </div>
    </div>
);

export default SellerEarnings;
import { FaUserCircle, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const ManageCustomers = () => {
    const customers = [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", joined: "Jan 2026", purchases: 2 },
        { id: 2, name: "Bob Smith", email: "bob@gmail.com", joined: "Feb 2026", purchases: 0 },
    ];

    return (
        <div className="space-y-6 mt-15">
            <h2 className="text-3xl font-black dark:text-white">Customer <span className="text-cyan-500">Directory</span></h2>
            <div className="grid gap-4">
                {customers.map(customer => (
                    <div key={customer.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-slate-300"><FaUserCircle size={40} /></div>
                            <div>
                                <h3 className="font-bold dark:text-white">{customer.name}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1"><FaEnvelope size={10}/> {customer.email}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-slate-400">Member Since</p>
                            <p className="text-sm font-bold dark:text-white flex items-center gap-2 justify-end">
                                <FaCalendarAlt className="text-cyan-500" size={12}/> {customer.joined}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageCustomers;
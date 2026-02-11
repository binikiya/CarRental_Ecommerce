import { useState } from "react";
import { FaUserShield, FaUserEdit, FaUserTag, FaSearch } from "react-icons/fa";

const ManagePermissions = () => {
    // Mock data - in production, fetch from /api/users/
    const [users, setUsers] = useState([
        { id: 1, name: "Sajid Admin", email: "admin@drivex.com", role: "admin", status: "Active" },
        { id: 2, name: "Tokyo Motors", email: "info@tokyo.jp", role: "seller", status: "Active" },
        { id: 3, name: "John Customer", email: "john@gmail.com", role: "customer", status: "Active" },
    ]);

    const handleRoleChange = (id: number, newRole: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
        // api.patch(`/users/${id}/`, { role: newRole });
    };

    return (
        <div className="space-y-8 mt-15">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black dark:text-white">Roles & <span className="text-cyan-500">Permissions</span></h1>
                    <p className="text-slate-500 text-sm">Control access levels and administrative privileges.</p>
                </div>
                
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="pl-12 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm w-full md:w-64"
                    />
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/5 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                            <th className="p-6">User</th>
                            <th className="p-6">Current Role</th>
                            <th className="p-6">Change Access</th>
                            <th className="p-6 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                            <FaUserEdit size={16} />
                                        </div>
                                        <div>
                                            <p className="font-bold dark:text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 w-fit ${
                                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 
                                        user.role === 'seller' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'
                                    }`}>
                                        <FaUserTag size={10} /> {user.role}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <select 
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="bg-slate-50 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="seller">Seller</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-6 text-right">
                                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{user.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagePermissions;
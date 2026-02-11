import { useEffect, useState } from "react";
import { FaUserShield, FaUserEdit, FaShieldAlt } from "react-icons/fa";
import { getAllUsers, updateUserRole } from "../../api/carService";
import toast from "react-hot-toast";

const ManagePermissions = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (id: number, role: string) => {
        try {
            await updateUserRole(id, role);
            toast.success("User privileges updated");
            fetchUsers();
        }
        catch (err) {
            toast.error("Critical: Could not update role");
        }
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-cyan-500">SYNCING USER PERMISSIONS...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 mt-15">
            <header>
                <h1 className="text-4xl font-black dark:text-white">Role <span className="text-cyan-500">Architecture</span></h1>
                <p className="text-slate-500 text-sm italic">Assign administrative and seller privileges to accounts.</p>
            </header>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/5 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 dark:border-white/5">
                            <th className="p-6">Identity</th>
                            <th className="p-6">Current Authorization</th>
                            <th className="p-6">Modify Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                                            {user.first_name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold dark:text-white text-sm">{user.first_name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 w-fit ${
                                        user.is_staff ? 'bg-purple-500/10 text-purple-500' : 'bg-slate-500/10 text-slate-500'
                                    }`}>
                                        <FaShieldAlt /> {user.is_staff ? 'Administrator' : 'Standard User'}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleRoleUpdate(user.id, 'admin')}
                                            className="px-4 py-2 bg-cyan-500/10 text-cyan-500 rounded-xl text-[10px] font-black hover:bg-cyan-500 hover:text-white transition-all"
                                        >
                                            MAKE ADMIN
                                        </button>
                                        <button 
                                            onClick={() => handleRoleUpdate(user.id, 'user')}
                                            className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            REVOKE
                                        </button>
                                    </div>
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
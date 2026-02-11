import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
    FaChartBar, FaUsers, FaUserShield, FaGavel, 
    FaPercentage, FaHistory, FaSignOutAlt, FaBoxOpen 
} from 'react-icons/fa';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartBar /> },
        { name: 'Sellers', path: '/admin/sellers', icon: <FaUsers /> },
        { name: 'Permissions', path: '/admin/permissions', icon: <FaUserShield /> },
        { name: 'Inventory', path: '/admin/products', icon: <FaBoxOpen /> },
        { name: 'Disputes', path: '/admin/disputes', icon: <FaGavel /> },
        { name: 'Commission', path: '/admin/commission', icon: <FaPercentage /> },
        { name: 'Audit Logs', path: '/admin/logs', icon: <FaHistory /> },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            <aside className="w-72 bg-slate-900 dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 sticky top-0 h-screen overflow-y-auto">
                <div className="p-8 mb-4">
                    <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter">
                        DRIVEX <span className="text-cyan-500">ADMIN</span>
                    </h1>
                </div>

                <nav className="px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                                    isActive 
                                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                                }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-8 w-full px-4">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3.5 w-full text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 p-10 overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                    {/* CRITICAL: This is where ManageCategories, AuditLogs, etc. will show up */}
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
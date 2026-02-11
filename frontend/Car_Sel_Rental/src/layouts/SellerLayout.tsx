import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaChartBar, FaCar, FaPlusCircle, FaChartPie, FaCog, FaSignOutAlt, FaReceipt } from 'react-icons/fa';

const SellerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/seller/dashboard', icon: <FaChartBar /> },
        { name: 'My Vehicles', path: '/seller/inventory', icon: <FaCar /> },
        { name: 'List New Car', path: '/seller/add-car', icon: <FaPlusCircle /> },
        { name: 'Sales & Rentals', path: '/seller/orders', icon: <FaReceipt /> },
        { name: 'Earnings', path: '/seller/earnings', icon: <FaChartPie /> },
        { name: 'Shop Settings', path: '/seller/settings', icon: <FaCog /> },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <aside className="w-72 bg-slate-900 dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 sticky top-0 h-screen overflow-y-auto">
                <div className="p-8 mb-4">
                    <h1 className="text-2xl font-black tracking-tighter">
                        DRIVEX <span className="text-emerald-500">SELLER</span>
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
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
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

            <main className="flex-1 p-10 overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SellerLayout;
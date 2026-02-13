import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaChartBar, FaUser, FaBox, FaHeart, FaMapMarkerAlt, FaCreditCard, FaHistory, FaSignOutAlt, FaStar } from 'react-icons/fa';

const CustomerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/customer/dashboard', icon: <FaChartBar /> },
        { name: 'My Profile', path: '/customer/profile', icon: <FaUser /> },
        { name: 'My Orders', path: '/customer/orders', icon: <FaBox /> },
        { name: 'Wishlist', path: '/customer/wishlist', icon: <FaHeart /> },
        { name: 'Booking History', path: '/customer/history', icon: <FaHistory /> },
        { name: 'My Reviews', path: '/customer/reviews', icon: <FaStar /> },
        { name: 'Addresses', path: '/customer/addresses', icon: <FaMapMarkerAlt /> },
        { name: 'Payments', path: '/customer/payments', icon: <FaCreditCard /> },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            <aside className="w-64 bg-slate-900 dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 sticky top-0 h-screen hidden md:block">
                <div className="p-8 text-xl font-black text-indigo-600 dark:text-indigo-400">
                    MY <span className="text-slate-900 dark:text-white">DRIVEX</span>
                </div>
                <nav className="px-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                location.pathname === item.path 
                                ? "bg-indigo-600 text-white" 
                                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                            }`}
                        >
                            {item.icon} {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-8 w-full px-4">
                    <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3.5 w-full text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-10">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CustomerLayout;
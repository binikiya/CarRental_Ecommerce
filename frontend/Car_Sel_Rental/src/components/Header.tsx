import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import Logo from '../assets/logo.png';
import { MdLogin, MdDarkMode, MdOutlineSettings, MdLogout, MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [user, setUser] = useState<{ email: string } | null>(null);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && savedUser !== "undefined") {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Cars", path: "/cars" },
        { name: "Brands", path: "/brands" },
        { name: "Categories", path: "/categories" },
        { name: "Buy/Rent", path: "/rent" },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled 
            ? "bg-[#050b14]/80 backdrop-blur-md py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-b border-white/5" 
            : "bg-slate-500 py-4"
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-cyan-400 to-indigo-600 p-0.5 transition-transform group-hover:rotate-12">
                        <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                            <img src={Logo} alt="Logo" className="h-7 w-7 object-contain" />
                        </div>
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
                        DRIVE<span className="text-cyan-400">X</span>
                    </span>
                </Link>

                <div className="hidden lg:flex items-center gap-1 bg-slate-800/40 p-1 rounded-full border border-blue/2">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-blue hover:bg-white/10 rounded-full transition-all">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative" ref={dropDownRef}>
                        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-white/10">
                            <div className="h-8 w-8 rounded-full bg-linear-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold uppercase text-xs">
                                {user ? user.email.toString().charAt(0) : <CgProfile size={20} />}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-[10px] text-slate-400 font-bold leading-none uppercase">
                                    {token ? "Seller" : "Guest"}
                                </p>
                                <p className="text-xs font-semibold text-white">
                                    {user ? user.email.toString() : "Account"}
                                </p>
                            </div>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                                {token ? (
                                    <>
                                        <Link to="/seller/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 rounded-xl transition-colors">
                                            <MdDashboard className="text-cyan-400 text-lg" /> Dashboard
                                        </Link>
                                        <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 rounded-xl transition-colors">
                                            <MdOutlineSettings className="text-slate-400 text-lg" /> Settings
                                        </Link>
                                        <div className="h-px bg-white/10 my-2 mx-2"></div>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                                        >
                                            <MdLogout className="text-lg" /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 rounded-xl transition-colors">
                                            <MdDarkMode className="text-purple-400 text-lg" /> Dark Mode
                                        </button>
                                        <div className="h-px bg-white/10 my-2 mx-2"></div>
                                        <Link to="/login" onClick={() => setOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors font-medium">
                                            <MdLogin className="text-lg" /> Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <button className="lg:hidden p-2 text-white" onClick={() => setMobileMenu(!mobileMenu)}>
                        {mobileMenu ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
                    </button>
                </div>
            </div>

            {scrolled && (
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-[40%] -left-[10%] w-[40%] h-[200%] bg-cyan-500/10 blur-[80px] rotate-12"></div>
                    <div className="absolute -top-[40%] -right-[10%] w-[40%] h-[200%] bg-indigo-600/10 blur-[80px] -rotate-12"></div>
                </div>
            )}

            <div className={`lg:hidden fixed inset-0 bg-slate-950 z-60 transition-transform duration-300 ${mobileMenu ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-6">
                    <button onClick={() => setMobileMenu(false)} className="mb-8 text-white"><HiX size={32}/><span className="sr-only">Close Menu</span></button>
                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.path} onClick={() => setMobileMenu(false)} className="text-3xl font-bold text-white hover:text-cyan-400">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
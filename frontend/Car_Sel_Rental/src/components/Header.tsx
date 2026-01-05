import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import Logo from '../assets/logo.png';
import { FaSearch } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { FcSupport } from "react-icons/fc";
import { MdPermMedia } from "react-icons/md";
import { MdLogin } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";

const Header = () => {
    const [open, setOpen] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="w-full min-h-16 bg-gradient-to-r rounded-2xl from-slate-900 to-slate-800 border-b border-slate-700">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-24 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="h-15 w-15 rounded-full border-2 border-cyan-200">
                                <img src={Logo} alt="Logo" />
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="#" className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white">
                                Cars
                            </Link>
                            <Link to="#" className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white">
                                Brands
                            </Link>
                            <Link to="#" className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white">
                                Categories
                            </Link>
                            <Link to="#" className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white">
                                New Products
                            </Link>
                            <Link to="#" className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white">
                                Buy/Rent
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="relative w-full max-w-md">
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                                <FaSearch />
                            </span>
                            <input type="text" placeholder="Search" className="w-full rounded-lg bg-slate-800 pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-50">
                        <button className="text-amber-300 hover:text-white text-2xl mb-2" type="button">
                            <IoNotifications />
                        </button>
                        <div className="relative" ref={dropDownRef}>
                            <button onClick={() => setOpen(!open)} className="h-8 w-8 rounded-full border border-slate-600">
                                <span className="text-3xl text-slate-500">
                                    <CgProfile />
                                </span>
                            </button>
                            {open && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-lg">
                                    <ul className="py-1 text-sm text-slate-200">
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-slate-800 rounded-lg">
                                                <div className="flex">
                                                    <span className="ml-2 text-indigo-400 text-lg"><IoMdSettings /></span>
                                                    <p className="ml-4">Setting</p>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-slate-800 rounded-lg">
                                                <div className="flex">
                                                    <span className="ml-2 text-indigo-400 text-lg"><MdDarkMode /></span>
                                                    <p className="ml-4">Dark</p>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <hr className="my-1 border-slate-700" />
                                        </li>
                                        <li>
                                            <button className="w-full text-left px-4 py-2 text-green-500 hover:bg-slate-800 rounded-lg">
                                                <div className="flex">
                                                    <span className="ml-2 text-green-300 text-lg"><MdLogin /></span>
                                                    <p className="ml-4">Sign In</p>
                                                </div>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        
                    </div>
                </div>
                <div className="flex-1">
                    <div className="bg-cover bg-center flex items-center justify-center px-6">
                        <div className="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-1">
                            <div className="rounded-2xl border border-white/10 p-4 backdrop-blur-xl shadow-lg">
                                <h2 className="text-6xl text-white p-2">Work With Us</h2>
                                <p className="text-sm text-slate-300 leading-relaxed">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus quaerat at aspernatur veniam consectetur explicabo, recusandae quos minus laborum alias delectus nemo saepe inventore laudantium. Repellat excepturi ex ad nobis.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-cover bg-center flex items-center justify-center px-6 mt-3 mb-3">
                        <div className="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 p-4 backdrop-blur-xl shadow-lg">
                                <div className="mb-3 flex items-center gap-3 text-white">
                                    <span className="text-indigo-400 text-lg"><FaPhone /></span>
                                    <h3 className="font-semibold text-lg">Sales</h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta cum quos, quam alias ullam non labore necessitatibus id voluptatum hic!</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 p-4 backdrop-blur-xl shadow-lg">
                                <div className="mb-3 flex items-center gap-3 text-white">
                                    <span className="text-indigo-400 text-lg"><FcSupport /></span>
                                    <h3 className="font-semibold text-lg">Technical Support</h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi, suscipit? Quas iure accusantium, culpa nihil odit quisquam obcaecati.</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 p-4 backdrop-blur-xl shadow-lg">
                                <div className="mb-3 flex items-center gap-3 text-white">
                                    <span className="text-indigo-400 text-lg"><MdPermMedia /></span>
                                    <h3 className="font-semibold text-lg">Media Inquiries</h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est laboriosam vero ratione id nemo deleniti placeat earum dicta odio veniam.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
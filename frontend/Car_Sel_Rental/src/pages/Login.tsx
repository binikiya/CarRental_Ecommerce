import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/authService";
import { Key, Mail, Car } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');
        
        if (token && token !== "undefined" && userJson) {
            const user = JSON.parse(userJson);
            const targetPath = user.role === 'admin' ? "/admin/dashboard" : "/seller/dashboard";
            navigate(targetPath, { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await login(credentials.email, credentials.password);

            const userJson = localStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;
            const userRole = user?.role;

            if (location.state?.from) {
                navigate(location.state.from.pathname, { replace: true });
            }
            else {
                const targetPath = userRole === 'seller' ? "/seller/dashboard" : "/admin/dashboard";
                navigate(targetPath, { replace: true });
            }
        }
        catch (err) {
            setError("Invalid email or password. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 mt-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                        <Car size={36} />
                    </div>
                    <h2 className="text-3xl font-black dark:text-white mb-2">Main <span className="text-cyan-500">Login</span></h2>
                    <p className="text-slate-500 text-sm mb-8">Manage your inventory and track your sales.</p>
                </div>

                {error && <div className="mb-6 p-4 bg-red-500/10 text-red-500 text-sm rounded-xl border border-red-500/20">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input type="email" placeholder="Email" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" onChange={(e) => setCredentials({...credentials, email: e.target.value})} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
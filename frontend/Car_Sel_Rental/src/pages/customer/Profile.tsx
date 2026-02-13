import { useState, useEffect } from "react";
import { FaUserEdit, FaShieldAlt, FaTrashAlt, FaKey, FaSave } from "react-icons/fa";
import { getProfile, updateProfile, changePassword, deactivateAccount } from "../../api/carService";
import toast from "react-hot-toast";

const Profile = () => {
    const [profile, setProfile] = useState({ phone: "", email: "", first_name: "", last_name: "" });
    const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm: "" });

    useEffect(() => {
        getProfile().then(res => setProfile(res.data));
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(profile);
            toast.success("Profile updated!");
        } catch { toast.error("Failed to update profile"); }
    };

    const handleChangePass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm) return toast.error("Passwords do not match");
        try {
            await changePassword(passwords);
            toast.success("Password updated successfully!");
            setPasswords({ old_password: "", new_password: "", confirm: "" });
        } catch { toast.error("Old password incorrect"); }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-15">
            <header>
                <h1 className="text-4xl font-black dark:text-white">Account <span className="text-indigo-600">Settings</span></h1>
                <p className="text-slate-500 text-sm">Manage your personal information and security.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Info */}
                <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
                    <h3 className="font-bold flex items-center gap-2 dark:text-white"><FaUserEdit className="text-indigo-600"/> Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="First Name" value={profile.first_name} onChange={(v) => setProfile({...profile, first_name: v})} />
                        <Input label="Last Name" value={profile.last_name} onChange={(v) => setProfile({...profile, last_name: v})} />
                    </div>
                    <Input label="Phone" value={profile.phone} onChange={(v) => setProfile({...profile, phone: v})} />
                    <Input label="Email" value={profile.email} disabled />
                    <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                        <FaSave /> Save Profile
                    </button>
                </form>

                <form onSubmit={handleChangePass} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
                    <h3 className="font-bold flex items-center gap-2 dark:text-white"><FaShieldAlt className="text-indigo-600"/> Security</h3>
                    <Input label="Current Password" type="password" value={passwords.old_password} onChange={(v) => setPasswords({...passwords, old_password: v})} />
                    <Input label="New Password" type="password" value={passwords.new_password} onChange={(v) => setPasswords({...passwords, new_password: v})} />
                    <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={(v) => setPasswords({...passwords, confirm: v})} />
                    <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                        <FaKey /> Update Password
                    </button>
                </form>
            </div>

            <div className="p-8 bg-red-500/5 rounded-[2.5rem] border border-red-500/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h4 className="font-bold text-red-600 flex items-center gap-2"><FaTrashAlt /> Danger Zone</h4>
                    <p className="text-xs text-red-500/70 mt-1">Once you deactivate your account, your active bookings will be paused.</p>
                </div>
                <button onClick={() => toast.error("Please contact support for account deletion.")} className="px-6 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all">
                    Deactivate Account
                </button>
            </div>
        </div>
    );
};

const Input = ({ label, value, onChange, type = "text", disabled = false }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{label}</label>
        <input 
            type={type} value={value} disabled={disabled}
            onChange={(e) => onChange && onChange(e.target.value)}
            className={`w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
    </div>
);

export default Profile;
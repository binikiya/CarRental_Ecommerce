import { useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

interface ToastProps {
    message: string;
    isOpen: boolean;
    onClose: () => void;
}

const Toast = ({ message, isOpen, onClose }: ToastProps) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => onClose(), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-24 right-6 z-[110] flex items-center gap-3 bg-slate-900 border border-emerald-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="bg-emerald-500 rounded-full p-1">
                <FaCheckCircle className="text-slate-950" size={16} />
            </div>
            <p className="text-sm font-bold">{message}</p>
            <button onClick={onClose} className="ml-4 text-slate-400 hover:text-white transition-colors">
                <FaTimes size={14} />
            </button>
        </div>
    );
};

export default Toast;
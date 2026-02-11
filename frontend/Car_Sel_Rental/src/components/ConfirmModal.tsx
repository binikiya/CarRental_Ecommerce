import { FaExclamationTriangle } from "react-icons/fa";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transform animate-in zoom-in-95 duration-200">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle size={28} />
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3 p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-3 px-4 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
import { useEffect, useState } from "react";
import { FaStar, FaEdit, FaTrash, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getMyReviews, deleteReview, updateReview } from "../../api/carService";
import toast from "react-hot-toast";

const ManageReviews = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        try {
            const res = await getMyReviews();
            setReviews(res.data);
        } finally { setLoading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this review?")) return;
        await deleteReview(id);
        toast.success("Review deleted");
        fetchReviews();
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: any = {
            pending: "bg-amber-100 text-amber-600 border-amber-200",
            approved: "bg-emerald-100 text-emerald-600 border-emerald-200",
            rejected: "bg-red-100 text-red-600 border-red-200"
        };
        const icons: any = {
            pending: <FaHourglassHalf />,
            approved: <FaCheckCircle />,
            rejected: <FaTimesCircle />
        };
        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status]}`}>
                {icons[status]} {status}
            </span>
        );
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-indigo-500 font-black">RETRIEVING FEEDBACK...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 mt-15">
            <header>
                <h1 className="text-4xl font-black dark:text-white">My <span className="text-indigo-600">Reviews</span></h1>
                <p className="text-slate-500 text-sm italic">Manage the feedback you've shared with the community.</p>
            </header>

            <div className="grid gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between gap-6 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <StatusBadge status={review.status} />
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < review.rating ? "fill-current" : "text-slate-200 dark:text-slate-700"} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold dark:text-white text-lg">Review for {review.car_name || "Vehicle"}</h3>
                                <p className="text-slate-500 text-sm mt-2 leading-relaxed">"{review.comment}"</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Posted on {new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex md:flex-col gap-2 justify-center">
                            <button className="p-4 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(review.id)} className="p-4 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {reviews.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <p className="font-bold text-slate-400 italic">You haven't written any reviews yet.</p>
                </div>
            )}
        </div>
    );
};

export default ManageReviews;
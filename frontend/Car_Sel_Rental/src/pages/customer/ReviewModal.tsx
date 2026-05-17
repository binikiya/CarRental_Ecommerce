import { useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { submitReview } from "../../api/carService";

const ReviewModal = ({ carId, onClose, onSuccess }: any) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = async () => {
        if (rating === 0) return toast.error("Please select a rating");

        try {
            await submitReview(carId, rating, comment);
            toast.success("Review submitted for approval!");
            onSuccess();
            onClose();
        }
        catch (err) {
            toast.error("You have already reviewed this car or haven't purchased it.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
                <h3 className="text-2xl font-black dark:text-white mb-6">Rate your <span className="text-indigo-600">Experience</span></h3>
                
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)}>
                            <FaStar className={star <= rating ? "text-yellow-400" : "text-slate-300"} size={30} />
                        </button>
                    ))}
                </div>

                <textarea 
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 dark:text-white mb-6 outline-none border border-transparent focus:border-indigo-500"
                    placeholder="Tell others about the car's condition, performance..."
                    rows={4}
                    onChange={(e) => setComment(e.target.value)}
                />

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500">Cancel</button>
                    <button onClick={handleSubmit} className="flex-1 py-3 bg-indigo-600 text-white font-black rounded-xl">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
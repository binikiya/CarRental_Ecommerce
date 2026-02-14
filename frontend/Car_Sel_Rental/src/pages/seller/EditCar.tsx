import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateCar, getCarById } from "../../api/carService";
import api from "../../api/api";
import Toast from "../../components/Toast";

const EditCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<any>(null);
    const [toast, setToast] = useState({ show: false, message: "" });

    useEffect(() => {
        const fetchCar = async () => {
            const data = await getCarById(id!);
            setFormData(data);
        };
        fetchCar();
    }, [id]);

    const handleBlockDates = async (dates: string[]) => {
        // dates = ["2026-02-20", "2026-02-21"]
        await api.post(`/cars/${id}/block_availability/`, { dates });
        setToast({ show: true, message: "Dates blocked!" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateCar(Number(id), formData);
            setToast({ show: true, message: "Listing updated!" });
            setTimeout(() => navigate("/seller/dashboard"), 1000);
        } catch (error) {
            console.error(error);
        }
    };

    if (!formData) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 mt-10">
            <h1 className="text-3xl font-black dark:text-white mb-8">Edit <span className="text-cyan-500">Listing</span></h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-8 rounded-4xl border border-slate-200 dark:border-white/5">
                <div className="md:col-span-2">
                    <label className="label-style">Vehicle Title</label>
                    <input value={formData.title} name="title" onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-style" />
                </div>

                <div className="md:col-span-2">
                    <label className="label-style">Top Speed / Performance</label>
                    <input value={formData.speed} name="speed" type="text" onChange={(e) => setFormData({...formData, speed: e.target.value})} className="input-style"/>
                </div>

                <div className="md:col-span-2">
                    <label className="label-style">Tag</label>
                    <input value={formData.tag} name="tag" type="text" onChange={(e) => setFormData({...formData, tag: e.target.value})} className="input-style"/>
                </div>

                <button type="submit" className="md:col-span-2 py-4 bg-cyan-500 text-slate-900 font-bold rounded-2xl hover:bg-cyan-400">
                    Save Changes
                </button>

                <Toast isOpen={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
            </form>
        </div>
    );
};

export default EditCar;
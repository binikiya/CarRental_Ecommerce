import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { createCar } from "../api/carService";

const AddCar = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: 2,
        title: "",
        category: "",
        car_type: "sell",
        price_sell: "",
        price_per_day: "",
        fuel_type: "petrol",
        transmission: "manual",
        model_year: new Date().getFullYear(),
        speed: "",
        mileage: "",
        description: "",
        tag: "New Arrival",
        status: "active"
    });

    useEffect(() => {
        api.get('/cars/category/').then(res => setCategories(res.data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const carData = {
                ...formData,
                category: Number(formData.category),
                mileage: Number(formData.mileage),
                model_year: Number(formData.model_year),
                speed: formData.speed || "0 km/h",
                slug: formData.title.toLowerCase().replace(/ /g, '-') + '-' + Date.now()
            };
            const newCar = await createCar(carData);
            navigate(`/seller/upload-images/${newCar.id}`);
        }
        catch (error) {
            console.error("Failed to create car", error);
            alert("Error creating car. Check if all fields are filled.");
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 mt-12">
            <h1 className="text-3xl font-black dark:text-white mb-8">List a <span className="text-cyan-500">New Vehicle</span></h1>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-8 rounded-4xl border border-slate-200 dark:border-white/5">
                <div className="md:col-span-2">
                    <label className="label-style">Vehicle Title</label>
                    <input name="title" onChange={handleChange} required className="input-style" placeholder="e.g. 2024 Porsche 911 Carrera" />
                </div>

                <div>
                    <label className="label-style">Category</label>
                    <select name="category" onChange={handleChange} required className="input-style">
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="label-style">Listing Type</label>
                    <select name="car_type" onChange={handleChange} className="input-style">
                        <option value="sell">For Sale</option>
                        <option value="rent">For Rent</option>
                        <option value="both">Both</option>
                    </select>
                </div>

                {(formData.car_type === 'sell' || formData.car_type === 'both') && (
                    <div>
                        <label className="label-style">Selling Price ($)</label>
                        <input name="price_sell" type="number" onChange={handleChange} className="input-style" />
                    </div>
                )}

                {(formData.car_type === 'rent' || formData.car_type === 'both') && (
                    <div>
                        <label className="label-style">Price Per Day ($)</label>
                        <input name="price_per_day" type="number" onChange={handleChange} className="input-style" />
                    </div>
                )}

                <div>
                    <label className="label-style">Fuel Type</label>
                    <select name="fuel_type" onChange={handleChange} className="input-style">
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>

                <div>
                    <label className="label-style">Transmission</label>
                    <select name="transmission" onChange={handleChange} className="input-style">
                        <option value="manual">Manual</option>
                        <option value="automatic">Automatic</option>
                    </select>
                </div>

                <div>
                    <label className="label-style">Mileage (km)</label>
                    <input 
                        name="mileage" 
                        type="number" 
                        onChange={handleChange} 
                        required 
                        className="input-style" 
                    />
                </div>

                <div>
                    <label className="label-style">Top Speed / Performance</label>
                    <input 
                        name="speed" 
                        type="text" 
                        onChange={handleChange} 
                        required 
                        className="input-style" 
                        placeholder="e.g. 250 km/h"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="label-style">Description</label>
                    <textarea name="description" onChange={handleChange} rows={4} className="input-style" />
                </div>

                <button type="submit" disabled={loading} className="md:col-span-2 py-4 bg-cyan-500 text-slate-900 font-bold rounded-2xl hover:bg-cyan-400 transition-all">
                    {loading ? "Creating..." : "Next: Upload Images"}
                </button>
            </form>
        </div>
    );
};

export default AddCar;
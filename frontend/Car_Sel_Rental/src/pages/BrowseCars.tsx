import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCars } from "../api/carService";

const BrowseCars = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    
    // Local state for UI inputs
    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        category: searchParams.get("category") || "",
        min_price: searchParams.get("min_price") || ""
    });

    useEffect(() => {
        const query = searchParams.toString();
        getCars(query).then(res => setCars(res.data));
    }, [searchParams]);

    const handleApplyFilters = () => {
        // Remove empty filters
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== "")
        );
        setSearchParams(cleanFilters);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-10">
            {/* Sidebar Filter */}
            <aside className="w-full lg:w-72 space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 space-y-6">
                    <h3 className="font-black dark:text-white uppercase tracking-tighter text-sm">Refine Search</h3>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Keywords</label>
                        <input 
                            type="text" value={filters.search}
                            onChange={e => setFilters({...filters, search: e.target.value})}
                            className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Category</label>
                        <select 
                            value={filters.category}
                            onChange={e => setFilters({...filters, category: e.target.value})}
                            className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                        >
                            <option value="">All Types</option>
                            <option value="SUV">SUV</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Sports">Sports</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleApplyFilters}
                        className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all"
                    >
                        Apply Filters
                    </button>
                </div>
            </aside>

            {/* Results Grid */}
            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map(car => (
                    <CarCard key={car.id} car={car} /> // Reuse your existing CarCard
                ))}
            </main>
        </div>
    );
};

export default BrowseCars;
import { useState } from "react";
import { FaSearch, FaFilter, FaRedo } from "react-icons/fa";

interface FilterProps {
    onFilterChange: (filters: any) => void;
}

const HomeFilter = ({ onFilterChange }: FilterProps) => {
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        min_price: "",
        max_price: "",
        car_type: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const reset = { search: "", category: "", min_price: "", max_price: "", car_type: "" };
        setFilters(reset);
        onFilterChange(reset);
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl -mt-12 relative z-10 mx-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="search" value={filters.search} onChange={handleChange} placeholder="Search model..." className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border-none rounded-2xl dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all" />
                </div>

                <select name="car_type" value={filters.car_type} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border-none rounded-2xl dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none" >
                    <option value="">All Types</option>
                    <option value="sell">Buy</option>
                    <option value="rent">Rent</option>
                </select>

                <div className="flex gap-2">
                    <input name="min_price" type="number" placeholder="Min $" value={filters.min_price} onChange={handleChange} className="w-1/2 px-4 py-3 bg-slate-50 dark:bg-white/5 border-none rounded-2xl dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
                    <input name="max_price" type="number" placeholder="Max $" value={filters.max_price} onChange={handleChange} className="w-1/2 px-4 py-3 bg-slate-50 dark:bg-white/5 border-none rounded-2xl dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>

                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-cyan-500 transition-all">
                    <FaFilter size={14} /> More Filters
                </button>

                <button 
                    onClick={resetFilters} className="px-4 py-3 bg-cyan-500 text-slate-900 rounded-2xl font-bold text-sm hover:bg-cyan-400 transition-all flex items-center justify-center gap-2" >
                    <FaRedo size={12} /> Apply Changes
                </button>

            </div>
        </div>
    );
};

export default HomeFilter;
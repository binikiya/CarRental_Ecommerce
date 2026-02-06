import { useState } from "react";

const SearchBar = () => {
    const [query, setQuery] = useState({ name: '', location: '', category: 'all' });

    const handleSearch = () => {
        // This will navigate to your "All Products" page with URL params
        // e.g., /products?name=porsche&location=berlin
        const params = new URLSearchParams(query).toString();
        window.location.href = `/products?${params}`;
    };

    return (
        <div className="flex flex-wrap items-center bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 gap-4">
            <input 
                placeholder="Car name or brand..." 
                className="flex-1 min-w-[200px] bg-transparent outline-none dark:text-white"
                onChange={(e) => setQuery({...query, name: e.target.value})}
            />
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 hidden md:block" />
            <input 
                placeholder="Location..." 
                className="flex-1 min-w-[150px] bg-transparent outline-none dark:text-white"
                onChange={(e) => setQuery({...query, location: e.target.value})}
            />
            <button 
                onClick={handleSearch}
                className="px-8 py-3 bg-cyan-500 text-slate-950 font-bold rounded-2xl hover:bg-cyan-400 transition-all"
            >
                Search
            </button>
        </div>
    );
};
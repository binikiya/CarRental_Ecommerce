import { useEffect, useState } from "react";
import { getFilteredCars } from "../api/carService";
import type { Car } from "../data/cars";
import FeaturedCars from "../components/FeaturedCars";
import Hero from "../components/Hero";
import ContactSection from "../components/ContactSection";
import HomeFilter from "../components/HomeFilter";

const Home = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async (filters = {}) => {
        setLoading(true);
        try {
            const data = await getFilteredCars(filters);
            setCars(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars(); 
    }, []);

    return (
        <main>
            <Hero />
            <div className="h-[60vh] bg-slate-950 flex items-center justify-center">
                <h1 className="text-6xl font-black text-white">Find Your <span className="text-cyan-500">Drive</span></h1>
            </div>
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                <HomeFilter onFilterChange={fetchCars} />
            </div>
            <section className="py-12 border-y border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
                    Partnered with Industry Leaders
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {/* Replace these with brand icons/logos */}
                        <span className="text-2xl font-bold dark:text-white">VOLKSWAGEN</span>
                        <span className="text-2xl font-bold dark:text-white">PORSCHE</span>
                        <span className="text-2xl font-bold dark:text-white">TESLA</span>
                        <span className="text-2xl font-bold dark:text-white">AUDI</span>
                        <span className="text-2xl font-bold dark:text-white">BMW</span>
                        <span className="text-2xl font-bold dark:text-white">TOYOTA</span>
                    </div>
                </div>
            </section>

            <FeaturedCars />
            <ContactSection />
        </main>
    );
};

export default Home;
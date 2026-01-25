import FeaturedCars from "../components/FeaturedCars";
import Hero from "../components/Hero";
import ContactSection from "../components/ContactSection";

const Home = () => {
    return (
        <main>
            <Hero />
            <ContactSection />
            <section className="py-12 border-y border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-6">
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
        </main>
    );
};

export default Home;
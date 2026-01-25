import { ArrowRight, Play  } from 'lucide-react';
import VW2026 from '../assets/vw-2026.jpg';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-700 pt-20 mt-2">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-300/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Left Content */}
                <div className="space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-medium tracking-wider uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        New 2026 Models Available
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                        Experience the <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-indigo-500">
                            Future of Driving
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Discover a curated collection of elite vehicles. From electric pioneers 
                        to classic powerhouses, find the machine that defines your journey.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <button className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all flex items-center gap-2 overflow-hidden">
                            Explore Inventory
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <Play size={10} />
                            </span>
                            Watch Review
                        </button>
                    </div>

                    {/* Simple Trust Signals */}
                    <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-white/5">
                        <div>
                            <p className="text-2xl font-bold text-white">500+</p>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Premium Cars</p>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div>
                            <p className="text-2xl font-bold text-white">12k+</p>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Happy Clients</p>
                        </div>
                    </div>
                </div>

                {/* Right Visual (Image Placeholder) */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative aspect-square md:aspect-video lg:aspect-square bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <img src={VW2026} alt="Volkswagen 2026" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent"></div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
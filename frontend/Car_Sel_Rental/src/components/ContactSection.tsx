import { Phone, HandFist, Clapperboard } from 'lucide-react';

const ContactSection = () => {
    return (
        <section className="pt-32 pb-20 bg-slate-600 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 rounded-3xl border border-white/10 p-10 bg-linear-to-br from-slate-800 to-slate-900 shadow-2xl">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">Work With Us</h2>
                    <p className="max-w-2xl text-lg text-slate-400 leading-relaxed">
                        Join our global network of automotive enthusiasts and professionals. 
                        We're building the future of digital car marketplaces.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ContactCard icon={<Phone className="text-cyan-400" />} title="Sales" desc="Ready to upgrade? Our sales team is available 24/7 for consultations." />
                    <ContactCard icon={<HandFist className="text-red-400" />} title="Technical Support" desc="Need help with the platform? Our engineers are just a click away." />
                    <ContactCard icon={<Clapperboard className="text-purple-400" />} title="Media Inquiries" desc="For press kits, interviews, and brand assets, contact our media wing." />
                </div>
            </div>
        </section>
    );
};

const ContactCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="group p-8 rounded-2xl border border-white/5 bg-slate-800/50 hover:bg-slate-800 transition-all hover:-translate-y-2">
        <div className="mb-4 text-3xl">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default ContactSection;
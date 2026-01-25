import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
    <footer className="bg-slate-100 dark:bg-[#030712] pt-20 pb-10 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="space-y-6">
            <h3 className="text-2xl font-bold dark:text-white">DRIVE<span className="text-cyan-500">X</span></h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            The world's most trusted marketplace for premium and exotic vehicles. 
            Redefining the driving experience since 2026.
            </p>
            <div className="flex gap-4">
            <SocialIcon icon={<FaFacebook />} />
            <SocialIcon icon={<FaTwitter />} />
            <SocialIcon icon={<FaInstagram />} />
            <SocialIcon icon={<FaLinkedin />} />
            </div>
        </div>

        {/* Links Column */}
        <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Latest Inventory</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Special Offers</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Sell Your Car</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Car Reviews</a></li>
            </ul>
        </div>

        {/* Support Column */}
        <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition-colors">Contact Us</a></li>
            </ul>
        </div>

        {/* Newsletter */}
        <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Get the latest car releases in your inbox.</p>
            <div className="flex gap-2">
            <input 
                type="email" 
                placeholder="Email" 
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button className="bg-cyan-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-sm">Join</button>
            </div>
        </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-200 dark:border-white/5 text-center">
        <p className="text-sm text-slate-500">&copy; 2026 DriveX Global. All rights reserved.</p>
        </div>
    </footer>
    );
};

const SocialIcon = ({ icon }: { icon: any }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-cyan-500 hover:text-slate-950 transition-all">
        {icon}
    </a>
);

export default Footer;
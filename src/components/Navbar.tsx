import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Menu, X, Sun, Moon, Home, Layers, Upload, LayoutDashboard, Wand2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const navLinks = [
    { label: 'Home', section: 'home', icon: Home },
    { label: 'Features', section: 'features', icon: Layers },
    { label: 'Upload', section: 'upload', icon: Upload },
    { label: 'Dashboard', section: 'dashboard', icon: LayoutDashboard },
    { label: 'Improved', section: 'improved-resume', icon: Wand2 },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { currentSection, setCurrentSection, darkMode, toggleDarkMode } = useStore();

    const scrollToSection = (section: string) => {
        setCurrentSection(section);
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setMobileOpen(false);
    };

    return (
        <>
            {/* Desktop Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-50"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 md:pt-4">
                    <div className="liquid-glass-strong rounded-2xl px-4 sm:px-6 py-3">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <motion.div
                                className="flex items-center gap-2.5 cursor-pointer shrink-0"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => scrollToSection('home')}
                            >
                                <div className="relative">
                                    <div 
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
                                        }}
                                    >
                                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <div 
                                        className="absolute inset-0 rounded-xl blur-xl opacity-40"
                                        style={{
                                            background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
                                        }}
                                    />
                                </div>
                                <span className="text-sm sm:text-base font-bold tracking-tight text-text-primary">
                                    Resumate<span className="text-gradient"> AI</span>
                                </span>
                            </motion.div>

                            {/* Desktop Nav Links */}
                            <div className="hidden md:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <motion.button
                                        key={link.section}
                                        onClick={() => scrollToSection(link.section)}
                                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${currentSection === link.section
                                                ? 'text-text-primary'
                                                : 'text-text-secondary hover:text-text-primary'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {currentSection === link.section && (
                                            <motion.div
                                                layoutId="navPill"
                                                className="absolute inset-0 rounded-xl liquid-glass-subtle"
                                                style={{ borderColor: 'rgba(99, 102, 241, 0.15)' }}
                                                transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Right side */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleDarkMode}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl liquid-glass-subtle flex items-center justify-center text-text-secondary hover:text-neon-amber transition-colors"
                                >
                                    <motion.div
                                        animate={{ rotate: darkMode ? 0 : 180 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                    </motion.div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => scrollToSection('upload')}
                                    className="hidden sm:flex items-center px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-main relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Get Started</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute -inset-2 rounded-2xl bg-gradient-main blur-2xl opacity-25 group-hover:opacity-40 transition-opacity" />
                                </motion.button>

                                {/* Mobile menu toggle */}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                    className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl liquid-glass-subtle flex items-center justify-center text-text-secondary"
                                >
                                    <AnimatePresence mode="wait">
                                        {mobileOpen ? (
                                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="md:hidden mx-4 sm:mx-6 lg:mx-8 mt-2"
                        >
                            <div className="liquid-glass-strong rounded-2xl p-3 space-y-1">
                                {navLinks.map((link, i) => (
                                    <motion.button
                                        key={link.section}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => scrollToSection(link.section)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${currentSection === link.section
                                                ? 'text-text-primary liquid-glass-subtle'
                                                : 'text-text-secondary active:bg-white/5'
                                            }`}
                                    >
                                        <link.icon className="w-4 h-4" />
                                        {link.label}
                                    </motion.button>
                                ))}
                                <div className="pt-1">
                                    <motion.button
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => scrollToSection('upload')}
                                        className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-main"
                                    >
                                        Get Started
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Mobile Bottom Tab Bar */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-pb"
            >
                <div className="mx-3 mb-3">
                    <div className="liquid-glass-strong rounded-2xl px-2 py-2 flex items-center justify-around">
                        {navLinks.map((link) => {
                            const isActive = currentSection === link.section;
                            return (
                                <motion.button
                                    key={link.section}
                                    onClick={() => scrollToSection(link.section)}
                                    whileTap={{ scale: 0.85 }}
                                    className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? 'text-neon-blue' : 'text-text-muted'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobileTab"
                                            className="absolute inset-0 rounded-xl liquid-glass-subtle"
                                            style={{ borderColor: 'rgba(99, 102, 241, 0.15)' }}
                                            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                        />
                                    )}
                                    <link.icon className="w-4.5 h-4.5 relative z-10" />
                                    <span className="text-[10px] font-medium relative z-10">{link.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </>
    );
}

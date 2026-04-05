import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import ParticleField from './components/ParticleField';
import ToastContainer from './components/Toast';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import UploadSection from './sections/UploadSection';
import DashboardSection from './sections/DashboardSection';
import SuggestionsSection from './sections/SuggestionsSection';
import InsightsSection from './sections/InsightsSection';
import HistorySection from './sections/HistorySection';
import FooterSection from './sections/FooterSection';
import { useStore } from './store/useStore';

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const { analysisResult, setCurrentSection, darkMode } = useStore();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Track scroll position for nav highlight
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'features', 'upload', 'dashboard'];
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 200) {
                        setCurrentSection(id);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [setCurrentSection]);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-neon-blue/30 selection:text-white">
            <ParticleField />
            <LoadingScreen isLoading={isLoading} />
            <ToastContainer />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <Navbar />
                <main>
                    <HeroSection />
                    <FeaturesSection />
                    <UploadSection />
                    {analysisResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <DashboardSection />
                            <SuggestionsSection />
                            <InsightsSection />
                        </motion.div>
                    )}
                    <HistorySection />
                </main>
                <FooterSection />
            </motion.div>
        </div>
    );
}

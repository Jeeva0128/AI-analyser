import { motion } from 'framer-motion';
import { Download, Lock, Star, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import TiltCard from '../components/TiltCard';

export default function ImprovedResumeSection() {
    const { analysisResult, improvedResume, isPremium, setIsPremium } = useStore();

    if (!analysisResult) return null;

    const handleDownload = () => {
        if (!isPremium) {
            // Show premium modal
            alert('Premium feature! Upgrade to download the AI-improved resume.');
            return;
        }

        if (!improvedResume) {
            alert('Improved resume is still being generated. Please try again.');
            return;
        }

        // Create and download the improved resume as .txt file
        const element = document.createElement('a');
        const file = new Blob([improvedResume], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${analysisResult.fileName.replace('.pdf', '')}_IMPROVED.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <section id="improved-resume" className="relative py-16 sm:py-20 lg:py-28">
            <div className="absolute top-0 right-1/3 w-[400px] sm:w-[600px] h-[400px] sm:h[600px] bg-neon-yellow/3 rounded-full blur-[150px] sm:blur-[200px]" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-10 lg:mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-pill mb-4 sm:mb-5">
                        <Star className="w-3.5 h-3.5 text-neon-yellow" />
                        <span className="text-xs sm:text-sm font-medium text-neon-yellow">AI Enhanced</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
                        Your <span className="text-gradient">Improved Resume</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-2xl mx-auto">
                        AI-enhanced version with stronger action verbs and better formatting. {!isPremium && 'Premium feature.'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <TiltCard glowColor="rgba(251, 191, 36, 0.12)">
                        <div className="relative liquid-card rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10">
                            {/* Anti-copy overlay */}
                            <div
                                className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
                                style={{
                                    background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
                                }}
                            />

                            {/* Disable text selection and context menu */}
                            <div
                                className="relative select-none"
                                onContextMenu={(e) => !isPremium && e.preventDefault()}
                                onCopy={(e) => !isPremium && e.preventDefault()}
                                onDrag={(e) => !isPremium && e.preventDefault()}
                                style={{
                                    userSelect: isPremium ? 'text' : 'none',
                                    WebkitUserSelect: isPremium ? 'text' : 'none',
                                    msUserSelect: isPremium ? 'text' : 'none',
                                }}
                            >
                                {/* Watermark for non-premium users */}
                                {!isPremium && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        style={{
                                            fontSize: '120px',
                                            fontWeight: 'bold',
                                            color: 'rgba(232, 168, 46, 0.1)',
                                            transform: 'rotate(-45deg)',
                                            zIndex: 0,
                                        }}
                                    >
                                        PREVIEW
                                    </div>
                                )}

                                {/* Resume content */}
                                <div className="relative z-10 prose prose-invert max-w-none">
                                    <pre className="bg-white/5 p-4 sm:p-6 rounded-lg overflow-auto max-h-96 text-xs sm:text-sm text-text-secondary font-mono whitespace-pre-wrap break-words">
                                        {improvedResume ? improvedResume.substring(0, 2000) : 'Generating your improved resume...'}
                                        {improvedResume && improvedResume.length > 2000 && (
                                            <div className="text-neon-amber mt-4">
                                                ... (Continue with premium download)
                                            </div>
                                        )}
                                    </pre>
                                </div>
                            </div>

                            {/* Download section */}
                            <div className="relative z-20 mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-white/5">
                                {!isPremium ? (
                                    <>
                                        <div className="flex items-center gap-2 text-neon-yellow">
                                            <Lock className="w-5 h-5" />
                                            <span className="text-sm sm:text-base font-semibold">Premium Feature</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // Toggle premium for demo purposes
                                                setIsPremium(true);
                                                alert('Premium activated! You can now download the improved resume.');
                                            }}
                                            className="flex-1 sm:flex-none px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-neon-amber to-neon-yellow text-gray-900 font-semibold hover:shadow-lg hover:shadow-neon-yellow/50 transition-all"
                                        >
                                            Upgrade to Premium
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 text-neon-green">
                                            <Eye className="w-5 h-5" />
                                            <span className="text-sm sm:text-base font-semibold">Premium Access Granted</span>
                                        </div>
                                        <button
                                            onClick={handleDownload}
                                            className="flex-1 sm:flex-none px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-cyan text-gray-900 font-semibold hover:shadow-lg hover:shadow-neon-green/50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download Improved Resume
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </TiltCard>
                </motion.div>

                {/* Features list */}
                <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                    {[
                        { title: 'Enhanced Language', desc: 'Stronger action verbs and impact' },
                        { title: 'Optimized Format', desc: 'Better ATS compatibility' },
                        { title: 'Skill Optimization', desc: 'Incorporates missing keywords' },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                            className="text-center"
                        >
                            <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-neon-yellow/15 flex items-center justify-center mb-3 sm:mb-4">
                                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-neon-yellow" />
                            </div>
                            <h3 className="font-semibold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
                            <p className="text-xs sm:text-sm text-text-muted">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

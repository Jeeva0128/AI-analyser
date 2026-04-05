import { motion } from 'framer-motion';
import { Brain, Target, BarChart3, Shield, Lightbulb, Gauge, FileSearch, TrendingUp } from 'lucide-react';
import TiltCard from '../components/TiltCard';

const features = [
    { icon: Brain, title: 'AI-Powered Analysis', description: 'Advanced NLP models scan your resume for content quality, structure, and relevance.', color: '#6366f1' },
    { icon: Target, title: 'ATS Compatibility', description: 'Ensure your resume passes Applicant Tracking Systems with our scoring engine.', color: '#8b5cf6' },
    { icon: BarChart3, title: 'Skill Gap Analysis', description: 'Identify missing skills and keywords that top employers are looking for.', color: '#22d3ee' },
    { icon: Shield, title: 'Privacy First', description: 'Your data is encrypted and never shared. We delete uploads after analysis.', color: '#34d399' },
    { icon: Lightbulb, title: 'Smart Suggestions', description: 'Get actionable, prioritized recommendations to improve your resume instantly.', color: '#fbbf24' },
    { icon: Gauge, title: 'Instant Results', description: 'Get comprehensive analysis in under 3 seconds with our optimized pipeline.', color: '#f472b6' },
    { icon: FileSearch, title: 'Keyword Matching', description: 'Match your resume against job descriptions to maximize relevance.', color: '#a78bfa' },
    { icon: TrendingUp, title: 'Progress Tracking', description: 'Track your improvement over time with detailed history and trend analysis.', color: '#2dd4bf' },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="relative py-16 sm:py-20 lg:py-28">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-neon-purple/4 rounded-full blur-[150px] sm:blur-[200px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 sm:mb-14 lg:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-pill mb-5 sm:mb-6">
                        <span className="text-xs sm:text-sm font-medium text-neon-purple">Features</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
                        Everything You Need to{' '}
                        <span className="text-gradient">Stand Out</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl sm:max-w-2xl mx-auto">
                        Our AI analyzes every aspect of your resume to help you land more interviews.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.5, delay: index * 0.06 }}
                        >
                            <TiltCard glowColor={`${feature.color}30`} className="h-full">
                                <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 h-full group relative transition-all duration-500">
                                    {/* Dynamic Glow Layer */}
                                    <div 
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl sm:rounded-2xl border-[1px]"
                                        style={{ 
                                            borderColor: `${feature.color}50`,
                                            boxShadow: `0 0 30px -10px ${feature.color}60`,
                                            background: `linear-gradient(to bottom right, ${feature.color}0C, transparent)`
                                        }}
                                    />
                                    
                                    <div className="relative z-10">
                                        <div
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
                                            style={{ 
                                                background: `${feature.color}18`,
                                                boxShadow: `0 0 15px -3px ${feature.color}40`
                                            }}
                                        >
                                            <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300" style={{ color: feature.color }} />
                                        </div>
                                        <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1.5 sm:mb-2 transition-colors duration-300" style={{ ['--hover-color' as any]: feature.color }}>{feature.title}</h3>
                                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed hidden sm:block delay-75">{feature.description}</p>
                                        <p className="text-[11px] text-text-secondary leading-relaxed sm:hidden delay-75">{feature.description.split('.')[0]}.</p>
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

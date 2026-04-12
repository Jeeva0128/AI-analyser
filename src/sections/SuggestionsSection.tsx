import { motion } from 'framer-motion';
import { Lightbulb, Zap, Edit3, Code, Search, Layout } from 'lucide-react';
import { useStore } from '../store/useStore';
import SuggestionCard from '../components/SuggestionCard';
import AnalysisHeader from '../components/AnalysisHeader';

const iconMap: Record<string, any> = {
    zap: Zap,
    edit: Edit3,
    code: Code,
    search: Search,
    layout: Layout,
};

export default function SuggestionsSection() {
    const { analysisResult } = useStore();
    if (!analysisResult) return null;

    // Safely access suggestions array
    const suggestionsArray = Array.isArray(analysisResult.suggestions) ? analysisResult.suggestions : [];
    
    if (suggestionsArray.length === 0) {
        return null;
    }

    return (
        <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
            {/* Animated background gradients */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-b from-amber-500/8 to-transparent rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-t from-red-500/6 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <AnalysisHeader
                        icon={Lightbulb}
                        label="AI Suggestions"
                        title="Improve Your Resume"
                        subtitle="Personalized recommendations from our AI to help you stand out to recruiters and ATS systems."
                        colorClass="text-neon-amber"
                    />
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {suggestionsArray.slice(0, 3).map((suggestion, index) => {
                        const Icon = suggestion?.icon
                            ? iconMap[suggestion.icon] || Lightbulb
                            : [Zap, Edit3, Code, Search, Layout][index % 5];
                        const priority = (suggestion?.priority || 'medium') as 'high' | 'medium' | 'low';

                        return (
                            <SuggestionCard
                                key={index}
                                title={suggestion?.title || `Suggestion ${index + 1}`}
                                description={suggestion?.description || 'Review and improve this aspect of your resume.'}
                                icon={Icon}
                                priority={priority}
                                index={index}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

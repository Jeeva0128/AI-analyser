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
        <section className="relative py-16 sm:py-20 lg:py-28">
            <div className="absolute top-1/2 left-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-neon-purple/4 rounded-full blur-[150px] sm:blur-[200px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnalysisHeader
                    icon={Lightbulb}
                    label="AI Suggestions"
                    title="Improve Your Resume"
                    subtitle="Personalized recommendations from our AI to help you stand out to recruiters and ATS systems."
                    colorClass="text-neon-amber"
                />

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    {suggestionsArray.map((suggestion, index) => {
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

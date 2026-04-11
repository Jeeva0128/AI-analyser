import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnalysisHeaderProps {
    icon: LucideIcon;
    label: string;
    title: string;
    subtitle: string;
    colorClass?: string;
}

export default function AnalysisHeader({
    icon: Icon,
    label,
    title,
    subtitle,
    colorClass = 'text-neon-cyan',
}: AnalysisHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-pill mb-5 sm:mb-6"
            >
                <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
                <span className={`text-xs sm:text-sm font-medium ${colorClass}`}>{label}</span>
            </motion.div>

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4"
            >
                {title.split(' ').map((word, i) => (
                    <span key={i}>
                        {i === title.split(' ').length - 1 ? (
                            <span className="text-gradient">{word}</span>
                        ) : (
                            word
                        )}{' '}
                    </span>
                ))}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl sm:max-w-2xl mx-auto"
            >
                {subtitle}
            </motion.p>
        </motion.div>
    );
}

import { motion } from 'framer-motion';

interface CircularProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    color?: string;
    bgColor?: string;
}

export default function CircularProgress({
    value,
    size = 160,
    strokeWidth = 10,
    label = 'Score',
    color = 'url(#progressGradient)',
    bgColor = 'rgba(255, 255, 255, 0.05)',
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#34d399';
        if (score >= 60) return '#fbbf24';
        return '#f87171';
    };

    return (
        <div className="relative inline-flex flex-col items-center">
            <svg width={size} height={size} className="circular-progress">
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    filter="url(#glow)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="text-3xl sm:text-4xl font-bold"
                    style={{ color: getScoreColor(value) }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    {value}
                </motion.span>
                <span className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider mt-0.5 sm:mt-1">{label}</span>
            </div>
        </div>
    );
}

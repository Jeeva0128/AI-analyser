import { motion } from 'framer-motion';

interface StreamingLoaderProps {
    message?: string;
    subMessage?: string;
    progress?: number;
}

export default function StreamingLoader({
    message = 'Processing your resume...',
    subMessage = 'Analyzing content, keywords, and structure',
    progress,
}: StreamingLoaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-12 sm:py-16"
        >
            {/* Animated loader */}
            <div className="relative mb-6 sm:mb-8">
                <motion.div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-transparent"
                    style={{
                        borderTopColor: '#06b6d4',
                        borderRightColor: '#0ea5e9',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                {/* Inner pulsing circle */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-neon-cyan"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            {/* Message */}
            <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1.5 sm:mb-2 text-center">
                {message}
            </h3>

            {/* Subtext */}
            {subMessage && (
                <p className="text-xs sm:text-sm text-text-secondary text-center mb-5 sm:mb-6 max-w-sm">
                    {subMessage}
                </p>
            )}

            {/* Progress bar if available */}
            {progress !== undefined && (
                <div className="w-full max-w-xs">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-text-secondary">Processing</span>
                        <span className="text-xs font-mono text-neon-cyan">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 sm:h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            {/* Dots animation */}
            <div className="flex gap-1 mt-6 sm:mt-8">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-neon-cyan"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

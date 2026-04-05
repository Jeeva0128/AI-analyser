import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[200] bg-bg-primary flex items-center justify-center"
                >
                    {/* Background ambient glow */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neon-blue blur-[150px]"
                        />
                        <motion.div
                            animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.12, 0.06] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-neon-purple blur-[120px]"
                        />
                    </div>

                    <div className="relative flex flex-col items-center px-6">
                        {/* Liquid glass logo container */}
                        <motion.div
                            animate={{
                                scale: [1, 1.08, 1],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="relative mb-10"
                        >
                            {/* Pulse rings */}
                            <motion.div
                                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-3xl border border-neon-blue/30"
                            />
                            <motion.div
                                animate={{ scale: [1, 2], opacity: [0.2, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                className="absolute inset-0 rounded-3xl border border-neon-purple/20"
                            />

                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-cyan flex items-center justify-center liquid-glass-strong">
                                <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                            </div>
                            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-neon-blue to-neon-purple blur-3xl opacity-20" />
                        </motion.div>

                        {/* Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                                AI Resume <span className="text-gradient">Analyzer</span>
                            </h2>
                            <p className="text-sm sm:text-base text-text-muted">Initializing AI engine...</p>
                        </motion.div>

                        {/* Liquid loading bar */}
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 192 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                            className="mt-10 h-1 rounded-full overflow-hidden liquid-glass-subtle"
                            style={{ width: 192 }}
                        >
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-full w-1/3 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

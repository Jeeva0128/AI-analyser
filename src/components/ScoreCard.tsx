import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import TiltCard from './TiltCard';

interface ScoreCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    color: string;
    index?: number;
}

export default function ScoreCard({ label, value, icon: Icon, color, index = 0 }: ScoreCardProps) {
    const getStatus = (score: number) => {
        if (score >= 80) return { text: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
        if (score >= 60) return { text: 'Good', color: 'text-sky-400', bg: 'bg-sky-400/10' };
        return { text: 'Needs Work', color: 'text-amber-400', bg: 'bg-amber-400/10' };
    };

    const status = getStatus(value);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
        >
            <TiltCard glowColor={`${color}50`}>
                <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-5 h-full group relative overflow-hidden border border-white/10" style={{ borderColor: `${color}40` }}>
                    {/* Permanent gradient background */}
                    <div 
                        className="absolute inset-0 opacity-8 group-hover:opacity-15 transition-opacity duration-300" 
                        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }} 
                    />
                    
                    {/* Glowing orb effect - GLOW ON HOVER */}
                    <div 
                        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-400 blur-3xl group-hover:blur-2xl"
                        style={{ background: color, boxShadow: `0 0 30px ${color}60` }} 
                    />
                    
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4 sm:mb-5">
                            <motion.div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xl border-1.5 transition-all duration-300"
                                style={{ background: `${color}30`, borderColor: `${color}60`, border: `1.5px solid ${color}60` }}
                                whileHover={{ scale: 1.15, rotate: 8, boxShadow: `0 0 20px ${color}80, inset 0 0 15px ${color}40` }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <Icon className="w-6 h-6 sm:w-6 sm:h-6" style={{ color }} />
                            </motion.div>
                            <motion.span 
                                className={`text-[8px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border ${status.color} ${status.bg}`}
                                style={{ borderColor: `${status.color}60` }}
                                whileHover={{ scale: 1.08, boxShadow: `0 0 10px ${status.color}80` }}
                            >
                                {status.text}
                            </motion.span>
                        </div>

                        <motion.div 
                            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r text-transparent bg-clip-text mb-1 tracking-tight"
                            style={{ backgroundImage: `linear-gradient(to right, ${color}, rgba(255,255,255,0.5))` }}
                        >
                            {value}<span className="text-lg sm:text-xl text-text-muted ml-1">%</span>
                        </motion.div>

                        <div className="text-[11px] sm:text-xs text-text-secondary mb-4 font-semibold uppercase tracking-wider">{label}</div>

                        {/* Enhanced animated progress bar with PERMANENT color */}
                        <div className="h-2 sm:h-2.5 rounded-full overflow-hidden border transition-all duration-300 group-hover:shadow-lg" style={{ background: `${color}15`, borderColor: `${color}40` }}>
                            <motion.div
                                className="h-full rounded-full shadow-xl relative"
                                style={{ background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.5))` }}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${value}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-white/20 transition-all duration-300"
                                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </TiltCard>
        </motion.div>
    );
}

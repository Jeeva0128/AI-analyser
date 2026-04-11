import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Target } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useStore } from '../store/useStore';
import CircularProgress from '../components/CircularProgress';
import TiltCard from '../components/TiltCard';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="liquid-glass-strong rounded-lg px-3 py-2 text-sm">
                <p className="text-text-primary font-medium">{label}</p>
                <p className="text-neon-cyan">{`Level: ${payload[0].value}%`}</p>
            </div>
        );
    }
    return null;
};

export default function DashboardSection() {
    const { analysisResult } = useStore();
    if (!analysisResult) return null;

    // Safely access insights with defaults
    const insights = analysisResult.insights || {
        keywordMatch: 70,
        formatting: 75,
        grammar: 80,
        impact: 65,
        roleFit: 72,
    };

    const radarData = [
        { subject: 'Keywords', value: insights.keywordMatch || 70 },
        { subject: 'Format', value: insights.formatting || 75 },
        { subject: 'Grammar', value: insights.grammar || 80 },
        { subject: 'Impact', value: insights.impact || 65 },
        { subject: 'Role Fit', value: insights.roleFit || 72 },
    ];

    // Safely access skills array
    const skillsArray = Array.isArray(analysisResult.skills) ? analysisResult.skills : [];
    const skillsData = skillsArray.slice(0, 8).map((s: any) => ({
        name: s?.name || String(s) || 'Skill',
        level: s?.level || 75
    }));

    const getBarColor = (level: number) => {
        if (level >= 80) return '#34d399';
        if (level >= 60) return '#6366f1';
        return '#fbbf24';
    };

    const scoreCards = [
        { label: 'Overall Score', value: analysisResult.overallScore || 0, icon: Award, color: '#6366f1' },
        { label: 'ATS Score', value: analysisResult.atsScore || 0, icon: TrendingUp, color: '#8b5cf6' },
        { label: 'Keyword Match', value: insights.keywordMatch || 70, icon: BarChart3, color: '#22d3ee' },
        { label: 'Role Fit', value: insights.roleFit || 72, icon: Target, color: '#34d399' },
    ];

    return (
        <section id="dashboard" className="relative py-16 sm:py-20 lg:py-28">
            <div className="absolute bottom-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-neon-cyan/4 rounded-full blur-[150px] sm:blur-[200px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 sm:mb-14 lg:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-pill mb-5 sm:mb-6">
                        <BarChart3 className="w-3.5 h-3.5 text-neon-cyan" />
                        <span className="text-xs sm:text-sm font-medium text-neon-cyan">Analysis Results</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
                        Your Resume <span className="text-gradient">Dashboard</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl sm:max-w-2xl mx-auto">
                        Here's a comprehensive breakdown of your resume analysis.
                    </p>
                </motion.div>

                {/* Score cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-4 sm:mb-5 lg:mb-6">
                    {scoreCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            <TiltCard glowColor={`${card.color}15`}>
                                <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}12` }}>
                                            <card.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: card.color }} />
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-mono text-text-muted">{card.value >= 80 ? 'Excellent' : card.value >= 60 ? 'Good' : 'Needs Work'}</span>
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold text-text-primary mb-0.5 sm:mb-1">{card.value}<span className="text-base sm:text-lg text-text-muted">%</span></div>
                                    <div className="text-xs sm:text-sm text-text-secondary">{card.label}</div>
                                    <div className="mt-2.5 sm:mt-3 h-1 sm:h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}88)` }}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${card.value}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                                        />
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>

                {/* Main grid */}
                <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                    {/* Circular Score */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <TiltCard>
                            <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col items-center">
                                <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-4 sm:mb-6">Resume Score</h3>
                                <CircularProgress value={analysisResult.overallScore} size={160} strokeWidth={10} />
                                <div className="mt-5 sm:mt-6 w-full space-y-2.5 sm:space-y-3">
                                    {(analysisResult.strengths || []).slice(0, 3).map((s, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-1.5 shrink-0" />
                                            <span className="text-text-secondary leading-snug">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                    >
                        <TiltCard>
                            <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8">
                                <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Quality Breakdown</h3>
                                <ResponsiveContainer width="100%" height={260}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="rgba(148, 163, 184, 0.08)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                        <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                                        <Radar name="Score" dataKey="value" stroke="#6366f1" fill="url(#radarGrad)" strokeWidth={2} />
                                        <defs>
                                            <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.08} />
                                            </linearGradient>
                                        </defs>
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Missing Keywords */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                    >
                        <TiltCard>
                            <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 h-full">
                                <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2 sm:mb-3">Missing Keywords</h3>
                                <p className="text-xs sm:text-sm text-text-muted mb-3 sm:mb-4">Add these to improve your ATS score</p>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {(analysisResult.missingKeywords || []).map((keyword, i) => (
                                        <motion.span
                                            key={keyword}
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.25, delay: 0.4 + i * 0.04 }}
                                            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium liquid-pill text-neon-pink cursor-default hover:bg-neon-pink/8 transition-colors"
                                            style={{ borderColor: 'rgba(244, 114, 182, 0.15)' }}
                                        >
                                            {keyword}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>

                {/* Skills Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-3 sm:mt-4 lg:mt-5"
                >
                    <TiltCard>
                        <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8">
                            <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-4 sm:mb-6">Skills Detected</h3>
                            <div className="overflow-x-auto -mx-2 px-2">
                                <div className="min-w-[500px]">
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={skillsData} barSize={28}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" />
                                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.08)' }} />
                                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.08)' }} domain={[0, 100]} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="level" radius={[6, 6, 0, 0]}>
                                                {skillsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.level)} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </motion.div>
            </div>
        </section>
    );
}

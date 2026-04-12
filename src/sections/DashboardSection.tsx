import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Target, Zap } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useStore } from '../store/useStore';
import CircularProgress from '../components/CircularProgress';
import TiltCard from '../components/TiltCard';
import ScoreCard from '../components/ScoreCard';
import SkillTags from '../components/SkillTags';
import AnalysisHeader from '../components/AnalysisHeader';

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

    return (
        <section id="dashboard" className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <AnalysisHeader
                        icon={BarChart3}
                        label="Analysis Results"
                        title="Your Resume Dashboard"
                        subtitle="Here's a comprehensive breakdown of your resume analysis with AI-powered insights."
                        colorClass="text-neon-cyan"
                    />
                </motion.div>

                {/* Score cards */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                    <ScoreCard
                        label="Overall Score"
                        value={analysisResult.overallScore || 0}
                        icon={Award}
                        color="#6366f1"
                        index={0}
                    />
                    <ScoreCard
                        label="ATS Score"
                        value={analysisResult.atsScore || 0}
                        icon={TrendingUp}
                        color="#6366f1"
                        index={1}
                    />
                    <ScoreCard
                        label="Keyword Match"
                        value={insights.keywordMatch || 70}
                        icon={BarChart3}
                        color="#6366f1"
                        index={2}
                    />
                    <ScoreCard
                        label="Role Fit"
                        value={insights.roleFit || 72}
                        icon={Target}
                        color="#6366f1"
                        index={3}
                    />
                </div>

                {/* Main grid layout */}
                <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                    {/* Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <TiltCard>
                            <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 relative overflow-hidden">
                                <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Quality Breakdown</h3>
                                <ResponsiveContainer width="100%" height={240}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="rgba(148, 163, 184, 0.12)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }} />
                                        <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                                        <Radar name="Score" dataKey="value" stroke="#6366f1" fill="rgba(99, 102, 241, 0.1)" strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Missing Keywords */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, x: 20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25, type: "spring" }}
                    >
                        <TiltCard>
                            <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 h-full flex flex-col relative overflow-hidden">
                                <div className="mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
                                        <span className="inline-block w-1 h-4 bg-amber-400 rounded-full" />
                                        Missing Keywords
                                    </h3>
                                    <p className="text-xs sm:text-sm text-text-muted">Add these to boost your ATS compatibility</p>
                                </div>
                                <div className="flex-1">
                                    <SkillTags
                                        skills={analysisResult.missingKeywords || []}
                                        variant="warning"
                                        maxVisible={6}
                                        animate={true}
                                    />
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>

                {/* Skills Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mt-6 sm:mt-8 lg:mt-10"
                >
                    <TiltCard>
                        <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 relative overflow-hidden">
                            <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-4 sm:mb-5 flex items-center gap-2">
                                <span className="inline-block p-1.5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg">
                                    <Zap className="w-4 h-4 text-white" />
                                </span>
                                Top Skills
                            </h3>
                            <div className="overflow-x-auto -mx-2 px-2">
                                <div className="min-w-[400px]">
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={skillsData} barSize={28}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                                            <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }} />
                                            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }} domain={[0, 100]} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                                            <Bar dataKey="level" radius={[8, 8, 0, 0]} isAnimationActive={true} animationDuration={1200}>
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

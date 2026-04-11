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
        <section id="dashboard" className="relative py-16 sm:py-20 lg:py-28">
            <div className="absolute bottom-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-neon-cyan/4 rounded-full blur-[150px] sm:blur-[200px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnalysisHeader
                    icon={BarChart3}
                    label="Analysis Results"
                    title="Your Resume Dashboard"
                    subtitle="Here's a comprehensive breakdown of your resume analysis with AI-powered insights."
                    colorClass="text-neon-cyan"
                />

                {/* Score cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8 lg:mb-12">
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
                        color="#8b5cf6"
                        index={1}
                    />
                    <ScoreCard
                        label="Keyword Match"
                        value={insights.keywordMatch || 70}
                        icon={BarChart3}
                        color="#22d3ee"
                        index={2}
                    />
                    <ScoreCard
                        label="Role Fit"
                        value={insights.roleFit || 72}
                        icon={Target}
                        color="#34d399"
                        index={3}
                    />
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
                            <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 h-full flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1">Missing Keywords</h3>
                                    <p className="text-xs sm:text-sm text-text-muted">Add these to improve your ATS score</p>
                                </div>
                                <div className="flex-1">
                                    <SkillTags
                                        skills={analysisResult.missingKeywords || []}
                                        variant="warning"
                                        maxVisible={8}
                                        animate={true}
                                    />
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>

                {/* Skills section */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 sm:mt-8 lg:mt-10"
                >
                    <TiltCard>
                        <div className="liquid-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8">
                            <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-neon-green" />
                                Detected Skills
                            </h3>
                            <p className="text-xs sm:text-sm text-text-muted mb-5 sm:mb-6">These are the professional skills found in your resume</p>
                            <SkillTags
                                skills={skillsArray}
                                variant="success"
                                maxVisible={20}
                                showLevel={false}
                                animate={true}
                            />
                        </div>
                    </TiltCard>
                </motion.div>

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
                            <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-4 sm:mb-6">Skill Proficiency</h3>
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

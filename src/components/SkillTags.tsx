import { motion } from 'framer-motion';

export interface Skill {
    name: string;
    level?: number;
    category?: string;
}

type SkillInput = Skill | string;

interface SkillTagsProps {
    skills: SkillInput[];
    maxVisible?: number;
    variant?: 'default' | 'warning' | 'success';
    showLevel?: boolean;
    animate?: boolean;
}

const variantStyles = {
    default: {
        bg: 'bg-slate-800/40',
        border: 'border-slate-700/40',
        text: 'text-slate-300',
        hover: 'hover:bg-slate-700/60',
    },
    warning: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-300',
        hover: 'hover:bg-amber-500/20',
    },
    success: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-300',
        hover: 'hover:bg-emerald-500/20',
    },
};

export default function SkillTags({
    skills,
    maxVisible = 12,
    variant = 'default',
    showLevel = false,
    animate = true,
}: SkillTagsProps) {
    const displaySkills = skills.slice(0, maxVisible);
    const remainingCount = skills.length - maxVisible;
    const style = variantStyles[variant];

    const getSkillName = (skill: SkillInput) => {
        if (typeof skill === 'string') return skill;
        return skill?.name || '';
    };

    const getSkillLevel = (skill: SkillInput) => {
        if (typeof skill === 'string') return undefined;
        return skill?.level;
    };

    return (
        <div className="flex flex-wrap gap-2 sm:gap-3">
            {displaySkills.map((skill, i) => {
                const skillName = getSkillName(skill);
                const skillLevel = getSkillLevel(skill);

                return (
                    <motion.div
                        key={skillName + i}
                        initial={animate ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                        whileInView={animate ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.25, delay: animate ? i * 0.04 : 0 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                    >
                        <div
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border transition-all duration-200 cursor-default group ${style.bg} ${style.border} ${style.text} ${style.hover}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-medium">{skillName}</span>
                                {showLevel && skillLevel && (
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, j) => (
                                            <div
                                                key={j}
                                                className={`w-1 h-1.5 rounded-full transition-colors ${
                                                    j < Math.ceil(skillLevel / 20)
                                                        ? 'bg-current'
                                                        : 'bg-current/20'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            {remainingCount > 0 && (
                <motion.div
                    initial={animate ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                    whileInView={animate ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: animate ? displaySkills.length * 0.04 : 0 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                >
                    <div
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border transition-all duration-200 cursor-default ${style.bg} ${style.border} ${style.text}`}
                    >
                        <span className="text-xs sm:text-sm font-medium">+{remainingCount} more</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

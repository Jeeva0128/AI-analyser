import type { AnalysisResult } from '../store/useStore';

export function generateMockAnalysis(fileName: string, fileSize: string): AnalysisResult {
    return {
        overallScore: 78,
        atsScore: 82,
        skills: [
            { name: 'React', level: 92, category: 'Frontend' },
            { name: 'TypeScript', level: 88, category: 'Languages' },
            { name: 'Node.js', level: 75, category: 'Backend' },
            { name: 'Python', level: 70, category: 'Languages' },
            { name: 'AWS', level: 65, category: 'Cloud' },
            { name: 'Docker', level: 60, category: 'DevOps' },
            { name: 'GraphQL', level: 55, category: 'API' },
            { name: 'PostgreSQL', level: 72, category: 'Database' },
            { name: 'CI/CD', level: 58, category: 'DevOps' },
            { name: 'Figma', level: 45, category: 'Design' },
        ],
        missingKeywords: [
            'Agile methodology',
            'System design',
            'Microservices',
            'Unit testing',
            'Performance optimization',
            'REST API design',
            'Team leadership',
            'Code review',
        ],
        suggestions: [
            {
                title: 'Add More Action Verbs',
                description: 'Replace passive phrases like "responsible for" with strong action verbs like "engineered", "architected", or "spearheaded" to make your experience more impactful.',
                priority: 'high',
                icon: 'zap',
            },
            {
                title: 'Improve Professional Summary',
                description: 'Your summary is too generic. Tailor it to highlight your unique value proposition and include 2-3 key achievements with quantifiable metrics.',
                priority: 'high',
                icon: 'edit',
            },
            {
                title: 'Quantify Your Achievements',
                description: 'Add specific numbers and metrics. Instead of "improved performance", say "improved page load speed by 40%, reducing bounce rate by 25%".',
                priority: 'high',
                icon: 'trending-up',
            },
            {
                title: 'Add Technical Projects Section',
                description: 'Include 2-3 notable projects with tech stack details, your role, and measurable outcomes to showcase hands-on experience.',
                priority: 'medium',
                icon: 'code',
            },
            {
                title: 'Optimize for ATS Keywords',
                description: 'Your resume is missing several industry-standard keywords. Add terms like "microservices", "agile", and "system design" naturally throughout.',
                priority: 'medium',
                icon: 'search',
            },
            {
                title: 'Improve Formatting Consistency',
                description: 'Ensure consistent date formats, bullet point styles, and spacing throughout. Use a clean, single-column layout for better ATS parsing.',
                priority: 'low',
                icon: 'layout',
            },
        ],
        insights: {
            keywordMatch: 72,
            experienceYears: 5,
            roleFit: 81,
            formatting: 85,
            grammar: 93,
            impact: 68,
        },
        strengths: [
            'Strong frontend development skills',
            'Good educational background',
            'Relevant work experience',
            'Clean resume formatting',
            'Proper use of technical terminology',
        ],
        fileName,
        fileSize,
        analyzedAt: new Date().toLocaleString(),
    };
}

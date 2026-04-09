const SKILLS_DB = {
    React: { category: 'Frontend', aliases: ['reactjs', 'react.js'] },
    'Vue.js': { category: 'Frontend', aliases: ['vuejs', 'vue'] },
    Angular: { category: 'Frontend', aliases: ['angularjs'] },
    'Next.js': { category: 'Frontend', aliases: ['nextjs'] },
    TypeScript: { category: 'Languages', aliases: ['ts'] },
    JavaScript: { category: 'Languages', aliases: ['js', 'es6'] },
    Python: { category: 'Languages', aliases: [] },
    Java: { category: 'Languages', aliases: [] },
    'C++': { category: 'Languages', aliases: [] },
    'C#': { category: 'Languages', aliases: ['.net', 'dotnet'] },
    Go: { category: 'Languages', aliases: ['golang'] },
    Ruby: { category: 'Languages', aliases: ['ruby on rails', 'rails'] },
    PHP: { category: 'Languages', aliases: [] },
    Swift: { category: 'Languages', aliases: [] },
    Kotlin: { category: 'Languages', aliases: [] },
    'Node.js': { category: 'Backend', aliases: ['nodejs', 'node'] },
    Express: { category: 'Backend', aliases: ['expressjs'] },
    Django: { category: 'Backend', aliases: [] },
    Flask: { category: 'Backend', aliases: [] },
    'Spring Boot': { category: 'Backend', aliases: ['spring'] },
    AWS: { category: 'Cloud', aliases: ['amazon web services'] },
    Azure: { category: 'Cloud', aliases: ['microsoft azure'] },
    GCP: { category: 'Cloud', aliases: ['google cloud platform', 'google cloud'] },
    Docker: { category: 'DevOps', aliases: [] },
    Kubernetes: { category: 'DevOps', aliases: ['k8s'] },
    'CI/CD': { category: 'DevOps', aliases: ['github actions', 'jenkins', 'circleci', 'gitlab ci'] },
    Terraform: { category: 'DevOps', aliases: [] },
    Git: { category: 'Tools', aliases: ['github', 'gitlab'] },
    PostgreSQL: { category: 'Database', aliases: ['postgres'] },
    MySQL: { category: 'Database', aliases: [] },
    MongoDB: { category: 'Database', aliases: ['mongo'] },
    Redis: { category: 'Database', aliases: [] },
    GraphQL: { category: 'API', aliases: [] },
    'REST API': { category: 'API', aliases: ['restful', 'rest apis'] },
    Figma: { category: 'Design', aliases: [] },
    Tailwind: { category: 'Frontend', aliases: ['tailwind css'] },
};

const ATS_KEYWORDS = [
    'Agile methodology',
    'System design',
    'Microservices',
    'Unit testing',
    'Performance optimization',
    'REST API design',
    'Team leadership',
    'Code review',
    'CI/CD pipeline',
    'Cloud architecture',
    'DevOps',
    'Data structures',
];

function countOccurrences(text, term) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    return (text.match(regex) || []).length;
}

function detectSkills(text) {
    const skills = [];
    for (const [skillName, skillInfo] of Object.entries(SKILLS_DB)) {
        const allTerms = [skillName, ...skillInfo.aliases];
        let maxCount = 0;
        for (const term of allTerms) {
            maxCount = Math.max(maxCount, countOccurrences(text, term));
        }
        if (maxCount > 0) {
            const level = Math.min(95, 40 + maxCount * 12);
            skills.push({ name: skillName, level, category: skillInfo.category });
        }
    }
    return skills.sort((a, b) => b.level - a.level);
}

function estimateExperienceYears(text) {
    const directPattern = /(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience|exp)/gi;
    let maxYears = 0;

    for (const match of text.matchAll(directPattern)) {
        const num = parseInt(match[1]);
        if (num > 0 && num < 50) maxYears = Math.max(maxYears, num);
    }

    const years = [...text.matchAll(/\b(19[9]\d|20[0-2]\d)\b/g)]
        .map((m) => parseInt(m[1]))
        .filter((y) => y >= 1990 && y <= new Date().getFullYear());

    if (years.length >= 2) {
        const span = Math.max(...years) - Math.min(...years);
        if (span < 50) maxYears = Math.max(maxYears, span);
    }

    return Math.max(0, Math.min(30, maxYears));
}

function calculateAtsScore(text, skills) {
    let score = 40;
    score += Math.min(20, skills.length * 1.5);

    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) score += 5;
    if (/\b(\+?\d[\d\s\-().]{7,}\d)\b/.test(text)) score += 3;

    const sections = ['experience', 'education', 'skills', 'projects', 'summary', 'objective', 'profile'];
    for (const s of sections) {
        if (new RegExp(`\\b${s}\\b`, 'i').test(text)) score += 3;
    }

    if (/\d+%/.test(text)) score += 5;
    if (/\$[\d,]+/.test(text)) score += 3;

    return Math.min(100, Math.max(0, Math.round(score)));
}

function generateSuggestions(text, skills) {
    const suggestions = [];
    const lowerText = text.toLowerCase();

    const actionVerbs = ['engineered', 'architected', 'spearheaded', 'developed', 'implemented', 'led', 'managed', 'optimized', 'designed', 'delivered'];
    if (!actionVerbs.some((v) => lowerText.includes(v))) {
        suggestions.push({
            title: 'Add More Action Verbs',
            description: 'Replace passive phrases like "responsible for" with strong action verbs like "engineered", "architected", or "spearheaded" to make your experience more impactful.',
            priority: 'high',
            icon: 'zap',
        });
    }

    if (!/\d+%/.test(text)) {
        suggestions.push({
            title: 'Quantify Your Achievements',
            description: 'Add specific numbers and metrics. Instead of "improved performance", say "improved page load speed by 40%, reducing bounce rate by 25%".',
            priority: 'high',
            icon: 'trending-up',
        });
    }

    if (!/(summary|objective|profile)/i.test(text)) {
        suggestions.push({
            title: 'Add a Professional Summary',
            description: 'Include a 2-3 line professional summary at the top highlighting your key value proposition and career goals.',
            priority: 'high',
            icon: 'edit',
        });
    }

    const missingAts = ATS_KEYWORDS.filter((k) => !lowerText.includes(k.toLowerCase()));
    if (missingAts.length > 3) {
        suggestions.push({
            title: 'Optimize for ATS Keywords',
            description: `Your resume is missing several industry-standard keywords. Add terms like "${missingAts.slice(0, 3).join('", "')}" naturally throughout.`,
            priority: 'medium',
            icon: 'search',
        });
    }

    if (!/(project|portfolio|github\.com)/i.test(text)) {
        suggestions.push({
            title: 'Add a Projects Section',
            description: 'Include 2-3 notable projects with tech stack details, your role, and measurable outcomes to showcase hands-on experience.',
            priority: 'medium',
            icon: 'code',
        });
    }

    suggestions.push({
        title: 'Improve Formatting Consistency',
        description: 'Ensure consistent date formats, bullet point styles, and spacing throughout. Use a clean, single-column layout for better ATS parsing.',
        priority: 'low',
        icon: 'layout',
    });

    return suggestions.slice(0, 6);
}

function getMissingKeywords(text) {
    return ATS_KEYWORDS.filter((kw) => !text.toLowerCase().includes(kw.toLowerCase())).slice(0, 8);
}

function getStrengths(text, skills) {
    const strengths = [];
    if (skills.length >= 5) strengths.push('Strong technical skill set');
    if (/\d+%/.test(text)) strengths.push('Uses quantifiable achievements');
    if (/(bachelor|master|phd|degree|university|college)/i.test(text)) strengths.push('Good educational background');
    if (/(project|portfolio)/i.test(text)) strengths.push('Demonstrates project experience');
    if (/(linkedin\.com|github\.com)/i.test(text)) strengths.push('Professional online presence');
    if (text.length > 2000) strengths.push('Comprehensive resume content');
    if (strengths.length === 0) strengths.push('Resume submitted for analysis');
    return strengths;
}

function analyzeLocally(text, fileName, fileSize) {
    const skills = detectSkills(text);
    const experienceYears = estimateExperienceYears(text);
    const atsScore = calculateAtsScore(text, skills);
    const suggestions = generateSuggestions(text, skills);
    const missingKeywords = getMissingKeywords(text);
    const strengths = getStrengths(text, skills);

    const keywordMatch = Math.round(100 - (missingKeywords.length / ATS_KEYWORDS.length) * 100);
    const skillScore = Math.min(100, skills.length * 7);
    const overallScore = Math.round(atsScore * 0.4 + keywordMatch * 0.3 + skillScore * 0.3);

    return {
        overallScore: Math.min(100, Math.max(0, overallScore)),
        atsScore,
        skills: skills.slice(0, 12),
        missingKeywords,
        suggestions,
        insights: {
            keywordMatch,
            experienceYears,
            roleFit: Math.round(atsScore * 0.9),
            formatting: Math.min(95, 55 + (text.split('\n').length > 20 ? 20 : 0) + (skills.length > 4 ? 20 : 0)),
            grammar: 88,
            impact: Math.min(90, 45 + (/\d+%/.test(text) ? 25 : 0) + (skills.length > 6 ? 20 : 0)),
        },
        strengths,
        fileName,
        fileSize: `${(fileSize / 1024).toFixed(1)} KB`,
        analyzedAt: new Date().toLocaleString(),
    };
}

async function analyzeWithOpenAI(text, fileName, fileSize) {
    const truncatedText = text.substring(0, 8000);
    const prompt = `You are an expert resume analyst. Analyze the following resume text and return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "overallScore": <0-100>,
  "atsScore": <0-100>,
  "skills": [{"name": "<name>", "level": <0-100>, "category": "<Frontend|Backend|Languages|Cloud|DevOps|Database|API|Design|Tools>"}],
  "missingKeywords": ["<keyword>"],
  "suggestions": [{"title": "<title>", "description": "<description>", "priority": "<high|medium|low>", "icon": "<zap|edit|trending-up|code|search|layout|star>"}],
  "insights": {"keywordMatch": <0-100>, "experienceYears": <number>, "roleFit": <0-100>, "formatting": <0-100>, "grammar": <0-100>, "impact": <0-100>},
  "strengths": ["<strength>"]
}

Resume:
${truncatedText}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 2000,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content.trim());

    return {
        ...result,
        fileName,
        fileSize: `${(fileSize / 1024).toFixed(1)} KB`,
        analyzedAt: new Date().toLocaleString(),
    };
}

export async function analyzeResumeText(text, fileName, fileSize) {
    if (process.env.OPENAI_API_KEY) {
        try {
            return await analyzeWithOpenAI(text, fileName, fileSize);
        } catch (err) {
            console.warn('OpenAI analysis failed, falling back to local analysis:', err.message);
        }
    }
    return analyzeLocally(text, fileName, fileSize);
}

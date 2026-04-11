# 🛠️ New Components - Quick Reference Guide

## Overview
This document provides quick reference for using the 6 new SaaS UI components created for Resumate AI.

---

## 1. ScoreCard Component

### Purpose
Display a single score metric with animated progress bar and status indicator.

### Import
```tsx
import ScoreCard from '../components/ScoreCard';
```

### Basic Usage
```tsx
<ScoreCard
  label="Overall Score"
  value={85}
  icon={Award}
  color="#6366f1"
  index={0}
/>
```

### Props
```tsx
interface ScoreCardProps {
  label: string;           // Card title
  value: number;          // Score 0-100
  icon: LucideIcon;       // Icon component
  color: string;          // Hex color
  index?: number;         // For stagger animation
}
```

### Features
- ✅ Animated progress bar
- ✅ Dynamic status text (Excellent/Good/Needs Work)
- ✅ Color-coded animations
- ✅ Responsive sizing
- ✅ Hover effects

### Example: Dashboard Top Scores
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <ScoreCard
    label="Overall Score"
    value={analysisResult.overallScore}
    icon={Award}
    color="#6366f1"
    index={0}
  />
  <ScoreCard
    label="ATS Score"
    value={analysisResult.atsScore}
    icon={TrendingUp}
    color="#8b5cf6"
    index={1}
  />
</div>
```

---

## 2. SkillTags Component

### Purpose
Display skills as modern tags/chips with hover effects and overflow handling.

### Import
```tsx
import SkillTags from '../components/SkillTags';
```

### Basic Usage
```tsx
<SkillTags
  skills={skillArray}
  variant="success"
  maxVisible={20}
  animate={true}
/>
```

### Props
```tsx
type SkillInput = Skill | string;

interface SkillTagsProps {
  skills: SkillInput[];              // Array of skills
  maxVisible?: number;               // Max visible (default: 12)
  variant?: 'default' | 'warning' | 'success';
  showLevel?: boolean;               // Show proficiency dots
  animate?: boolean;                 // Enable animations
}

// Skill object structure
interface Skill {
  name: string;
  level?: number;
  category?: string;
}
```

### Variants
```tsx
// Default - neutral styling
<SkillTags skills={skills} variant="default" />

// Warning - amber/orange styling
<SkillTags skills={missingSkills} variant="warning" />

// Success - green styling  
<SkillTags skills={detectedSkills} variant="success" />
```

### Features
- ✅ Supports both string and object arrays
- ✅ Automatic "+X more" indicator
- ✅ Staggered animations
- ✅ Hover scale effects
- ✅ Multiple color variants
- ✅ Optional proficiency level dots

### Examples
```tsx
// Missing skills (strings)
<SkillTags
  skills={['JavaScript', 'React', 'TypeScript']}
  variant="warning"
  maxVisible={8}
/>

// Detected skills (objects)
<SkillTags
  skills={[
    { name: 'React', level: 90 },
    { name: 'TypeScript', level: 85 }
  ]}
  variant="success"
  showLevel={true}
/>
```

---

## 3. SuggestionCard Component

### Purpose
Display individual suggestions with priority-based styling and CTA button.

### Import
```tsx
import SuggestionCard from '../components/SuggestionCard';
```

### Basic Usage
```tsx
<SuggestionCard
  title="Add quantifiable results"
  description="Include metrics and numbers in your achievements"
  icon={Edit3}
  priority="high"
  index={0}
/>
```

### Props
```tsx
type PriorityType = 'high' | 'medium' | 'low';

interface SuggestionCardProps {
  title: string;              // Suggestion title
  description: string;        // Detail text
  icon: LucideIcon;          // Icon component
  priority?: PriorityType;    // Priority level
  index?: number;            // For stagger animation
}
```

### Priority Colors
```tsx
// High - Red
// Medium - Amber  
// Low - Green
```

### Features
- ✅ Priority-based color coding
- ✅ Icon with hover scale effect
- ✅ "Learn more" CTA button
- ✅ Smooth animations
- ✅ Responsive padding
- ✅ Tilt card effect

### Example: Suggestion Grid
```tsx
{suggestions.map((suggestion, index) => (
  <SuggestionCard
    key={index}
    title={suggestion.title}
    description={suggestion.description}
    icon={getIconForSuggestion(suggestion.type)}
    priority={suggestion.priority}
    index={index}
  />
))}
```

---

## 4. AnalysisHeader Component

### Purpose
Reusable section header with badge, animated title, and subtitle.

### Import
```tsx
import AnalysisHeader from '../components/AnalysisHeader';
```

### Basic Usage
```tsx
<AnalysisHeader
  icon={BarChart3}
  label="Analysis Results"
  title="Your Resume Dashboard"
  subtitle="Here's a comprehensive breakdown..."
  colorClass="text-neon-cyan"
/>
```

### Props
```tsx
interface AnalysisHeaderProps {
  icon: LucideIcon;           // Badge icon
  label: string;              // Badge text
  title: string;              // Main heading
  subtitle: string;           // Supporting text
  colorClass?: string;        // Icon/badge color
}
```

### Features
- ✅ Animated badge
- ✅ Staggered text animations
- ✅ Gradient accent on last word
- ✅ Customizable colors
- ✅ Responsive text sizes
- ✅ Consistent styling

### Color Classes
```tsx
// Available Tailwind color classes:
colorClass="text-neon-cyan"      // Blue
colorClass="text-neon-amber"     // Orange
colorClass="text-neon-green"     // Green
colorClass="text-neon-purple"    // Purple
colorClass="text-neon-pink"      // Pink
```

### Example: Featured Sections
```tsx
// Dashboard section
<AnalysisHeader
  icon={BarChart3}
  label="Analysis Results"
  title="Your Resume Dashboard"
  subtitle="Comprehensive breakdown of your resume analysis"
  colorClass="text-neon-cyan"
/>

// Suggestions section
<AnalysisHeader
  icon={Lightbulb}
  label="AI Suggestions"
  title="Improve Your Resume"
  subtitle="Personalized recommendations..."
  colorClass="text-neon-amber"
/>
```

---

## 5. StreamingLoader Component

### Purpose
Modern loading state with animations and optional progress tracking.

### Import
```tsx
import StreamingLoader from '../components/StreamingLoader';
```

### Basic Usage
```tsx
<StreamingLoader
  message="Processing your resume..."
  subMessage="Analyzing content, keywords, and structure"
  progress={65}
/>
```

### Props
```tsx
interface StreamingLoaderProps {
  message?: string;        // Loading message
  subMessage?: string;     // Supporting text
  progress?: number;       // Progress 0-100 (optional)
}
```

### Features
- ✅ Spinning circular animation
- ✅ Pulsing inner circle effect
- ✅ Animated bounce dots
- ✅ Optional progress bar
- ✅ Customizable messages
- ✅ Smooth and professional

### Examples
```tsx
// With progress
<StreamingLoader
  message="Analyzing your resume..."
  subMessage="This may take a few seconds"
  progress={uploadProgress}
/>

// Without progress
<StreamingLoader
  message="Processing..."
  subMessage="Please wait while we analyze your resume"
/>

// Minimal
<StreamingLoader />
```

---

## 6. StatCard Component

### Purpose
Display key statistics with gradient text and animated accent bar.

### Import
```tsx
import StatCard from '../components/StatCard';
```

### Basic Usage
```tsx
<StatCard
  title="Keyword Match"
  value={75}
  icon={Search}
  color="#22d3ee"
  subtext="Keywords found in your resume"
  index={0}
/>
```

### Props
```tsx
interface StatCardProps {
  title: string;           // Stat label
  value: number;          // Stat value (0-100)
  icon?: React.ReactNode; // Optional icon
  color: string;          // Hex color
  subtext?: string;       // Optional supporting text
  index?: number;         // For stagger animation
}
```

### Features
- ✅ Gradient colored text
- ✅ Animated bottom accent bar
- ✅ Optional icon display
- ✅ Supporting text
- ✅ Clean typography
- ✅ Responsive design

### Example: KPI Dashboard
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard
    title="Overall Score"
    value={analysisResult.overallScore}
    icon={<Award className="w-8 h-8" />}
    color="#6366f1"
    index={0}
  />
  <StatCard
    title="Keyword Match"
    value={insights.keywordMatch}
    icon={<Search className="w-8 h-8" />}
    color="#22d3ee"
    index={1}
  />
</div>
```

---

## 🎨 Color Reference

### Available Colors
```tsx
// Primary Colors
#6366f1   // Indigo (primary)
#8b5cf6   // Purple

// Semantic Colors
#34d399   // Emerald (success)
#22d3ee   // Cyan (info)
#fbbf24   // Amber (warning)
#f87171   // Red (error)

// Using in components
color="#6366f1"        // ScoreCard
colorClass="text-neon-cyan"  // AnalysisHeader
```

---

## 📱 Responsive Classes

### Common Patterns
```tsx
// Font sizes
className="text-sm sm:text-base lg:text-lg"

// Padding
className="p-4 sm:p-5 lg:p-8"

// Grid columns
className="grid grid-cols-2 lg:grid-cols-4"

// Gaps
className="gap-3 sm:gap-4 lg:gap-5"
```

---

## 🎬 Animation Patterns

### Entry Animation
```tsx
<Component
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
/>
```

### Stagger Animation
```tsx
{items.map((item, i) => (
  <Component
    key={i}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: i * 0.08 }}
  />
))}
```

### Hover Animation
```tsx
<Component
  whileHover={{ scale: 1.05, y: -2 }}
  transition={{ duration: 0.2 }}
/>
```

---

## 🚀 Best Practices

### ✅ Do's
- ✅ Use components for consistency
- ✅ Import from component directory
- ✅ Pass all required props
- ✅ Use Tailwind color classes
- ✅ Leverage stagger animations with index prop
- ✅ Keep component tree shallow

### ❌ Don'ts
- ❌ Don't inline complex logic in components
- ❌ Don't override component animations
- ❌ Don't pass undefined values
- ❌ Don't use multiple color systems
- ❌ Don't modify component internals
- ❌ Don't create duplicate versions

---

## 📋 Component Integration Checklist

When adding components to sections:

- [ ] Import component at top of file
- [ ] Wrap in motion div with viewport animations
- [ ] Pass required props correctly
- [ ] Use proper Tailwind breakpoints
- [ ] Add stagger animations where needed
- [ ] Test on mobile and desktop
- [ ] Verify animations are smooth
- [ ] Check TypeScript has no errors
- [ ] Build and verify no warnings
- [ ] Commit and push changes

---

## 🐛 Common Issues & Solutions

### Animation not showing?
```tsx
// Make sure to add viewport
whileInView={{ opacity: 1 }}
viewport={{ once: true }}  // ← Essential
```

### Type error with icons?
```tsx
// Import icon from lucide-react
import { Award } from 'lucide-react';

// Then pass directly
icon={Award}  // ✅ Correct
```

### Skills showing undefined?
```tsx
// Ensure skills array is properly formatted
const skills = ['React', 'TypeScript'];  // ✅ Correct
const skills = analysisResult.skills || [];  // ✅ Safe fallback
```

### Responsive not working?
```tsx
// Use correct breakpoint prefixes
className="text-sm sm:text-base lg:text-lg"  // ✅ Correct
className="text-sm md:text-base px-textlg"   // ❌ Wrong
```

---

## 📚 Further Reading

- See `UI_UPGRADE_GUIDE.md` for detailed component API
- See `UI_TRANSFORMATION_COMPLETE.md` for architecture overview
- Check `src/sections/DashboardSection.tsx` for real usage examples
- Check `src/sections/SuggestionsSection.tsx` for more examples

---

## ✨ Summary

You now have 6 powerful, reusable components that:
- 🎨 Maintain consistent design
- ⚡ Include smooth animations
- 📱 Are fully responsive
- 🔒 Have full type safety
- 🚀 Are production-ready

Use them to build beautiful, professional interfaces quickly and efficiently!

---

**Happy building! 🎉**

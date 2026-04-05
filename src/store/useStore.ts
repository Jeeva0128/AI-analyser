import { create } from 'zustand';

export interface AnalysisResult {
    overallScore: number;
    atsScore: number;
    skills: { name: string; level: number; category: string }[];
    missingKeywords: string[];
    suggestions: { title: string; description: string; priority: 'high' | 'medium' | 'low'; icon: string }[];
    insights: {
        keywordMatch: number;
        experienceYears: number;
        roleFit: number;
        formatting: number;
        grammar: number;
        impact: number;
    };
    strengths: string[];
    fileName: string;
    fileSize: string;
    analyzedAt: string;
}

export interface UploadHistory {
    id: string;
    fileName: string;
    score: number;
    date: string;
}

interface AppState {
    currentSection: string;
    setCurrentSection: (section: string) => void;
    isUploading: boolean;
    setIsUploading: (val: boolean) => void;
    uploadProgress: number;
    setUploadProgress: (val: number) => void;
    analysisResult: AnalysisResult | null;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    isAnalyzing: boolean;
    setIsAnalyzing: (val: boolean) => void;
    uploadedFile: File | null;
    setUploadedFile: (file: File | null) => void;
    uploadHistory: UploadHistory[];
    addToHistory: (entry: UploadHistory) => void;
    toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const useStore = create<AppState>((set) => ({
    currentSection: 'home',
    setCurrentSection: (section) => set({ currentSection: section }),
    isUploading: false,
    setIsUploading: (val) => set({ isUploading: val }),
    uploadProgress: 0,
    setUploadProgress: (val) => set({ uploadProgress: val }),
    analysisResult: null,
    setAnalysisResult: (result) => set({ analysisResult: result }),
    isAnalyzing: false,
    setIsAnalyzing: (val) => set({ isAnalyzing: val }),
    uploadedFile: null,
    setUploadedFile: (file) => set({ uploadedFile: file }),
    uploadHistory: [
        { id: '1', fileName: 'resume_v3.pdf', score: 72, date: '2024-12-15' },
        { id: '2', fileName: 'resume_v2.pdf', score: 65, date: '2024-12-10' },
        { id: '3', fileName: 'resume_v1.pdf', score: 58, date: '2024-12-05' },
    ],
    addToHistory: (entry) => set((state) => ({ uploadHistory: [entry, ...state.uploadHistory] })),
    toasts: [],
    addToast: (message, type) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 4000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    darkMode: true,
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));

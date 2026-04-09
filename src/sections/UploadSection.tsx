import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, Loader2, File, CloudUpload } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function UploadSection() {
    const {
        isUploading, setIsUploading,
        uploadProgress, setUploadProgress,
        setAnalysisResult,
        isAnalyzing, setIsAnalyzing,
        uploadedFile, setUploadedFile,
        addToast, addToHistory,
    } = useStore();
    const [isDragActive, setIsDragActive] = useState(false);

    const uploadAndAnalyze = useCallback(
        async (file: File) => {
            setUploadedFile(file);
            setIsUploading(true);
            setUploadProgress(0);

            const formData = new FormData();
            formData.append('resume', file);

            try {
                const progressInterval = setInterval(() => {
                    setUploadProgress((prev) => Math.min(prev + 6, 90));
                }, 80);

                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    body: formData,
                });

                clearInterval(progressInterval);
                setUploadProgress(100);
                setIsUploading(false);

                if (!response.ok) {
                    const err = await response.json().catch(() => ({ error: 'Analysis failed.' }));
                    throw new Error(err.error || 'Analysis failed.');
                }

                addToast('Resume uploaded successfully!', 'success');
                setIsAnalyzing(true);

                const result = await response.json();
                setAnalysisResult(result);
                setIsAnalyzing(false);

                addToHistory({
                    id: Date.now().toString(),
                    fileName: file.name,
                    score: result.overallScore,
                    date: new Date().toISOString().split('T')[0],
                });

                addToast('AI analysis complete! Scroll down to see results.', 'info');

                setTimeout(() => {
                    const el = document.getElementById('dashboard');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 600);
            } catch (err) {
                setIsUploading(false);
                setIsAnalyzing(false);
                const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
                addToast(message, 'error');
                setUploadedFile(null);
                setUploadProgress(0);
            }
        },
        [setUploadedFile, setIsUploading, setUploadProgress, setAnalysisResult, setIsAnalyzing, addToast, addToHistory]
    );

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setIsDragActive(false);
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                if (file.size > 10 * 1024 * 1024) {
                    addToast('File too large. Maximum size is 10MB.', 'error');
                    return;
                }
                uploadAndAnalyze(file);
            }
        },
        [uploadAndAnalyze, addToast]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
        },
        maxFiles: 1,
        disabled: isUploading || isAnalyzing,
    });

    const removeFile = () => {
        setUploadedFile(null);
        setAnalysisResult(null);
        setUploadProgress(0);
    };

    return (
        <section id="upload" className="relative py-16 sm:py-20 lg:py-28">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-neon-blue/4 rounded-full blur-[150px] sm:blur-[200px]" />

            <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-pill mb-5 sm:mb-6">
                        <Upload className="w-3.5 h-3.5 text-neon-blue" />
                        <span className="text-xs sm:text-sm font-medium text-neon-blue">Upload</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
                        Upload Your <span className="text-gradient">Resume</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-lg mx-auto">
                        Drop your resume and let our AI do the heavy lifting.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <AnimatePresence mode="wait">
                        {!uploadedFile ? (
                            <motion.div
                                key="dropzone"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                            >
                                <div
                                    {...getRootProps()}
                                    className={`relative group cursor-pointer transition-all duration-400 ${isDragActive ? 'scale-[1.02]' : ''}`}
                                >
                                    <input {...getInputProps()} />

                                    {/* Animated glow border on hover/drag */}
                                    <div className={`absolute -inset-px rounded-2xl sm:rounded-3xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan transition-opacity duration-500 blur-sm ${isDragActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'}`} />
                                    <div className={`absolute -inset-px rounded-2xl sm:rounded-3xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan transition-opacity duration-500 ${isDragActive ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}`} />

                                    <div className="relative liquid-card-elevated rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
                                        <motion.div
                                            animate={isDragActive ? { scale: 1.12, y: -8 } : { scale: 1, y: 0 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            className="inline-flex mb-5 sm:mb-6"
                                        >
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl liquid-glass flex items-center justify-center animate-liquid-border">
                                                <CloudUpload className="w-7 h-7 sm:w-8 sm:h-8 text-neon-blue" />
                                            </div>
                                        </motion.div>

                                        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">
                                            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                                        </h3>
                                        <p className="text-sm text-text-secondary mb-5 sm:mb-6">or tap to browse files</p>

                                        <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-text-muted">
                                            <span className="flex items-center gap-1.5">
                                                <FileText className="w-3.5 h-3.5" /> PDF
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                                            <span className="flex items-center gap-1.5">
                                                <File className="w-3.5 h-3.5" /> DOCX
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                                            <span>Max 10MB</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="uploaded"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                className="liquid-card-elevated rounded-2xl sm:rounded-3xl p-5 sm:p-8"
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl liquid-glass flex items-center justify-center shrink-0 animate-liquid-border">
                                        <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-neon-blue" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm sm:text-base font-semibold text-text-primary truncate">{uploadedFile.name}</div>
                                        <div className="text-xs sm:text-sm text-text-muted mt-0.5">{(uploadedFile.size / 1024).toFixed(1)} KB</div>
                                    </div>
                                    {!isUploading && !isAnalyzing && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={removeFile}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl liquid-glass-subtle flex items-center justify-center text-text-muted hover:text-neon-red transition-colors"
                                        >
                                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </motion.button>
                                    )}
                                </div>

                                {isUploading && (
                                    <div className="mt-5 sm:mt-6">
                                        <div className="flex justify-between text-xs sm:text-sm mb-2">
                                            <span className="text-text-secondary">Uploading...</span>
                                            <span className="text-neon-blue font-mono">{uploadProgress}%</span>
                                        </div>
                                        <div className="h-1.5 sm:h-2 rounded-full bg-white/5 overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                transition={{ duration: 0.1 }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isAnalyzing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-5 sm:mt-6 flex items-center gap-3 p-3 sm:p-4 rounded-xl liquid-glass-subtle"
                                        style={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}
                                    >
                                        <div className="relative shrink-0">
                                            <Loader2 className="w-5 h-5 text-neon-purple animate-spin" />
                                            <div className="absolute inset-0 rounded-full bg-neon-purple blur-md opacity-30" />
                                        </div>
                                        <div>
                                            <div className="text-xs sm:text-sm font-medium text-text-primary">AI is analyzing your resume...</div>
                                            <div className="text-[11px] sm:text-xs text-text-muted mt-0.5">Scanning content, keywords, and structure</div>
                                        </div>
                                    </motion.div>
                                )}

                                {!isUploading && !isAnalyzing && uploadedFile && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-5 sm:mt-6 flex items-center gap-3 p-3 sm:p-4 rounded-xl liquid-glass-subtle"
                                        style={{ borderColor: 'rgba(52, 211, 153, 0.15)' }}
                                    >
                                        <CheckCircle className="w-5 h-5 text-neon-green shrink-0" />
                                        <div>
                                            <div className="text-xs sm:text-sm font-medium text-text-primary">Analysis Complete!</div>
                                            <div className="text-[11px] sm:text-xs text-text-muted mt-0.5">Scroll down to view your results</div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}

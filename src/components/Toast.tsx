import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ToastContainer() {
    const { toasts, removeToast } = useStore();

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-neon-green shrink-0" />,
        error: <XCircle className="w-5 h-5 text-neon-red shrink-0" />,
        info: <Info className="w-5 h-5 text-neon-cyan shrink-0" />,
    };

    return (
        <div className="fixed top-20 right-3 sm:right-4 z-[100] flex flex-col gap-2.5 w-[calc(100%-1.5rem)] sm:w-auto sm:max-w-sm">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 80, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 80, scale: 0.92 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="liquid-glass-strong rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl"
                    >
                        {icons[toast.type]}
                        <span className="text-sm text-text-primary flex-1 leading-snug">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-text-primary transition-colors shrink-0 p-0.5">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

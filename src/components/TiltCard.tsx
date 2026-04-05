import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    tiltAmount?: number;
    disabled?: boolean;
}

export default function TiltCard({ children, className = '', glowColor = 'rgba(99, 102, 241, 0.12)', tiltAmount = 8, disabled = false }: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (disabled || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setRotateX((y - 0.5) * -tiltAmount);
        setRotateY((x - 0.5) * tiltAmount);
        setGlowPos({ x: x * 100, y: y * 100 });
    }, [disabled, tiltAmount]);

    const handleMouseLeave = useCallback(() => {
        setRotateX(0);
        setRotateY(0);
        setGlowPos({ x: 50, y: 50 });
    }, []);

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
            className={`relative ${className}`}
        >
            {/* Mouse-following liquid highlight */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                style={{
                    background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 55%)`,
                }}
            />
            {/* Refraction edge highlight */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                style={{
                    background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.04), transparent 40%)`,
                }}
            />
            {children}
        </motion.div>
    );
}

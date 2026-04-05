import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
    const meshRef = useRef<THREE.Points>(null!);
    const count = 150;

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 24;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
            const c = new THREE.Color();
            c.setHSL(0.65 + Math.random() * 0.18, 0.7, 0.45 + Math.random() * 0.25);
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        return [pos, col];
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.015;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.08;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.035} vertexColors transparent opacity={0.5} sizeAttenuation />
        </points>
    );
}

function FloatingOrb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const offset = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + offset) * 0.25;
            meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.25 + offset) * 0.12;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.45} />
        </mesh>
    );
}

export default function ParticleField() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]} style={{ pointerEvents: 'none' }}>
                <ambientLight intensity={0.15} />
                <pointLight position={[5, 5, 5]} intensity={0.4} color="#6366f1" />
                <pointLight position={[-5, -5, 5]} intensity={0.25} color="#8b5cf6" />
                <Particles />
                <FloatingOrb position={[-2.5, 1.2, -2]} color="#6366f1" scale={1.1} />
                <FloatingOrb position={[2.8, -0.6, -3]} color="#8b5cf6" />
                <FloatingOrb position={[0.2, 2.2, -4]} color="#22d3ee" scale={0.7} />
                <FloatingOrb position={[-3.2, -1.2, -2]} color="#f472b6" scale={0.5} />
                <FloatingOrb position={[3.2, 1.8, -5]} color="#6366f1" scale={1.3} />
            </Canvas>
        </div>
    );
}

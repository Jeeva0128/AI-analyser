import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

function ParallaxCamera() {
    const { camera } = useThree();
    const target = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    useFrame(() => {
        camera.position.x += (target.current.x * 0.8 - camera.position.x) * 0.02;
        camera.position.y += (target.current.y * 0.8 - camera.position.y) * 0.02;
    });

    return null;
}

function Starfield() {
    const meshRef = useRef<THREE.Points>(null!);
    const count = 1000;

    const { geometry, originalPositions, randoms } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const rnd = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            // Wide volume for 3D depth
            pos[i * 3] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
            
            const c = new THREE.Color();
            c.setHSL(0.6 + Math.random() * 0.1, 0.6, 0.5 + Math.random() * 0.5);
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;

            rnd[i] = Math.random();
        }
        
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        
        return { geometry: geo, originalPositions: new Float32Array(pos), randoms: rnd };
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        
        const time = state.clock.elapsedTime;
        meshRef.current.rotation.y = time * 0.015;
        meshRef.current.rotation.x = Math.sin(time * 0.01) * 0.03;

        const posAttr = geometry.attributes.position;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const speed = randoms[i];
            
            // Deterministic drifting logic (safe from cumulative compounding)
            let y = originalPositions[i * 3 + 1] + (time * (speed * 0.7 + 0.3));
            y = ((y + 20) % 40) - 20;

            // X-axis swaying like dust
            const xOffset = Math.sin(time * speed * 2 + i) * (speed + 0.5);
            
            posArray[i * 3] = originalPositions[i * 3] + xOffset;
            posArray[i * 3 + 1] = y;
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef} geometry={geometry} frustumCulled={false}>
            <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
}

function FloatingOrb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const offset = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + offset) * 0.3;
            meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.2 + offset) * 0.15;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.3} depthWrite={false} />
        </mesh>
    );
}

// redundant import removed

export default function ParticleField() {
    const { darkMode } = useStore();
    return (
        <div className={`absolute inset-0 -z-10 transition-opacity duration-700 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]} style={{ pointerEvents: 'none' }}>
                <ParallaxCamera />
                <ambientLight intensity={0.15} />
                <pointLight position={[5, 5, 5]} intensity={0.4} color="#6366f1" />
                <pointLight position={[-5, -5, 5]} intensity={0.25} color="#8b5cf6" />
                <Starfield />

                <FloatingOrb position={[-2.5, 1.2, -2]} color="#6366f1" scale={1.2} />
                <FloatingOrb position={[2.8, -0.6, -3]} color="#8b5cf6" scale={0.9} />
                <FloatingOrb position={[0.2, 2.2, -4]} color="#22d3ee" scale={0.7} />
                <FloatingOrb position={[-3.2, -1.2, -2]} color="#f472b6" scale={0.5} />
                <FloatingOrb position={[3.2, 1.8, -5]} color="#6366f1" scale={1.4} />
            </Canvas>
        </div>
    );
}

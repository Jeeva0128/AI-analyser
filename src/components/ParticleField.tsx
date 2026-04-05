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
        camera.position.x += (target.current.x * 0.5 - camera.position.x) * 0.025;
        camera.position.y += (target.current.y * 0.5 - camera.position.y) * 0.025;
    });

    return null;
}

// Main starfield with enhanced space particle effect
function Starfield() {
    const meshRef = useRef<THREE.Points>(null!);
    const count = 2000;

    const { geometry, originalPositions, randoms, speeds } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const rnd = new Float32Array(count);
        const spd = new Float32Array(count);
        
        // Space color palette
        const colors = [
            [0.4, 0.6, 1.0],    // Blue
            [0.6, 0.3, 1.0],    // Purple
            [0.2, 0.8, 1.0],    // Cyan
            [1.0, 1.0, 1.0],    // White
            [0.8, 0.4, 1.0],    // Magenta
            [0.3, 0.9, 0.8],    // Teal
        ];
        
        for (let i = 0; i < count; i++) {
            // Deep space volume
            pos[i * 3] = (Math.random() - 0.5) * 80;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
            
            // Pick from space color palette
            const colorChoice = colors[Math.floor(Math.random() * colors.length)];
            col[i * 3] = colorChoice[0];
            col[i * 3 + 1] = colorChoice[1];
            col[i * 3 + 2] = colorChoice[2];

            rnd[i] = Math.random();
            spd[i] = Math.random() * 0.5 + 0.3;
        }
        
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        
        return { 
            geometry: geo, 
            originalPositions: new Float32Array(pos), 
            randoms: rnd,
            speeds: spd 
        };
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        
        const time = state.clock.elapsedTime;
        
        // Smooth, slow rotation
        meshRef.current.rotation.y = time * 0.008;
        meshRef.current.rotation.x = Math.sin(time * 0.005) * 0.02;

        const posAttr = geometry.attributes.position;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const speed = speeds[i];
            const random = randoms[i];
            
            // Vertical floating motion - smooth and continuous
            let y = originalPositions[i * 3 + 1] + (time * speed * 0.4);
            y = ((y + 40) % 80) - 40;

            // Subtle horizontal swaying - organic motion
            const xOffset = Math.sin(time * speed * 0.5 + i) * (0.3 + speed);
            const zOffset = Math.cos(time * speed * 0.3 + i * 0.1) * (0.2 + random * 0.3);
            
            posArray[i * 3] = originalPositions[i * 3] + xOffset;
            posArray[i * 3 + 1] = y;
            posArray[i * 3 + 2] = originalPositions[i * 3 + 2] + zOffset;
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef} geometry={geometry} frustumCulled={false}>
            <pointsMaterial 
                size={0.08} 
                vertexColors 
                transparent 
                opacity={0.9} 
                depthWrite={false} 
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    );
}

// Nebula dust layer for atmosphere
function NebulaDust() {
    const meshRef = useRef<THREE.Points>(null!);
    const count = 800;

    const { geometry, originalPositions, randoms } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const rnd = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 15;
            
            // Nebula colors - more purple and pink hues
            const hue = Math.random();
            const c = new THREE.Color();
            if (hue < 0.3) {
                c.setRGB(0.6, 0.2, 0.9);  // Purple
            } else if (hue < 0.65) {
                c.setRGB(0.8, 0.2, 0.6);  // Pink
            } else {
                c.setRGB(0.3, 0.4, 0.9);  // Blue
            }
            
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
        const posAttr = geometry.attributes.position;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const speed = randoms[i] * 0.3 + 0.1;
            
            // Very slow drift
            let y = originalPositions[i * 3 + 1] + (time * speed * 0.15);
            y = ((y + 50) % 100) - 50;

            // Gentle wave motion
            const xOffset = Math.sin(time * speed * 0.2 + i) * 0.8;
            
            posArray[i * 3] = originalPositions[i * 3] + xOffset;
            posArray[i * 3 + 1] = y;
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef} geometry={geometry} frustumCulled={false}>
            <pointsMaterial 
                size={0.15} 
                vertexColors 
                transparent 
                opacity={0.25} 
                depthWrite={false} 
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    );
}

// Floating glowing orbs for depth
function FloatingOrb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const offset = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (meshRef.current) {
            // Smooth orbital motion
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2 + offset) * 0.5;
            meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.15 + offset) * 0.3;
            meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 0.1 + offset) * 0.2;
            
            // Gentle scaling pulse
            meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.1);
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={0.8} 
                transparent 
                opacity={0.5} 
                depthWrite={false}
                wireframe={false}
            />
        </mesh>
    );
}

export default function ParticleField() {
    const { darkMode } = useStore();
    
    return (
        <div 
            className={`fixed inset-0 transition-opacity duration-700 ${darkMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ zIndex: -999 }}
        >
            <Canvas 
                camera={{ position: [0, 0, 8], fov: 50 }} 
                dpr={[1, 1.5]} 
                style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
                gl={{ 
                    antialias: true,
                    preserveDrawingBuffer: true,
                    alpha: true 
                }}
            >
                <ParallaxCamera />
                
                {/* Lighting setup for space ambience */}
                <ambientLight intensity={0.08} />
                <pointLight position={[10, 10, 10]} intensity={0.3} color="#6366f1" decay={2} />
                <pointLight position={[-10, -10, 10]} intensity={0.2} color="#8b5cf6" decay={2} />
                <pointLight position={[5, -5, 0]} intensity={0.15} color="#22d3ee" decay={2} />
                
                {/* Particle layers */}
                <Starfield />
                <NebulaDust />

                {/* Floating orbs - decorative depth elements */}
                <FloatingOrb position={[-3, 2, -3]} color="#6366f1" scale={1.3} />
                <FloatingOrb position={[3.5, -1, -4]} color="#8b5cf6" scale={0.8} />
                <FloatingOrb position={[0, 3, -5]} color="#22d3ee" scale={0.6} />
                <FloatingOrb position={[-4, -2, -2]} color="#f472b6" scale={0.5} />
                <FloatingOrb position={[4, 2, -6]} color="#6366f1" scale={1.5} />
            </Canvas>
        </div>
    );
}

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Torus, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

/** Central animated torus knot — the new hero 3D model */
function AnimatedTorusKnot() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.x = clock.getElapsedTime() * 0.12;
            ref.current.rotation.y = clock.getElapsedTime() * 0.18;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
            <TorusKnot ref={ref} args={[1.2, 0.35, 128, 32, 2, 3]}>
                <MeshDistortMaterial
                    color="#06b6d4"
                    emissive="#0e7490"
                    emissiveIntensity={0.4}
                    roughness={0.15}
                    metalness={0.85}
                    distort={0.15}
                    speed={2}
                    transparent
                    opacity={0.9}
                />
            </TorusKnot>
        </Float>
    );
}

/** Outer wireframe torus ring */
function WireframeTorus() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.x = Math.PI / 3 + clock.getElapsedTime() * 0.08;
            ref.current.rotation.z = clock.getElapsedTime() * 0.12;
        }
    });

    return (
        <Torus ref={ref} args={[2.8, 0.012, 16, 120]}>
            <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.2} />
        </Torus>
    );
}

/** Second tilted orbit ring */
function OrbitRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.x = Math.PI / 2 + Math.sin(clock.getElapsedTime() * speed) * 0.3;
            ref.current.rotation.z = clock.getElapsedTime() * speed * 0.5;
        }
    });

    return (
        <Torus ref={ref} args={[radius, 0.012, 16, 100]}>
            <meshBasicMaterial color={color} transparent opacity={0.3} />
        </Torus>
    );
}

/** Floating particles scattered around the model */
function Particles() {
    const count = 60;
    const ref = useRef<THREE.Points>(null!);
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 3.2 + Math.random() * 1.8;
            arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            arr[i * 3 + 2] = r * Math.cos(phi);
        }
        return arr;
    }, []);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.y = clock.getElapsedTime() * 0.04;
            ref.current.rotation.x = clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial color="#06b6d4" size={0.05} transparent opacity={0.5} sizeAttenuation />
        </points>
    );
}

export default function HeroScene() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 1.5]}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[8, 8, 8]} intensity={1.2} color="#06b6d4" />
                <pointLight position={[-8, -8, -5]} intensity={0.6} color="#6366f1" />
                <spotLight position={[0, 6, 6]} intensity={0.9} angle={0.4} penumbra={1} color="#06b6d4" />

                <AnimatedTorusKnot />
                <WireframeTorus />
                <OrbitRing radius={3.5} speed={0.25} color="#06b6d4" />
                <OrbitRing radius={4.0} speed={0.18} color="#6366f1" />
                <Particles />
            </Canvas>
        </div>
    );
}

"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GPUCanvas, useGPUTier } from "@/lib/gpu";
import type { GPUErrorBoundary as GPUErrorBoundaryType } from "@/lib/gpu";

// GPUErrorBoundary loaded client-only per W3 (SSR guard — wraps GPU canvas)
const GPUErrorBoundary = dynamic(
  () =>
    import("@/lib/gpu").then((m) => ({
      default: m.GPUErrorBoundary,
    })),
  { ssr: false },
) as typeof GPUErrorBoundaryType;

// ---------------------------------------------------------------------------
// Brand colors
// ---------------------------------------------------------------------------
const C = {
  orange: "#E8590C",
  darkOrange: "#C44A08",
  cream: "#FFF5ED",
  navy: "#1B3A5C",
  gold: "#E8A817",
  nose: "#2D1810",
  white: "#FFFFFF",
} as const;

// ---------------------------------------------------------------------------
// Geometry helpers — meshes built purely from Three.js primitives
// ---------------------------------------------------------------------------

function FoxScene({ animate }: { animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEarRef = useRef<THREE.Mesh>(null);
  const rightEarRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.04;
    }
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 0.8) * 0.08;
    }
    if (leftEarRef.current) {
      leftEarRef.current.rotation.z = Math.sin(t * 2) * 0.12;
    }
    if (rightEarRef.current) {
      rightEarRef.current.rotation.z = -Math.sin(t * 2) * 0.12;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ------------------------------------------------------------------ */}
      {/* BODY — CylinderGeometry, seated pose                               */}
      {/* ------------------------------------------------------------------ */}
      <mesh position={[0, -0.72, 0]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.5, 12]} />
        <meshStandardMaterial color={C.orange} roughness={0.35} metalness={0} emissive={C.orange} emissiveIntensity={0.35} />
      </mesh>

      {/* Chest — front white/cream sphere */}
      <mesh position={[0, -0.68, 0.22]}>
        <sphereGeometry args={[0.28, 14, 14]} />
        <meshStandardMaterial color={C.cream} roughness={0.7} metalness={0} />
      </mesh>

      {/* ------------------------------------------------------------------ */}
      {/* TAIL — CylinderGeometry rotated to curl behind body                */}
      {/* ------------------------------------------------------------------ */}
      {/* Main tail — orange */}
      <mesh
        ref={tailRef}
        position={[0.28, -0.78, -0.28]}
        rotation={[0.6, 0.3, -1.1]}
      >
        <cylinderGeometry args={[0.1, 0.15, 0.6, 10]} />
        <meshStandardMaterial color={C.orange} roughness={0.35} metalness={0} emissive={C.orange} emissiveIntensity={0.35} />
      </mesh>
      {/* Tail tip — cream */}
      <mesh position={[0.46, -0.64, -0.34]} rotation={[0.6, 0.3, -1.1]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color={C.cream} roughness={0.7} metalness={0} />
      </mesh>

      {/* ------------------------------------------------------------------ */}
      {/* HEAD GROUP                                                          */}
      {/* ------------------------------------------------------------------ */}
      <group ref={headRef} position={[0, -0.18, 0]}>
        {/* Head sphere — slightly squashed */}
        <mesh scale={[1, 0.9, 1]}>
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshStandardMaterial color={C.orange} roughness={0.35} metalness={0} emissive={C.orange} emissiveIntensity={0.35} />
        </mesh>

        {/* ---------------------------------------------------------------- */}
        {/* EARS                                                              */}
        {/* ---------------------------------------------------------------- */}
        {/* Left ear — outer orange */}
        <mesh
          ref={leftEarRef}
          position={[-0.3, 0.38, 0]}
          rotation={[0, 0, -0.28]}
        >
          <coneGeometry args={[0.18, 0.35, 4]} />
          <meshStandardMaterial color={C.orange} roughness={0.35} metalness={0} emissive={C.orange} emissiveIntensity={0.35} />
        </mesh>
        {/* Left ear — inner cream */}
        <mesh position={[-0.295, 0.38, 0.04]} rotation={[0, 0, -0.28]}>
          <coneGeometry args={[0.1, 0.26, 4]} />
          <meshStandardMaterial color={C.cream} roughness={0.7} metalness={0} />
        </mesh>

        {/* Right ear — outer orange */}
        <mesh
          ref={rightEarRef}
          position={[0.3, 0.38, 0]}
          rotation={[0, 0, 0.28]}
        >
          <coneGeometry args={[0.18, 0.35, 4]} />
          <meshStandardMaterial color={C.orange} roughness={0.35} metalness={0} emissive={C.orange} emissiveIntensity={0.35} />
        </mesh>
        {/* Right ear — inner cream */}
        <mesh position={[0.295, 0.38, 0.04]} rotation={[0, 0, 0.28]}>
          <coneGeometry args={[0.1, 0.26, 4]} />
          <meshStandardMaterial color={C.cream} roughness={0.7} metalness={0} />
        </mesh>

        {/* ---------------------------------------------------------------- */}
        {/* MUZZLE                                                            */}
        {/* ---------------------------------------------------------------- */}
        <mesh position={[0, -0.1, 0.4]} scale={[1.15, 0.85, 0.9]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={C.cream} roughness={0.7} metalness={0} />
        </mesh>

        {/* NOSE */}
        <mesh position={[0, 0.0, 0.55]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color={C.nose} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* ---------------------------------------------------------------- */}
        {/* EYES                                                              */}
        {/* ---------------------------------------------------------------- */}
        {/* Left eye */}
        <mesh position={[-0.17, 0.08, 0.43]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={C.navy} roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Left eye glint */}
        <mesh position={[-0.14, 0.11, 0.5]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color={C.white} roughness={0.1} metalness={0} />
        </mesh>

        {/* Right eye */}
        <mesh position={[0.17, 0.08, 0.43]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={C.navy} roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Right eye glint */}
        <mesh position={[0.2, 0.11, 0.5]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color={C.white} roughness={0.1} metalness={0} />
        </mesh>

        {/* ---------------------------------------------------------------- */}
        {/* CHEEK PATCHES                                                     */}
        {/* ---------------------------------------------------------------- */}
        {/* Left cheek */}
        <mesh position={[-0.3, -0.1, 0.35]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial
            color={C.cream}
            roughness={0.8}
            metalness={0}
            transparent
            opacity={0.55}
          />
        </mesh>
        {/* Right cheek */}
        <mesh position={[0.3, -0.1, 0.35]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial
            color={C.cream}
            roughness={0.8}
            metalness={0}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* ---------------------------------------------------------------- */}
        {/* GOLD STAR ACCENT — 5 thin boxes rotated in a star pattern        */}
        {/* Positioned above the head                                         */}
        {/* ---------------------------------------------------------------- */}
        {[0, 36, 72, 108, 144].map((deg, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((deg * Math.PI) / 180) * 0.06,
              0.62 + Math.sin((deg * Math.PI) / 180) * 0.06,
              0,
            ]}
            rotation={[0, 0, (deg * Math.PI) / 180]}
          >
            <boxGeometry args={[0.22, 0.04, 0.04]} />
            <meshStandardMaterial color={C.gold} roughness={0.3} metalness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// CSS-only fallback — rendered when GPU tier is 'css' (no WebGL/WebGPU)
// ---------------------------------------------------------------------------

function FoxFallback({ size }: { size: number }) {
  return (
    <svg
      role="img"
      aria-label="AMSIFOX mascot"
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* body */}
      <ellipse cx="40" cy="58" rx="18" ry="14" fill={C.orange} />
      {/* chest */}
      <ellipse cx="40" cy="55" rx="10" ry="9" fill={C.cream} />
      {/* head */}
      <circle cx="40" cy="34" r="20" fill={C.orange} />
      {/* left ear */}
      <polygon points="24,18 18,4 32,14" fill={C.orange} />
      <polygon points="25,16 21,8 30,14" fill={C.cream} />
      {/* right ear */}
      <polygon points="56,18 62,4 48,14" fill={C.orange} />
      <polygon points="55,16 59,8 50,14" fill={C.cream} />
      {/* muzzle */}
      <ellipse cx="40" cy="40" rx="10" ry="8" fill={C.cream} />
      {/* nose */}
      <ellipse cx="40" cy="36" rx="3" ry="2" fill={C.nose} />
      {/* eyes */}
      <circle cx="31" cy="29" r="4" fill={C.navy} />
      <circle cx="49" cy="29" r="4" fill={C.navy} />
      <circle cx="32" cy="28" r="1.2" fill={C.white} />
      <circle cx="50" cy="28" r="1.2" fill={C.white} />
      {/* tail */}
      <ellipse cx="58" cy="62" rx="8" ry="5" fill={C.orange} transform="rotate(-30 58 62)" />
      <ellipse cx="63" cy="58" rx="4" ry="3" fill={C.cream} transform="rotate(-30 63 58)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

interface AmsifoxModelProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const sizeMap: Record<NonNullable<AmsifoxModelProps["size"]>, number> = {
  sm: 48,
  md: 80,
  lg: 120,
};

export default function AmsifoxModel({
  size = "md",
  animate = true,
}: AmsifoxModelProps) {
  const canvasSize = sizeMap[size];
  const { tier, loading } = useGPUTier();

  // While probing GPU, render nothing to avoid layout shift
  if (loading) {
    return (
      <div
        style={{ width: canvasSize, height: canvasSize }}
        aria-hidden="true"
      />
    );
  }

  // CSS-only tier: GPU unavailable — render SVG fallback (no canvas)
  if (tier === "css") {
    return <FoxFallback size={canvasSize} />;
  }

  // webgpu or webgl tier: render the 3D canvas wrapped in error boundary
  return (
    <GPUErrorBoundary fallback={<FoxFallback size={canvasSize} />}>
      <div
        role="img"
        aria-label="AMSIFOX mascot — 3D animated fox"
        style={{ width: canvasSize, height: canvasSize }}
      >
        <GPUCanvas
          style={{ width: canvasSize, height: canvasSize }}
          camera={{ position: [0, 0.05, 1.7], fov: 38 }}
          rendererOpts={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[1, 2, 2]} intensity={1.0} color="#FFF8F0" />
          <directionalLight position={[-1, 0, 1]} intensity={0.4} color="#FFB347" />
          <FoxScene animate={animate} />
        </GPUCanvas>
      </div>
    </GPUErrorBoundary>
  );
}

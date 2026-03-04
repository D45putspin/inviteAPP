"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Sparkles, PerspectiveCamera } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import TemplateRenderer from "./templates/TemplateRenderer";

function hasWebGLSupport() {
    try {
        const canvas = document.createElement("canvas");
        return Boolean(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
    } catch {
        return false;
    }
}

function buildRenderProfile({ reducedMotion }) {
    if (typeof window === "undefined") {
        return {
            isMobile: false,
            quality: "lite",
            canRender3D: true,
            reducedMotion,
        };
    }

    const mobileQuery = window.matchMedia("(max-width: 900px)");
    const compactQuery = window.matchMedia("(max-height: 760px)");
    const canRender3D = hasWebGLSupport();
    const saveData = navigator.connection?.saveData === true;
    const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
    const isMobile = mobileQuery.matches;
    const isCompact = compactQuery.matches;
    const needsLite = reducedMotion || saveData || lowCpu || lowMemory || isMobile || isCompact;

    return {
        isMobile,
        quality: canRender3D ? (needsLite ? "lite" : "full") : "off",
        canRender3D,
        reducedMotion,
    };
}

function Scene({ template, quality, reducedMotion }) {
    // Select particle colors based on template
    const colors = useMemo(() => {
        switch (template) {
            case "floral": return "#10b981"; // Emerald particles
            case "minimal": return "#8B7355"; // Earthy brown/gold
            case "luxury": return "#FFD700"; // Bright Gold
            default: return "#ffffff";
        }
    }, [template]);

    const isLite = quality === "lite";

    return (
        <>
            <ambientLight intensity={isLite ? 0.35 : 0.5} />
            <directionalLight position={[10, 10, 5]} intensity={isLite ? 0.65 : 1} />

            <Float
                speed={reducedMotion ? 0 : isLite ? 1.1 : 2}
                rotationIntensity={reducedMotion ? 0 : isLite ? 0.22 : 0.5}
                floatIntensity={reducedMotion ? 0 : isLite ? 0.55 : 1}
            >
                <Sparkles
                    count={isLite ? 36 : 100}
                    scale={isLite ? 10 : 12}
                    size={isLite ? 3.2 : 5}
                    speed={reducedMotion ? 0 : isLite ? 0.15 : 0.3}
                    opacity={isLite ? 0.42 : 0.6}
                    color={colors}
                />
                {!isLite && (
                    <Sparkles
                        count={50}
                        scale={8}
                        size={10}
                        speed={0.1}
                        opacity={0.2}
                        color="#ffffff"
                    />
                )}
            </Float>
        </>
    );
}

export default function Invite3DView({ invite, children }) {
    const prefersReducedMotion = useReducedMotion();
    const [renderProfile, setRenderProfile] = useState(() => buildRenderProfile({ reducedMotion: false }));

    useEffect(() => {
        const updateProfile = () => {
            setRenderProfile(buildRenderProfile({ reducedMotion: Boolean(prefersReducedMotion) }));
        };

        updateProfile();
        window.addEventListener("resize", updateProfile);
        window.addEventListener("orientationchange", updateProfile);

        return () => {
            window.removeEventListener("resize", updateProfile);
            window.removeEventListener("orientationchange", updateProfile);
        };
    }, [prefersReducedMotion]);

    if (!invite) return null;

    const show3D = renderProfile.canRender3D && renderProfile.quality !== "off";
    const disableMotionFx = Boolean(prefersReducedMotion);

    return (
        <div className={`invite-3d-wrapper theme-${invite.template} ${show3D ? `three-d-${renderProfile.quality}` : "three-d-disabled"} ${renderProfile.isMobile ? "is-mobile" : ""}`}>
            {/* 3D Scene Layer */}
            <div className="canvas-layer">
                {show3D ? (
                    <Canvas
                        dpr={renderProfile.quality === "lite" ? [1, 1.25] : [1, 1.8]}
                        gl={{
                            alpha: true,
                            antialias: renderProfile.quality !== "lite",
                            powerPreference: renderProfile.quality === "lite" ? "low-power" : "high-performance",
                        }}
                        performance={{ min: 0.45, max: 1 }}
                    >
                        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                        <Scene template={invite.template} quality={renderProfile.quality} reducedMotion={Boolean(prefersReducedMotion)} />
                    </Canvas>
                ) : (
                    <div className="canvas-fallback-glow" />
                )}
            </div>

            {/* Content Layer with Framer Motion */}
            <div className="content-layer">
                <motion.div
                    initial={disableMotionFx ? false : { opacity: 0, y: 50, scale: 0.95 }}
                    animate={disableMotionFx ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
                    transition={disableMotionFx ? { duration: 0 } : { duration: 1.5, ease: "easeOut" }}
                    className="invite-content"
                >
                    <div className="immersive-template-container">
                        <TemplateRenderer invite={invite} isPreview={false}>
                            {children}
                        </TemplateRenderer>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}

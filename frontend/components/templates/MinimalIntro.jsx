import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MinimalIntro({ onOpen, onComplete }) {
    const [phase, setPhase] = useState('idle');
    const startedRef = useRef(false);

    const startSequence = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        setPhase('running');
    };

    useEffect(() => {
        const autoTimer = setTimeout(startSequence, 550);
        return () => clearTimeout(autoTimer);
    }, []);

    useEffect(() => {
        if (phase !== 'running') return undefined;
        const revealTimer = setTimeout(() => {
            setPhase('reveal');
            if (onOpen) onOpen();
        }, 1200);
        const fadeTimer = setTimeout(() => setPhase('fade'), 2050);
        const doneTimer = setTimeout(() => {
            setPhase('done');
            if (onComplete) onComplete();
        }, 2850);

        return () => {
            clearTimeout(revealTimer);
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, [phase, onOpen, onComplete]);

    if (phase === 'done') return null;

    const started = phase !== 'idle';
    const fadingOut = phase === 'fade' || phase === 'done';

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            onClick={startSequence}
            style={{
                background: 'radial-gradient(circle at 50% 40%, #f6f6f4 0%, #efefec 45%, #e7e7e3 100%)',
                opacity: fadingOut ? 0 : 1,
                transition: 'opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
                pointerEvents: fadingOut ? 'none' : 'auto'
            }}
        >
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(rgba(18,18,18,0.06) 0.7px, transparent 0.7px)',
                    backgroundSize: '3px 3px',
                    opacity: 0.45
                }}
            />
            <motion.div
                className="absolute rounded-full"
                initial={{ scale: 0.12, opacity: 0 }}
                animate={{
                    scale: started ? [0.12, 0.9, 1.4, 2.3] : 0.12,
                    opacity: started ? [0, 1, 0.65, 0] : 0
                }}
                transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '30vmin',
                    height: '30vmin',
                    background: 'radial-gradient(circle, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.82) 48%, rgba(10,10,10,0) 72%)',
                    filter: 'blur(0.2px)'
                }}
            />
            <motion.div
                className="relative z-10 flex flex-col items-center text-[#0a0a0a]"
                initial={{ opacity: 0 }}
                animate={{ opacity: started ? 1 : 0 }}
                transition={{ duration: 0.4 }}
            >
                <motion.p
                    className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase"
                    initial={{ y: 12, opacity: 0 }}
                    animate={started ? { y: [12, 0, 0, -8], opacity: [0, 1, 1, 0] } : { y: 12, opacity: 0 }}
                    transition={{ duration: 1.35, times: [0, 0.24, 0.8, 1], ease: 'easeInOut' }}
                >
                    Convite
                </motion.p>
                <motion.h1
                    className="mt-3 text-4xl md:text-6xl font-light tracking-[-0.04em]"
                    initial={{ y: 24, opacity: 0, filter: 'blur(6px)' }}
                    animate={started ? { y: [24, 0, 0, -16], opacity: [0, 1, 1, 0], filter: ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'] } : { y: 24, opacity: 0, filter: 'blur(6px)' }}
                    transition={{ duration: 1.9, delay: 0.35, times: [0, 0.22, 0.82, 1], ease: [0.22, 1, 0.36, 1] }}
                >
                    The Moment
                </motion.h1>
                <motion.p
                    className="mt-10 text-[11px] uppercase tracking-[0.18em] text-black/45"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: started ? 0 : 0.75 }}
                    transition={{ duration: 0.2 }}
                >
                    Toque para acelerar
                </motion.p>
            </motion.div>
        </div>
    );
}

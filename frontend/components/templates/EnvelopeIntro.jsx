import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function GoldParticle({ particle }) {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: 'radial-gradient(circle, rgba(252,246,186,0.95) 0%, rgba(212,175,55,0.7) 45%, rgba(212,175,55,0) 75%)',
                boxShadow: '0 0 10px rgba(212,175,55,0.45)'
            }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{
                opacity: [0, 0.66, 0.35, 0],
                scale: [0.2, 1.15, 0.95, 0.3],
                x: [0, particle.xDrift],
                y: [0, particle.yDrift]
            }}
            transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                repeatDelay: particle.repeatDelay,
                ease: 'easeOut'
            }}
        />
    );
}

export default function EnvelopeIntro({ invite, onOpen, onComplete }) {
    const [phase, setPhase] = useState('idle'); // idle, opening, reveal, fade, done
    const startedRef = useRef(false);

    const initials = invite?.names
        ? invite.names
            .split('&')
            .map((name) => name.trim()[0])
            .join(' & ')
            .substring(0, 5)
        : 'A & T';

    const particles = useMemo(
        () =>
            Array.from({ length: 16 }).map((_, id) => ({
                id,
                x: 16 + Math.random() * 68,
                y: 16 + Math.random() * 62,
                size: 2 + Math.random() * 3,
                delay: Math.random() * 2.6,
                duration: 2.8 + Math.random() * 1.8,
                repeatDelay: Math.random() * 1.6,
                xDrift: (Math.random() - 0.5) * 42,
                yDrift: -70 - Math.random() * 80
            })),
        []
    );

    const startSequence = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        setPhase('opening');
    };

    useEffect(() => {
        const autoTimer = setTimeout(startSequence, 760);
        return () => clearTimeout(autoTimer);
    }, []);

    useEffect(() => {
        if (phase !== 'opening') return undefined;
        const revealTimer = setTimeout(() => {
            setPhase('reveal');
            if (onOpen) onOpen();
        }, 1520);
        const fadeTimer = setTimeout(() => setPhase('fade'), 2240);
        const doneTimer = setTimeout(() => {
            setPhase('done');
            if (onComplete) onComplete();
        }, 3140);

        return () => {
            clearTimeout(revealTimer);
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, [phase, onOpen, onComplete]);

    if (phase === 'done') return null;

    const opened = phase !== 'idle';
    const fading = phase === 'fade';

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            onClick={startSequence}
            style={{
                background: 'radial-gradient(ellipse 70% 60% at 50% 42%, #1a1a1f 0%, #0a0a0f 58%, #050508 100%)',
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.9s cubic-bezier(0.65, 0, 0.35, 1)',
                pointerEvents: fading ? 'none' : 'auto'
            }}
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 40% at 50% 52%, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.02) 58%, rgba(0,0,0,0.55) 100%)'
                }}
            />
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((particle) => (
                    <GoldParticle key={particle.id} particle={particle} />
                ))}
            </div>

            <div
                style={{
                    position: 'relative',
                    width: 'min(90vw, 460px)',
                    aspectRatio: '1.6 / 1',
                    transformStyle: 'preserve-3d',
                    transform: opened ? 'translateY(-8px)' : 'translateY(0)',
                    transition: 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)',
                    cursor: opened ? 'default' : 'pointer'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '8px',
                        background: 'linear-gradient(130deg, #d4af37 0%, #fcf6ba 24%, #b38728 52%, #fbf5b7 76%, #aa771c 100%)',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)'
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        top: '7%',
                        left: '5%',
                        right: '5%',
                        bottom: '8%',
                        zIndex: 2,
                        borderRadius: '5px',
                        background: 'linear-gradient(160deg, #0b0b11 0%, #12121b 58%, #09090f 100%)',
                        border: '1px solid rgba(212,175,55,0.22)',
                        boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.55)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: opened ? 'translateY(-42%)' : 'translateY(0)',
                        transition: 'transform 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.42s'
                    }}
                >
                    <p
                        style={{
                            fontSize: '10px',
                            letterSpacing: '0.62em',
                            textTransform: 'uppercase',
                            color: 'rgba(212,175,55,0.55)',
                            marginBottom: '14px',
                            fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}
                    >
                        Convite
                    </p>
                    <h2
                        style={{
                            fontSize: 'clamp(32px, 8vw, 42px)',
                            fontFamily: '"Cinzel", serif',
                            fontWeight: 700,
                            margin: 0,
                            background:
                                'linear-gradient(135deg, #bf953f 0%, #fcf6ba 30%, #b38728 60%, #fbf5b7 80%, #aa771c 100%)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        {initials}
                    </h2>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 3,
                        background: '#1e1e24',
                        clipPath: 'polygon(0 0, 50% 45%, 0 100%)',
                        boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.32)'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 3,
                        background: '#25252c',
                        clipPath: 'polygon(100% 0, 50% 45%, 100% 100%)',
                        boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.32)'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 3,
                        background: '#2d2d36',
                        clipPath: 'polygon(0 100%, 50% 45%, 100% 100%)'
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: opened ? 1 : 4,
                        background: '#1b1b22',
                        clipPath: 'polygon(0 0, 100% 0, 50% 55%)',
                        transformOrigin: 'top',
                        transform: opened ? 'rotateX(180deg)' : 'rotateX(0deg)',
                        transition: 'transform 0.74s cubic-bezier(0.22, 1, 0.36, 1), z-index 0s 0.32s'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '55%',
                            left: '50%',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            transform: opened ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%) scale(1)',
                            opacity: opened ? 0 : 1,
                            transition: 'opacity 0.3s ease, transform 0.3s ease',
                            display: 'grid',
                            placeItems: 'center',
                            background: 'conic-gradient(from 0deg, #d4af37, #fcf6ba, #b38728, #d4af37)'
                        }}
                    >
                        <span
                            style={{
                                fontFamily: '"Cinzel", serif',
                                fontSize: '15px',
                                fontWeight: 700,
                                color: '#61430f'
                            }}
                        >
                            {initials}
                        </span>
                    </div>
                </div>

                <p
                    style={{
                        position: 'absolute',
                        bottom: '-48px',
                        width: '100%',
                        textAlign: 'center',
                        color: 'rgba(212,175,55,0.64)',
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        opacity: opened ? 0 : 0.85,
                        transition: 'opacity 0.2s ease',
                        animation: opened ? 'none' : 'introPulse 2.2s ease-in-out infinite'
                    }}
                >
                    Abrindo automaticamente... toque para acelerar
                </p>
            </div>

            <style>{`
                @keyframes introPulse {
                    0%, 100% { opacity: 0.45; transform: scale(1); }
                    50% { opacity: 0.95; transform: scale(1.04); }
                }
            `}</style>
        </div>
    );
}

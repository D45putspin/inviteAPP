import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function OceanIntro({ onOpen, onComplete }) {
    const [phase, setPhase] = useState('idle'); // idle, swell, break, fade, done
    const [bubbleCount, setBubbleCount] = useState(18);
    const [reducedMotion, setReducedMotion] = useState(false);

    const startedRef = useRef(false);
    const openedRef = useRef(false);
    const completedRef = useRef(false);
    const timersRef = useRef([]);

    const bubbles = useMemo(
        () =>
            Array.from({ length: bubbleCount }).map((_, id) => ({
                id,
                left: `${Math.random() * 100}%`,
                size: `${Math.random() * 2.6 + 1.4}px`,
                drift: `${Math.random() * 36 - 18}px`,
                delay: `${Math.random() * 2.2}s`,
                duration: `${Math.random() * 2.1 + 2.3}s`
            })),
        [bubbleCount]
    );

    const clearTimers = () => {
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current = [];
    };

    const queue = (callback, delay) => {
        const timer = setTimeout(callback, delay);
        timersRef.current.push(timer);
    };

    const safeOpen = () => {
        if (openedRef.current) return;
        openedRef.current = true;
        if (onOpen) onOpen();
    };

    const safeComplete = () => {
        if (completedRef.current) return;
        completedRef.current = true;
        if (onComplete) onComplete();
    };

    const finishQuickly = () => {
        clearTimers();
        safeOpen();
        setPhase('fade');
        queue(() => {
            setPhase('done');
            safeComplete();
        }, 280);
    };

    const runSequence = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        setPhase('swell');

        if (reducedMotion) {
            finishQuickly();
            return;
        }

        queue(() => setPhase('break'), 840);
        queue(() => {
            safeOpen();
            setPhase('fade');
        }, 1480);
        queue(() => {
            setPhase('done');
            safeComplete();
        }, 2320);
    };

    const accelerate = () => {
        if (phase === 'idle') {
            runSequence();
            return;
        }
        if (phase === 'swell' || phase === 'break') {
            finishQuickly();
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const compact = window.matchMedia('(max-width: 768px)').matches;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setBubbleCount(compact ? 10 : 18);
        setReducedMotion(reduce);
    }, []);

    useEffect(() => {
        const timer = setTimeout(runSequence, 600);
        return () => clearTimeout(timer);
    }, []);

    useEffect(
        () => () => {
            clearTimers();
        },
        []
    );

    if (phase === 'done') return null;

    return (
        <div
            className={`fixed inset-0 z-[100] overflow-hidden ocean-intro phase-${phase}`}
            onClick={accelerate}
            style={{
                opacity: phase === 'fade' ? 0 : 1,
                transition: 'opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
                pointerEvents: phase === 'fade' ? 'none' : 'auto'
            }}
        >
            <style>{`
                .ocean-intro {
                    display: grid;
                    place-items: center;
                    background: linear-gradient(180deg, #6ed6ef 0%, #2096c7 32%, #0a5c8c 64%, #053257 100%);
                }

                .ocean-intro::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(circle at 50% 16%, rgba(215, 250, 255, 0.6) 0%, rgba(215, 250, 255, 0.06) 35%, transparent 58%),
                        linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent 32%);
                    pointer-events: none;
                }

                .wave {
                    position: absolute;
                    left: -12%;
                    width: 124%;
                    border-radius: 48% 52% 0 0 / 24% 26% 0 0;
                    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
                    will-change: transform, opacity;
                }

                .wave-back {
                    height: 42vh;
                    bottom: -12vh;
                    background: linear-gradient(180deg, rgba(125, 230, 243, 0.72) 0%, rgba(16, 110, 164, 0.96) 100%);
                    animation: waveBobA 5.8s ease-in-out infinite;
                }

                .wave-mid {
                    height: 36vh;
                    bottom: -11vh;
                    background: linear-gradient(180deg, rgba(188, 246, 255, 0.76) 0%, rgba(25, 142, 198, 0.94) 100%);
                    animation: waveBobB 4.7s ease-in-out infinite;
                }

                .wave-front {
                    height: 30vh;
                    bottom: -10vh;
                    background: linear-gradient(180deg, rgba(220, 252, 255, 0.88) 0%, rgba(41, 167, 214, 0.96) 100%);
                    animation: waveBobA 4.1s ease-in-out infinite;
                    box-shadow: 0 -8px 18px rgba(214, 247, 255, 0.22);
                }

                .pearl-stage {
                    position: relative;
                    width: min(54vw, 220px);
                    aspect-ratio: 1;
                    display: grid;
                    place-items: center;
                    z-index: 3;
                }

                .pearl {
                    width: 100%;
                    height: 100%;
                    border-radius: 999px;
                    background:
                        radial-gradient(circle at 30% 28%, #ffffff 0%, #d6f4ff 30%, #84d8ee 62%, #2ca9d6 100%);
                    border: 3px solid rgba(230, 251, 255, 0.82);
                    box-shadow:
                        0 0 30px rgba(172, 239, 255, 0.82),
                        0 10px 24px rgba(3, 53, 89, 0.35);
                    transform: translateY(0) scale(1);
                    transition: transform 0.72s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
                    animation: pearlFloat 3.8s ease-in-out infinite;
                    will-change: transform, opacity;
                }

                .bubble {
                    position: absolute;
                    bottom: -10vh;
                    border-radius: 999px;
                    background: rgba(227, 250, 255, 0.8);
                    animation: bubbleLift linear infinite;
                    pointer-events: none;
                    will-change: transform, opacity;
                }

                .spray {
                    position: absolute;
                    width: min(120vw, 1200px);
                    height: min(120vw, 1200px);
                    border-radius: 999px;
                    opacity: 0;
                    pointer-events: none;
                    background: radial-gradient(circle, rgba(245, 254, 255, 0.95) 0%, rgba(179, 240, 250, 0.8) 28%, rgba(66, 195, 228, 0.26) 48%, transparent 62%);
                    transform: scale(0.25);
                    z-index: 2;
                }

                .foam {
                    position: absolute;
                    width: min(92vw, 960px);
                    height: 5px;
                    border-radius: 999px;
                    background: linear-gradient(90deg, transparent 0%, rgba(245, 253, 255, 0.95) 18%, rgba(245, 253, 255, 0.95) 82%, transparent 100%);
                    opacity: 0;
                    transform: scaleX(0.35);
                    pointer-events: none;
                    z-index: 4;
                }

                .foam-a { top: 43%; }
                .foam-b { top: 50%; width: min(76vw, 720px); }
                .foam-c { top: 57%; width: min(64vw, 620px); }

                .instruction {
                    position: absolute;
                    bottom: 9vh;
                    color: rgba(228, 249, 255, 0.8);
                    font-size: 11px;
                    letter-spacing: 0.32em;
                    text-transform: uppercase;
                    font-weight: 600;
                    animation: oceanHint 2.1s ease-in-out infinite;
                    z-index: 5;
                }

                .phase-swell .wave-back { transform: translateY(-12vh); }
                .phase-swell .wave-mid { transform: translateY(-14vh); }
                .phase-swell .wave-front { transform: translateY(-16vh); }
                .phase-swell .pearl { transform: translateY(8vh) scale(0.84); }

                .phase-break .wave-back,
                .phase-break .wave-mid,
                .phase-break .wave-front {
                    opacity: 0.45;
                }

                .phase-break .pearl,
                .phase-fade .pearl {
                    transform: translateY(16vh) scale(0.2);
                    opacity: 0;
                    animation: none;
                }

                .phase-break .spray {
                    animation: sprayBurst 1s cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
                }

                .phase-break .foam,
                .phase-fade .foam {
                    animation: foamSweep 0.78s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .phase-break .instruction,
                .phase-fade .instruction {
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                @keyframes waveBobA {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(-2.5%) translateY(-1.8vh); }
                }

                @keyframes waveBobB {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(2%) translateY(-1.3vh); }
                }

                @keyframes pearlFloat {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.03); }
                }

                @keyframes bubbleLift {
                    0% { transform: translate3d(0, 0, 0) scale(0.4); opacity: 0; }
                    14% { opacity: 0.7; }
                    100% { transform: translate3d(var(--drift, 0px), -112vh, 0) scale(1.2); opacity: 0; }
                }

                @keyframes sprayBurst {
                    0% { opacity: 0.9; transform: scale(0.2); }
                    100% { opacity: 0; transform: scale(2.3); }
                }

                @keyframes foamSweep {
                    0% { opacity: 0; transform: scaleX(0.35); }
                    30% { opacity: 0.95; }
                    100% { opacity: 0; transform: scaleX(1.18); }
                }

                @keyframes oceanHint {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.95; }
                }
            `}</style>

            {bubbles.map((bubble) => (
                <div
                    key={bubble.id}
                    className="bubble"
                    style={{
                        left: bubble.left,
                        width: bubble.size,
                        height: bubble.size,
                        animationDelay: bubble.delay,
                        animationDuration: bubble.duration,
                        '--drift': bubble.drift
                    }}
                />
            ))}

            <div className="wave wave-back" />
            <div className="wave wave-mid" />
            <div className="wave wave-front" />

            <div className="pearl-stage" onClick={accelerate}>
                <div className="pearl" />
            </div>

            <div className="spray" />
            <div className="foam foam-a" />
            <div className="foam foam-b" />
            <div className="foam foam-c" />

            <p className="instruction">{phase === 'idle' ? 'Toque para acelerar' : 'A mare esta abrindo'}</p>
        </div>
    );
}

import React, { useEffect, useMemo, useRef, useState } from 'react';

const PRELOAD_MS = 220;
const COUNT_STEP_MS = 1000;
const START_MS = 280;
const REVEAL_MS = 360;
const FADE_MS = 420;

export default function VintageIntro({ invite, onOpen, onComplete }) {
    const [phase, setPhase] = useState('idle'); // idle, preload, countdown, start, reveal, fade, done
    const [displayText, setDisplayText] = useState('');
    const [flashActive, setFlashActive] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    const startedRef = useRef(false);
    const openedRef = useRef(false);
    const completedRef = useRef(false);
    const timersRef = useRef([]);

    const filmTag = useMemo(() => {
        const a = (invite?.groomName || '').trim();
        const b = (invite?.brideName || '').trim();
        if (a || b) return `${a || 'Convidado'} & ${b || 'Convidada'}`;
        return 'VINTAGE EDITION';
    }, [invite?.brideName, invite?.groomName]);

    const clearTimers = () => {
        timersRef.current.forEach((timerId) => clearTimeout(timerId));
        timersRef.current = [];
    };

    const queue = (callback, delay) => {
        const timerId = setTimeout(callback, delay);
        timersRef.current.push(timerId);
    };

    const pulseFlash = (delay) => {
        queue(() => setFlashActive(true), delay);
        queue(() => setFlashActive(false), delay + 120);
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
        setDisplayText('START');
        setFlashActive(true);
        safeOpen();
        setPhase('reveal');

        queue(() => setFlashActive(false), 110);
        queue(() => setPhase('fade'), 130);
        queue(() => {
            setPhase('done');
            safeComplete();
        }, 420);
    };

    const runSequence = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        setPhase('preload');

        if (reducedMotion) {
            finishQuickly();
            return;
        }

        const t1 = PRELOAD_MS;
        const t2 = t1 + COUNT_STEP_MS;
        const t3 = t2 + COUNT_STEP_MS;
        const tStart = t3 + COUNT_STEP_MS;
        const tReveal = tStart + START_MS;
        const tFade = tReveal + REVEAL_MS;
        const tDone = tFade + FADE_MS;

        queue(() => {
            setPhase('countdown');
            setDisplayText('3');
        }, t1);

        pulseFlash(t2);
        queue(() => setDisplayText('2'), t2);

        pulseFlash(t3);
        queue(() => setDisplayText('1'), t3);

        pulseFlash(tStart);
        queue(() => {
            setPhase('start');
            setDisplayText('START');
        }, tStart);

        pulseFlash(tReveal);
        queue(() => {
            setPhase('reveal');
            safeOpen();
        }, tReveal);

        queue(() => setPhase('fade'), tFade);

        queue(() => {
            setPhase('done');
            safeComplete();
        }, tDone);
    };

    const accelerate = () => {
        if (phase === 'done' || phase === 'fade') return;
        if (phase === 'idle') {
            runSequence();
            return;
        }
        finishQuickly();
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setReducedMotion(reduce);
    }, []);

    useEffect(() => {
        const timerId = setTimeout(runSequence, 420);
        return () => clearTimeout(timerId);
    }, []);

    useEffect(
        () => () => {
            clearTimers();
        },
        []
    );

    if (phase === 'done') return null;

    const isReveal = phase === 'reveal' || phase === 'fade';

    return (
        <div
            className={`fixed inset-0 z-[100] overflow-hidden vintage-intro phase-${phase}`}
            onClick={accelerate}
            style={{
                background: isReveal ? '#f4ecd8' : '#1a1a1a',
                opacity: phase === 'fade' ? 0 : 1,
                transition: 'opacity 420ms ease, background-color 220ms linear',
                pointerEvents: phase === 'fade' ? 'none' : 'auto'
            }}
        >
            <style>{`
                .vintage-intro {
                    display: grid;
                    place-items: center;
                    color: #f4ecd8;
                }

                .film-frame {
                    position: relative;
                    width: min(92vw, 780px);
                    aspect-ratio: 16 / 10;
                    border: 1px solid rgba(244, 236, 216, 0.28);
                    background: radial-gradient(circle at 50% 42%, rgba(112, 66, 20, 0.18) 0%, rgba(26, 26, 26, 0.92) 65%, rgba(15, 15, 15, 1) 100%);
                    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.48), inset 0 0 0 1px rgba(112, 66, 20, 0.5);
                    overflow: hidden;
                    animation: filmJitter 150ms steps(2, end) infinite;
                    will-change: transform;
                }

                .film-frame::before,
                .film-frame::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: clamp(10px, 2.5vw, 18px);
                    background: rgba(0, 0, 0, 0.72);
                    z-index: 6;
                }

                .film-frame::before { top: 0; }
                .film-frame::after { bottom: 0; }

                .film-grain,
                .film-scratches,
                .film-vignette,
                .film-content,
                .film-flash {
                    position: absolute;
                    inset: 0;
                }

                .film-grain {
                    z-index: 2;
                    opacity: 0.2;
                    background-image:
                        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.26) 0.4px, transparent 1px),
                        radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.22) 0.6px, transparent 1.2px),
                        radial-gradient(circle at 60% 70%, rgba(255, 255, 255, 0.18) 0.4px, transparent 1px);
                    background-size: 3px 3px, 4px 4px, 5px 5px;
                    animation: grainMove 1.6s steps(10, end) infinite;
                    mix-blend-mode: screen;
                    pointer-events: none;
                }

                .film-scratches {
                    z-index: 3;
                    opacity: 0.24;
                    background-image:
                        linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%),
                        linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.28) 50%, transparent 100%),
                        linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.35) 50%, transparent 100%);
                    background-size: 1px 100%, 2px 100%, 1px 100%;
                    background-position: 18% 0, 62% 0, 84% 0;
                    background-repeat: no-repeat;
                    animation: scratchShift 2.4s steps(1, end) infinite;
                    pointer-events: none;
                }

                .film-vignette {
                    z-index: 4;
                    background: radial-gradient(circle at center, transparent 38%, rgba(0, 0, 0, 0.72) 100%);
                    pointer-events: none;
                }

                .film-content {
                    z-index: 5;
                    display: grid;
                    place-items: center;
                    text-align: center;
                    padding: 14px 18px;
                }

                .leader {
                    letter-spacing: 0.45em;
                    text-transform: uppercase;
                    font-family: 'Playfair Display', 'Times New Roman', serif;
                    font-size: clamp(10px, 2.2vw, 14px);
                    color: rgba(244, 236, 216, 0.74);
                }

                .count-number {
                    font-family: 'Bebas Neue', 'Arial Narrow', Arial, sans-serif;
                    font-size: clamp(6rem, 36vw, 18rem);
                    line-height: 0.82;
                    letter-spacing: 0.04em;
                    color: #f4ecd8;
                    text-shadow: 0 0 24px rgba(112, 66, 20, 0.38);
                }

                .start-word {
                    font-family: 'Playfair Display', 'Times New Roman', serif;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    font-size: clamp(2rem, 10vw, 5rem);
                    color: #f4ecd8;
                }

                .name-tag {
                    margin-top: clamp(8px, 2vw, 14px);
                    font-size: clamp(10px, 2.3vw, 14px);
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(244, 236, 216, 0.62);
                    font-family: 'Playfair Display', 'Times New Roman', serif;
                }

                .phase-reveal .film-frame,
                .phase-fade .film-frame {
                    border-color: rgba(112, 66, 20, 0.3);
                    box-shadow: 0 10px 28px rgba(112, 66, 20, 0.2), inset 0 0 0 1px rgba(112, 66, 20, 0.35);
                    background: #f4ecd8;
                }

                .phase-reveal .film-grain,
                .phase-fade .film-grain,
                .phase-reveal .film-scratches,
                .phase-fade .film-scratches,
                .phase-reveal .film-vignette,
                .phase-fade .film-vignette,
                .phase-reveal .film-content,
                .phase-fade .film-content {
                    opacity: 0;
                    transition: opacity 280ms ease;
                }

                .film-flash {
                    z-index: 7;
                    background: #fff;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 70ms linear;
                }

                .film-flash.is-active {
                    opacity: 0.86;
                }

                .accelerate-trigger {
                    position: absolute;
                    left: 50%;
                    bottom: max(20px, env(safe-area-inset-bottom));
                    transform: translateX(-50%);
                    border: 1px solid rgba(244, 236, 216, 0.45);
                    color: rgba(244, 236, 216, 0.86);
                    background: rgba(26, 26, 26, 0.42);
                    font-family: 'Bebas Neue', 'Arial Narrow', Arial, sans-serif;
                    font-size: 12px;
                    letter-spacing: 0.24em;
                    text-transform: uppercase;
                    padding: 8px 14px;
                    transition: opacity 160ms ease, transform 160ms ease;
                    backdrop-filter: blur(1px);
                }

                .accelerate-trigger:active {
                    transform: translateX(-50%) scale(0.98);
                }

                .phase-reveal .accelerate-trigger,
                .phase-fade .accelerate-trigger {
                    opacity: 0;
                    pointer-events: none;
                }

                @keyframes filmJitter {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(1px, 0); }
                    50% { transform: translate(0, 1px); }
                    75% { transform: translate(-1px, 0); }
                    100% { transform: translate(0, -1px); }
                }

                @keyframes grainMove {
                    0% { transform: translate3d(0, 0, 0); }
                    20% { transform: translate3d(-2%, 1%, 0); }
                    40% { transform: translate3d(1%, -2%, 0); }
                    60% { transform: translate3d(-1%, 1%, 0); }
                    80% { transform: translate3d(2%, -1%, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }

                @keyframes scratchShift {
                    0%, 70% {
                        opacity: 0.16;
                        transform: translateX(0);
                    }
                    73% {
                        opacity: 0.34;
                        transform: translateX(1px);
                    }
                    76% {
                        opacity: 0.2;
                        transform: translateX(-1px);
                    }
                    100% {
                        opacity: 0.16;
                        transform: translateX(0);
                    }
                }

                @media (max-width: 640px) {
                    .film-frame {
                        width: min(96vw, 680px);
                    }

                    .accelerate-trigger {
                        font-size: 11px;
                        letter-spacing: 0.2em;
                        padding: 7px 12px;
                    }
                }
            `}</style>

            <div className="film-frame" aria-live="polite">
                <div className="film-grain" />
                <div className="film-scratches" />
                <div className="film-vignette" />

                <div className="film-content">
                    {!displayText && <p className="leader">Picture Leader</p>}

                    {phase === 'countdown' && <div className="count-number">{displayText}</div>}

                    {phase === 'start' && <div className="start-word">{displayText}</div>}

                    {(phase === 'preload' || phase === 'countdown' || phase === 'start') && (
                        <p className="name-tag">{filmTag}</p>
                    )}
                </div>

                <div className={`film-flash ${flashActive ? 'is-active' : ''}`} />
            </div>

            <button
                type="button"
                className="accelerate-trigger"
                onClick={(event) => {
                    event.stopPropagation();
                    accelerate();
                }}
            >
                Accelerate
            </button>
        </div>
    );
}

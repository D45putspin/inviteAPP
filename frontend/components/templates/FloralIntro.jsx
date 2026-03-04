import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloralIntro({ onOpen }) {
    const [isBlooming, setIsBlooming] = useState(false);
    const [isExploding, setIsExploding] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isDone, setIsDone] = useState(false);

    if (isDone) return null;

    const handlePlantClick = () => {
        if (isBlooming) return;
        setIsBlooming(true);

        // 1. Iniciar o crescimento (caule, folhas, pétalas)

        // 2. Aguardar que a flor abra totalmente e o núcleo brilhe (2.8s)
        setTimeout(() => {
            // 3. Fazer o núcleo explodir de luz para cobrir o ecrã
            setIsExploding(true);

            setTimeout(() => {
                // 4. Esconder a cena escura revelando o template por baixo
                setIsFadingOut(true);
                if (onOpen) onOpen(); // Call onOpen here

                setTimeout(() => {
                    setIsDone(true);
                }, 1500); // Duração do fade out da cena

            }, 600); // Tempo para o ecrã ficar branco com a expansão do núcleo

        }, 2800); // Tempo total para a flor abrir completamente antes da explosão de luz
    };

    useEffect(() => {
        if (isBlooming) return;
        const timer = setTimeout(() => handlePlantClick(), 700);
        return () => clearTimeout(timer);
    }, [isBlooming]);

    return (
        <div
            id="floral-scene"
            className={isFadingOut ? 'fade-out' : ''}
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, #064e3b 0%, #022c22 100%)',
                zIndex: 100,
                transition: 'opacity 1.5s cubic-bezier(0.7, 0, 0.3, 1)',
                opacity: isFadingOut ? 0 : 1,
                pointerEvents: isFadingOut ? 'none' : 'auto'
            }}
        >
            <div
                id="floral-plant"
                className={`plant-container ${isBlooming ? 'is-blooming' : ''} ${isExploding ? 'explode' : ''}`}
                onClick={handlePlantClick}
                style={{
                    position: 'relative',
                    width: '300px',
                    height: '400px',
                    cursor: isBlooming ? 'default' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    transform: 'translateY(50px)'
                }}
            >
                <div className="seed-glow"></div>
                <div className="seed"></div>

                <div className="stem"></div>
                <div className="leaf leaf-left"></div>
                <div className="leaf leaf-right"></div>

                <div className="flower">
                    {/* Pétalas Grandes (Fundo) */}
                    <div className="petal p1"></div>
                    <div className="petal p2"></div>
                    <div className="petal p3"></div>
                    <div className="petal p4"></div>
                    <div className="petal p5"></div>
                    <div className="petal p6"></div>
                    <div className="petal p7"></div>
                    <div className="petal p8"></div>

                    {/* Pétalas Pequenas (Frente) */}
                    <div className="petal petal-small sp1"></div>
                    <div className="petal petal-small sp2"></div>
                    <div className="petal petal-small sp3"></div>
                    <div className="petal petal-small sp4"></div>
                    <div className="petal petal-small sp5"></div>
                    <div className="petal petal-small sp6"></div>
                    <div className="petal petal-small sp7"></div>
                    <div className="petal petal-small sp8"></div>

                    {/* Núcleo Luminoso */}
                    <div className="core"></div>
                </div>

                <p className="instruction-text font-medium" style={{ opacity: isBlooming ? 0 : 1 }}>
                    Toque para florescer
                </p>
            </div>

            <style>{`
                /* HOVER EFFECT */
                .plant-container:not(.is-blooming):hover .seed-glow {
                    opacity: 0.8 !important;
                    transform: scale(1.2);
                }

                /* Semente Inicial */
                .seed {
                    width: 16px;
                    height: 24px;
                    background: linear-gradient(135deg, #10b981, #047857);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    position: absolute;
                    bottom: 40px;
                    z-index: 10;
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
                    transition: opacity 0.5s ease;
                }

                .seed-glow {
                    width: 40px;
                    height: 40px;
                    background: radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, transparent 70%);
                    position: absolute;
                    bottom: 32px;
                    border-radius: 50%;
                    opacity: 0.4;
                    transition: all 0.3s ease;
                    pointer-events: none;
                }

                /* Tronco/Caule */
                .stem {
                    position: absolute;
                    bottom: 50px;
                    width: 4px;
                    height: 0;
                    background: linear-gradient(to top, #047857, #10b981);
                    border-radius: 4px;
                    transform-origin: bottom center;
                    transition: height 1.2s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 5;
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
                }

                /* Folhas */
                .leaf {
                    position: absolute;
                    width: 40px;
                    height: 20px;
                    background: linear-gradient(135deg, #34d399, #059669);
                    border-radius: 0 20px 0 20px;
                    opacity: 0;
                    transform: scale(0);
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease;
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
                }

                .leaf-left {
                    bottom: 120px;
                    left: calc(50% - 40px);
                    transform-origin: bottom right;
                }

                .leaf-right {
                    bottom: 160px;
                    right: calc(50% - 40px);
                    border-radius: 20px 0 20px 0;
                    transform-origin: bottom left;
                }

                /* A Flor */
                .flower {
                    position: absolute;
                    bottom: 230px;
                    width: 0;
                    height: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 20;
                }

                .petal {
                    position: absolute;
                    width: 30px;
                    height: 90px;
                    background: linear-gradient(to top, #0ea5e9, #34d399, #a7f3d0);
                    border-radius: 50%;
                    transform-origin: bottom center;
                    bottom: 0;
                    opacity: 0;
                    mix-blend-mode: screen;
                    box-shadow: 0 0 20px rgba(52, 211, 153, 0.4);
                    transition: transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.5s ease;
                }

                .petal-small {
                    width: 20px;
                    height: 60px;
                    background: linear-gradient(to top, #6366f1, #2dd4bf, #f0fdf4);
                    z-index: 21;
                }

                /* Núcleo Brilhante */
                .core {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: #ffffff;
                    border-radius: 50%;
                    bottom: -10px;
                    box-shadow: 0 0 30px 10px rgba(255, 255, 255, 0.8), 0 0 60px 20px rgba(16, 185, 129, 0.6);
                    opacity: 0;
                    transform: scale(0);
                    z-index: 25;
                    transition: transform 1s ease, opacity 1s ease;
                }

                /* Texto de Instrução */
                .instruction-text {
                    position: absolute;
                    bottom: 0;
                    color: #a7f3d0;
                    font-size: 0.9rem;
                    letter-spacing: 0.05em;
                    transition: opacity 0.3s;
                    animation: floralPulse 2s infinite;
                }

                @keyframes floralPulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }

                /* =========================================
                   ANIMAÇÕES DE FLORESCIMENTO (.is-blooming)
                   ========================================= */

                .is-blooming .seed { opacity: 0; }
                .is-blooming .seed-glow { opacity: 0; }
                .is-blooming .instruction-text { animation: none; }

                .is-blooming .stem { height: 180px; }

                .is-blooming .leaf-left {
                    opacity: 1;
                    transform: scale(1) rotate(-15deg);
                    transition-delay: 0.4s;
                }

                .is-blooming .leaf-right {
                    opacity: 1;
                    transform: scale(1) rotate(15deg);
                    transition-delay: 0.6s;
                }

                /* Pétalas Grandes */
                .is-blooming .p1 { opacity: 0.8; transform: scale(1) rotate(0deg); transition-delay: 1.0s; }
                .is-blooming .p2 { opacity: 0.8; transform: scale(1) rotate(45deg); transition-delay: 1.1s; }
                .is-blooming .p3 { opacity: 0.8; transform: scale(1) rotate(90deg); transition-delay: 1.2s; }
                .is-blooming .p4 { opacity: 0.8; transform: scale(1) rotate(135deg); transition-delay: 1.3s; }
                .is-blooming .p5 { opacity: 0.8; transform: scale(1) rotate(180deg); transition-delay: 1.4s; }
                .is-blooming .p6 { opacity: 0.8; transform: scale(1) rotate(225deg); transition-delay: 1.5s; }
                .is-blooming .p7 { opacity: 0.8; transform: scale(1) rotate(270deg); transition-delay: 1.6s; }
                .is-blooming .p8 { opacity: 0.8; transform: scale(1) rotate(315deg); transition-delay: 1.7s; }

                /* Pétalas Pequenas */
                .is-blooming .sp1 { opacity: 0.9; transform: scale(1) rotate(22.5deg); transition-delay: 1.4s; }
                .is-blooming .sp2 { opacity: 0.9; transform: scale(1) rotate(67.5deg); transition-delay: 1.5s; }
                .is-blooming .sp3 { opacity: 0.9; transform: scale(1) rotate(112.5deg); transition-delay: 1.6s; }
                .is-blooming .sp4 { opacity: 0.9; transform: scale(1) rotate(157.5deg); transition-delay: 1.7s; }
                .is-blooming .sp5 { opacity: 0.9; transform: scale(1) rotate(202.5deg); transition-delay: 1.8s; }
                .is-blooming .sp6 { opacity: 0.9; transform: scale(1) rotate(247.5deg); transition-delay: 1.9s; }
                .is-blooming .sp7 { opacity: 0.9; transform: scale(1) rotate(292.5deg); transition-delay: 2.0s; }
                .is-blooming .sp8 { opacity: 0.9; transform: scale(1) rotate(337.5deg); transition-delay: 2.1s; }

                /* Acender o núcleo */
                .is-blooming .core {
                    opacity: 1;
                    transform: scale(1);
                    transition-delay: 2.2s;
                }

                /* Efeito de flash/explosão que revela a página */
                .explode .core {
                    transform: scale(250);
                    background-color: #fdf8f5; /* Match theme-floral background to make the transition seamless */
                    transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1), background-color 0.5s;
                }
            `}</style>
        </div>
    );
}

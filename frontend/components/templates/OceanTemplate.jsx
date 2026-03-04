import React from 'react';
import { motion } from 'framer-motion';
import Countdown from './Countdown';

export default function OceanTemplate({ invite, isPreview, children }) {
    const revealVar = {
        hidden: { opacity: 0, y: 26 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } }
    };

    return (
        <div className={`template-ocean ${isPreview ? 'preview-mode' : 'full-mode'} web-page-layout min-h-screen relative overflow-hidden`} style={{ fontFamily: '"Montserrat", sans-serif' }}>
            <div className="absolute inset-0 pointer-events-none ocean-gradient-overlay" />
            <div className="absolute inset-x-0 top-0 h-48 pointer-events-none ocean-wave-top" />

            <section className="wp-section hero-section relative z-10 flex flex-col justify-center min-h-screen" style={{ padding: 0 }}>
                <motion.div
                    className="content-card text-center w-full max-w-5xl mx-auto px-6"
                    style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.25 }}
                >
                    <span className="text-[10px] uppercase tracking-[0.5em] text-[#00838f] mb-7 block font-medium">Junto ao mar</span>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 text-[#004d40] leading-tight" style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 400 }}>
                        {invite.names}
                    </h1>

                    <p className="text-xl md:text-3xl mb-8 text-[#00838f] tracking-[0.1em] md:tracking-[0.18em] font-light">
                        {invite.date}
                    </p>

                    <p className="max-w-2xl mx-auto text-base md:text-2xl leading-relaxed mb-10 text-[#006064]/80 font-light">
                        "{invite.message}"
                    </p>

                    <div className="ocean-countdown-wrap inline-block mb-4">
                        <Countdown targetDate={invite.date} />
                    </div>
                </motion.div>
            </section>

            <section className="wp-section relative z-10 py-24 md:py-28 border-t border-white/25">
                <div className="max-w-6xl mx-auto w-full px-6">
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
                        <motion.div className="ocean-surface p-8 md:p-10 text-center relative" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <div className="absolute top-4 right-6">
                                {invite.ceremonyTime && <span className="text-[#00838f]/60 font-medium text-xs tracking-wider">{invite.ceremonyTime}</span>}
                            </div>
                            <h3 className="text-xs uppercase tracking-[0.3em] font-semibold text-[#00838f] mb-4">Cerimonia</h3>
                            <h4 className="text-3xl md:text-4xl mb-5 text-[#004d40]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>{invite.location}</h4>
                            <p className="text-[#006064]/80 leading-relaxed font-light text-base md:text-lg">
                                {invite.ceremonyText || "Com a brisa do oceano e o por do sol, trocaremos nossos votos ao lado da familia e amigos."}
                            </p>
                        </motion.div>

                        <motion.div className="ocean-surface ocean-surface-contrast p-8 md:p-10 text-center relative" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <div className="absolute top-4 right-6">
                                {invite.receptionTime && <span className="text-[#00838f]/60 font-medium text-xs tracking-wider">{invite.receptionTime}</span>}
                            </div>
                            <h3 className="text-xs uppercase tracking-[0.3em] font-semibold text-[#00838f] mb-4">Celebracao</h3>
                            <h4 className="text-3xl md:text-4xl mb-5 text-[#004d40]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>{invite.title}</h4>
                            <p className="text-[#006064]/80 leading-relaxed font-light text-base md:text-lg">
                                {invite.receptionText || "A festa continua com jantar, musica e danca a beira-mar em uma noite feita para celebrar."}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="wp-section relative z-10 py-24 md:py-28 border-t border-white/25">
                <motion.div className="max-w-3xl mx-auto text-center w-full px-6" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <h3 className="text-4xl md:text-5xl mb-4 text-[#004d40]" style={{ fontFamily: '"Playfair Display", serif' }}>Confirme sua Presenca</h3>
                    <p className="mb-12 text-base text-[#00838f]/80 font-light">Ajude-nos a preparar cada detalhe deste dia especial.</p>

                    <div className="rsvp-injected-container form-ocean mb-14 ocean-rsvp-card">
                        {children}
                    </div>

                    <footer className="mt-10">
                        <p className="text-4xl md:text-5xl text-[#004d40]" style={{ fontFamily: '"Great Vibes", cursive' }}>{invite.names}</p>
                    </footer>
                </motion.div>
            </section>
        </div>
    );
}

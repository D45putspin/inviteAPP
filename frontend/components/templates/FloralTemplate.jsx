import React from 'react';
import { motion } from 'framer-motion';
import Countdown from './Countdown';

export default function FloralTemplate({ invite, isPreview, children }) {
    const revealVar = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: 'easeOut' } }
    };

    return (
        <div className={`template-floral ${isPreview ? 'preview-mode' : 'full-mode'} web-page-layout relative overflow-hidden`}>
            {/* Soft Green Pattern Background */}
            <div className="absolute inset-0 pointer-events-none floral-noise-overlay" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_60%)] pointer-events-none" />

            <section className="wp-section hero-section relative z-10" style={{ padding: 0 }}>
                <motion.div
                    className="content-card text-center relative overflow-hidden w-full max-w-4xl mx-auto rounded-[2.25rem] shadow-2xl shadow-emerald-900/5"
                    initial={{ scale: 0.96, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                >
                    <div className="floral-panel">
                        <span className="font-sans text-[11px] uppercase tracking-[0.38em] text-[#059669] block mb-6 md:mb-7 font-medium">{invite.title}</span>
                        <h1 className="names text-5xl md:text-7xl lg:text-8xl mb-6 md:mb-8 mt-2 leading-tight" style={{ fontFamily: '"Great Vibes", cursive', color: '#064e3b' }}>
                            {invite.names}
                        </h1>
                        <p className="text-lg md:text-2xl tracking-[0.2em] uppercase text-[#047857]" style={{ fontFamily: '"Cinzel", serif' }}>
                            {invite.date}
                        </p>

                        <div className="mx-auto my-9 md:my-10 w-24 h-px bg-gradient-to-r from-transparent via-[#34d399] to-transparent opacity-80" />

                        <p className="max-w-2xl mx-auto leading-relaxed text-base md:text-xl mb-10 md:mb-12 px-4 text-[#064e3b]" style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic' }}>
                            "{invite.message}"
                        </p>

                        <div className="pb-4">
                            <Countdown targetDate={invite.date} />
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="wp-section relative z-10" style={{ minHeight: 'auto', padding: '110px 24px' }}>
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-14 w-full" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#064e3b' }}>
                    <motion.div className="floral-surface p-8 md:p-10 text-center md:text-left" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            {invite.ceremonyTime && <span className="text-[#059669]/70 font-sans text-xs font-semibold tracking-wider mt-2">{invite.ceremonyTime}</span>}
                        </div>
                        <h3 className="text-xl text-[#059669] uppercase tracking-[0.25em] mb-4" style={{ fontFamily: '"Cinzel", serif' }}>Cerimonia</h3>
                        <p className="text-2xl md:text-3xl font-semibold italic mb-4">{invite.location}</p>
                        <p className="text-lg leading-relaxed opacity-90">
                            {invite.ceremonyText || "Um momento de partilha em um ambiente especial. Esperamos voce para celebrar o inicio do nosso para sempre."}
                        </p>
                    </motion.div>

                    <motion.div className="floral-surface p-8 md:p-10 text-center md:text-left" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                </svg>
                            </div>
                            {invite.receptionTime && <span className="text-[#059669]/70 font-sans text-xs font-semibold tracking-wider mt-2">{invite.receptionTime}</span>}
                        </div>
                        <h3 className="text-xl text-[#059669] uppercase tracking-[0.25em] mb-4" style={{ fontFamily: '"Cinzel", serif' }}>Celebracao</h3>
                        <p className="text-2xl md:text-3xl font-semibold italic mb-4">{invite.title}</p>
                        <p className="text-lg leading-relaxed opacity-90">
                            {invite.receptionText || "Apos a cerimonia, continuamos com jantar, musica e uma noite inesquecivel ao lado de quem amamos."}
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="wp-section relative z-10" style={{ padding: '90px 24px 130px' }}>
                <motion.div
                    className="max-w-4xl mx-auto text-center w-full rounded-[2.5rem] overflow-hidden floral-rsvp-wrap"
                    variants={revealVar}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <div className="p-8 md:p-14">
                        <h3 className="text-3xl md:text-4xl mb-10" style={{ fontFamily: '"Cinzel", serif', color: '#047857' }}>Confirme sua Presenca</h3>

                        <div className="rsvp-injected-container form-floral mb-12 mx-auto">
                            {children}
                        </div>

                        <footer className="mt-10 pt-8 border-t border-[#34d399]/30">
                            <p className="text-4xl md:text-5xl mb-4 text-[#064e3b]" style={{ fontFamily: '"Great Vibes", cursive' }}>{invite.names}</p>
                            <p className="font-sans text-[10px] tracking-[0.45em] text-[#059669] uppercase font-semibold">Com amor e alegria</p>
                        </footer>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

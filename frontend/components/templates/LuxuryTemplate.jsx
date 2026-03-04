import React from 'react';
import { motion } from 'framer-motion';
import Countdown from './Countdown';

export default function LuxuryTemplate({ invite, isPreview, children }) {
    const revealVar = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } }
    };

    return (
        <div className={`template-luxury ${isPreview ? 'preview-mode' : 'full-mode'} web-page-layout min-h-screen`}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] rounded-full bg-[#d4af37]/10 blur-3xl opacity-25" />
                <div className="absolute inset-0 luxury-grid-overlay" />
            </div>

            <section className="wp-section hero-section relative z-10 flex flex-col justify-center min-h-screen border-b border-[#d4af37]/15" style={{ padding: 0 }}>
                <motion.div
                    className="content-card text-center w-full max-w-5xl mx-auto px-6"
                    style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                    <p className="font-sans text-[10px] tracking-[0.52em] uppercase text-[#d4af37]/65 block mb-8 font-medium">Pela Graca do Amor</p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] leading-tight" style={{ fontFamily: '"Cinzel", serif' }}>
                        {invite.names}
                    </h1>
                    <p className="text-xl md:text-2xl italic font-light text-[#d4af37]/80 tracking-[0.18em] md:tracking-[0.25em]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                        {invite.date}
                    </p>

                    <div className="flex items-center justify-center gap-4 my-10 md:my-12 opacity-55">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
                        <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
                    </div>

                    <p className="max-w-2xl mx-auto leading-relaxed text-lg md:text-2xl mb-12 text-[#d4af37]/85" style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 300 }}>
                        "{invite.message}"
                    </p>

                    <div className="mb-12">
                        <Countdown targetDate={invite.date} />
                    </div>
                </motion.div>
            </section>

            <section className="wp-section relative z-10 border-b border-[#d4af37]/12" style={{ minHeight: 'auto', padding: '130px 24px' }}>
                <div className="max-w-6xl mx-auto w-full" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-16 w-full">
                        <motion.div className="luxury-surface p-8 md:p-10 relative" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
                            <div className="flex justify-between items-center mb-4 border-b border-[#d4af37]/10 pb-4">
                                <h3 className="text-[#d4af37]/60 uppercase tracking-[0.35em] font-sans text-[10px]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Onde e quando</h3>
                                {invite.ceremonyTime && <span className="text-[#d4af37]/70 font-sans text-[11px] font-medium">{invite.ceremonyTime}</span>}
                            </div>
                            <h4 className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] to-[#fcf6ba] mb-5" style={{ fontFamily: '"Cinzel", serif' }}>A cerimonia</h4>
                            <p className="text-2xl italic text-[#d4af37]/90 mb-4">{invite.location}</p>
                            <p className="text-lg leading-relaxed text-[#d4af37]/62 font-light">
                                {invite.ceremonyText || "A celebracao comeca no horario marcado em um ambiente sofisticado, com dress code formal."}
                            </p>
                        </motion.div>

                        <motion.div className="luxury-surface p-8 md:p-10 relative" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
                            <div className="flex justify-between items-center mb-4 border-b border-[#d4af37]/10 pb-4">
                                <h3 className="text-[#d4af37]/60 uppercase tracking-[0.35em] font-sans text-[10px]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Celebracao</h3>
                                {invite.receptionTime && <span className="text-[#d4af37]/70 font-sans text-[11px] font-medium">{invite.receptionTime}</span>}
                            </div>
                            <h4 className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] to-[#fcf6ba] mb-5" style={{ fontFamily: '"Cinzel", serif' }}>Recepcao</h4>
                            <p className="text-2xl italic text-[#d4af37]/90 mb-4">{invite.title}</p>
                            <p className="text-lg leading-relaxed text-[#d4af37]/62 font-light">
                                {invite.receptionText || "Depois da cerimonia, seguiremos para um jantar especial e uma noite de celebracao."}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="wp-section relative z-10 overflow-hidden" style={{ minHeight: 'auto', padding: '130px 24px' }}>
                <motion.div className="max-w-3xl mx-auto text-center w-full relative" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
                    <div className="mb-14">
                        <h3 className="text-4xl md:text-5xl tracking-[0.2em] text-[#d4af37]" style={{ fontFamily: '"Cinzel", serif' }}>R.S.V.P</h3>
                    </div>

                    <div className="rsvp-injected-container form-luxury mb-16">
                        {children}
                    </div>

                    <footer className="mt-14 pt-10 border-t border-[#d4af37]/20 relative">
                        <p className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] mb-4 italic font-light" style={{ fontFamily: '"Cinzel", serif' }}>{invite.names}</p>
                        <p className="font-sans text-[10px] tracking-[0.55em] text-[#d4af37]/45 uppercase font-semibold">Aguardamos sua presenca</p>
                    </footer>
                </motion.div>
            </section>
        </div>
    );
}

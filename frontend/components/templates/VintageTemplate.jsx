import React from 'react';
import { motion } from 'framer-motion';
import Countdown from './Countdown';

export default function VintageTemplate({ invite, isPreview, children }) {
    const revealVar = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } }
    };

    return (
        <div className={`template-vintage ${isPreview ? 'preview-mode' : 'full-mode'} web-page-layout min-h-screen relative overflow-hidden`}>
            <div className="pointer-events-none absolute inset-0 opacity-35 mix-blend-multiply vintage-paper-noise" />
            <div className="pointer-events-none absolute inset-0 vintage-vignette" />

            <section className="wp-section hero-section relative z-10 flex flex-col justify-center min-h-screen border-b border-[#4a3b32]/20" style={{ padding: 0 }}>
                <motion.div
                    className="content-card text-center w-full max-w-4xl mx-auto px-6 py-12 md:py-16 relative vintage-panel"
                    initial={{ scale: 0.97, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.2 }}
                >
                    <p className="uppercase tracking-[0.34em] text-[11px] mb-6 text-[#8b7355]" style={{ fontFamily: '"Courier New", Courier, monospace' }}>Anunciamos o casamento de</p>

                    <h1 className="text-5xl md:text-7xl mb-5 text-[#3e2723] leading-tight" style={{ fontFamily: '"Great Vibes", cursive' }}>
                        {invite.names}
                    </h1>

                    <p className="text-lg md:text-2xl mb-8 italic text-[#5d4037]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                        {invite.date}
                    </p>

                    <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10 text-[#4a3b32]/90" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        {invite.message}
                    </p>

                    <Countdown targetDate={invite.date} />
                </motion.div>
            </section>

            <section className="wp-section relative z-10 border-b border-[#4a3b32]/20" style={{ minHeight: 'auto', padding: '110px 24px' }}>
                <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-10 px-2 md:px-0" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    <motion.div className="vintage-surface text-center p-8 md:p-10 relative" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <span className="uppercase tracking-[0.25em] text-[#8b7355] text-xs" style={{ fontFamily: '"Courier New", Courier, monospace' }}>Cerimonia</span>
                            {invite.ceremonyTime && <span className="text-[#8b7355]/70 text-xs font-bold" style={{ fontFamily: '"Courier New", Courier, monospace' }}>| {invite.ceremonyTime}</span>}
                        </div>
                        <h4 className="text-3xl mt-2 mb-4 italic">{invite.location}</h4>
                        <p className="text-lg text-[#5d4037] leading-relaxed">
                            {invite.ceremonyText || "Convidamos voce para testemunhar nossa uniao em um lugar especial, rodeado de afeto e historia."}
                        </p>
                    </motion.div>

                    <motion.div className="vintage-surface text-center p-8 md:p-10 relative" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <span className="uppercase tracking-[0.25em] text-[#8b7355] text-xs" style={{ fontFamily: '"Courier New", Courier, monospace' }}>Recepcao</span>
                            {invite.receptionTime && <span className="text-[#8b7355]/70 text-xs font-bold" style={{ fontFamily: '"Courier New", Courier, monospace' }}>| {invite.receptionTime}</span>}
                        </div>
                        <h4 className="text-3xl mt-2 mb-4 italic">{invite.title}</h4>
                        <p className="text-lg text-[#5d4037] leading-relaxed">
                            {invite.receptionText || "Apos a cerimonia, celebramos com boa musica, jantar e uma noite classica junto aos convidados."}
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="wp-section relative z-10" style={{ minHeight: 'auto', padding: '100px 24px 130px' }}>
                <motion.div className="max-w-3xl mx-auto text-center w-full" variants={revealVar} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <h3 className="text-4xl mb-3 italic" style={{ fontFamily: '"Cormorant Garamond", serif' }}>R.S.V.P.</h3>
                    <p className="mb-10 text-xs uppercase tracking-[0.3em] text-[#8b7355]" style={{ fontFamily: '"Courier New", Courier, monospace' }}>Por favor, responda</p>

                    <div className="rsvp-injected-container form-vintage mb-16 vintage-rsvp-card">
                        {children}
                    </div>

                    <footer className="mt-10 pt-8 border-t border-[#4a3b32]/20">
                        <p className="text-4xl mb-2 text-[#3e2723]" style={{ fontFamily: '"Great Vibes", cursive' }}>{invite.names}</p>
                    </footer>
                </motion.div>
            </section>
        </div>
    );
}

import React from 'react';
import { motion } from 'framer-motion';
import Countdown from './Countdown';

export default function MinimalTemplate({ invite, isPreview, children }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className={`template-minimal ${isPreview ? 'preview-mode' : 'full-mode'} web-page-layout min-h-screen`}>
            <section className="wp-section hero-section flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.07),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(0,0,0,0.06),transparent_50%)]" />

                <motion.div
                    className="content-card text-center relative z-10 w-full max-w-5xl px-6 md:px-10"
                    style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.p variants={itemVariants} className="text-[10px] md:text-xs tracking-[0.45em] uppercase text-black/45 mb-8 md:mb-10 font-medium">
                        {invite.title}
                    </motion.p>

                    <motion.h1
                        variants={itemVariants}
                        className="names text-5xl md:text-7xl lg:text-8xl mb-8 md:mb-10 tracking-[-0.03em] text-black"
                        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 300, lineHeight: '1.05' }}
                    >
                        {invite.names}
                    </motion.h1>

                    <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-10 md:mb-12">
                        <div className="h-px w-10 md:w-14 bg-black/20" />
                        <p className="text-xs md:text-sm tracking-[0.28em] uppercase text-black/55 font-medium text-center">
                            {invite.date}
                        </p>
                        <div className="h-px w-10 md:w-14 bg-black/20" />
                    </motion.div>

                    <motion.p
                        variants={itemVariants}
                        className="max-w-2xl mx-auto leading-relaxed text-base md:text-xl mb-12 md:mb-16 text-black/55"
                        style={{ fontWeight: 400 }}
                    >
                        {invite.message}
                    </motion.p>

                    <motion.div variants={itemVariants} className="mt-6 mb-4 md:mb-8">
                        <Countdown targetDate={invite.date} />
                    </motion.div>
                </motion.div>
            </section>

            <section className="wp-section" style={{ minHeight: 'auto', padding: '120px 24px' }}>
                <motion.div
                    className="max-w-6xl mx-auto w-full"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <div className="grid md:grid-cols-2 gap-14 lg:gap-24">
                        <motion.div variants={itemVariants} className="minimal-surface minimal-surface-soft p-8 md:p-10 rounded-[2rem]">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-[11px] uppercase tracking-[0.34em] text-black/45 font-semibold">Cerimonia</h3>
                                {invite.ceremonyTime && <span className="text-[10px] text-black/40 tracking-[0.15em] font-medium">{invite.ceremonyTime}</span>}
                            </div>
                            <h4 className="text-3xl md:text-4xl font-light tracking-tight mb-6 leading-tight">{invite.location}</h4>
                            <p className="text-black/55 leading-relaxed text-base md:text-lg max-w-md">
                                {invite.ceremonyText || "Junte-se a nos para celebrar com calma, elegancia e alegria em um ambiente pensado para momentos inesqueciveis."}
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="minimal-surface p-8 md:p-10 rounded-[2rem]">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-[11px] uppercase tracking-[0.34em] text-black/45 font-semibold">Recepcao</h3>
                                {invite.receptionTime && <span className="text-[10px] text-black/40 tracking-[0.15em] font-medium">{invite.receptionTime}</span>}
                            </div>
                            <h4 className="text-3xl md:text-4xl font-light tracking-tight mb-6 leading-tight">{invite.title}</h4>
                            <p className="text-black/55 leading-relaxed text-base md:text-lg max-w-md">
                                {invite.receptionText || "Chegue com antecedencia para aproveitar cada detalhe e celebrar conosco durante todo o evento."}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <section className="wp-section bg-white/75" style={{ minHeight: 'auto', padding: '120px 24px' }}>
                <motion.div
                    className="max-w-3xl mx-auto w-full"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-14 md:mb-16">
                        <h3 className="text-[11px] uppercase tracking-[0.34em] text-black/45 mb-5 font-semibold">Presenca</h3>
                        <h2 className="text-4xl md:text-5xl font-light tracking-tight">R.S.V.P.</h2>
                    </motion.div>

                    <motion.div variants={itemVariants} className="rsvp-injected-container form-minimal mb-16">
                        {children}
                    </motion.div>

                    <motion.footer variants={itemVariants} className="mt-12 text-center flex flex-col items-center justify-center">
                        <div className="w-12 h-px bg-black/20 mb-8" />
                        <p className="text-2xl md:text-3xl font-light tracking-tight mb-4">{invite.names}</p>
                        <p className="text-[10px] tracking-[0.34em] text-black/40 uppercase font-medium">Aguardamos voce</p>
                    </motion.footer>
                </motion.div>
            </section>
        </div>
    );
}

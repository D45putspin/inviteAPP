"use client";

import { useEffect, useMemo, useState } from "react";
import Invite3DView from "../components/Invite3DView";
import TemplateRenderer from "../components/templates/TemplateRenderer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://dev-api.tryklozt.com";

const initialFields = {
  title: "",
  names: "",
  date: "",
  location: "",
  message: "",
  photo: "",
  ceremonyTime: "15:00",
  ceremonyText: "Junte-se a nós para celebrar com calma, elegância e alegria em um ambiente pensado para momentos inesquecíveis.",
  receptionTime: "18:00",
  receptionText: "Apos a cerimonia, continuamos com jantar, musica e uma noite inesquecivel ao lado de quem amamos.",
};

export default function HomePage() {
  const [inviteSlug, setInviteSlug] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [fields, setFields] = useState(initialFields);
  const [selectedTemplate, setSelectedTemplate] = useState("floral");
  const [currentSlug, setCurrentSlug] = useState(null);
  const [adminKey, setAdminKey] = useState(null);
  const [inviteLink, setInviteLink] = useState("");

  const [inviteData, setInviteData] = useState(null);
  const [rsvp, setRsvp] = useState({
    name: "",
    email: "",
    attending: "yes",
    guests: "0",
    note: "",
  });
  const [rsvpThanks, setRsvpThanks] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setInviteSlug(params.get("invite"));
  }, []);

  useEffect(() => {
    if (!inviteSlug) {
      setInviteData(null);
      return;
    }

    fetch(`${API_BASE}/api/invites/${inviteSlug}`)
      .then((res) => res.json())
      .then((invite) => {
        if (!invite.error) {
          setInviteData(invite);
        }
      })
      .catch(() => {
        setInviteData(null);
      });
  }, [inviteSlug]);

  const preview = useMemo(() => {
    return {
      title: fields.title || "O nosso dia",
      names: fields.names || "Ana & Joaquim",
      date: fields.date || "25 de Maio, 2026",
      location: fields.location || "Quinta da Regaleira",
      message: fields.message || "Estamos muito felizes por partilhar este momento especial da nossa vida ao lado de quem mais amamos.",
      ceremonyTime: fields.ceremonyTime,
      ceremonyText: fields.ceremonyText,
      receptionTime: fields.receptionTime,
      receptionText: fields.receptionText,
      template: selectedTemplate,
    };
  }, [fields, selectedTemplate]);

  const onFieldChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const [builderStep, setBuilderStep] = useState("form"); // "form" | "preview"

  const onCreateInvite = async () => {
    // If we're just proceeding to preview, we don't necessarily need to hit the API unless we want to save.
    // However, since the prompt implies the flow is "Details -> Preview -> Buy", we can create the draft now
    // or just show the preview locally. Let's create the draft now so we get the slug.
    const payload = {
      title: fields.title || "O nosso dia",
      names: fields.names,
      date: fields.date,
      location: fields.location,
      message: fields.message,
      ceremonyTime: fields.ceremonyTime,
      ceremonyText: fields.ceremonyText,
      receptionTime: fields.receptionTime,
      receptionText: fields.receptionText,
      template: selectedTemplate,
      photoUrl: fields.photo || null,
    };

    const res = await fetch(`${API_BASE}/api/invites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      window.alert("Erro a guardar rascunho. Verifica os campos.");
      return;
    }

    setCurrentSlug(data.slug);
    setAdminKey(data.adminKey);
    setInviteLink(`${window.location.origin}/?invite=${data.slug}`);

    // Move to fullscreen preview
    setBuilderStep("preview");
    // Trigger the intro animation for the fullscreen preview
    setFields(prev => ({ ...prev, _forceIntro: Date.now() }));
  };

  const onPublish = async () => {
    if (!currentSlug) return;
    const res = await fetch(`${API_BASE}/api/invites/${currentSlug}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey }),
    });
    if (!res.ok) {
      window.alert("Erro ao publicar.");
      return;
    }
    window.alert("Convite publicado com sucesso!");
    window.location.href = `/?invite=${currentSlug}`;
  };

  const onSendRsvp = async () => {
    if (!inviteSlug) return;
    const payload = {
      name: rsvp.name,
      email: rsvp.email,
      attending: rsvp.attending,
      guests: parseInt(rsvp.guests || "0", 10),
      note: rsvp.note,
    };
    const res = await fetch(`${API_BASE}/api/invites/${inviteSlug}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      window.alert("Erro ao enviar RSVP.");
      return;
    }
    setRsvpThanks(true);
  };

  // 1. If viewing an existing invite (Guest View)
  if (inviteSlug) {
    if (!inviteData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#FDFBF7]">
          <div className="animate-[pulse_1.5s_ease-in-out_infinite] flex flex-col items-center">
            <div className="w-10 h-10 border-[3px] border-stone-200 border-t-stone-800 rounded-full animate-spin mb-6"></div>
            <p className="text-stone-400 font-semibold tracking-[0.2em] uppercase text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>A preparar os detalhes...</p>
          </div>
        </div>
      );
    }

    return (
      <Invite3DView invite={{ ...inviteData, forceIntro: false }}>
        <section id="rsvp-form" className="relative z-20 max-w-lg mx-auto bg-white/95 backdrop-blur-md border border-stone-100 p-8 sm:p-12 rounded-3xl shadow-2xl shadow-stone-900/10 mt-12 mb-24">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-50/50 to-white/10 rounded-3xl pointer-events-none"></div>
          <h2 className="text-3xl font-medium text-stone-800 mb-10 text-center tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Confirmação de Presença</h2>
          <div className="space-y-6">
            <div className="group flex flex-col">
              <label htmlFor="rsvpName" className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-bold group-focus-within:text-stone-800 transition-colors">Nome Completo</label>
              <input id="rsvpName" className="bg-transparent border-b border-stone-200 px-0 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800 transition-all placeholder:text-stone-300 rounded-none w-full text-base font-medium" value={rsvp.name} onChange={(e) => setRsvp((prev) => ({ ...prev, name: e.target.value }))} placeholder="Como o devemos tratar?" />
            </div>

            <div className="group flex flex-col">
              <label htmlFor="rsvpEmail" className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-bold group-focus-within:text-stone-800 transition-colors">Email de Contacto</label>
              <input id="rsvpEmail" type="email" className="bg-transparent border-b border-stone-200 px-0 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800 transition-all placeholder:text-stone-300 rounded-none w-full text-base font-medium" value={rsvp.email} onChange={(e) => setRsvp((prev) => ({ ...prev, email: e.target.value }))} placeholder="Para o envio de atualizações" />
            </div>

            <div className="group flex flex-col">
              <label htmlFor="rsvpAttending" className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-bold group-focus-within:text-stone-800 transition-colors">Irá estar presente?</label>
              <select id="rsvpAttending" className="bg-transparent border-b border-stone-200 px-0 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800 transition-all cursor-pointer rounded-none w-full text-base font-medium shadow-none appearance-none" style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23292524%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right .7em top 50%", backgroundSize: ".65em auto" }} value={rsvp.attending} onChange={(e) => setRsvp((prev) => ({ ...prev, attending: e.target.value }))}>
                <option value="yes">Sim, confirmo com alegria</option>
                <option value="no">Infelizmente, não poderei ir</option>
              </select>
            </div>

            {rsvp.attending === "yes" && (
              <div className="group flex flex-col animate-[slideUp_0.4s_ease-out_forwards]">
                <label htmlFor="rsvpGuests" className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-bold group-focus-within:text-stone-800 transition-colors">Acompanhantes Adicionais</label>
                <input id="rsvpGuests" type="number" min="0" max="10" className="bg-transparent border-b border-stone-200 px-0 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800 transition-all rounded-none w-full text-base font-medium" value={rsvp.guests} onChange={(e) => setRsvp((prev) => ({ ...prev, guests: e.target.value }))} />
              </div>
            )}

            <div className="group flex flex-col pb-2">
              <label htmlFor="rsvpNote" className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-bold group-focus-within:text-stone-800 transition-colors">Mensagem Opcional</label>
              <textarea id="rsvpNote" className="bg-transparent border-b border-stone-200 px-0 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800 transition-all placeholder:text-stone-300 min-h-[70px] resize-y rounded-none w-full text-base font-medium" value={rsvp.note} onChange={(e) => setRsvp((prev) => ({ ...prev, note: e.target.value }))} placeholder="Existe algo que gostasse de partilhar?"></textarea>
            </div>
          </div>

          <div className="mt-10">
            <button id="rsvpBtn" className="w-full group bg-stone-900 text-white font-semibold tracking-[0.15em] text-[11px] uppercase py-4 rounded-full transition-all duration-500 hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-900/20 active:scale-[0.98]" onClick={onSendRsvp}>
              Descobrir o Convite
            </button>
          </div>

          {rsvpThanks && (
            <div id="rsvpThanks" className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-center font-medium text-sm animate-[slideUp_0.4s_ease-out_forwards]">
              Agradecemos a sua confirmação.
            </div>
          )}
        </section>
      </Invite3DView>
    );
  }

  // 2. Fullscreen Preview (Builder Step 2)
  if (showBuilder && builderStep === "preview") {
    // For the preview, we want the template switcher to be floating, and a "Publish" button
    const updatePreviewTheme = (themeId) => {
      setSelectedTemplate(themeId);
      // Re-trigger the intro logic for the new theme
      setFields(prev => ({ ...prev, _forceIntro: Date.now() }));
    };

    return (
      <div className="fixed inset-0 z-50 bg-[#FDFBF7] overflow-hidden flex flex-col">
        {/* Render Fullscreen 3D Invite */}
        <div className="absolute inset-0 z-0 overflow-y-auto overflow-x-hidden bg-stone-900">
          <Invite3DView invite={{ ...preview, forceIntro: !!fields._forceIntro }}>
            <div className="space-y-6 max-w-lg mx-auto w-full text-left">
              <div className="group flex flex-col">
                <label className="text-[10px] uppercase tracking-widest opacity-60 mb-1 font-bold">Nome Completo</label>
                <input disabled className="bg-transparent border-b border-current/20 px-0 py-2.5 focus:outline-none placeholder:opacity-30 rounded-none w-full text-base font-medium cursor-not-allowed" placeholder="Como o devemos tratar?" />
              </div>

              <div className="group flex flex-col">
                <label className="text-[10px] uppercase tracking-widest opacity-60 mb-1 font-bold">Email de Contacto</label>
                <input disabled type="email" className="bg-transparent border-b border-current/20 px-0 py-2.5 focus:outline-none placeholder:opacity-30 rounded-none w-full text-base font-medium cursor-not-allowed" placeholder="Para o envio de atualizações" />
              </div>

              <div className="group flex flex-col">
                <label className="text-[10px] uppercase tracking-widest opacity-60 mb-1 font-bold">Irá estar presente?</label>
                <select disabled className="bg-transparent border-b border-current/20 px-0 py-2.5 focus:outline-none cursor-not-allowed rounded-none w-full text-base font-medium shadow-none appearance-none">
                  <option>Sim, confirmo com alegria</option>
                  <option>Infelizmente, não poderei ir</option>
                </select>
              </div>

              <div className="group flex flex-col pb-2">
                <label className="text-[10px] uppercase tracking-widest opacity-60 mb-1 font-bold">Mensagem Opcional</label>
                <textarea disabled className="bg-transparent border-b border-current/20 px-0 py-2.5 focus:outline-none placeholder:opacity-30 min-h-[70px] resize-y rounded-none w-full text-base font-medium cursor-not-allowed" placeholder="Existe algo que gostasse de partilhar?"></textarea>
              </div>

              <div className="mt-10">
                <button disabled className="w-full bg-stone-900 text-white font-semibold tracking-[0.15em] text-[11px] uppercase py-4 rounded-full cursor-not-allowed opacity-50">
                  Confirmar Presença
                </button>
              </div>
            </div>
          </Invite3DView>
        </div>

        {/* Floating Controls Overlay */}
        <div className="absolute inset-x-0 bottom-8 z-50 flex items-center justify-center pointer-events-none">
          {/* Theme Switcher Bar */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-2 rounded-full shadow-2xl flex items-center gap-1 pointer-events-auto">
            {[
              { id: "floral", label: "Floral" },
              { id: "minimal", label: "Minimal" },
              { id: "luxury", label: "Gala" },
              { id: "vintage", label: "Vintage" },
              { id: "ocean", label: "Brisa" }
            ].map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => updatePreviewTheme(tpl.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${selectedTemplate === tpl.id
                  ? "bg-stone-800 text-white shadow-md shadow-stone-900/10 scale-100"
                  : "text-stone-500 hover:bg-white hover:text-stone-800 hover:scale-105"
                  }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Top Nav (Back & Publish) */}
        <div className="absolute top-6 inset-x-6 z-50 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => setBuilderStep("form")}
            className="pointer-events-auto w-10 h-10 bg-white/50 backdrop-blur-md rounded-full border border-stone-200/50 flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 transition-all shadow-sm"
          >
            ←
          </button>

          <button
            onClick={onPublish}
            className="pointer-events-auto px-6 py-3 bg-stone-900 text-white text-[10px] uppercase font-bold tracking-[0.2em] rounded-full hover:bg-stone-800 hover:-translate-y-0.5 transition-all shadow-xl shadow-stone-900/20"
          >
            Adquirir e Partilhar — 9,99€
          </button>
        </div>
      </div>
    );
  }

  // 3. Landing Page & Builder Form (Step 1)
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 overflow-x-hidden relative font-sans selection:bg-stone-200/60 selection:text-stone-900">

      {/* Decorative Blur Orbs for Light Theme */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-stone-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      <header className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 px-4 flex flex-col items-center text-center z-10 transition-all duration-700 ease-in-out">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-stone-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-sm">
          A nova arte de convidar
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-8 max-w-5xl leading-[1.1] text-stone-900 font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
          Celebre <span className="italic font-light text-stone-500">momentos ímpares</span><br />
          com a máxima elegância.
        </h1>

        <p className="text-lg md:text-xl text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Personalize o seu design numa interface sofisticada, crie uma ligação eterna e receba presenças num piscar de olhos. Sem distrações.
        </p>

        {!showBuilder && (
          <button
            id="startBtn"
            onClick={() => {
              setShowBuilder(true);
              setTimeout(() => {
                document.getElementById('builder-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-500 bg-stone-900 rounded-full hover:bg-stone-800 hover:shadow-2xl hover:shadow-stone-900/20 active:scale-95 focus:outline-none overflow-hidden"
          >
            <span className="relative z-10 text-[11px] uppercase tracking-[0.2em] flex items-center gap-3">
              Criar o meu convite
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform duration-300"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </span>
          </button>
        )}
      </header>

      <main className="relative z-10 container mx-auto px-4 pb-32 max-w-4xl">
        {showBuilder && builderStep === "form" && (
          <section id="builder-section" className="animate-[slideUp_0.8s_ease-out_forwards] opacity-0 translate-y-8 max-w-3xl mx-auto space-y-12">

            <div className="text-center mb-10">
              <h2 className="text-3xl text-stone-800 mb-3 font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                Os detalhes do vosso dia especial
              </h2>
              <p className="text-stone-500 text-sm font-medium tracking-wide">Passo 1 de 2: Defina as informações e deixe a estética connosco.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 relative z-10 bg-white/70 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] border border-stone-200/50 shadow-2xl shadow-stone-900/5">

              <div className="col-span-1 md:col-span-2 group">
                <label htmlFor="title" className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold group-focus-within:text-stone-800 transition-colors">Título do Evento</label>
                <input id="title" className="w-full bg-transparent border-b border-stone-200 px-0 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800 transition-all placeholder:text-stone-300 rounded-none text-2xl font-medium" style={{ fontFamily: "'Playfair Display', serif" }} value={fields.title} onChange={(e) => onFieldChange("title", e.target.value)} placeholder="Ex: O nosso casamento" />
              </div>

              <div className="col-span-1 group mt-2">
                <label htmlFor="names" className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold group-focus-within:text-stone-800 transition-colors">Nomes dos Homenageados</label>
                <input id="names" className="w-full bg-transparent border-b border-stone-200 px-0 py-2 text-stone-800 focus:outline-none focus:border-stone-800 transition-all placeholder:text-stone-300 rounded-none text-lg font-medium" value={fields.names} onChange={(e) => onFieldChange("names", e.target.value)} placeholder="Ex: Ana & Joaquim" />
              </div>

              <div className="col-span-1 group mt-2">
                <label htmlFor="date" className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold group-focus-within:text-stone-800 transition-colors">Data do Evento</label>
                <input id="date" type="date" className="w-full bg-transparent border-b border-stone-200 px-0 py-2 text-stone-800 focus:outline-none focus:border-stone-800 transition-all rounded-none text-lg font-medium text-stone-600" value={fields.date} onChange={(e) => onFieldChange("date", e.target.value)} />
              </div>

              <div className="col-span-1 md:col-span-2 group mt-2">
                <label htmlFor="location" className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold group-focus-within:text-stone-800 transition-colors">Localização Formosa</label>
                <input id="location" className="w-full bg-transparent border-b border-stone-200 px-0 py-2 text-stone-800 focus:outline-none focus:border-stone-800 transition-all placeholder:text-stone-300 rounded-none text-lg font-medium" value={fields.location} onChange={(e) => onFieldChange("location", e.target.value)} placeholder="Ex: Quinta da Regaleira, Sintra" />
              </div>

              <div className="col-span-1 md:col-span-2 group mt-2">
                <label htmlFor="message" className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold group-focus-within:text-stone-800 transition-colors">Mensagem de Boas-Vindas</label>
                <textarea id="message" className="w-full bg-transparent border-b border-stone-200 px-0 py-2 text-stone-800 focus:outline-none focus:border-stone-800 transition-all placeholder:text-stone-300 min-h-[90px] resize-y rounded-none text-lg font-medium leading-relaxed" value={fields.message} onChange={(e) => onFieldChange("message", e.target.value)} placeholder="Partilhe os seus sentimentos..."></textarea>
              </div>
              <div className="col-span-1 md:col-span-2 group mt-2 pt-6 border-t border-stone-200/50">
                <h3 className="text-xl text-stone-800 font-medium mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Detalhes Aprofundados
                </h3>
              </div>

              <div className="col-span-1 group mt-2">
                <label htmlFor="ceremonyTime" className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold group-focus-within:text-stone-800 transition-colors">Hora da Cerimónia</label>
                <input id="ceremonyTime" type="time" className="w-full bg-transparent border-b border-stone-200 px-0 py-2 text-stone-800 focus:outline-none focus:border-stone-800 transition-all rounded-none text-lg font-medium text-stone-600" value={fields.ceremonyTime} onChange={(e) => onFieldChange("ceremonyTime", e.target.value)} />
              </div>

              <div className="col-span-1 md:col-span-2 group mt-2">
                <label htmlFor="ceremonyText" className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold group-focus-within:text-stone-800 transition-colors">Descrição da Cerimónia</label>
                <textarea id="ceremonyText" className="w-full bg-transparent border-b border-stone-200 px-0 py-2 text-stone-800 focus:outline-none focus:border-stone-800 transition-all placeholder:text-stone-300 min-h-[60px] resize-y rounded-none text-lg font-medium leading-relaxed" value={fields.ceremonyText} onChange={(e) => onFieldChange("ceremonyText", e.target.value)}></textarea>
              </div>

              <div className="col-span-1 group mt-4">
                <label htmlFor="receptionTime" className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold group-focus-within:text-stone-800 transition-colors">Hora da Receção</label>
                <input id="receptionTime" type="time" className="w-full bg-transparent border-b border-stone-200 px-0 py-2 text-stone-800 focus:outline-none focus:border-stone-800 transition-all rounded-none text-lg font-medium text-stone-600" value={fields.receptionTime} onChange={(e) => onFieldChange("receptionTime", e.target.value)} />
              </div>

              <div className="col-span-1 md:col-span-2 group mt-2">
                <label htmlFor="receptionText" className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold group-focus-within:text-stone-800 transition-colors">Descrição da Receção (Opcional)</label>
                <textarea id="receptionText" className="w-full bg-transparent border-b border-stone-200 px-0 py-2 text-stone-800 focus:outline-none focus:border-stone-800 transition-all placeholder:text-stone-300 min-h-[60px] resize-y rounded-none text-lg font-medium leading-relaxed" value={fields.receptionText} onChange={(e) => onFieldChange("receptionText", e.target.value)}></textarea>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex justify-center">
              <button id="createBtn" onClick={onCreateInvite} className="group relative inline-flex items-center justify-center px-16 py-5 font-bold text-white transition-all duration-500 bg-stone-900 rounded-full hover:bg-stone-800 hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/20 active:scale-95 focus:outline-none">
                <span className="text-[12px] uppercase tracking-[0.25em] flex items-center gap-4">
                  Seguinte: Pré-Visualização
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </span>
              </button>
            </div>

          </section>
        )}
      </main>
    </div>
  );
}

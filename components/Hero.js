export default function Hero({ image, video, title, subtitle, text }) {
  return (
    <section
      className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #191D33 0%, #04325A 45%, #193F73 100%)" }}
    >
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-70" />

      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[42%] overflow-hidden">
        {video ? (
          <video className="w-full h-full object-cover opacity-30" src={video} autoPlay muted loop playsInline />
        ) : (
          <img src={image} alt={title} className="w-full h-full object-cover opacity-30" />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, #04325A 0%, transparent 45%)" }}
        />
      </div>

      <div className="relative z-[2] max-w-container mx-auto w-full px-6 lg:px-10 py-28">
        <div className="max-w-xl">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-5 flex items-center gap-3">
            <span className="w-6 h-0.5 bg-accent inline-block" />
            Transporte y Logística
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold uppercase text-white leading-[0.95] tracking-tight">
            {title}
          </h1>
          <p className="font-heading text-xl md:text-2xl font-semibold text-white/90 mt-4">{subtitle}</p>
          <p className="font-body font-light text-light mt-5 leading-relaxed max-w-md">{text}</p>
          <div className="flex flex-wrap gap-4 mt-9">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center rounded-sm bg-accent text-primary font-heading text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 hover:brightness-95 transition-all"
            >
              Solicitar Cotización
            </a>
            <a
              href="/servicios"
              className="inline-flex items-center justify-center rounded-sm border border-white/30 text-white font-heading text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-white/10 transition-colors"
            >
              Nuestros Servicios
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-[2] hidden md:flex items-center gap-3 px-6 lg:px-10 pb-9 font-heading text-xs uppercase tracking-[0.3em] text-light">
        <span className="w-12 h-px bg-white/25 relative overflow-hidden scroll-line" />
        Desplazá para conocer más
      </div>
    </section>
  );
}

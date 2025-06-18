import React from "react";

// Noticias principales hardcodeadas para demo. Cambia luego por props, fetch o CMS.
const newsItems = [
  {
    title: "¡HGP alcanza $500K TVL en testnet!",
    summary: "La comunidad HighPower crece sin freno y la liquidez en testnet rompe récords. Todo listo para revolucionar la mainnet.",
    date: "2025-06-17",
    link: "#",
    tag: "Logro",
  },
  {
    title: "Auditoría Certik aprobada",
    summary: "La seguridad es prioridad: nuestros contratos han pasado la auditoría de Certik. Lee el informe y súmate con confianza.",
    date: "2025-06-16",
    link: "#",
    tag: "Seguridad",
    report: "/assets/auditoria-certik.pdf",
  },
  {
    title: "Alianza con DeFiStar",
    summary: "Unimos fuerzas con DeFiStar para pools de liquidez exclusivos, farming conjunto y expansión internacional.",
    date: "2025-06-15",
    link: "#",
    tag: "Alianza",
  },
  {
    title: "Airdrop NFT para testers",
    summary: "Participa en la testnet y reclama tu NFT único. ¡Ser pionero tiene recompensa y acceso a features premium!",
    date: "2025-06-14",
    link: "#",
    tag: "Airdrop",
  },
];

// Testimonios de inversores/partners (demo)
const testimonials = [
  {
    name: "María G.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: "Invertí en HighPower en testnet y la experiencia fue premium. El equipo es transparente y la comunidad muy activa.",
    role: "Inversora Early",
  },
  {
    name: "CryptoPool Ventures",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    quote: "Decidimos sumar liquidez por la auditoría y el roadmap claro. HGP tiene potencial de unicornio.",
    role: "VC Partner",
  },
];

// Últimos posts de Medium (puedes conectar a la API real)
const mediumPosts = [
  {
    title: "Cómo HGP redefine el DeFi en BSC",
    date: "2025-06-13",
    link: "https://medium.com/highpower/hgp-defi-bsc",
  },
  {
    title: "Guía: Participa en pools y gana NFTs",
    date: "2025-06-10",
    link: "https://medium.com/highpower/guia-pools-nft",
  },
];

// Últimos tweets (puedes conectar a la API real)
const tweets = [
  {
    content: "¡Ya puedes probar nuestro dashboard en testnet y ganar recompensas! 🚀 #DeFi #BSC #HGP",
    date: "2025-06-17",
    link: "https://twitter.com/highpowercoin/status/1",
  },
  {
    content: "¡Auditoría Certik superada! Seguridad y transparencia para nuestra comunidad 🔒",
    date: "2025-06-16",
    link: "https://twitter.com/highpowercoin/status/2",
  },
];

export default function NewsSection() {
  return (
    <section className="relative w-full py-16 px-2 sm:px-4 bg-gradient-to-b from-black via-gray-900 to-indigo-950">
      <div className="max-w-6xl mx-auto">
        {/* Título destacado */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center tracking-tight">
          Noticias y Actualizaciones
        </h2>
        <p className="text-center text-lg text-indigo-200 mb-10">
          Transparencia, hitos y novedades para inversores y comunidad.
        </p>
        {/* Grid responsivo de noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {newsItems.map((item, i) => (
            <NewsCard key={i} {...item} />
          ))}
        </div>

        {/* Grid de información adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Auditoría destacada */}
          <div className="bg-black/60 border border-indigo-800 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <span className="text-2xl mb-3 inline-block">🛡️</span>
            <h3 className="text-lg font-bold text-white mb-2">Auditoría de Seguridad</h3>
            <p className="text-indigo-200 mb-2 text-sm text-center">
              Todos los contratos han sido auditados por Certik.<br />
              <a href="/assets/auditoria-certik.pdf" className="text-indigo-300 underline hover:text-indigo-50" target="_blank" rel="noopener noreferrer">
                Descargar informe PDF
              </a>
            </p>
          </div>
          {/* Últimos posts de Medium */}
          <div className="bg-black/60 border border-indigo-800 rounded-2xl shadow-md p-6">
            <span className="text-2xl mb-3 inline-block">📰</span>
            <h3 className="text-lg font-bold text-white mb-2">Últimos en Medium</h3>
            <ul>
              {mediumPosts.map((post, i) => (
                <li key={i} className="mb-2">
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:underline">
                    {post.title}
                  </a>
                  <span className="block text-xs text-indigo-400">{formatDate(post.date)}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Últimos tweets */}
          <div className="bg-black/60 border border-indigo-800 rounded-2xl shadow-md p-6">
            <span className="text-2xl mb-3 inline-block">🐦</span>
            <h3 className="text-lg font-bold text-white mb-2">Twitter</h3>
            <ul>
              {tweets.map((tw, i) => (
                <li key={i} className="mb-2">
                  <a href={tw.link} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:underline">
                    {tw.content}
                  </a>
                  <span className="block text-xs text-indigo-400">{formatDate(tw.date)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testimonios de inversores */}
        <div className="mt-14">
          <h3 className="text-2xl font-bold text-white text-center mb-6">Testimonios de Inversores & Partners</h3>
          <div className="flex flex-col md:flex-row gap-7 justify-center items-stretch">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>

        {/* Llamado a la acción para inversores */}
        <div className="mt-16 flex flex-col items-center">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-xl p-6 flex flex-col items-center max-w-xl w-full shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-2">¿Listo para ser parte del próximo unicornio DeFi?</h3>
            <p className="text-indigo-100 mb-3 text-center">
              Únete hoy y accede a pools exclusivos, gobernanza, NFTs y beneficios premium.<br />
              <span className="font-semibold text-white">HGP es más que un token: es una oportunidad real de multiplicar tu inversión desde el inicio.</span>
            </p>
            <a
              href="#"
              className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-indigo-100 transition-all duration-200"
            >
              Quiero Invertir
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Card individual para cada noticia
function NewsCard({ title, summary, date, link, tag, report }) {
  return (
    <div className="relative bg-black/60 border border-indigo-800 rounded-2xl shadow-md overflow-hidden flex flex-col min-h-[200px] transition-transform hover:-translate-y-1 hover:shadow-2xl">
      {/* Etiqueta */}
      <span className="absolute top-4 right-4 bg-indigo-500 text-xs font-bold uppercase text-white px-3 py-1 rounded-full shadow">
        {tag}
      </span>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
          <p className="text-indigo-200 mb-4">{summary}</p>
          {report && (
            <a href={report} target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline hover:text-indigo-50 text-sm">
              Descargar Auditoría
            </a>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-indigo-400">{formatDate(date)}</span>
          <a
            href={link}
            className="text-sm font-semibold text-indigo-300 hover:text-indigo-100 transition"
          >
            Leer más →
          </a>
        </div>
      </div>
    </div>
  );
}

// Card de testimonial
function TestimonialCard({ name, avatar, quote, role }) {
  return (
    <div className="bg-black/60 border border-indigo-800 rounded-2xl shadow-md p-6 flex flex-col items-center text-center w-full max-w-xs mx-auto">
      <img
        src={avatar}
        alt={name}
        className="w-16 h-16 rounded-full mb-3 border-2 border-indigo-500 object-cover"
        loading="lazy"
      />
      <blockquote className="text-indigo-100 italic mb-2">“{quote}”</blockquote>
      <span className="text-white font-semibold">{name}</span>
      <span className="text-indigo-400 text-sm">{role}</span>
    </div>
  );
}

// Utilitario para formatear la fecha (puedes internacionalizarlo)
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

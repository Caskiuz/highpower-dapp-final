import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const modules = [
  { label: "Plataforma", icon: "fa-home", items: [
    { name: "News", path: "/news", icon: "fa-bolt" },
    { name: "Dashboard", path: "/dashboard", icon: "fa-gauge" },
    { name: "Roadmap", path: "/roadmap", icon: "fa-route" },
    { name: "About", path: "/about", icon: "fa-circle-info" },
    { name: "Equipo", path: "/team", icon: "fa-users" },
    { name: "Tecnología", path: "/tech", icon: "fa-microchip" },
    { name: "Ecosistema", path: "/partners", icon: "fa-cubes" },
    { name: "Incubación", path: "/incubation", icon: "fa-lightbulb" }
  ] },
  { label: "Finanzas", icon: "fa-wallet", items: [
    { name: "Swap", path: "/swap", icon: "fa-sync-alt" },
    { name: "Staking", path: "/staking", icon: "fa-coins" },
    { name: "Trading/Analytics", path: "/trading-analytics", icon: "fa-chart-line" }
  ] },
  { label: "NFTs", icon: "fa-gem", items: [
    { name: "Galería NFT", path: "/nfts", icon: "fa-images" }
  ] },
  { label: "Comunidad", icon: "fa-users", items: [
    { name: "DAO", path: "/governance", icon: "fa-users-cog" },
    { name: "Soporte", path: "/support", icon: "fa-headset" },
    { name: "FAQ", path: "/faq", icon: "fa-question-circle" },
    { name: "Contacto", path: "/contact", icon: "fa-envelope" }
  ] },
  { label: "Seguridad", icon: "fa-shield-alt", items: [
    { name: "Auditoría", path: "/audit", icon: "fa-user-shield" }
  ] }
];

export default function BottomNav() {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const handleNavClick = (idx) => {
    if (modules[idx].items.length === 1) {
      navigate(modules[idx].items[0].path);
    } else {
      setOpenMenu(idx);
    }
  };

  return (
    <>
      {/* Modal de submenú */}
      {openMenu !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-end md:hidden"
          onClick={() => setOpenMenu(null)}>
          <div className="w-full bg-[#232146] rounded-t-xl p-3 pt-6 animate-slide-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-3">
              <i className={`fas ${modules[openMenu].icon} text-2xl text-[var(--primary-purple)]`} />
              <span className="ml-3 text-lg font-bold text-white">{modules[openMenu].label}</span>
            </div>
            <div className="flex flex-col gap-2">
              {modules[openMenu].items.map((item) => (
                <button
                  key={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-md text-white bg-[#2e294a] hover:bg-[var(--primary-purple)]/90 transition-all"
                  onClick={() => {
                    navigate(item.path);
                    setOpenMenu(null);
                  }}>
                  <i className={`fas ${item.icon} text-lg`} />
                  {item.name}
                </button>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-[var(--primary-purple)] font-semibold" onClick={() => setOpenMenu(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Barra inferior solo móvil */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#19162d] border-t border-[var(--primary-purple)] flex justify-around items-center h-16 shadow-2xl md:hidden">
        {modules.map((mod, idx) => (
          <button
            key={mod.label}
            className="flex flex-col items-center flex-1 py-2 hover:bg-[var(--primary-purple)]/15 transition-all"
            onClick={() => handleNavClick(idx)}
          >
            <i className={`fas ${mod.icon} text-xl mb-1`} />
            <span className="text-xs text-white">{mod.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

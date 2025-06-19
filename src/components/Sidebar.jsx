import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

const modules = [
  {
    label: "PLATAFORMA",
    icon: "fa-home",
    items: [
      { name: "News", path: "/news", icon: "fa-bolt" },
      { name: "Dashboard", path: "/dashboard", icon: "fa-gauge" },
      { name: "Roadmap", path: "/roadmap", icon: "fa-route" },
      { name: "About", path: "/about", icon: "fa-circle-info" },
      { name: "Equipo", path: "/team", icon: "fa-users" },
      { name: "Tecnología", path: "/tech", icon: "fa-microchip" },
      { name: "Ecosistema", path: "/partners", icon: "fa-cubes" },
      { name: "Incubación", path: "/incubation", icon: "fa-lightbulb" }
    ]
  },
  {
    label: "FINANZAS & TOKENS",
    icon: "fa-wallet",
    items: [
      { name: "Swap", path: "/swap", icon: "fa-sync-alt" },
      { name: "Staking", path: "/yield", icon: "fa-coins" },
      { name: "Trading/Analytics", path: "/trading-analytics", icon: "fa-chart-line" }
    ]
  },
  {
    label: "NFTs & MARKETPLACE",
    icon: "fa-gem",
    items: [
      { name: "Galería NFT", path: "/nfts", icon: "fa-images" }
    ]
  },
  {
    label: "COMUNIDAD & GOBERNANZA",
    icon: "fa-users",
    items: [
      { name: "DAO", path: "/governance", icon: "fa-users-cog" },
      { name: "Soporte", path: "/support", icon: "fa-headset" },
      { name: "FAQ", path: "/faq", icon: "fa-question-circle" },
      { name: "Contacto", path: "/contact", icon: "fa-envelope" }
    ]
  },
  {
    label: "SEGURIDAD & TRANSPARENCIA",
    icon: "fa-shield-alt",
    items: [
      { name: "Auditoría", path: "/audit-security", icon: "fa-user-shield" }
    ]
  }
];

const SIDEBAR_EXPANDED_KEY = "hgp_sidebar_expanded";
const NAVBAR_HEIGHT = 64; // px

export default function Sidebar() {
  const location = useLocation();
  const sidebarRef = useRef(null);

  const [expanded, setExpanded] = useState(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_EXPANDED_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_EXPANDED_KEY, JSON.stringify(expanded));
  }, [expanded]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        expanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setExpanded(false);
        setActiveModule(null);
      }
    }
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  const handleMainIconClick = (idx) => {
    if (!expanded) {
      setExpanded(true);
      setActiveModule(idx);
    } else if (activeModule === idx) {
      setExpanded(false);
      setActiveModule(null);
    } else {
      setActiveModule(idx);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`hidden md:flex flex-col bg-gradient-to-b from-[#232146] via-[#201c3a] to-[#181629] pt-4 border-r-2 border-[var(--primary-purple)] shadow-2xl z-30 fixed left-0 transition-all duration-200 ease-in-out
      ${expanded ? "w-64" : "w-20"}`}
      style={{
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        top: `${NAVBAR_HEIGHT}px`
      }}
    >
      <nav className="flex flex-col gap-2 mt-2">
        {modules.map((mod, idx) => (
          <div key={mod.label} className="relative group">
            <button
              className={`flex items-center justify-center w-full py-6 rounded-lg transition-all duration-150 cursor-pointer
                ${
                  expanded && activeModule === idx
                    ? "bg-[var(--primary-purple)]/90 text-white neon-glow"
                    : "text-white hover:bg-[var(--primary-purple)]/20"
                }
                sidebar-icon-glow`}
              style={{
                borderLeft:
                  expanded && activeModule === idx
                    ? "3px solid #8f5bff"
                    : "3px solid transparent"
              }}
              aria-label={mod.label}
              onClick={() => handleMainIconClick(idx)}
            >
              <i
                className={`fas ${mod.icon} text-2xl`}
                style={{
                  color: "#fff",
                  filter:
                    expanded && activeModule === idx
                      ? "drop-shadow(0 0 8px #a259ff) drop-shadow(0 0 16px #8f5bffcc)"
                      : "drop-shadow(0 0 4px #8f5bff88)"
                }}
              />
              {expanded && (
                <>
                  <span className="ml-3 font-bold text-base whitespace-nowrap">{mod.label}</span>
                  <i
                    className={`fas fa-caret-${activeModule === idx ? "down" : "right"} ml-auto text-xs`}
                  />
                </>
              )}
            </button>
            {expanded && activeModule === idx && (
              <div className="flex flex-col mt-1 ml-8 animate-fade-in">
                {mod.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2 my-1 rounded-lg font-semibold text-base transition-all duration-150
                      ${
                        isActive || location.pathname.startsWith(item.path)
                          ? "bg-[var(--primary-purple)]/95 text-white shadow-lg neon-glow"
                          : "text-[#bcbef7] hover:text-white hover:bg-[var(--primary-purple)]/20"
                      }`
                    }
                    onClick={() => {
                      setExpanded(false);
                      setActiveModule(null);
                    }}
                  >
                    <i className={`fas ${item.icon} text-xl`} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

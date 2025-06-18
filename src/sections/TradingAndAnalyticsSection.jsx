// src/sections/TradingAndAnalyticsSection.jsx
import React from "react";

function TradingAndAnalyticsSection() {
  // Si tienes integración real, reemplaza estos datos por props/fetchs/etc.
  const analyticsData = [
    {
      title: "Volumen 24h",
      value: "$2,500,000",
      icon: "fa-chart-line",
      color: "text-green-400"
    },
    {
      title: "Usuarios Activos",
      value: "1,430",
      icon: "fa-users",
      color: "text-blue-400"
    },
    {
      title: "Transacciones Totales",
      value: "53,800",
      icon: "fa-exchange-alt",
      color: "text-purple-400"
    },
    {
      title: "Pares Disponibles",
      value: "12",
      icon: "fa-coins",
      color: "text-yellow-400"
    }
  ];

  return (
    <section id="trading-analytics" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-10 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--primary-purple)] mb-6">
        Trading & Analytics
      </h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Visualiza el desempeño y la actividad del ecosistema HighPower en tiempo real. Datos clave, métricas de trading y análisis para la comunidad.
      </p>
      {/* KPIs principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {analyticsData.map((stat, idx) => (
          <div
            key={idx}
            className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center transition-transform hover:scale-105"
          >
            <i className={`fas ${stat.icon} ${stat.color} text-4xl mb-4`}></i>
            <div className="text-3xl font-bold text-[var(--off-white)]">{stat.value}</div>
            <div className="text-[var(--light-gray-text)] mt-2">{stat.title}</div>
          </div>
        ))}
      </div>
      {/* Área de gráfico de ejemplo (sustituye por tu integración real si aplica) */}
      <div className="mt-12 bg-gray-900 p-6 rounded-xl shadow-lg border border-[var(--secondary-blue)]">
        <h3 className="text-2xl font-semibold text-[var(--secondary-blue)] mb-4 text-left">
          Ejemplo de Gráfico: Volumen de Trading Últimos 7 Días
        </h3>
        <div className="w-full h-60 flex items-center justify-center">
          <img
            alt="Demo Trading Chart"
            className="max-h-56 w-full object-contain rounded-lg"
            src="https://placehold.co/600x200/8A2BE2/FFFFFF?text=Trading+Chart"
          />
        </div>
        <p className="text-gray-500 text-sm mt-4 text-left">
          *Integra aquí tus propios gráficos usando Chart.js, Recharts, o cualquier herramienta analytics real-time.
        </p>
      </div>
    </section>
  );
}

export default TradingAndAnalyticsSection;

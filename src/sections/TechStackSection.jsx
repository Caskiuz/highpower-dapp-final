// src/sections/TechStackSection.jsx
import React from 'react';

function TechStackSection() {
  return (
    <section id="tech" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Arquitectura e Implementación Tecnológica</h2>

      <div className="space-y-6 text-[var(--light-gray-text)]">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">16. Arquitectura e Implementación Tecnológica</h3>
          <p className="leading-relaxed">
            HighPower se construirá sobre una base tecnológica sólida y escalable, utilizando un entorno de desarrollo eficiente y herramientas modernas.
          </p>

          <h4 className="text-2xl font-semibold text-[var(--off-white)] mt-6 mb-3">Blockchain Principal:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>BNB Chain:</strong> Seleccionada por su velocidad, bajo costo transaccional, alta escalabilidad y compatibilidad con la Máquina Virtual de Ethereum (EVM).</li>
          </ul>

          <h4 className="text-2xl font-semibold text-[var(--off-white)] mt-6 mb-3">Contratos Inteligentes:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Lenguaje:</strong> Solidity.</li>
            <li><strong>Framework:</strong> Hardhat (simplifica el desarrollo y despliegue de contratos en EVM).</li>
            <li><strong>Estándares:</strong> BEP-20 para el token HGP, y BEP-721/BEP-1155 para los NFTs.</li>
            <li><strong>Herramientas:</strong> hardhat-cli.</li>
          </ul>

          <h4 className="text-2xl font-semibold text-[var(--off-white)] mt-6 mb-3">Frontend (DApp):</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Framework JS:</strong> React (con Next.js para Server-Side Rendering/Static Site Generation y optimización).</li>
            <li><strong>Lenguaje:</strong> JavaScript/TypeScript (TypeScript es altamente recomendado para robustez y escalabilidad).</li>
            <li><strong>Estilos:</strong> Tailwind CSS (para eficiencia y diseño responsivo).</li>
            <li><strong>Manejo de Estado:</strong> Opciones como Zustand, Jotai o React Context API.</li>
            <li><strong>Conectividad BNB Chain:</strong> Librerías como wagmi, viem y MetaMask SDK/web3.js para la interacción con billeteras EVM.</li>
            <li><strong>Gráficos:</strong> Librerías como Chart.js o Recharts, alimentadas por APIs de datos de precios.</li>
          </ul>

          <h4 className="text-2xl font-semibold text-[var(--off-white)] mt-6 mb-3">Backend (APIs Auxiliares/Indexadores - si es necesario):</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Lenguaje:</strong> Node.js.</li>
            <li><strong>Framework:</strong> Express.js o Fastify.</li>
            <li><strong>Base de Datos:</strong> PostgreSQL, MongoDB (para datos no blockchain).</li>
            <li><strong>Despliegue Serverless:</strong> Plataformas como Vercel, o servicios cloud como AWS Lambda/Google Cloud Functions.</li>
          </ul>

          <h4 className="text-2xl font-semibold text-[var(--off-white)] mt-6 mb-3">Base de Datos Descentralizada (Opcional/IPFS):</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Para almacenar metadatos inmutables de NFTs y otros datos de la galería. Se priorizarán soluciones como Arweave o IPFS.</li>
          </ul>

          <h4 className="text-2xl font-semibold text-[var(--off-white)] mt-6 mb-3">Entorno de Desarrollo Integrado (IDE) y Extensiones:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>VS Code:</strong> IDE principal.</li>
            <li><strong>Extensiones Recomendadas:</strong> Solidity Visual Developer, Prettier, ESLint, Tailwind CSS IntelliSense, GitHub Copilot.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">17. Ideas Adicionales para Profesionalidad y Escalabilidad</h3>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>Auditorías de Seguridad Continuas:</strong> Auditorías periódicas a medida que se implementen nuevas funcionalidades.</li>
            <li><strong>Programa de Bug Bounty:</strong> Incentivar a la comunidad de seguridad a identificar vulnerabilidades.</li>
            <li><strong>Asociaciones Estratégicas:</strong> Colaboraciones con proyectos consolidados en la BNB Chain.</li>
            <li><strong>Incentivos para Creadores de Altcoins:</strong> Programas de subvenciones o concursos para artistas y creadores.</li>
            <li><strong>Gamificación:</strong> Introducción de elementos de juego.</li>
            <li><strong>Expansión Cross-Chain (Futuro):):</strong> Explorar puentes a otras blockchains relevantes.</li>
            <li><strong>Desarrollo de una Aplicación Móvil (Futuro):):</strong> Aplicación nativa para iOS y Android.</li>
            <li><strong>Educación y Recursos:</strong> Desarrollo de una "Academia HighPower".</li>
            <li><strong>Herramientas de Análisis Avanzadas:</strong> Provisión de dashboards y análisis detallados.</li>
            <li><strong>Comunidad Activa y Moderada:</strong> Establecimiento de canales de comunicación bien moderados.</li>
            <li><strong>Transparencia Financiera:</strong> Publicación regular de informes.</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

export default TechStackSection;

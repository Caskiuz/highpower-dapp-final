// src/sections/ContactSection.jsx
import React, { useState } from 'react';

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', 'submitting'
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar el error cuando el usuario empieza a escribir
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El correo electrónico no es válido.';
    }
    if (!formData.subject.trim()) errors.subject = 'El asunto es obligatorio.';
    if (!formData.message.trim()) errors.message = 'El mensaje es obligatorio.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    setFormErrors({});

    if (!validateForm()) {
      setSubmissionStatus('error');
      setTimeout(() => setSubmissionStatus(null), 3000); // Quitar mensaje de error después de 3 segundos
      return;
    }

    try {
      // Simular un envío a una API o servicio (ej. emailjs, formspree, o un backend propio)
      // Aquí solo simulamos un retardo de red
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular respuesta exitosa
      setSubmissionStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Limpiar formulario
      setTimeout(() => setSubmissionStatus(null), 5000); // Quitar mensaje de éxito después de 5 segundos

    } catch (error) {
      console.error('Error al enviar el formulario (simulado):', error);
      setSubmissionStatus('error');
      setTimeout(() => setSubmissionStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--secondary-blue)]">
      <h2 className="text-4xl font-bold text-[var(--secondary-blue)] mb-6">Contáctanos</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        ¿Tienes preguntas, sugerencias o quieres colaborar? Envíanos un mensaje.
      </p>

      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--primary-purple)] max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Envíanos un Mensaje</h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="name" className="block text-[var(--light-gray-text)] text-sm font-bold mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-900 text-[var(--off-white)] ${formErrors.name ? 'border-red-500' : 'border-gray-700'}`}
              placeholder="Tu nombre"
              disabled={submissionStatus === 'submitting'}
            />
            {formErrors.name && <p className="text-red-400 text-xs italic mt-1">{formErrors.name}</p>}
          </div>

          {/* Campo Correo Electrónico */}
          <div>
            <label htmlFor="email" className="block text-[var(--light-gray-text)] text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-900 text-[var(--off-white)] ${formErrors.email ? 'border-red-500' : 'border-gray-700'}`}
              placeholder="tu@ejemplo.com"
              disabled={submissionStatus === 'submitting'}
            />
            {formErrors.email && <p className="text-red-400 text-xs italic mt-1">{formErrors.email}</p>}
          </div>

          {/* Campo Asunto */}
          <div>
            <label htmlFor="subject" className="block text-[var(--light-gray-text)] text-sm font-bold mb-2">
              Asunto
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-900 text-[var(--off-white)] ${formErrors.subject ? 'border-red-500' : 'border-gray-700'}`}
              placeholder="Asunto de tu mensaje"
              disabled={submissionStatus === 'submitting'}
            />
            {formErrors.subject && <p className="text-red-400 text-xs italic mt-1">{formErrors.subject}</p>}
          </div>

          {/* Campo Mensaje */}
          <div>
            <label htmlFor="message" className="block text-[var(--light-gray-text)] text-sm font-bold mb-2">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-900 text-[var(--off-white)] resize-y ${formErrors.message ? 'border-red-500' : 'border-gray-700'}`}
              placeholder="Escribe tu mensaje aquí..."
              disabled={submissionStatus === 'submitting'}
            ></textarea>
            {formErrors.message && <p className="text-red-400 text-xs italic mt-1">{formErrors.message}</p>}
          </div>

          {/* Botón de Envío y Estado */}
          <button
            type="submit"
            disabled={submissionStatus === 'submitting'}
            className={`bg-[var(--accent-green)] hover:bg-[var(--primary-purple)] text-[var(--dark-gray)] font-bold py-3 px-8 rounded-full text-xl w-full
                       transition duration-300 ease-in-out transform hover:scale-105 shadow-xl flex items-center justify-center
                       ${submissionStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submissionStatus === 'submitting' ? (
              <>
                <i className="fas fa-spinner fa-spin mr-3"></i> Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-3"></i> Enviar Mensaje
              </>
            )}
          </button>

          {submissionStatus === 'success' && (
            <p className="text-green-400 text-center mt-4 flex items-center justify-center">
              <i className="fas fa-check-circle mr-2"></i> ¡Mensaje enviado con éxito! Te responderemos pronto.
            </p>
          )}
          {submissionStatus === 'error' && Object.keys(formErrors).length === 0 && ( // Solo muestra este si no hay errores de validación de campo
            <p className="text-red-400 text-center mt-4 flex items-center justify-center">
              <i className="fas fa-exclamation-triangle mr-2"></i> Hubo un error al enviar tu mensaje. Inténtalo de nuevo.
            </p>
          )}
        </form>
      </div>

      {/* Información de Contacto Adicional */}
      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-green)] max-w-2xl mx-auto mt-8">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Otras Vías de Contacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <i className="fas fa-envelope text-purple-400 text-3xl"></i>
            <div>
              <p className="text-gray-400">Correo Electrónico:</p>
              <a href="mailto:info@highpowerdapp.com" className="text-[var(--off-white)] hover:text-[var(--accent-green)] font-semibold transition-colors">info@highpowerdapp.com</a>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <i className="fab fa-discord text-blue-400 text-3xl"></i>
            <div>
              <p className="text-gray-400">Comunidad Discord:</p>
              <a href="https://discord.gg/YOUR_DISCORD_INVITE" target="_blank" rel="noopener noreferrer" className="text-[var(--off-white)] hover:text-[var(--accent-green)] font-semibold transition-colors">Únete a nuestro Discord</a>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <i className="fab fa-twitter text-cyan-400 text-3xl"></i>
            <div>
              <p className="text-gray-400">Twitter (X):</p>
              <a href="https://twitter.com/HighPowerDApp" target="_blank" rel="noopener noreferrer" className="text-[var(--off-white)] hover:text-[var(--accent-green)] font-semibold transition-colors">@HighPowerDApp</a>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <i className="fab fa-telegram-plane text-blue-500 text-3xl"></i>
            <div>
              <p className="text-gray-400">Telegram:</p>
              <a href="https://t.me/HighPowerDAppOfficial" target="_blank" rel="noopener noreferrer" className="text-[var(--off-white)] hover:text-[var(--accent-green)] font-semibold transition-colors">Únete al Grupo Oficial</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;

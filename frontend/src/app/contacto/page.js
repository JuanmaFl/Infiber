'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envío (aquí integrarías con tu backend)
    setTimeout(() => {
      setEnviado(true);
      setLoading(false);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-[#00BCD4] cursor-pointer">
              Infiber
            </div>
          </Link>
          <div className="space-x-6 flex items-center">
            <Link href="/#planes" className="text-[#212121] hover:text-[#00BCD4] transition">
              Planes
            </Link>
            <Link href="/login" className="text-[#212121] hover:text-[#00BCD4] transition">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-[#E3F2FD]">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-[#212121] mb-4"
          >
            Contáctanos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#757575]"
          >
            Estamos aquí para ayudarte
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-[#212121] mb-6">
                  Información de contacto
                </h2>
                <p className="text-[#757575] text-lg mb-8">
                  Nuestro equipo está disponible 24/7 para resolver todas tus dudas
                </p>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 bg-[#E3F2FD] rounded-xl"
                >
                  <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#212121] mb-1">Teléfono</h3>
                    <p className="text-[#757575]">+57 123 456 7890</p>
                    <p className="text-[#757575]">WhatsApp disponible</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 bg-[#E3F2FD] rounded-xl"
                >
                  <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#212121] mb-1">Email</h3>
                    <p className="text-[#757575]">soporte@infiber.com</p>
                    <p className="text-[#757575]">ventas@infiber.com</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 bg-[#E3F2FD] rounded-xl"
                >
                  <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#212121] mb-1">Zonas de Cobertura</h3>
                    <p className="text-[#757575]">Palmitas</p>
                    <p className="text-[#757575]">San Cristóbal</p>
                    <p className="text-[#757575]">Robledo</p>
                  </div>
                </motion.div>
              </div>

              <div className="bg-[#4CAF50] text-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Horario de Atención</h3>
                <p>Lunes a Domingo: 24 horas</p>
                <p className="text-sm mt-2 opacity-90">
                  Soporte técnico disponible en todo momento
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold text-[#212121] mb-6">
                Envíanos un mensaje
              </h2>

              {enviado && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#4CAF50] text-white p-4 rounded-xl mb-6"
                >
                  ✓ Mensaje enviado exitosamente. Te contactaremos pronto.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#212121] font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#212121] font-semibold mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Mensaje
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] resize-none"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Enviando...' : (
                    <>
                      <Send size={20} />
                      Enviar mensaje
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
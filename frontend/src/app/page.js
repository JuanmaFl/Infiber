'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Zap, Shield, Users, Download, Upload, Clock } from 'lucide-react';
import { fetchPlanes } from '@/lib/api';

export default function Home() {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    fetchPlanes().then(setPlanes);
  }, []);

  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-[#00BCD4]"
          >
            Infiber
          </motion.div>
          <div className="space-x-6 flex items-center">
            <a href="#planes" className="text-[#212121] hover:text-[#00BCD4] transition font-medium">Planes</a>
            <a href="#cobertura" className="text-[#212121] hover:text-[#00BCD4] transition font-medium">Cobertura</a>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00BCD4] text-white px-6 py-2 rounded-full hover:bg-[#00ACC1] hover:shadow-lg transition font-semibold"
            >
              Contratar
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-[#E3F2FD] relative overflow-hidden">
        {/* Animated background circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-[#00BCD4] rounded-full opacity-10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#00BCD4] rounded-full opacity-10 blur-3xl"
        />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-bold mb-6 leading-tight">
              <span className="text-[#00BCD4]">
                Internet.
              </span>
              <br />
              <span className="text-[#212121]">Pero mejor.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#212121] font-medium mb-8"
          >
            Fibra óptica de alta velocidad para Palmitas, San Cristóbal y Robledo
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 188, 212, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00BCD4] text-white px-10 py-4 rounded-full text-lg hover:bg-[#00ACC1] hover:shadow-xl transition font-semibold"
          >
            Ver planes →
          </motion.button>

          {/* Floating Icons */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-20 right-20"
          >
            <Wifi className="text-[#00BCD4] opacity-20" size={80} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-20 left-20"
          >
            <Zap className="text-[#00BCD4] opacity-20" size={80} />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#212121] text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { number: "100+", label: "Clientes Activos", icon: Users },
              { number: "99.9%", label: "Uptime", icon: Shield },
              { number: "24/7", label: "Soporte", icon: Clock }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <stat.icon className="mx-auto mb-4 text-[#00BCD4]" size={48} />
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                  className="text-5xl font-bold mb-2 text-white"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes Section */}
      <section id="planes" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-center mb-4 text-[#212121]">
              Planes diseñados a tu medida
            </h2>
            <p className="text-center text-[#757575] mb-12 text-lg">
              Precios ya incluyen IVA
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {planes.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 188, 212, 0.25)"
                }}
                className="bg-white border-2 border-gray-200 rounded-3xl p-8 relative overflow-hidden group hover:border-[#00BCD4] transition-all"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-[#E3F2FD] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-[#212121]">{plan.nombre}</h3>
                  <div className="text-5xl font-bold text-[#00BCD4] mb-6">
                    ${plan.precio.toLocaleString()}
                    <span className="text-lg text-[#757575] font-normal">/mes</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 bg-white border-2 border-[#E3F2FD] p-4 rounded-xl"
                    >
                      <Download className="text-[#00BCD4]" size={24} />
                      <span className="text-lg font-semibold text-[#212121]">{plan.velocidad_bajada} Mbps de bajada</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 bg-white border-2 border-[#E3F2FD] p-4 rounded-xl"
                    >
                      <Upload className="text-[#00BCD4]" size={24} />
                      <span className="text-lg font-semibold text-[#212121]">{plan.velocidad_subida} Mbps de subida</span>
                    </motion.div>
                  </div>

                  <p className="text-[#757575] mb-6">
                    {plan.descripcion}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] hover:shadow-xl transition font-semibold"
                  >
                    Contratar ahora →
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#E3F2FD]">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center mb-16 text-[#212121]"
          >
            ¿Por qué elegir Infiber?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Zap,
                title: "Velocidad Real",
                description: "La velocidad que pagas es la que recibes, sin letra pequeña",
                color: "#FF9800"
              },
              {
                icon: Shield,
                title: "Sin Permanencia",
                description: "Cancela cuando quieras, sin cláusulas ni penalizaciones",
                color: "#4CAF50"
              },
              {
                icon: Users,
                title: "Soporte Humano",
                description: "Atención 24/7 con personas reales, no bots",
                color: "#00BCD4"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="text-center group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{ backgroundColor: feature.color }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition"
                >
                  <feature.icon className="text-white" size={40} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-[#212121]">{feature.title}</h3>
                <p className="text-[#757575] leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#212121] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-[#00BCD4]">
                Infiber
              </h3>
              <p className="text-gray-300 text-lg">
                Internet de alta velocidad para el norte de Medellín
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-xl text-white">Contacto</h4>
              <p className="text-gray-300 mb-2">📧 soporte@infiber.com</p>
              <p className="text-gray-300">📱 WhatsApp: +57 123 456 7890</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-xl text-white">Zonas de Cobertura</h4>
              <p className="text-gray-300">📍 Palmitas</p>
              <p className="text-gray-300">📍 San Cristóbal</p>
              <p className="text-gray-300">📍 Robledo</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Infiber ISP. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Wifi, Zap, Shield, Users, Download, Upload, Clock,
  Check, Star, MessageCircle, MapPin, Phone, Mail,
  ArrowRight, Globe, Award, Headphones
} from 'lucide-react';
import { fetchPlanes } from '@/lib/api';
import Link from 'next/link';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    fetchPlanes().then(setPlanes);
  }, []);

  return (
    <div className="bg-white">
      {/* Navbar Mejorado */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-[#00BCD4] flex items-center gap-2"
            >
              <Wifi className="text-[#00BCD4]" size={28} />
              Infiber
            </motion.div>

            <div className="hidden md:flex space-x-8 items-center">
              <a href="#planes" className="text-[#212121] hover:text-[#00BCD4] transition font-medium">Planes</a>
              <a href="#beneficios" className="text-[#212121] hover:text-[#00BCD4] transition font-medium">Beneficios</a>
              <a href="#cobertura" className="text-[#212121] hover:text-[#00BCD4] transition font-medium">Cobertura</a>
              <a href="#testimonios" className="text-[#212121] hover:text-[#00BCD4] transition font-medium">Testimonios</a>
              <a href="#contacto" className="text-[#212121] hover:text-[#00BCD4] transition font-medium">Contacto</a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[#00BCD4] font-semibold hover:text-[#00ACC1] transition"
                >
                  Iniciar Sesión
                </motion.button>
              </Link>
              <Link href="/contratar">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#00BCD4] text-white px-6 py-2 rounded-full hover:bg-[#00ACC1] hover:shadow-lg transition font-semibold"
                >
                  Contratar Ahora
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Mejorado */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#E3F2FD] via-white to-[#E3F2FD] relative overflow-hidden min-h-screen flex items-center">
        {/* Animated background */}
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

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-[#00BCD4]/10 px-4 py-2 rounded-full mb-6"
              >
                <span className="text-[#00BCD4] font-semibold">✨ Fibra Óptica de Alta Velocidad</span>
              </motion.div>

              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-[#212121]">Internet</span>
                <br />
                <span className="text-[#00BCD4]">Sin Límites</span>
              </h1>

              <p className="text-xl text-[#757575] mb-8 leading-relaxed">
                La mejor conexión de fibra óptica para Palmitas, San Cristóbal y Robledo.
                Velocidad real, sin interrupciones, sin sorpresas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.a
                  href="#planes"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#00BCD4] text-white px-8 py-4 rounded-full text-lg hover:bg-[#00ACC1] hover:shadow-xl transition font-semibold text-center flex items-center justify-center gap-2"
                >
                  Ver Planes <ArrowRight size={20} />
                </motion.a>
                <motion.a
                  href="#contacto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-[#00BCD4] text-[#00BCD4] px-8 py-4 rounded-full text-lg hover:bg-[#00BCD4] hover:text-white transition font-semibold text-center"
                >
                  Contactar
                </motion.a>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "99.9%", label: "Uptime" },
                  { value: "24/7", label: "Soporte" },
                  { value: "100+", label: "Clientes" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl font-bold text-[#00BCD4]">{stat.value}</p>
                    <p className="text-sm text-[#757575]">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Imagen/Ilustración */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="bg-white p-8 rounded-3xl shadow-2xl"
              >
                <div className="space-y-6">
                  {[
                    { icon: Zap, text: "Instalación en 24 horas", color: "bg-yellow-100 text-yellow-600" },
                    { icon: Shield, text: "Sin cláusulas de permanencia", color: "bg-green-100 text-green-600" },
                    { icon: Headphones, text: "Soporte técnico 24/7", color: "bg-blue-100 text-blue-600" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.2 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className={`p-3 rounded-xl ${item.color}`}>
                        <item.icon size={24} />
                      </div>
                      <span className="font-semibold text-[#212121]">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-20 h-20 bg-[#00BCD4] rounded-full opacity-20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#00BCD4] rounded-full opacity-20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logos/Confianza */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container mx-auto px-6">
          <p className="text-center text-[#757575] mb-8 font-semibold">Tecnología de clase mundial</p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-60">
            {['Cisco', 'Ubiquiti', 'MikroTik', 'Huawei'].map((brand, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-2xl font-bold text-gray-400"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-[#212121]">
              ¿Por qué elegir Infiber?
            </h2>
            <p className="text-xl text-[#757575]">
              Más que internet, una experiencia completa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Velocidad Real",
                description: "La velocidad que contratas es la que recibes. Sin trucos, sin letra pequeña.",
                color: "bg-yellow-100 text-yellow-600"
              },
              {
                icon: Shield,
                title: "Sin Permanencia",
                description: "Cancela cuando quieras, sin penalizaciones ni cláusulas abusivas.",
                color: "bg-green-100 text-green-600"
              },
              {
                icon: Users,
                title: "Soporte Humano",
                description: "Atención 24/7 con personas reales que conocen tu zona.",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: Award,
                title: "Instalación Gratis",
                description: "Instalamos tu servicio sin costo adicional en menos de 24 horas.",
                color: "bg-purple-100 text-purple-600"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${benefit.color} mb-6`}
                >
                  <benefit.icon size={32} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-[#212121]">{benefit.title}</h3>
                <p className="text-[#757575] leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     {/* Planes Section Mejorado */}
      <section id="planes" className="py-20 bg-gradient-to-br from-[#E3F2FD] to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-[#212121]">
              Planes diseñados para ti
            </h2>
            <p className="text-xl text-[#757575]">
              Sin costos ocultos • Precios incluyen IVA • Instalación gratuita
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
                  y: -15,
                  boxShadow: "0 25px 50px -12px rgba(0, 188, 212, 0.3)"
                }}
                className={`bg-white rounded-3xl p-8 relative overflow-hidden group border-2 transition-all ${
                  index === 1 ? 'border-[#00BCD4] scale-105' : 'border-gray-200 hover:border-[#00BCD4]'
                }`}
              >
                {/* Badge "Más Popular" */}
                {index === 1 && (
                  <div className="absolute top-0 right-0 bg-[#00BCD4] text-white px-4 py-1 rounded-bl-2xl font-semibold text-sm">
                    ⭐ Más Popular
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E3F2FD] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  {/* Nombre del Plan */}
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-[#212121] mb-2">{plan.nombre}</h3>
                    <p className="text-[#757575]">Ideal para {plan.nombre.includes('Básico') ? 'navegación ligera' : plan.nombre.includes('Estándar') ? '2-3 personas' : 'familias y gaming'}</p>
                  </div>

                  {/* Precio */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-[#00BCD4]">
                        ${plan.precio.toLocaleString()}
                      </span>
                      <span className="text-lg text-[#757575]">/mes</span>
                    </div>
                    <p className="text-sm text-[#757575] mt-2">IVA incluido • Sin permanencia</p>
                  </div>

                  {/* Características */}
                  <div className="space-y-4 mb-8">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 bg-white border-2 border-[#E3F2FD] p-4 rounded-xl group-hover:border-[#00BCD4] transition"
                    >
                      <Download className="text-[#00BCD4] flex-shrink-0" size={24} />
                      <div>
                        <p className="font-bold text-[#212121]">{plan.velocidad_bajada} Mbps</p>
                        <p className="text-sm text-[#757575]">Velocidad de descarga</p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 bg-white border-2 border-[#E3F2FD] p-4 rounded-xl group-hover:border-[#00BCD4] transition"
                    >
                      <Upload className="text-[#00BCD4] flex-shrink-0" size={24} />
                      <div>
                        <p className="font-bold text-[#212121]">{plan.velocidad_subida} Mbps</p>
                        <p className="text-sm text-[#757575]">Velocidad de carga</p>
                      </div>
                    </motion.div>

                    {/* Beneficios incluidos */}
                    <div className="pt-4 border-t-2 border-gray-100 space-y-3">
                      {[
                        'Router WiFi incluido',
                        'Instalación gratuita',
                        'Soporte 24/7',
                        'IP pública (opcional)'
                      ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="text-green-600 flex-shrink-0" size={18} />
                          <span className="text-sm text-[#757575]">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="text-[#757575] mb-6 text-sm">
                    {plan.descripcion}
                  </p>

                  {/* Botón */}
                  <Link href="/contratar">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-full font-semibold transition flex items-center justify-center gap-2 ${
                        index === 1
                          ? 'bg-[#00BCD4] text-white hover:bg-[#00ACC1] shadow-lg'
                          : 'bg-[#E3F2FD] text-[#00BCD4] hover:bg-[#00BCD4] hover:text-white'
                      }`}
                    >
                      Contratar ahora <ArrowRight size={18} />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nota adicional */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-[#757575]">
              ¿Necesitas un plan personalizado?
              <a href="#contacto" className="text-[#00BCD4] font-semibold hover:underline ml-2">
                Contáctanos
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparación de Planes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-[#212121]">
              Compara y elige
            </h2>
            <p className="text-xl text-[#757575]">
              Todos los planes incluyen los mismos beneficios
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 font-bold text-[#212121]">Característica</th>
                  {planes.map(plan => (
                    <th key={plan.id} className="text-center p-4 font-bold text-[#00BCD4]">
                      {plan.nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Velocidad de Bajada', key: 'velocidad_bajada', suffix: ' Mbps' },
                  { label: 'Velocidad de Subida', key: 'velocidad_subida', suffix: ' Mbps' },
                  { label: 'Precio Mensual', key: 'precio', prefix: '$', suffix: '' }
                ].map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b border-gray-100 hover:bg-[#E3F2FD]/30 transition"
                  >
                    <td className="p-4 font-semibold text-[#212121]">{row.label}</td>
                    {planes.map(plan => (
                      <td key={plan.id} className="text-center p-4 text-[#757575]">
                        {row.prefix}{plan[row.key].toLocaleString()}{row.suffix}
                      </td>
                    ))}
                  </motion.tr>
                ))}
                {[
                  'Router WiFi',
                  'Instalación',
                  'Soporte 24/7',
                  'Sin permanencia',
                  'IP pública'
                ].map((benefit, i) => (
                  <motion.tr
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i + 3) * 0.1 }}
                    className="border-b border-gray-100 hover:bg-[#E3F2FD]/30 transition"
                  >
                    <td className="p-4 text-[#212121]">{benefit}</td>
                    {planes.map(plan => (
                      <td key={plan.id} className="text-center p-4">
                        <Check className="text-green-600 mx-auto" size={20} />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="py-20 bg-gradient-to-br from-[#212121] to-[#424242] text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-300">
              Más de 100 familias confían en Infiber
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                location: "Palmitas",
                text: "Después de años con internet lento, Infiber fue un cambio total. Ahora toda la familia puede estar conectada sin problemas.",
                rating: 5
              },
              {
                name: "Carlos Ramírez",
                location: "San Cristóbal",
                text: "Trabajo desde casa y necesito conexión estable. Con Infiber nunca he tenido problemas en videollamadas o subiendo archivos.",
                rating: 5
              },
              {
                name: "Ana Martínez",
                location: "Robledo",
                text: "El soporte técnico es excelente. Siempre responden rápido y resuelven cualquier duda. Lo recomiendo 100%.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>
                <p className="text-gray-100 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* Cobertura Section */}
      <section id="cobertura" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-[#212121]">
              Zonas de Cobertura
            </h2>
            <p className="text-xl text-[#757575]">
              Actualmente brindamos servicio en el norte de Medellín
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {[
              {
                name: "Palmitas",
                description: "Cobertura completa en toda la zona",
                icon: MapPin,
                color: "bg-blue-100 text-blue-600"
              },
              {
                name: "San Cristóbal",
                description: "Servicio en expansión continua",
                icon: MapPin,
                color: "bg-green-100 text-green-600"
              },
              {
                name: "Robledo",
                description: "Llegamos a todos los barrios",
                icon: MapPin,
                color: "bg-purple-100 text-purple-600"
              }
            ].map((zone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-[#00BCD4] transition text-center"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${zone.color} mx-auto mb-4`}
                >
                  <zone.icon size={32} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-[#212121]">{zone.name}</h3>
                <p className="text-[#757575]">{zone.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mapa Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#E3F2FD] to-[#B2EBF2] p-12 rounded-3xl text-center max-w-3xl mx-auto"
          >
            <Globe className="text-[#00BCD4] mx-auto mb-4" size={64} />
            <h3 className="text-3xl font-bold mb-4 text-[#212121]">
              ¿No estás en estas zonas?
            </h3>
            <p className="text-[#757575] mb-6 text-lg">
              Estamos en constante expansión. Déjanos tus datos y te avisaremos cuando lleguemos a tu sector.
            </p>
            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-[#00BCD4] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#00ACC1] transition"
            >
              Quiero que lleguen a mi zona
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#E3F2FD]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-[#212121]">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-[#757575]">
              Todo lo que necesitas saber sobre nuestro servicio
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "¿Cuánto tarda la instalación?",
                a: "La instalación se realiza en menos de 24 horas hábiles después de contratar el servicio. Coordinamos contigo el mejor horario."
              },
              {
                q: "¿Hay costos de instalación?",
                a: "No, la instalación es completamente gratuita. Solo pagas la mensualidad de tu plan."
              },
              {
                q: "¿Puedo cambiar de plan después?",
                a: "Sí, puedes cambiar a un plan superior o inferior en cualquier momento sin costos adicionales."
              },
              {
                q: "¿Qué pasa si tengo problemas técnicos?",
                a: "Contamos con soporte técnico 24/7. Puedes contactarnos por WhatsApp, teléfono o correo y te atendemos de inmediato."
              },
              {
                q: "¿Incluye el router WiFi?",
                a: "Sí, todos nuestros planes incluyen un router WiFi de alta calidad sin costo adicional."
              },
              {
                q: "¿Hay cláusula de permanencia?",
                a: "No, puedes cancelar el servicio cuando quieras sin penalizaciones ni costos adicionales."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-3 text-[#212121] flex items-start gap-3">
                  <span className="text-[#00BCD4] flex-shrink-0">Q:</span>
                  {faq.q}
                </h3>
                <p className="text-[#757575] pl-8 leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-[#212121]">
              ¿Listo para conectarte?
            </h2>
            <p className="text-xl text-[#757575]">
              Contáctanos y un asesor te atenderá de inmediato
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Información de Contacto */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold mb-6 text-[#212121]">
                Hablemos
              </h3>

              {[
                {
                  icon: Phone,
                  title: "Teléfono",
                  info: "+57 123 456 7890",
                  link: "tel:+571234567890",
                  color: "bg-green-100 text-green-600"
                },
                {
                  icon: MessageCircle,
                  title: "WhatsApp",
                  info: "+57 123 456 7890",
                  link: "https://wa.me/571234567890",
                  color: "bg-green-100 text-green-600"
                },
                {
                  icon: Mail,
                  title: "Email",
                  info: "soporte@infiber.com",
                  link: "mailto:soporte@infiber.com",
                  color: "bg-blue-100 text-blue-600"
                },
                {
                  icon: MapPin,
                  title: "Cobertura",
                  info: "Palmitas, San Cristóbal, Robledo",
                  link: "#cobertura",
                  color: "bg-purple-100 text-purple-600"
                }
              ].map((contact, index) => (
                <motion.a
                  key={index}
                  href={contact.link}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#00BCD4] hover:shadow-lg transition group"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${contact.color} group-hover:scale-110 transition`}>
                    <contact.icon size={28} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#212121] mb-1">{contact.title}</p>
                    <p className="text-[#00BCD4] font-medium">{contact.info}</p>
                  </div>
                </motion.a>
              ))}

              {/* Horario */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-[#E3F2FD] p-6 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="text-[#00BCD4]" size={24} />
                  <h4 className="font-bold text-[#212121]">Horario de Atención</h4>
                </div>
                <p className="text-[#757575]">
                  Lunes a Viernes: 8:00 AM - 6:00 PM<br />
                  Sábados: 9:00 AM - 2:00 PM<br />
                  <span className="text-[#00BCD4] font-semibold">Soporte técnico 24/7</span>
                </p>
              </motion.div>
            </motion.div>

            {/* Formulario de Contacto */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100"
            >
              <h3 className="text-2xl font-bold mb-6 text-[#212121]">
                Solicita información
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Zona
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition">
                    <option>Palmitas</option>
                    <option>San Cristóbal</option>
                    <option>Robledo</option>
                    <option>Otra zona</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition h-24 resize-none"
                    placeholder="Cuéntanos qué necesitas..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#00BCD4] text-white py-4 rounded-full hover:bg-[#00ACC1] hover:shadow-xl transition font-semibold flex items-center justify-center gap-2"
                >
                  Enviar solicitud <ArrowRight size={20} />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">
              ¿Qué esperas para cambiar?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Únete a más de 100 familias que ya disfrutan del mejor internet de fibra óptica en Medellín
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contratar">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#00BCD4] px-8 py-4 rounded-full font-bold hover:shadow-2xl transition"
                >
                  Contratar ahora
                </motion.button>
              </Link>
              <motion.a
                href="#planes"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#00BCD4] transition"
              >
                Ver planes
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Mejorado */}
      <footer className="bg-[#212121] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo y descripción */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wifi className="text-[#00BCD4]" size={32} />
                <h3 className="text-3xl font-bold text-[#00BCD4]">Infiber</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Internet de fibra óptica de alta velocidad para el norte de Medellín
              </p>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="font-bold mb-4 text-xl">Enlaces</h4>
              <ul className="space-y-2">
                <li><a href="#planes" className="text-gray-300 hover:text-[#00BCD4] transition">Planes</a></li>
                <li><a href="#beneficios" className="text-gray-300 hover:text-[#00BCD4] transition">Beneficios</a></li>
                <li><a href="#cobertura" className="text-gray-300 hover:text-[#00BCD4] transition">Cobertura</a></li>
                <li><a href="#testimonios" className="text-gray-300 hover:text-[#00BCD4] transition">Testimonios</a></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-bold mb-4 text-xl">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <Mail size={16} className="text-[#00BCD4]" />
                  soporte@infiber.com
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Phone size={16} className="text-[#00BCD4]" />
                  +57 123 456 7890
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <MessageCircle size={16} className="text-[#00BCD4]" />
                  WhatsApp 24/7
                </li>
              </ul>
            </div>

            {/* Zonas */}
            <div>
              <h4 className="font-bold mb-4 text-xl">Cobertura</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <MapPin size={16} className="text-[#00BCD4]" />
                  Palmitas
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <MapPin size={16} className="text-[#00BCD4]" />
                  San Cristóbal
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <MapPin size={16} className="text-[#00BCD4]" />
                  Robledo
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">© 2025 Infiber ISP. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-[#00BCD4] transition">Términos</a>
              <a href="#" className="text-gray-400 hover:text-[#00BCD4] transition">Privacidad</a>
              <a href="/login" className="text-gray-400 hover:text-[#00BCD4] transition">Acceso Clientes</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

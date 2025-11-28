'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';

export default function MiPerfil() {
  const [perfil, setPerfil] = useState({
    username: 'juanperez',
    email: 'juan.perez@email.com',
    first_name: 'Juan',
    last_name: 'Pérez',
    telefono: '300 123 4567',
    cedula: '1234567890',
    direccion: 'Cra 45 #23-12, Palmitas'
  });

  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.name]: e.target.value
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    
    // Aquí integrarías con tu API
    setTimeout(() => {
      setGuardando(false);
      setEditando(false);
      alert('Perfil actualizado exitosamente');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#212121]">Mi Perfil</h1>
            <p className="text-[#757575] mt-1">Administra tu información personal</p>
          </div>
          {!editando ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditando(true)}
              className="bg-[#00BCD4] text-white px-6 py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold"
            >
              Editar Perfil
            </motion.button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setEditando(false)}
                className="px-6 py-3 border-2 border-gray-300 text-[#757575] rounded-full hover:border-[#00BCD4] hover:text-[#00BCD4] transition font-semibold"
              >
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGuardar}
                disabled={guardando}
                className="bg-[#00BCD4] text-white px-6 py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                {guardando ? 'Guardando...' : 'Guardar'}
              </motion.button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100"
        >
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-[#00BCD4] rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {perfil.first_name.charAt(0)}{perfil.last_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#212121]">
                {perfil.first_name} {perfil.last_name}
              </h2>
              <p className="text-[#757575]">@{perfil.username}</p>
            </div>
          </div>

          <form onSubmit={handleGuardar} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#212121] font-semibold mb-2 flex items-center gap-2">
                  <User size={18} />
                  Nombre
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={perfil.first_name}
                  onChange={handleChange}
                  disabled={!editando}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-[#212121] font-semibold mb-2 flex items-center gap-2">
                  <User size={18} />
                  Apellido
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={perfil.last_name}
                  onChange={handleChange}
                  disabled={!editando}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#212121] font-semibold mb-2 flex items-center gap-2">
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={perfil.email}
                onChange={handleChange}
                disabled={!editando}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:bg-gray-50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#212121] font-semibold mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={perfil.telefono}
                  onChange={handleChange}
                  disabled={!editando}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-[#212121] font-semibold mb-2 flex items-center gap-2">
                  <User size={18} />
                  Cédula
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={perfil.cedula}
                  onChange={handleChange}
                  disabled={!editando}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#212121] font-semibold mb-2 flex items-center gap-2">
                <MapPin size={18} />
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={perfil.direccion}
                onChange={handleChange}
                disabled={!editando}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:bg-gray-50"
              />
            </div>
          </form>
        </motion.div>

        {/* Cambiar Contraseña */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
        >
          <h3 className="text-xl font-bold text-[#212121] mb-4 flex items-center gap-2">
            <Lock size={20} />
            Seguridad
          </h3>
          <button className="w-full md:w-auto px-6 py-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition font-semibold">
            Cambiar Contraseña
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
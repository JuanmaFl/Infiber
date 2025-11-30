'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { User, Mail, Phone, MapPin, Lock, Save, Loader2, Eye, EyeOff, CheckCircle, X } from 'lucide-react';
import { fetchUsuario, actualizarUsuario, cambiarPasswordAutenticado } from '@/lib/api';

export default function MiPerfil() {
  const [perfil, setPerfil] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    cedula: '',
    direccion: ''
  });
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  // Estado para cambio de contraseña
  const [mostrarCambiarPassword, setMostrarCambiarPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password_actual: '',
    nueva_password: '',
    confirmar_password: ''
  });
  const [mostrarPasswords, setMostrarPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  });
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [exitoPassword, setExitoPassword] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');
      
      if (!token || !userId) {
        window.location.href = '/login';
        return;
      }

      const data = await fetchUsuario(token, userId);
      setPerfil(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.name]: e.target.value
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    setExito(false);
    
    try {
      const token = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');
      
      await actualizarUsuario(token, userId, perfil);
      
      setExito(true);
      setEditando(false);
      
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al actualizar el perfil');
    } finally {
      setGuardando(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setCambiandoPassword(true);
    setErrorPassword('');
    setExitoPassword(false);

    // Validar que las contraseñas coincidan
    if (passwordData.nueva_password !== passwordData.confirmar_password) {
      setErrorPassword('Las contraseñas nuevas no coinciden');
      setCambiandoPassword(false);
      return;
    }

    // Validar longitud mínima
    if (passwordData.nueva_password.length < 8) {
      setErrorPassword('La nueva contraseña debe tener al menos 8 caracteres');
      setCambiandoPassword(false);
      return;
    }

    try {
      await cambiarPasswordAutenticado(
        passwordData.password_actual,
        passwordData.nueva_password
      );
      
      setExitoPassword(true);
      setPasswordData({
        password_actual: '',
        nueva_password: '',
        confirmar_password: ''
      });

      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        setMostrarCambiarPassword(false);
        setExitoPassword(false);
      }, 2000);

    } catch (err) {
      setErrorPassword(err.message || 'Error al cambiar contraseña');
    } finally {
      setCambiandoPassword(false);
    }
  };

  const toggleMostrarPassword = (campo) => {
    setMostrarPasswords({
      ...mostrarPasswords,
      [campo]: !mostrarPasswords[campo]
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#00BCD4]" size={48} />
        </div>
      </DashboardLayout>
    );
  }

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
                onClick={() => {
                  setEditando(false);
                  cargarPerfil();
                }}
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
                {guardando ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-[#FFEBEE] text-[#F44336] p-4 rounded-xl">
            {error}
          </div>
        )}

        {exito && (
          <div className="bg-[#E8F5E9] text-[#4CAF50] p-4 rounded-xl">
            ✅ Perfil actualizado exitosamente
          </div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100"
        >
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-[#00BCD4] rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {perfil.first_name?.charAt(0) || 'U'}{perfil.last_name?.charAt(0) || 'U'}
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
                  value={perfil.first_name || ''}
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
                  value={perfil.last_name || ''}
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
                value={perfil.email || ''}
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
                  value={perfil.telefono || ''}
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
                  value={perfil.cedula || ''}
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
                value={perfil.direccion || ''}
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
          <button 
            onClick={() => setMostrarCambiarPassword(true)}
            className="w-full md:w-auto px-6 py-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition font-semibold"
          >
            Cambiar Contraseña
          </button>
        </motion.div>
      </div>

      {/* Modal Cambiar Contraseña */}
      <AnimatePresence>
        {mostrarCambiarPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#212121]">Cambiar Contraseña</h2>
                <button
                  onClick={() => {
                    setMostrarCambiarPassword(false);
                    setPasswordData({
                      password_actual: '',
                      nueva_password: '',
                      confirmar_password: ''
                    });
                    setErrorPassword('');
                  }}
                  className="text-[#757575] hover:text-[#212121]"
                >
                  <X size={24} />
                </button>
              </div>

              {errorPassword && (
                <div className="bg-[#FFEBEE] text-[#F44336] p-4 rounded-xl mb-4">
                  {errorPassword}
                </div>
              )}

              {exitoPassword && (
                <div className="bg-[#E8F5E9] text-[#4CAF50] p-4 rounded-xl mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  ¡Contraseña actualizada exitosamente!
                </div>
              )}

              <form onSubmit={handleCambiarPassword} className="space-y-4">
                {/* Contraseña Actual */}
                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarPasswords.actual ? 'text' : 'password'}
                      name="password_actual"
                      value={passwordData.password_actual}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] pr-12"
                      required
                      disabled={cambiandoPassword || exitoPassword}
                    />
                    <button
                      type="button"
                      onClick={() => toggleMostrarPassword('actual')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#212121]"
                    >
                      {mostrarPasswords.actual ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Nueva Contraseña */}
                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarPasswords.nueva ? 'text' : 'password'}
                      name="nueva_password"
                      value={passwordData.nueva_password}
                      onChange={handlePasswordChange}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] pr-12"
                      required
                      disabled={cambiandoPassword || exitoPassword}
                    />
                    <button
                      type="button"
                      onClick={() => toggleMostrarPassword('nueva')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#212121]"
                    >
                      {mostrarPasswords.nueva ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarPasswords.confirmar ? 'text' : 'password'}
                      name="confirmar_password"
                      value={passwordData.confirmar_password}
                      onChange={handlePasswordChange}
                      placeholder="Repite la contraseña"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] pr-12"
                      required
                      disabled={cambiandoPassword || exitoPassword}
                    />
                    <button
                      type="button"
                      onClick={() => toggleMostrarPassword('confirmar')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#212121]"
                    >
                      {mostrarPasswords.confirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: cambiandoPassword || exitoPassword ? 1 : 1.02 }}
                  whileTap={{ scale: cambiandoPassword || exitoPassword ? 1 : 0.98 }}
                  type="submit"
                  disabled={cambiandoPassword || exitoPassword}
                  className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {cambiandoPassword ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Cambiando contraseña...
                    </>
                  ) : exitoPassword ? (
                    <>
                      <CheckCircle size={20} />
                      Contraseña actualizada
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Cambiar Contraseña
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
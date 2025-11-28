'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registrarUsuario } from '@/lib/api';

export default function Registro() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    cedula: '',
    telefono: '',
    password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        cedula: formData.cedula,
        telefono: formData.telefono,
        rol: 'cliente'
      };

      await registrarUsuario(userData);
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      router.push('/login?registered=true');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar usuario. Verifica que el usuario o email no estén en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3F2FD] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00BCD4] mb-2">Registro en Infiber</h1>
          <p className="text-[#757575]">Crea tu cuenta para contratar nuestros servicios</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Apellido */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Nombre <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Ej: Juan"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Apellido <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-[#212121] font-semibold mb-2">
              Nombre de Usuario <span className="text-[#F44336]">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ej: juanperez123"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              required
              disabled={loading}
            />
            <p className="text-xs text-[#757575] mt-1">Sin espacios ni caracteres especiales</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#212121] font-semibold mb-2">
              Correo Electrónico <span className="text-[#F44336]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: juan.perez@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              required
              disabled={loading}
            />
          </div>

          {/* Cédula y Teléfono */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Cédula <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Ej: 1234567890"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Teléfono <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: 300 123 4567"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Contraseñas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Contraseña <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Confirmar Contraseña <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          {/* Botón Submit */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/login" className="text-[#00BCD4] hover:underline block">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
          <Link href="/" className="text-[#757575] hover:underline block text-sm">
            Volver al inicio
          </Link>
        </div>

        {/* Términos y Condiciones */}
        <p className="text-xs text-[#757575] text-center mt-6">
          Al registrarte, aceptas nuestros términos y condiciones de servicio
        </p>
      </motion.div>
    </div>
  );
}
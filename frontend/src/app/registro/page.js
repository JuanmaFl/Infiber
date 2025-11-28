'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Registro() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    telefono: '',
    cedula: ''
  });
  const [error, setError] = useState('');
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
    setLoading(true);
    setError('');

    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://86.48.21.76/infiber/api/usuarios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          telefono: formData.telefono,
          cedula: formData.cedula,
          rol: 'cliente'
        })
      });

      if (response.ok) {
        router.push('/login?registered=true');
      } else {
        const data = await response.json();
        setError(JSON.stringify(data));
      }
    } catch (err) {
      setError('Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-[#00BCD4] mb-2 cursor-pointer">
              Infiber
            </h1>
          </Link>
          <p className="text-[#757575]">Crea tu cuenta</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#F44336] text-white p-4 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
              />
            </div>

            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#212121] font-semibold mb-2">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              required
            />
          </div>

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

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Cédula
              </label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
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

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
              />
            </div>

            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#757575]">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#00BCD4] font-semibold hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-[#757575] hover:text-[#00BCD4] transition">
            ← Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
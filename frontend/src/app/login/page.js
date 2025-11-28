'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(username, password);
      if (data.access) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        router.push('/dashboard/cliente');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-[#00BCD4] mb-2 cursor-pointer">
              Infiber
            </h1>
          </Link>
          <p className="text-[#757575]">Inicia sesión en tu cuenta</p>
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
          <div>
            <label className="block text-[#212121] font-semibold mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              placeholder="Tu usuario"
              required
            />
          </div>

          <div>
            <label className="block text-[#212121] font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              placeholder="Tu contraseña"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#757575]">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-[#00BCD4] font-semibold hover:underline">
              Regístrate aquí
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
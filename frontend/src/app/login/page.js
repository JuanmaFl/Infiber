'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(credentials.username, credentials.password);
      
      // Guardar información del usuario
      const payload = JSON.parse(atob(data.access.split('.')[1]));
      localStorage.setItem('user_id', payload.user_id);
      
      // Obtener info del usuario
      const userResponse = await fetch(`https://86.48.21.76/infiber/api/usuarios/${payload.user_id}/`, {
        headers: {
          'Authorization': `Bearer ${data.access}`,
        },
      });
      
      const userData = await userResponse.json();
      localStorage.setItem('user_rol', userData.rol);
      
      // Redireccionar según el rol
      if (userData.rol === 'admin' || userData.rol === 'superadmin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/cliente');
      }
    } catch (err) {
      if (err.message === 'USUARIO_BLOQUEADO') {
        // Redirigir a la página de bloqueado
        router.push('/bloqueado');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00BCD4] mb-2">Infiber</h1>
          <p className="text-[#757575]">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="bg-[#FFEBEE] text-[#F44336] p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#212121] font-semibold mb-2">
              Usuario o Email
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="usuario o email@ejemplo.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[#212121] font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              required
              disabled={loading}
            />
          </div>

          <div className="text-right">
            <Link 
              href="/recuperar-password" 
              className="text-sm text-[#00BCD4] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/registro" className="text-[#00BCD4] hover:underline block">
            ¿No tienes cuenta? Regístrate
          </Link>
          <Link href="/" className="text-[#757575] hover:underline block text-sm">
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
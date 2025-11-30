'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { solicitarCodigoRecuperacion } from '@/lib/api';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await solicitarCodigoRecuperacion(email);
      setSuccess(true);
      
      // Redirigir a la página de verificación después de 2 segundos
      setTimeout(() => {
        router.push(`/recuperar-password/verificar?email=${encodeURIComponent(email)}`);
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Error al enviar código. Intenta nuevamente.');
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E1F5FE] rounded-full mb-4">
            <Mail className="w-8 h-8 text-[#00BCD4]" />
          </div>
          <h1 className="text-3xl font-bold text-[#212121] mb-2">
            Recuperar Contraseña
          </h1>
          <p className="text-[#757575]">
            Ingresa tu email y te enviaremos un código de verificación
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#FFEBEE] text-[#F44336] p-4 rounded-xl mb-6 text-center"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#E8F5E9] text-[#4CAF50] p-4 rounded-xl mb-6"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">¡Código enviado!</span>
            </div>
            <p className="text-sm mt-2 text-center">
              Revisa tu email y usa el código para recuperar tu contraseña
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#212121] font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              required
              disabled={loading || success}
            />
          </div>

          <motion.button
            whileHover={{ scale: loading || success ? 1 : 1.02 }}
            whileTap={{ scale: loading || success ? 1 : 0.98 }}
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando código...' : success ? 'Redirigiendo...' : 'Enviar Código'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-[#757575] hover:text-[#00BCD4] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
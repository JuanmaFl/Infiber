'use client';
import { motion } from 'framer-motion';
import { AlertCircle, Mail, MapPin, Clock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UsuarioBloqueado({ mensaje, instrucciones, opciones, nota }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#FFEBEE] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
      >
        {/* Icono de alerta */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#FFEBEE] rounded-full flex items-center justify-center">
            <AlertCircle className="text-[#F44336]" size={48} />
          </div>
        </div>

        {/* Mensaje principal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#212121] mb-3">
            Cuenta Suspendida
          </h1>
          <p className="text-xl text-[#757575] mb-2">{mensaje}</p>
          <p className="text-[#424242]">{instrucciones}</p>
        </div>

        {/* Opciones de contacto */}
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-[#E3F2FD] rounded-xl border-l-4 border-[#00BCD4]">
            <div className="flex items-start gap-3">
              <Mail className="text-[#00BCD4] mt-1" size={24} />
              <div>
                <p className="font-semibold text-[#212121] mb-1">Correo Electrónico</p>
                <a 
                  href="mailto:soporte@infiber.com"
                  className="text-[#00BCD4] hover:underline font-semibold"
                >
                  soporte@infiber.com
                </a>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#E3F2FD] rounded-xl border-l-4 border-[#00BCD4]">
            <div className="flex items-start gap-3">
              <MapPin className="text-[#00BCD4] mt-1" size={24} />
              <div>
                <p className="font-semibold text-[#212121] mb-1">Visítanos en Nuestra Sede</p>
                <p className="text-[#424242]">Medellín, Antioquia, Colombia</p>
                <p className="text-sm text-[#757575] mt-1">
                  Palmitas, San Cristóbal, Robledo
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#E3F2FD] rounded-xl border-l-4 border-[#00BCD4]">
            <div className="flex items-start gap-3">
              <Clock className="text-[#00BCD4] mt-1" size={24} />
              <div>
                <p className="font-semibold text-[#212121] mb-1">Horario de Atención</p>
                <p className="text-[#424242]">Lunes a Viernes</p>
                <p className="text-[#424242]">8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nota */}
        <div className="p-4 bg-[#FFF3E0] rounded-xl mb-6">
          <p className="text-[#424242] text-center">
            <span className="font-semibold text-[#FF9800]">Nota:</span> {nota}
          </p>
        </div>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#F44336] text-white py-4 rounded-full hover:bg-[#D32F2F] transition font-semibold flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </motion.div>
    </div>
  );
}
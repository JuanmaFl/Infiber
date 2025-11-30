'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FileText, Calendar, MapPin, Wifi, Loader2 } from 'lucide-react';
import { fetchContratos } from '@/lib/api';

export default function MiContrato() {
  const [contrato, setContrato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarContrato = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No estás autenticado');
          return;
        }

        const data = await fetchContratos(token);
        
        if (!data) {
          setError('No tienes un contrato activo');
          return;
        }

        setContrato(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el contrato');
      } finally {
        setLoading(false);
      }
    };

    cargarContrato();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#00BCD4]" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contrato) {
    return (
      <DashboardLayout>
        <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100 text-center">
          <p className="text-[#F44336] text-lg">{error || 'No se encontró el contrato'}</p>
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
            <h1 className="text-3xl font-bold text-[#212121]">Mi Contrato</h1>
            <p className="text-[#757575] mt-1">Información detallada de tu servicio</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold ${
            contrato.estado === 'activo' 
              ? 'bg-[#E8F5E9] text-[#4CAF50]' 
              : 'bg-[#FFEBEE] text-[#F44336]'
          }`}>
            {contrato.estado === 'activo' ? '● Activo' : '● Inactivo'}
          </span>
        </div>

        {/* Contract Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-6">
              Detalles del Servicio
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#00BCD4]" size={24} />
                </div>
                <div>
                  <p className="text-[#757575] text-sm">Número de Contrato</p>
                  <p className="text-lg font-bold text-[#212121]">CNT-{contrato.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wifi className="text-[#00BCD4]" size={24} />
                </div>
                <div>
                  <p className="text-[#757575] text-sm">Plan Contratado</p>
                  <p className="text-lg font-bold text-[#212121]">
                    {contrato.plan_detalle?.nombre || 'Plan No Disponible'}
                  </p>
                  {contrato.plan_detalle && (
                    <p className="text-sm text-[#757575]">
                      ⬇ {contrato.plan_detalle.velocidad_bajada} Mbps / ⬆ {contrato.plan_detalle.velocidad_subida} Mbps
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-[#00BCD4]" size={24} />
                </div>
                <div>
                  <p className="text-[#757575] text-sm">Fecha de Inicio</p>
                  <p className="text-lg font-bold text-[#212121]">
                    {new Date(contrato.fecha_inicio).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-[#00BCD4]" size={24} />
                </div>
                <div>
                  <p className="text-[#757575] text-sm">Dirección de Instalación</p>
                  <p className="text-lg font-bold text-[#212121]">{contrato.direccion}</p>
                  <p className="text-sm text-[#757575]">Zona: {contrato.zona}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-6">
              Información de Facturación
            </h3>
            <div className="space-y-6">
              <div className="p-6 bg-[#E3F2FD] rounded-xl">
                <p className="text-[#757575] text-sm mb-2">Valor Mensual</p>
                <p className="text-4xl font-bold text-[#00BCD4]">
                  ${contrato.plan_detalle?.precio?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-[#757575] mt-1">+ IVA incluido</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl">
                  <span className="text-[#212121]">Instalación</span>
                  <span className="text-[#4CAF50] font-bold">Incluida</span>
                </div>
                <div className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl">
                  <span className="text-[#212121]">Router WiFi</span>
                  <span className="text-[#4CAF50] font-bold">Incluido</span>
                </div>
                <div className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl">
                  <span className="text-[#212121]">Soporte 24/7</span>
                  <span className="text-[#4CAF50] font-bold">Incluido</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
        >
          <h3 className="text-xl font-bold text-[#212121] mb-4">
            Acciones
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 bg-[#00BCD4] text-white rounded-xl hover:bg-[#00ACC1] transition font-semibold">
              Cambiar de Plan
            </button>
            <button className="p-4 border-2 border-[#00BCD4] text-[#00BCD4] rounded-xl hover:bg-[#E3F2FD] transition font-semibold">
              Descargar Contrato
            </button>
            <button className="p-4 border-2 border-gray-300 text-[#757575] rounded-xl hover:border-[#F44336] hover:text-[#F44336] transition font-semibold">
              Cancelar Servicio
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
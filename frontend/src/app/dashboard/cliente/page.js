'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Wifi, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export default function DashboardCliente() {
  const [stats, setStats] = useState({
    velocidad: '50 Mbps',
    consumo: '125 GB',
    proximoPago: '5 días',
    ticketsAbiertos: 0
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                <Wifi className="text-[#00BCD4]" size={24} />
              </div>
              <div>
                <p className="text-[#757575] text-sm">Velocidad Plan</p>
                <p className="text-2xl font-bold text-[#212121]">{stats.velocidad}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                <TrendingUp className="text-[#4CAF50]" size={24} />
              </div>
              <div>
                <p className="text-[#757575] text-sm">Consumo Mensual</p>
                <p className="text-2xl font-bold text-[#212121]">{stats.consumo}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFF3E0] rounded-xl flex items-center justify-center">
                <Calendar className="text-[#FF9800]" size={24} />
              </div>
              <div>
                <p className="text-[#757575] text-sm">Próximo Pago</p>
                <p className="text-2xl font-bold text-[#212121]">{stats.proximoPago}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFEBEE] rounded-xl flex items-center justify-center">
                <AlertCircle className="text-[#F44336]" size={24} />
              </div>
              <div>
                <p className="text-[#757575] text-sm">Tickets Abiertos</p>
                <p className="text-2xl font-bold text-[#212121]">{stats.ticketsAbiertos}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Estado del Servicio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-4">
              Estado del Servicio
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#E8F5E9] rounded-xl">
                <span className="text-[#212121] font-semibold">Conexión</span>
                <span className="text-[#4CAF50] font-bold">● Activa</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#E3F2FD] rounded-xl">
                <span className="text-[#212121] font-semibold">Latencia</span>
                <span className="text-[#00BCD4] font-bold">15 ms</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#E3F2FD] rounded-xl">
                <span className="text-[#212121] font-semibold">Uptime</span>
                <span className="text-[#00BCD4] font-bold">99.9%</span>
              </div>
            </div>
          </motion.div>

          {/* Facturas Recientes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-4">
              Facturas Recientes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl">
                <div>
                  <p className="font-semibold text-[#212121]">Noviembre 2025</p>
                  <p className="text-sm text-[#757575]">Vence: 30/11/2025</p>
                </div>
                <span className="text-[#4CAF50] font-bold bg-[#E8F5E9] px-3 py-1 rounded-full text-sm">
                  Pagada
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl">
                <div>
                  <p className="font-semibold text-[#212121]">Diciembre 2025</p>
                  <p className="text-sm text-[#757575]">Vence: 30/12/2025</p>
                </div>
                <span className="text-[#FF9800] font-bold bg-[#FFF3E0] px-3 py-1 rounded-full text-sm">
                  Pendiente
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Acceso Rápido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
        >
          <h3 className="text-xl font-bold text-[#212121] mb-4">
            Acceso Rápido
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <button className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-[#212121] font-semibold">
              Ver Facturas
            </button>
            <button className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-[#212121] font-semibold">
              Realizar Pago
            </button>
            <button className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-[#212121] font-semibold">
              Nuevo Ticket
            </button>
            <button className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-[#212121] font-semibold">
              Chat IA
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
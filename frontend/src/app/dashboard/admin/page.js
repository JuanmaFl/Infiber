'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Users, FileText, CreditCard, Ticket, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClientes: 45,
    clientesActivos: 42,
    contratosActivos: 42,
    facturasVencidas: 3,
    ticketsAbiertos: 8,
    ingresosMensual: 2940000
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                <Users className="text-[#00BCD4]" size={32} />
              </div>
              <div>
                <p className="text-[#757575] text-sm">Total Clientes</p>
                <p className="text-3xl font-bold text-[#212121]">{stats.totalClientes}</p>
                <p className="text-xs text-[#4CAF50]">{stats.clientesActivos} activos</p>
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
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                <FileText className="text-[#4CAF50]" size={32} />
              </div>
              <div>
                <p className="text-[#757575] text-sm">Contratos Activos</p>
                <p className="text-3xl font-bold text-[#212121]">{stats.contratosActivos}</p>
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
              <div className="w-16 h-16 bg-[#FFF3E0] rounded-xl flex items-center justify-center">
                <CreditCard className="text-[#FF9800]" size={32} />
              </div>
              <div>
                <p className="text-[#757575] text-sm">Facturas Vencidas</p>
                <p className="text-3xl font-bold text-[#212121]">{stats.facturasVencidas}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Second Row */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFEBEE] rounded-xl flex items-center justify-center">
                <Ticket className="text-[#F44336]" size={32} />
              </div>
              <div>
                <p className="text-[#757575] text-sm">Tickets Abiertos</p>
                <p className="text-3xl font-bold text-[#212121]">{stats.ticketsAbiertos}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-[#00BCD4] to-[#00ACC1] p-6 rounded-2xl shadow-lg col-span-2"
          >
            <div className="flex items-center gap-4 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign size={32} />
              </div>
              <div>
                <p className="text-white/80 text-sm">Ingresos Mensuales</p>
                <p className="text-4xl font-bold">${stats.ingresosMensual.toLocaleString()}</p>
                <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                  <TrendingUp size={16} />
                  +12% vs mes anterior
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tables */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Últimos Clientes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-4">
              Últimos Clientes Registrados
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00BCD4] rounded-full flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <p className="font-semibold text-[#212121]">Juan Díaz</p>
                      <p className="text-xs text-[#757575]">Plan Básico 20 Megas</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#757575]">Hoy</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tickets Urgentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-4">
              Tickets Urgentes
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-3 border-2 border-gray-100 rounded-xl hover:border-[#F44336] transition cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-[#212121]">Sin conexión desde ayer</p>
                    <span className="text-xs bg-[#FFEBEE] text-[#F44336] px-2 py-1 rounded-full font-semibold">
                      Urgente
                    </span>
                  </div>
                  <p className="text-xs text-[#757575]">Cliente: María García</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
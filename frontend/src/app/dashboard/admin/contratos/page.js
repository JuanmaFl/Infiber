'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Search, Plus, FileText } from 'lucide-react';

export default function GestionContratos() {
  const [contratos] = useState([
    {
      id: 'CNT-001',
      cliente: 'Juan Pérez',
      plan: 'Plan Básico 20 Megas',
      estado: 'activo',
      fecha_inicio: '2025-01-01',
      precio: 45000,
      zona: 'Palmitas'
    },
    {
      id: 'CNT-002',
      cliente: 'María Gómez',
      plan: 'Plan Estándar 50 Megas',
      estado: 'activo',
      fecha_inicio: '2025-01-15',
      precio: 70000,
      zona: 'San Cristóbal'
    },
    {
      id: 'CNT-003',
      cliente: 'Carlos López',
      plan: 'Plan Premium 100 Megas',
      estado: 'suspendido',
      fecha_inicio: '2024-12-01',
      precio: 95000,
      zona: 'Robledo'
    }
  ]);

  const [busqueda, setBusqueda] = useState('');

  const contratosFiltrados = contratos.filter(contrato =>
    contrato.id.toLowerCase().includes(busqueda.toLowerCase()) ||
    contrato.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'activo': return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'suspendido': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'cancelado': return 'bg-[#FFEBEE] text-[#F44336]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#212121]">Gestión de Contratos</h1>
            <p className="text-[#757575] mt-1">{contratos.length} contratos totales</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00BCD4] text-white px-6 py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Contrato
          </motion.button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por ID o nombre de cliente..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
            />
          </div>
        </div>

        {/* Contratos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contratosFiltrados.map((contrato, index) => (
            <motion.div
              key={contrato.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-[#00BCD4] transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                  <FileText className="text-[#00BCD4]" size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(contrato.estado)}`}>
                  {contrato.estado.charAt(0).toUpperCase() + contrato.estado.slice(1)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#212121] mb-1">{contrato.id}</h3>
              <p className="text-[#757575] mb-4">{contrato.cliente}</p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#757575]">Plan:</span>
                  <span className="text-[#212121] font-semibold">{contrato.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#757575]">Zona:</span>
                  <span className="text-[#212121] font-semibold">{contrato.zona}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#757575]">Valor:</span>
                  <span className="text-[#00BCD4] font-bold">${contrato.precio.toLocaleString()}</span>
                </div>
              </div>

              <button className="w-full bg-[#E3F2FD] text-[#00BCD4] py-2 rounded-xl hover:bg-[#00BCD4] hover:text-white transition font-semibold">
                Ver Detalles
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Search, Filter, Download } from 'lucide-react';

export default function GestionFacturas() {
  const [facturas] = useState([
    {
      id: 'FAC-2025-001',
      cliente: 'Juan Pérez',
      periodo: 'Enero 2025',
      monto: 45000,
      fecha_emision: '2025-01-01',
      fecha_vencimiento: '2025-01-15',
      estado: 'pagada'
    },
    {
      id: 'FAC-2025-002',
      cliente: 'María Gómez',
      periodo: 'Enero 2025',
      monto: 70000,
      fecha_emision: '2025-01-01',
      fecha_vencimiento: '2025-01-15',
      estado: 'pendiente'
    },
    {
      id: 'FAC-2025-003',
      cliente: 'Carlos López',
      periodo: 'Enero 2025',
      monto: 95000,
      fecha_emision: '2025-01-01',
      fecha_vencimiento: '2025-01-15',
      estado: 'vencida'
    },
    {
      id: 'FAC-2025-004',
      cliente: 'Ana Martínez',
      periodo: 'Enero 2025',
      monto: 70000,
      fecha_emision: '2025-01-01',
      fecha_vencimiento: '2025-01-15',
      estado: 'pagada'
    }
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');

  const facturasFiltradas = facturas.filter(factura => {
    const matchBusqueda = factura.id.toLowerCase().includes(busqueda.toLowerCase()) ||
                          factura.cliente.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'todas' || factura.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'pagada': return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'pendiente': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'vencida': return 'bg-[#FFEBEE] text-[#F44336]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalPendiente = facturas
    .filter(f => f.estado === 'pendiente' || f.estado === 'vencida')
    .reduce((sum, f) => sum + f.monto, 0);

  const totalRecaudado = facturas
    .filter(f => f.estado === 'pagada')
    .reduce((sum, f) => sum + f.monto, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">Gestión de Facturas</h1>
          <p className="text-[#757575] mt-1">{facturas.length} facturas registradas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#4CAF50] to-[#45A049] p-6 rounded-2xl shadow-lg text-white"
          >
            <p className="text-white/80 text-sm mb-1">Total Recaudado</p>
            <p className="text-3xl font-bold">${totalRecaudado.toLocaleString()}</p>
            <p className="text-sm text-white/80 mt-2">
              {facturas.filter(f => f.estado === 'pagada').length} facturas pagadas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-[#FF9800] to-[#FB8C00] p-6 rounded-2xl shadow-lg text-white"
          >
            <p className="text-white/80 text-sm mb-1">Total Pendiente</p>
            <p className="text-3xl font-bold">${totalPendiente.toLocaleString()}</p>
            <p className="text-sm text-white/80 mt-2">
              {facturas.filter(f => f.estado !== 'pagada').length} facturas por cobrar
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-[#F44336] to-[#E53935] p-6 rounded-2xl shadow-lg text-white"
          >
            <p className="text-white/80 text-sm mb-1">Facturas Vencidas</p>
            <p className="text-3xl font-bold">
              {facturas.filter(f => f.estado === 'vencida').length}
            </p>
            <p className="text-sm text-white/80 mt-2">Requieren atención</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por ID o cliente..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              >
                <option value="todas">Todas las facturas</option>
                <option value="pagada">Pagadas</option>
                <option value="pendiente">Pendientes</option>
                <option value="vencida">Vencidas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Facturas Table */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Factura</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Período</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Monto</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Vencimiento</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-[#212121]">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {facturasFiltradas.map((factura, index) => (
                  <motion.tr
                    key={factura.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#212121]">{factura.id}</p>
                    </td>
                    <td className="px-6 py-4 text-[#212121]">{factura.cliente}</td>
                    <td className="px-6 py-4 text-[#212121]">{factura.periodo}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#00BCD4]">${factura.monto.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-[#212121]">
                      {new Date(factura.fecha_vencimiento).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(factura.estado)}`}>
                        {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button className="p-2 bg-[#E3F2FD] text-[#00BCD4] rounded-lg hover:bg-[#00BCD4] hover:text-white transition">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
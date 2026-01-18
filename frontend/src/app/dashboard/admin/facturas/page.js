'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Search, Eye, Loader2, DollarSign, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

export default function GestionFacturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('https://infiber.duckdns.org/infiber/api/facturas/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setFacturas(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const facturasFiltradas = facturas.filter(factura => {
    const searchTerm = busqueda.toLowerCase();
    const cumpleBusqueda = (
      factura.numero_factura?.toLowerCase().includes(searchTerm) ||
      factura.contrato_detalle?.cliente_nombre?.toLowerCase().includes(searchTerm) ||
      factura.periodo?.toLowerCase().includes(searchTerm)
    );
    
    const cumpleEstado = filtroEstado === 'todas' || factura.estado === filtroEstado;
    
    return cumpleBusqueda && cumpleEstado;
  });

  const verDetalles = (factura) => {
    setFacturaSeleccionada(factura);
    setMostrarModal(true);
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'pendiente': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'pagada': return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'vencida': return 'bg-[#FFEBEE] text-[#F44336]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const calcularEstadisticas = () => {
    const pendientes = facturas.filter(f => f.estado === 'pendiente');
    const pagadas = facturas.filter(f => f.estado === 'pagada');
    const vencidas = facturas.filter(f => f.estado === 'vencida');
    
    const totalPendiente = pendientes.reduce((sum, f) => sum + parseFloat(f.monto), 0);
    const totalRecaudado = pagadas.reduce((sum, f) => sum + parseFloat(f.monto), 0);
    
    return {
      totalPendientes: pendientes.length,
      totalPagadas: pagadas.length,
      totalVencidas: vencidas.length,
      montoPendiente: totalPendiente,
      montoRecaudado: totalRecaudado
    };
  };

  const stats = calcularEstadisticas();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#00BCD4]" size={48} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#212121]">Gestión de Facturas</h1>
            <p className="text-[#757575] mt-1">
              {facturasFiltradas.length} factura{facturasFiltradas.length !== 1 ? 's' : ''} registrada{facturasFiltradas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#757575] text-sm">Pendientes</p>
              <AlertCircle className="text-[#FF9800]" size={20} />
            </div>
            <p className="text-3xl font-bold text-[#FF9800]">{stats.totalPendientes}</p>
            <p className="text-sm text-[#757575] mt-2">
              ${stats.montoPendiente.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#757575] text-sm">Pagadas</p>
              <CheckCircle className="text-[#4CAF50]" size={20} />
            </div>
            <p className="text-3xl font-bold text-[#4CAF50]">{stats.totalPagadas}</p>
            <p className="text-sm text-[#757575] mt-2">
              ${stats.montoRecaudado.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#757575] text-sm">Vencidas</p>
              <AlertCircle className="text-[#F44336]" size={20} />
            </div>
            <p className="text-3xl font-bold text-[#F44336]">{stats.totalVencidas}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#757575] text-sm">Total Facturas</p>
              <DollarSign className="text-[#00BCD4]" size={20} />
            </div>
            <p className="text-3xl font-bold text-[#00BCD4]">{facturas.length}</p>
          </motion.div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
              <input
                type="text"
                placeholder="Buscar por número, cliente, periodo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              />
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
            >
              <option value="todas">Todas las facturas</option>
              <option value="pendiente">Pendientes</option>
              <option value="pagada">Pagadas</option>
              <option value="vencida">Vencidas</option>
            </select>
          </div>
        </div>

        {/* Tabla de Facturas */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E3F2FD]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">N° Factura</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Periodo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Monto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Vencimiento</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {facturasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#757575]">
                      No se encontraron facturas
                    </td>
                  </tr>
                ) : (
                  facturasFiltradas.map((factura, index) => (
                    <motion.tr
                      key={factura.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#00BCD4]">
                          {factura.numero_factura}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#212121]">
                          {factura.contrato_detalle?.cliente_nombre || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-[#212121]">
                        {factura.periodo}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#00BCD4]">
                          ${parseFloat(factura.monto).toLocaleString()}
                        </p>
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
                        <button
                          onClick={() => verDetalles(factura)}
                          className="p-2 bg-[#E3F2FD] text-[#00BCD4] rounded-lg hover:bg-[#00BCD4] hover:text-white transition"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Detalles */}
        {mostrarModal && facturaSeleccionada && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#212121]">Detalles de la Factura</h2>
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Número y Estado */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#757575] text-sm">Número de Factura</p>
                    <p className="text-2xl font-bold text-[#00BCD4]">
                      {facturaSeleccionada.numero_factura}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getEstadoColor(facturaSeleccionada.estado)}`}>
                    {facturaSeleccionada.estado.charAt(0).toUpperCase() + facturaSeleccionada.estado.slice(1)}
                  </span>
                </div>

                {/* Información General */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <p className="font-semibold text-[#212121] mb-1">Periodo</p>
                    <p className="text-[#757575]">{facturaSeleccionada.periodo}</p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <p className="font-semibold text-[#212121] mb-1">Monto</p>
                    <p className="text-2xl font-bold text-[#00BCD4]">
                      ${parseFloat(facturaSeleccionada.monto).toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="text-[#00BCD4]" size={16} />
                      <p className="font-semibold text-[#212121]">Fecha Emisión</p>
                    </div>
                    <p className="text-[#757575]">
                      {new Date(facturaSeleccionada.fecha_emision).toLocaleDateString('es-CO')}
                    </p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="text-[#00BCD4]" size={16} />
                      <p className="font-semibold text-[#212121]">Fecha Vencimiento</p>
                    </div>
                    <p className="text-[#757575]">
                      {new Date(facturaSeleccionada.fecha_vencimiento).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                </div>

                {/* Información del Cliente */}
                <div className="p-4 bg-[#E3F2FD] rounded-xl">
                  <p className="font-semibold text-[#212121] text-lg mb-3">Cliente</p>
                  <p className="text-[#757575]">
                    {facturaSeleccionada.contrato_detalle?.cliente_nombre || 'No disponible'}
                  </p>
                </div>

                {/* Fecha de Pago (si está pagada) */}
                {facturaSeleccionada.fecha_pago && (
                  <div className="p-4 bg-[#E8F5E9] rounded-xl">
                    <p className="font-semibold text-[#4CAF50] mb-1">Fecha de Pago</p>
                    <p className="text-[#212121]">
                      {new Date(facturaSeleccionada.fecha_pago).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Botón Cerrar */}
                <button
                  onClick={() => setMostrarModal(false)}
                  className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
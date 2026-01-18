'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Search, Eye, Loader2, FileText, Calendar, DollarSign, Wifi } from 'lucide-react';

export default function GestionContratos() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarContratos();
  }, []);

  const cargarContratos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('https://infiber.duckdns.org/infiber/api/contratos/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setContratos(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const contratosFiltrados = contratos.filter(contrato => {
    const searchTerm = busqueda.toLowerCase();
    return (
      contrato.numero_contrato?.toLowerCase().includes(searchTerm) ||
      contrato.cliente_detalle?.first_name?.toLowerCase().includes(searchTerm) ||
      contrato.cliente_detalle?.last_name?.toLowerCase().includes(searchTerm) ||
      contrato.plan_detalle?.nombre?.toLowerCase().includes(searchTerm)
    );
  });

  const verDetalles = (contrato) => {
    setContratoSeleccionado(contrato);
    setMostrarModal(true);
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'activo': return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'suspendido': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'cancelado': return 'bg-[#FFEBEE] text-[#F44336]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

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
            <h1 className="text-3xl font-bold text-[#212121]">Gestión de Contratos</h1>
            <p className="text-[#757575] mt-1">
              {contratosFiltrados.length} contrato{contratosFiltrados.length !== 1 ? 's' : ''} registrado{contratosFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
            <input
              type="text"
              placeholder="Buscar por número, cliente, plan..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
            />
          </div>
        </div>

        {/* Stats Rápidas */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
            <p className="text-[#757575] text-sm mb-1">Contratos Activos</p>
            <p className="text-3xl font-bold text-[#4CAF50]">
              {contratos.filter(c => c.estado === 'activo').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
            <p className="text-[#757575] text-sm mb-1">Suspendidos</p>
            <p className="text-3xl font-bold text-[#FF9800]">
              {contratos.filter(c => c.estado === 'suspendido').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
            <p className="text-[#757575] text-sm mb-1">Cancelados</p>
            <p className="text-3xl font-bold text-[#F44336]">
              {contratos.filter(c => c.estado === 'cancelado').length}
            </p>
          </div>
        </div>

        {/* Tabla de Contratos */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E3F2FD]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">N° Contrato</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Fecha Inicio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contratosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[#757575]">
                      No se encontraron contratos
                    </td>
                  </tr>
                ) : (
                  contratosFiltrados.map((contrato, index) => (
                    <motion.tr
                      key={contrato.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#00BCD4]">
                          {contrato.numero_contrato}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#212121]">
                          {contrato.cliente_detalle?.first_name} {contrato.cliente_detalle?.last_name}
                        </p>
                        <p className="text-sm text-[#757575]">
                          @{contrato.cliente_detalle?.username}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#212121]">
                          {contrato.plan_detalle?.nombre}
                        </p>
                        <p className="text-sm text-[#757575]">
                          {contrato.plan_detalle?.velocidad_bajada} Mbps
                        </p>
                      </td>
                      <td className="px-6 py-4 text-[#212121]">
                        {new Date(contrato.fecha_inicio).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(contrato.estado)}`}>
                          {contrato.estado.charAt(0).toUpperCase() + contrato.estado.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => verDetalles(contrato)}
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
        {mostrarModal && contratoSeleccionado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#212121]">Detalles del Contrato</h2>
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Número de Contrato y Estado */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#757575] text-sm">Número de Contrato</p>
                    <p className="text-2xl font-bold text-[#00BCD4]">
                      {contratoSeleccionado.numero_contrato}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getEstadoColor(contratoSeleccionado.estado)}`}>
                    {contratoSeleccionado.estado.charAt(0).toUpperCase() + contratoSeleccionado.estado.slice(1)}
                  </span>
                </div>

                {/* Información del Cliente */}
                <div className="p-4 bg-[#E3F2FD] rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="text-[#00BCD4]" size={24} />
                    <p className="font-semibold text-[#212121] text-lg">Cliente</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#212121]">
                      <span className="font-semibold">Nombre:</span> {contratoSeleccionado.cliente_detalle?.first_name} {contratoSeleccionado.cliente_detalle?.last_name}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Email:</span> {contratoSeleccionado.cliente_detalle?.email || 'No registrado'}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Teléfono:</span> {contratoSeleccionado.cliente_detalle?.telefono || 'No registrado'}
                    </p>
                  </div>
                </div>

                {/* Información del Plan */}
                <div className="p-4 bg-[#E3F2FD] rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Wifi className="text-[#00BCD4]" size={24} />
                    <p className="font-semibold text-[#212121] text-lg">Plan Contratado</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#212121]">
                      <span className="font-semibold">Nombre:</span> {contratoSeleccionado.plan_detalle?.nombre}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Velocidad Bajada:</span> {contratoSeleccionado.plan_detalle?.velocidad_bajada} Mbps
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Velocidad Subida:</span> {contratoSeleccionado.plan_detalle?.velocidad_subida} Mbps
                    </p>
                    <p className="text-[#00BCD4] text-xl font-bold mt-2">
                      ${parseFloat(contratoSeleccionado.plan_detalle?.precio).toLocaleString()} / mes
                    </p>
                  </div>
                </div>

                {/* Detalles de Instalación */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="text-[#00BCD4]" size={20} />
                      <p className="font-semibold text-[#212121]">Fecha de Inicio</p>
                    </div>
                    <p className="text-[#757575]">
                      {new Date(contratoSeleccionado.fecha_inicio).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="text-[#00BCD4]" size={20} />
                      <p className="font-semibold text-[#212121]">Dirección</p>
                    </div>
                    <p className="text-[#757575]">
                      {contratoSeleccionado.direccion_instalacion || 'No registrada'}
                    </p>
                  </div>
                </div>

                {/* Zona y Observaciones */}
                {contratoSeleccionado.zona && (
                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <p className="font-semibold text-[#212121] mb-1">Zona de Cobertura</p>
                    <p className="text-[#757575]">{contratoSeleccionado.zona}</p>
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
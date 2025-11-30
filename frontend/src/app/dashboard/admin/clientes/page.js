'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Search, Eye, Edit, Loader2, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { fetchUsuarios } from '@/lib/api';

export default function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const usuarios = await fetchUsuarios(token);
      
      // Filtrar solo clientes
      const soloClientes = usuarios.filter(u => u.rol === 'cliente');
      setClientes(soloClientes);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const searchTerm = busqueda.toLowerCase();
    return (
      cliente.first_name?.toLowerCase().includes(searchTerm) ||
      cliente.last_name?.toLowerCase().includes(searchTerm) ||
      cliente.username?.toLowerCase().includes(searchTerm) ||
      cliente.email?.toLowerCase().includes(searchTerm) ||
      cliente.cedula?.toLowerCase().includes(searchTerm)
    );
  });

  const verDetalles = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModal(true);
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
            <h1 className="text-3xl font-bold text-[#212121]">Gestión de Clientes</h1>
            <p className="text-[#757575] mt-1">
              {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''} registrado{clientesFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, email, cédula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
            />
          </div>
        </div>

        {/* Tabla de Clientes */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E3F2FD]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Teléfono</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Cédula</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#757575]">
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente, index) => (
                    <motion.tr
                      key={cliente.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#00BCD4] rounded-full flex items-center justify-center text-white font-semibold">
                            {cliente.first_name?.[0] || cliente.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#212121]">
                              {cliente.first_name} {cliente.last_name}
                            </p>
                            <p className="text-sm text-[#757575]">@{cliente.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#212121]">{cliente.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-[#212121]">{cliente.telefono || 'N/A'}</td>
                      <td className="px-6 py-4 text-[#212121]">{cliente.cedula || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => verDetalles(cliente)}
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
        {mostrarModal && clienteSeleccionado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#212121]">Detalles del Cliente</h2>
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar y Nombre */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#00BCD4] rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                    {clienteSeleccionado.first_name?.[0] || clienteSeleccionado.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#212121]">
                      {clienteSeleccionado.first_name} {clienteSeleccionado.last_name}
                    </h3>
                    <p className="text-[#757575]">@{clienteSeleccionado.username}</p>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="text-[#00BCD4]" size={20} />
                      <p className="font-semibold text-[#212121]">Email</p>
                    </div>
                    <p className="text-[#757575]">{clienteSeleccionado.email || 'No registrado'}</p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="text-[#00BCD4]" size={20} />
                      <p className="font-semibold text-[#212121]">Teléfono</p>
                    </div>
                    <p className="text-[#757575]">{clienteSeleccionado.telefono || 'No registrado'}</p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="text-[#00BCD4]" size={20} />
                      <p className="font-semibold text-[#212121]">Cédula</p>
                    </div>
                    <p className="text-[#757575]">{clienteSeleccionado.cedula || 'No registrada'}</p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="text-[#00BCD4]" size={20} />
                      <p className="font-semibold text-[#212121]">Dirección</p>
                    </div>
                    <p className="text-[#757575]">{clienteSeleccionado.direccion || 'No registrada'}</p>
                  </div>
                </div>

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
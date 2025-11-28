'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí cargarías desde la API
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://86.48.21.76/infiber/api/usuarios/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error:', error);
        // Datos de ejemplo si falla
        setClientes([
          {
            id: 1,
            username: 'juanperez',
            email: 'juan.perez@email.com',
            first_name: 'Juan',
            last_name: 'Pérez',
            rol: 'cliente',
            telefono: '300 123 4567',
            cedula: '1234567890'
          },
          {
            id: 2,
            username: 'mariagomez',
            email: 'maria.gomez@email.com',
            first_name: 'María',
            last_name: 'Gómez',
            rol: 'cliente',
            telefono: '301 234 5678',
            cedula: '9876543210'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.first_name.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.last_name.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.cedula.includes(busqueda)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#212121]">Gestión de Clientes</h1>
            <p className="text-[#757575] mt-1">{clientes.length} clientes registrados</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00BCD4] text-white px-6 py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Cliente
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, email o cédula..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
            />
          </div>
        </div>

        {/* Clientes Table */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border-2 border-gray-100 text-center">
            <p className="text-[#757575]">Cargando clientes...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Teléfono</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Cédula</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#212121]">Rol</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#212121]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clientesFiltrados.map((cliente, index) => (
                    <motion.tr
                      key={cliente.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#00BCD4] rounded-full flex items-center justify-center text-white font-bold">
                            {cliente.first_name.charAt(0)}{cliente.last_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#212121]">
                              {cliente.first_name} {cliente.last_name}
                            </p>
                            <p className="text-xs text-[#757575]">@{cliente.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#212121]">{cliente.email}</td>
                      <td className="px-6 py-4 text-[#212121]">{cliente.telefono}</td>
                      <td className="px-6 py-4 text-[#212121]">{cliente.cedula}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#E3F2FD] text-[#00BCD4] rounded-full text-sm font-semibold">
                          {cliente.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 bg-[#E3F2FD] text-[#00BCD4] rounded-lg hover:bg-[#00BCD4] hover:text-white transition">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 bg-[#FFF3E0] text-[#FF9800] rounded-lg hover:bg-[#FF9800] hover:text-white transition">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 bg-[#FFEBEE] text-[#F44336] rounded-lg hover:bg-[#F44336] hover:text-white transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {clientesFiltrados.length === 0 && (
              <div className="p-12 text-center text-[#757575]">
                No se encontraron clientes con ese criterio de búsqueda
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
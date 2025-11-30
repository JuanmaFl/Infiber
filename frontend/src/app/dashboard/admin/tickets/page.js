'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Search, Eye, Loader2, MessageSquare, User, Clock } from 'lucide-react';

export default function GestionTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarTickets();
  }, []);

  const cargarTickets = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('https://86.48.21.76/infiber/api/tickets/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const ticketsFiltrados = tickets.filter(ticket => {
    const searchTerm = busqueda.toLowerCase();
    const cumpleBusqueda = (
      ticket.asunto?.toLowerCase().includes(searchTerm) ||
      ticket.descripcion?.toLowerCase().includes(searchTerm) ||
      ticket.id?.toString().includes(searchTerm)
    );
    
    const cumpleEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
    const cumplePrioridad = filtroPrioridad === 'todas' || ticket.prioridad === filtroPrioridad;
    
    return cumpleBusqueda && cumpleEstado && cumplePrioridad;
  });

  const verDetalles = (ticket) => {
    setTicketSeleccionado(ticket);
    setMostrarModal(true);
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'abierto': return 'bg-[#E3F2FD] text-[#00BCD4]';
      case 'en_proceso': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'resuelto': return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'cerrado': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch(prioridad) {
      case 'alta': return 'bg-[#FFEBEE] text-[#F44336]';
      case 'media': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'baja': return 'bg-[#E3F2FD] text-[#00BCD4]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const calcularEstadisticas = () => {
    const abiertos = tickets.filter(t => t.estado === 'abierto');
    const enProceso = tickets.filter(t => t.estado === 'en_proceso');
    const resueltos = tickets.filter(t => t.estado === 'resuelto');
    const cerrados = tickets.filter(t => t.estado === 'cerrado');
    
    return {
      totalAbiertos: abiertos.length,
      totalEnProceso: enProceso.length,
      totalResueltos: resueltos.length,
      totalCerrados: cerrados.length
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
            <h1 className="text-3xl font-bold text-[#212121]">Gestión de Tickets</h1>
            <p className="text-[#757575] mt-1">
              {ticketsFiltrados.length} ticket{ticketsFiltrados.length !== 1 ? 's' : ''} registrado{ticketsFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <p className="text-[#757575] text-sm mb-1">Abiertos</p>
            <p className="text-3xl font-bold text-[#00BCD4]">{stats.totalAbiertos}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <p className="text-[#757575] text-sm mb-1">En Proceso</p>
            <p className="text-3xl font-bold text-[#FF9800]">{stats.totalEnProceso}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <p className="text-[#757575] text-sm mb-1">Resueltos</p>
            <p className="text-3xl font-bold text-[#4CAF50]">{stats.totalResueltos}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <p className="text-[#757575] text-sm mb-1">Cerrados</p>
            <p className="text-3xl font-bold text-gray-600">{stats.totalCerrados}</p>
          </motion.div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
              <input
                type="text"
                placeholder="Buscar por ID, asunto, descripción..."
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
              <option value="todos">Todos los estados</option>
              <option value="abierto">Abiertos</option>
              <option value="en_proceso">En Proceso</option>
              <option value="resuelto">Resueltos</option>
              <option value="cerrado">Cerrados</option>
            </select>
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
            >
              <option value="todas">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        {/* Lista de Tickets */}
        <div className="space-y-4">
          {ticketsFiltrados.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border-2 border-gray-100 text-center">
              <p className="text-[#757575]">No se encontraron tickets</p>
            </div>
          ) : (
            ticketsFiltrados.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-[#00BCD4] transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#212121]">
                        #{ticket.id} - {ticket.asunto}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPrioridadColor(ticket.prioridad)}`}>
                        {ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(ticket.estado)}`}>
                        {ticket.estado.replace('_', ' ').charAt(0).toUpperCase() + ticket.estado.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-[#757575] mb-3">{ticket.descripcion}</p>
                    
                    <div className="flex gap-4 text-sm text-[#757575]">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Creado: {new Date(ticket.creado).toLocaleDateString('es-CO')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span>Cliente ID: {ticket.cliente}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => verDetalles(ticket)}
                    className="ml-4 p-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Modal de Detalles */}
        {mostrarModal && ticketSeleccionado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#212121]">Detalles del Ticket</h2>
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* ID y Estado */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#757575] text-sm">Ticket ID</p>
                    <p className="text-3xl font-bold text-[#00BCD4]">#{ticketSeleccionado.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPrioridadColor(ticketSeleccionado.prioridad)}`}>
                      {ticketSeleccionado.prioridad.charAt(0).toUpperCase() + ticketSeleccionado.prioridad.slice(1)}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getEstadoColor(ticketSeleccionado.estado)}`}>
                      {ticketSeleccionado.estado.replace('_', ' ').charAt(0).toUpperCase() + ticketSeleccionado.estado.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>

                {/* Asunto */}
                <div className="p-4 bg-[#E3F2FD] rounded-xl">
                  <p className="font-semibold text-[#212121] text-lg mb-2">Asunto</p>
                  <p className="text-[#757575]">{ticketSeleccionado.asunto}</p>
                </div>

                {/* Descripción */}
                <div className="p-4 bg-[#E3F2FD] rounded-xl">
                  <p className="font-semibold text-[#212121] text-lg mb-2">Descripción</p>
                  <p className="text-[#757575] whitespace-pre-wrap">{ticketSeleccionado.descripcion}</p>
                </div>

                {/* Información del Ticket */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="text-[#00BCD4]" size={16} />
                      <p className="font-semibold text-[#212121]">Cliente ID</p>
                    </div>
                    <p className="text-[#757575]">{ticketSeleccionado.cliente}</p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="text-[#00BCD4]" size={16} />
                      <p className="font-semibold text-[#212121]">Asignado a</p>
                    </div>
                    <p className="text-[#757575]">
                      {ticketSeleccionado.asignado_a || 'Sin asignar'}
                    </p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="text-[#00BCD4]" size={16} />
                      <p className="font-semibold text-[#212121]">Fecha Creación</p>
                    </div>
                    <p className="text-[#757575]">
                      {new Date(ticketSeleccionado.creado).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="text-[#00BCD4]" size={16} />
                      <p className="font-semibold text-[#212121]">Última Actualización</p>
                    </div>
                    <p className="text-[#757575]">
                      {new Date(ticketSeleccionado.actualizado).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
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
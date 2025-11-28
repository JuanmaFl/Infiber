'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Search, Filter, MessageSquare } from 'lucide-react';

export default function GestionTickets() {
  const [tickets] = useState([
    {
      id: 1,
      asunto: 'Intermitencia en la conexión',
      cliente: 'Juan Pérez',
      descripcion: 'La conexión se corta cada 30 minutos',
      prioridad: 'alta',
      estado: 'en_proceso',
      creado: '2025-03-10',
      actualizado: '2025-03-11'
    },
    {
      id: 2,
      asunto: 'Consulta sobre cambio de plan',
      cliente: 'María Gómez',
      descripcion: 'Me gustaría información sobre el plan Premium',
      prioridad: 'baja',
      estado: 'abierto',
      creado: '2025-03-11',
      actualizado: '2025-03-11'
    },
    {
      id: 3,
      asunto: 'Sin servicio desde ayer',
      cliente: 'Carlos López',
      descripcion: 'No tengo conexión desde ayer en la tarde',
      prioridad: 'alta',
      estado: 'abierto',
      creado: '2025-03-11',
      actualizado: '2025-03-11'
    },
    {
      id: 4,
      asunto: 'Problema con facturación',
      cliente: 'Ana Martínez',
      descripcion: 'Mi factura tiene un cargo incorrecto',
      prioridad: 'media',
      estado: 'en_proceso',
      creado: '2025-03-09',
      actualizado: '2025-03-10'
    }
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const ticketsFiltrados = tickets.filter(ticket => {
    const matchBusqueda = ticket.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
                          ticket.cliente.toLowerCase().includes(busqueda.toLowerCase());
    const matchPrioridad = filtroPrioridad === 'todas' || ticket.prioridad === filtroPrioridad;
    const matchEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
    return matchBusqueda && matchPrioridad && matchEstado;
  });

  const getPrioridadColor = (prioridad) => {
    switch(prioridad) {
      case 'alta': return 'bg-[#FFEBEE] text-[#F44336]';
      case 'media': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'baja': return 'bg-[#E3F2FD] text-[#00BCD4]';
      default: return 'bg-gray-100 text-gray-600';
    }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">Gestión de Tickets</h1>
          <p className="text-[#757575] mt-1">{tickets.length} tickets totales</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl border-2 border-gray-100"
          >
            <p className="text-[#757575] text-sm mb-1">Abiertos</p>
            <p className="text-2xl font-bold text-[#00BCD4]">
              {tickets.filter(t => t.estado === 'abierto').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white p-4 rounded-xl border-2 border-gray-100"
          >
            <p className="text-[#757575] text-sm mb-1">En Proceso</p>
            <p className="text-2xl font-bold text-[#FF9800]">
              {tickets.filter(t => t.estado === 'en_proceso').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-xl border-2 border-gray-100"
          >
            <p className="text-[#757575] text-sm mb-1">Alta Prioridad</p>
            <p className="text-2xl font-bold text-[#F44336]">
              {tickets.filter(t => t.prioridad === 'alta').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white p-4 rounded-xl border-2 border-gray-100"
          >
            <p className="text-[#757575] text-sm mb-1">Resueltos Hoy</p>
            <p className="text-2xl font-bold text-[#4CAF50]">0</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar tickets..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              >
                <option value="todas">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
              >
                <option value="todos">Todos los estados</option>
                <option value="abierto">Abierto</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {ticketsFiltrados.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-[#00BCD4] transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#212121]">
                      Ticket #{ticket.id} - {ticket.asunto}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPrioridadColor(ticket.prioridad)}`}>
                      {ticket.prioridad.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(ticket.estado)}`}>
                      {ticket.estado.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-[#212121] mb-2">{ticket.descripcion}</p>
                  
                  <div className="flex gap-4 text-sm text-[#757575]">
                    <span>Cliente: <span className="font-semibold text-[#212121]">{ticket.cliente}</span></span>
                    <span>Creado: {new Date(ticket.creado).toLocaleDateString('es-CO')}</span>
                    <span>Actualizado: {new Date(ticket.actualizado).toLocaleDateString('es-CO')}</span>
                  </div>
                </div>

                <button className="p-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition ml-4">
                  <MessageSquare size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
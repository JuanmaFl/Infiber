'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Plus, MessageSquare } from 'lucide-react';

export default function MisTickets() {
  const [tickets] = useState([
    {
      id: 1,
      asunto: 'Intermitencia en la conexión',
      descripcion: 'La conexión se corta cada 30 minutos aproximadamente',
      prioridad: 'alta',
      estado: 'en_proceso',
      creado: '2025-03-10',
      actualizado: '2025-03-11'
    },
    {
      id: 2,
      asunto: 'Consulta sobre cambio de plan',
      descripcion: 'Me gustaría información sobre el plan Premium',
      prioridad: 'baja',
      estado: 'resuelto',
      creado: '2025-02-15',
      actualizado: '2025-02-16'
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoTicket, setNuevoTicket] = useState({
    asunto: '',
    descripcion: '',
    prioridad: 'media'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Ticket creado exitosamente');
    setMostrarFormulario(false);
    setNuevoTicket({ asunto: '', descripcion: '', prioridad: 'media' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#212121]">Mis Tickets</h1>
            <p className="text-[#757575] mt-1">Gestiona tus solicitudes de soporte</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-[#00BCD4] text-white px-6 py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Ticket
          </motion.button>
        </div>

        {/* Formulario Nuevo Ticket */}
        {mostrarFormulario && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-4">
              Crear Nuevo Ticket
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#212121] font-semibold mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  value={nuevoTicket.asunto}
                  onChange={(e) => setNuevoTicket({...nuevoTicket, asunto: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#212121] font-semibold mb-2">
                  Descripción
                </label>
                <textarea
                  value={nuevoTicket.descripcion}
                  onChange={(e) => setNuevoTicket({...nuevoTicket, descripcion: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#212121] font-semibold mb-2">
                  Prioridad
                </label>
                <select
                  value={nuevoTicket.prioridad}
                  onChange={(e) => setNuevoTicket({...nuevoTicket, prioridad: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold"
                >
                  Crear Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1 border-2 border-gray-300 text-[#757575] py-3 rounded-full hover:border-[#00BCD4] hover:text-[#00BCD4] transition font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-[#00BCD4] transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#212121]">
                      #{ticket.id} - {ticket.asunto}
                    </h3>
                  </div>
                  <p className="text-[#757575] mb-3">{ticket.descripcion}</p>
                  
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPrioridadColor(ticket.prioridad)}`}>
                      {ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(ticket.estado)}`}>
                      {ticket.estado.replace('_', ' ').charAt(0).toUpperCase() + ticket.estado.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>

                <button className="p-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition">
                  <MessageSquare size={20} />
                </button>
              </div>

              <div className="flex gap-4 text-sm text-[#757575] pt-3 border-t border-gray-100">
                <span>Creado: {new Date(ticket.creado).toLocaleDateString('es-CO')}</span>
                <span>Actualizado: {new Date(ticket.actualizado).toLocaleDateString('es-CO')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
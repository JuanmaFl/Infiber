'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { 
  Search, Eye, Loader2, MessageSquare, User, Clock, X, Send,
  UserCheck, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { 
  listarComentarios, 
  agregarComentario,
  asignarTecnico,
  cambiarEstadoTicket,
  cambiarPrioridadTicket,
  fetchTecnicos
} from '@/lib/api';

export default function GestionTickets() {
  const [tickets, setTickets] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  
  // Modal de detalles
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  
  // Estados de carga
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [cambiandoPrioridad, setCambiandoPrioridad] = useState(false);
  const [asignandoTecnico, setAsignandoTecnico] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const [ticketsData, tecnicosData] = await Promise.all([
        fetch('https://86.48.21.76/infiber/api/tickets/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(r => r.json()),
        fetchTecnicos()
      ]);
      
      setTickets(ticketsData);
      setTecnicos(tecnicosData);
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

  const abrirModal = async (ticket) => {
    setTicketSeleccionado(ticket);
    setMostrarModal(true);
    
    try {
      const data = await listarComentarios(ticket.id);
      setComentarios(data);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    }
  };

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    setEnviandoComentario(true);
    try {
      const comentarioCreado = await agregarComentario(ticketSeleccionado.id, nuevoComentario);
      setComentarios([...comentarios, comentarioCreado]);
      setNuevoComentario('');
    } catch (error) {
      console.error('Error agregando comentario:', error);
      alert('Error al agregar comentario');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleAsignarTecnico = async (tecnicoId) => {
    setAsignandoTecnico(true);
    try {
      const ticketActualizado = await asignarTecnico(ticketSeleccionado.id, tecnicoId);
      setTicketSeleccionado(ticketActualizado);
      
      // Actualizar en la lista
      setTickets(tickets.map(t => t.id === ticketActualizado.id ? ticketActualizado : t));
      
      // Recargar comentarios
      const comentariosActualizados = await listarComentarios(ticketSeleccionado.id);
      setComentarios(comentariosActualizados);
      
      alert('Técnico asignado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al asignar técnico');
    } finally {
      setAsignandoTecnico(false);
    }
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    if (!confirm(`¿Cambiar el estado del ticket a "${nuevoEstado.replace('_', ' ')}"?`)) return;
    
    setCambiandoEstado(true);
    try {
      const ticketActualizado = await cambiarEstadoTicket(ticketSeleccionado.id, nuevoEstado);
      setTicketSeleccionado(ticketActualizado);
      
      // Actualizar en la lista
      setTickets(tickets.map(t => t.id === ticketActualizado.id ? ticketActualizado : t));
      
      // Recargar comentarios
      const comentariosActualizados = await listarComentarios(ticketSeleccionado.id);
      setComentarios(comentariosActualizados);
      
      alert('Estado actualizado y notificación enviada al cliente');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al cambiar estado');
    } finally {
      setCambiandoEstado(false);
    }
  };

  const handleCambiarPrioridad = async (nuevaPrioridad) => {
    setCambiandoPrioridad(true);
    try {
      const ticketActualizado = await cambiarPrioridadTicket(ticketSeleccionado.id, nuevaPrioridad);
      setTicketSeleccionado(ticketActualizado);
      
      // Actualizar en la lista
      setTickets(tickets.map(t => t.id === ticketActualizado.id ? ticketActualizado : t));
      
      // Recargar comentarios
      const comentariosActualizados = await listarComentarios(ticketSeleccionado.id);
      setComentarios(comentariosActualizados);
      
      alert('Prioridad actualizada');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al cambiar prioridad');
    } finally {
      setCambiandoPrioridad(false);
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

  const getPrioridadColor = (prioridad) => {
    switch(prioridad) {
      case 'alta': return 'bg-[#FFEBEE] text-[#F44336]';
      case 'urgente': return 'bg-[#FFEBEE] text-[#D32F2F]';
      case 'media': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'baja': return 'bg-[#E3F2FD] text-[#00BCD4]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTipoNombre = (tipo) => {
    const nombres = {
      'problema_conexion': 'Problema de Conexión',
      'traslado': 'Traslado de Servicio',
      'router_adicional': 'Router Adicional',
      'cambio_plan': 'Cambio de Plan',
      'otro': 'Otro'
    };
    return nombres[tipo] || tipo;
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
              <option value="urgente">Urgente</option>
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
              <AlertCircle className="mx-auto text-[#757575] mb-4" size={48} />
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
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-[#212121]">
                        #{ticket.id} - {ticket.asunto}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F5F5] text-[#757575]">
                        {getTipoNombre(ticket.tipo)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPrioridadColor(ticket.prioridad)}`}>
                        {ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(ticket.estado)}`}>
                        {ticket.estado.replace('_', ' ').charAt(0).toUpperCase() + ticket.estado.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-[#757575] mb-3">{ticket.descripcion}</p>
                    
                    <div className="flex gap-4 text-sm text-[#757575] flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Creado: {new Date(ticket.creado).toLocaleDateString('es-CO')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span>Cliente ID: {ticket.cliente}</span>
                      </div>
                      {ticket.asignado_a && (
                        <div className="flex items-center gap-1">
                          <UserCheck size={16} className="text-[#00BCD4]" />
                          <span className="text-[#00BCD4]">Asignado: Técnico #{ticket.asignado_a}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => abrirModal(ticket)}
                    className="ml-4 p-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition"
                    title="Gestionar ticket"
                  >
                    <Eye size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Gestión Completo */}
      <AnimatePresence>
        {mostrarModal && ticketSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-4xl my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                <div>
                  <h2 className="text-2xl font-bold text-[#212121]">
                    Ticket #{ticketSeleccionado.id}
                  </h2>
                  <p className="text-[#757575] text-sm">{ticketSeleccionado.asunto}</p>
                </div>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-[#757575] hover:text-[#212121] p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Información Principal */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <p className="font-semibold text-[#212121] mb-2">Tipo de Solicitud</p>
                    <p className="text-[#757575]">{getTipoNombre(ticketSeleccionado.tipo)}</p>
                  </div>
                  <div className="p-4 bg-[#E3F2FD] rounded-xl">
                    <p className="font-semibold text-[#212121] mb-2">Cliente</p>
                    <p className="text-[#757575]">ID: {ticketSeleccionado.cliente}</p>
                  </div>
                </div>

                {/* Descripción */}
                <div className="p-4 bg-[#F5F5F5] rounded-xl">
                  <p className="font-semibold text-[#212121] mb-2">Descripción</p>
                  <p className="text-[#424242] whitespace-pre-wrap">{ticketSeleccionado.descripcion}</p>
                </div>

                {/* Controles de Gestión */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Asignar Técnico */}
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
                    <label className="block text-[#212121] font-semibold mb-2">
                      <UserCheck className="inline mr-2" size={18} />
                      Asignar Técnico
                    </label>
                    <select
                      value={ticketSeleccionado.asignado_a || ''}
                      onChange={(e) => handleAsignarTecnico(e.target.value || null)}
                      disabled={asignandoTecnico}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:opacity-50"
                    >
                      <option value="">Sin asignar</option>
                      {tecnicos.map(tec => (
                        <option key={tec.id} value={tec.id}>
                          {tec.first_name} {tec.last_name} ({tec.rol})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cambiar Estado */}
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
                    <label className="block text-[#212121] font-semibold mb-2">
                      <CheckCircle className="inline mr-2" size={18} />
                      Estado
                    </label>
                    <select
                      value={ticketSeleccionado.estado}
                      onChange={(e) => handleCambiarEstado(e.target.value)}
                      disabled={cambiandoEstado}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:opacity-50"
                    >
                      <option value="abierto">Abierto</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="resuelto">Resuelto</option>
                      <option value="cerrado">Cerrado</option>
                    </select>
                  </div>

                  {/* Cambiar Prioridad */}
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
                    <label className="block text-[#212121] font-semibold mb-2">
                      <AlertCircle className="inline mr-2" size={18} />
                      Prioridad
                    </label>
                    <select
                      value={ticketSeleccionado.prioridad}
                      onChange={(e) => handleCambiarPrioridad(e.target.value)}
                      disabled={cambiandoPrioridad}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:opacity-50"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                </div>

                {/* Comentarios */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-[#212121] mb-4 flex items-center gap-2">
                    <MessageSquare size={24} />
                    Comentarios y Respuestas
                  </h3>
                  
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {comentarios.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="mx-auto text-[#757575] mb-2" size={48} />
                        <p className="text-[#757575]">No hay comentarios aún</p>
                      </div>
                    ) : (
                      comentarios.map((comentario) => (
                        <div 
                          key={comentario.id} 
                          className={`p-4 rounded-xl ${comentario.es_interno ? 'bg-[#FFF3E0] border-2 border-[#FF9800]' : 'bg-[#F5F5F5]'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#212121]">
                                {comentario.usuario_nombre}
                              </span>
                              {comentario.es_interno && (
                                <span className="px-2 py-0.5 bg-[#FF9800] text-white text-xs rounded-full">
                                  Interno
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#757575]">
                              {new Date(comentario.creado).toLocaleString('es-CO')}
                            </span>
                          </div>
                          <p className="text-[#424242]">{comentario.comentario}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input de comentario */}
                  <form onSubmit={handleEnviarComentario} className="flex gap-3">
                    <input
                      type="text"
                      value={nuevoComentario}
                      onChange={(e) => setNuevoComentario(e.target.value)}
                      placeholder="Escribe una respuesta al cliente..."
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                      disabled={enviandoComentario}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!nuevoComentario.trim() || enviandoComentario}
                      className="bg-[#00BCD4] text-white p-3 rounded-full hover:bg-[#00ACC1] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enviandoComentario ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Send size={20} />
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-between text-sm text-[#757575]">
                  <span>Creado: {new Date(ticketSeleccionado.creado).toLocaleString('es-CO')}</span>
                  <span>Actualizado: {new Date(ticketSeleccionado.actualizado).toLocaleString('es-CO')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
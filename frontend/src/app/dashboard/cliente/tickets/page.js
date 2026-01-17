'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Plus, MessageSquare, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { fetchTickets, crearTicket, listarComentarios, agregarComentario } from '@/lib/api';

export default function MisTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enviando, setEnviando] = useState(false);
  
  // Estados para modal de comentarios
  const [modalComentarios, setModalComentarios] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  
  // Estado para nuevo ticket
  const [nuevoTicket, setNuevoTicket] = useState({
    tipo: 'problema_conexion',
    asunto: '',
    descripcion: '',
    prioridad: 'media',
    datos_adicionales: {}
  });

  useEffect(() => {
    cargarTickets();
  }, []);

  const cargarTickets = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const data = await fetchTickets(token);
      setTickets(data);
    } catch (error) {
      console.error('Error cargando tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTipoChange = (tipo) => {
    setNuevoTicket({
      ...nuevoTicket,
      tipo,
      asunto: getTituloSugerido(tipo),
      datos_adicionales: {}
    });
  };

  const getTituloSugerido = (tipo) => {
    const titulos = {
      'problema_conexion': 'Problema con mi conexión a internet',
      'traslado': 'Solicitud de traslado de servicio',
      'router_adicional': 'Solicitud de router adicional',
      'cambio_plan': 'Solicitud de cambio de plan',
      'otro': ''
    };
    return titulos[tipo] || '';
  };

  const handleDatosAdicionalesChange = (campo, valor) => {
    setNuevoTicket({
      ...nuevoTicket,
      datos_adicionales: {
        ...nuevoTicket.datos_adicionales,
        [campo]: valor
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const token = localStorage.getItem('access_token');
      await crearTicket(token, {
        tipo: nuevoTicket.tipo,
        asunto: nuevoTicket.asunto,
        descripcion: nuevoTicket.descripcion,
        prioridad: nuevoTicket.prioridad,
        datos_adicionales: nuevoTicket.datos_adicionales,
        estado: 'abierto'
      });
      
      alert('Ticket creado exitosamente');
      setMostrarFormulario(false);
      setNuevoTicket({
        tipo: 'problema_conexion',
        asunto: '',
        descripcion: '',
        prioridad: 'media',
        datos_adicionales: {}
      });
      cargarTickets();
    } catch (error) {
      console.error('Error creando ticket:', error);
      alert('Error al crear el ticket');
    } finally {
      setEnviando(false);
    }
  };

  const abrirModalComentarios = async (ticket) => {
    setTicketSeleccionado(ticket);
    setModalComentarios(true);
    
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

  const renderCamposEspecificos = () => {
    switch(nuevoTicket.tipo) {
      case 'problema_conexion':
        return (
          <>
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                ¿Reinició el router? <span className="text-[#F44336]">*</span>
              </label>
              <select
                value={nuevoTicket.datos_adicionales.reinicio_router || ''}
                onChange={(e) => handleDatosAdicionalesChange('reinicio_router', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                disabled={enviando}
              >
                <option value="">Seleccione...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                ¿Las luces del router están encendidas?
              </label>
              <select
                value={nuevoTicket.datos_adicionales.luces_router || ''}
                onChange={(e) => handleDatosAdicionalesChange('luces_router', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                disabled={enviando}
              >
                <option value="">Seleccione...</option>
                <option value="todas">Todas encendidas</option>
                <option value="algunas">Algunas apagadas</option>
                <option value="ninguna">Ninguna encendida</option>
              </select>
            </div>
          </>
        );

      case 'traslado':
        return (
          <>
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Nueva Dirección <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="text"
                value={nuevoTicket.datos_adicionales.nueva_direccion || ''}
                onChange={(e) => handleDatosAdicionalesChange('nueva_direccion', e.target.value)}
                placeholder="Ingresa la nueva dirección completa"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                disabled={enviando}
              />
            </div>
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Zona <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="text"
                value={nuevoTicket.datos_adicionales.zona || ''}
                onChange={(e) => handleDatosAdicionalesChange('zona', e.target.value)}
                placeholder="Ej: Robledo, San Cristóbal"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                disabled={enviando}
              />
            </div>
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Fecha Preferida para el Traslado
              </label>
              <input
                type="date"
                value={nuevoTicket.datos_adicionales.fecha_preferida || ''}
                onChange={(e) => handleDatosAdicionalesChange('fecha_preferida', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                disabled={enviando}
              />
            </div>
          </>
        );

      case 'router_adicional':
        return (
          <>
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Ubicación del Router Adicional <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="text"
                value={nuevoTicket.datos_adicionales.ubicacion_router || ''}
                onChange={(e) => handleDatosAdicionalesChange('ubicacion_router', e.target.value)}
                placeholder="Ej: Segundo piso, habitación principal"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                disabled={enviando}
              />
            </div>
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Cantidad de Routers
              </label>
              <select
                value={nuevoTicket.datos_adicionales.cantidad || '1'}
                onChange={(e) => handleDatosAdicionalesChange('cantidad', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                disabled={enviando}
              >
                <option value="1">1 Router</option>
                <option value="2">2 Routers</option>
                <option value="3">3 Routers</option>
              </select>
            </div>
          </>
        );

      case 'cambio_plan':
        return (
          <>
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Plan Deseado <span className="text-[#F44336]">*</span>
              </label>
              <input
                type="text"
                value={nuevoTicket.datos_adicionales.plan_deseado || ''}
                onChange={(e) => handleDatosAdicionalesChange('plan_deseado', e.target.value)}
                placeholder="Ej: Plan 200 Mbps, Plan Premium"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                required
                disabled={enviando}
              />
            </div>
            <div>
              <label className="block text-[#212121] font-semibold mb-2">
                Razón del Cambio
              </label>
              <textarea
                value={nuevoTicket.datos_adicionales.razon || ''}
                onChange={(e) => handleDatosAdicionalesChange('razon', e.target.value)}
                placeholder="¿Por qué deseas cambiar de plan?"
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] resize-none"
                disabled={enviando}
              />
            </div>
          </>
        );

      default:
        return null;
    }
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
        <AnimatePresence>
          {mostrarFormulario && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
            >
              <h3 className="text-xl font-bold text-[#212121] mb-4">
                Crear Nuevo Ticket
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tipo de Ticket */}
                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Tipo de Solicitud <span className="text-[#F44336]">*</span>
                  </label>
                  <select
                    value={nuevoTicket.tipo}
                    onChange={(e) => handleTipoChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                    disabled={enviando}
                  >
                    <option value="problema_conexion">🌐 Problema de Conexión</option>
                    <option value="traslado">📦 Traslado de Servicio</option>
                    <option value="router_adicional">📡 Router Adicional</option>
                    <option value="cambio_plan">🔄 Cambio de Plan</option>
                    <option value="otro">📝 Otro</option>
                  </select>
                </div>

                {/* Asunto */}
                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Asunto <span className="text-[#F44336]">*</span>
                  </label>
                  <input
                    type="text"
                    value={nuevoTicket.asunto}
                    onChange={(e) => setNuevoTicket({...nuevoTicket, asunto: e.target.value})}
                    placeholder="Ej: Problema con la conexión"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                    required
                    disabled={enviando}
                  />
                </div>

                {/* Campos específicos según tipo */}
                {renderCamposEspecificos()}

                {/* Descripción */}
                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Descripción <span className="text-[#F44336]">*</span>
                  </label>
                  <textarea
                    value={nuevoTicket.descripcion}
                    onChange={(e) => setNuevoTicket({...nuevoTicket, descripcion: e.target.value})}
                    placeholder="Describe detalladamente tu problema o consulta..."
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] resize-none"
                    required
                    disabled={enviando}
                  />
                </div>

                {/* Prioridad */}
                <div>
                  <label className="block text-[#212121] font-semibold mb-2">
                    Prioridad
                  </label>
                  <select
                    value={nuevoTicket.prioridad}
                    onChange={(e) => setNuevoTicket({...nuevoTicket, prioridad: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                    disabled={enviando}
                  >
                    <option value="baja">Baja - No es urgente</option>
                    <option value="media">Media - Requiere atención pronto</option>
                    <option value="alta">Alta - Urgente</option>
                  </select>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={enviando}
                    className="flex-1 bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {enviando ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Creando...
                      </>
                    ) : (
                      'Crear Ticket'
                    )}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    disabled={enviando}
                    className="flex-1 border-2 border-gray-300 text-[#757575] py-3 rounded-full hover:border-[#00BCD4] hover:text-[#00BCD4] transition font-semibold disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#00BCD4] mr-3" size={32} />
            <p className="text-[#757575]">Cargando tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border-2 border-gray-100 text-center">
            <AlertCircle className="mx-auto text-[#757575] mb-4" size={48} />
            <p className="text-[#757575] mb-4">No tienes tickets creados</p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="text-[#00BCD4] hover:underline font-semibold"
            >
              Crear tu primer ticket
            </button>
          </div>
        ) : (
          /* Tickets List */
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
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F5F5] text-[#757575]">
                        {getTipoNombre(ticket.tipo)}
                      </span>
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

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => abrirModalComentarios(ticket)}
                    className="p-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition"
                    title="Ver comentarios"
                  >
                    <MessageSquare size={20} />
                  </motion.button>
                </div>

                <div className="flex gap-4 text-sm text-[#757575] pt-3 border-t border-gray-100">
                  <span>Creado: {new Date(ticket.creado).toLocaleDateString('es-CO')}</span>
                  <span>Actualizado: {new Date(ticket.actualizado).toLocaleDateString('es-CO')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Comentarios */}
      <AnimatePresence>
        {modalComentarios && ticketSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#212121]">
                    Ticket #{ticketSeleccionado.id}
                  </h2>
                  <p className="text-[#757575] text-sm">{ticketSeleccionado.asunto}</p>
                </div>
                <button
                  onClick={() => setModalComentarios(false)}
                  className="text-[#757575] hover:text-[#212121]"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Comentarios */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {comentarios.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto text-[#757575] mb-2" size={48} />
                    <p className="text-[#757575]">No hay comentarios aún</p>
                    <p className="text-sm text-[#BDBDBD]">Sé el primero en comentar</p>
                  </div>
                ) : (
                  comentarios.map((comentario) => (
                    <div key={comentario.id} className="bg-[#F5F5F5] p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[#212121]">
                          {comentario.usuario_nombre}
                        </span>
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
              <form onSubmit={handleEnviarComentario} className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Escribe un comentario..."
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
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
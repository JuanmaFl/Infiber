'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FileText, Calendar, MapPin, Wifi, Loader2, X, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { 
  fetchContratos, 
  verificarFacturasPendientes, 
  fetchPlanes, 
  cambiarPlanContrato, 
  cancelarContrato 
} from '@/lib/api';

export default function MiContrato() {
  const [contrato, setContrato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para modales
  const [mostrarModalCambiarPlan, setMostrarModalCambiarPlan] = useState(false);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  
  // Estados para cambiar plan
  const [planes, setPlanes] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [cambiandoPlan, setCambiandoPlan] = useState(false);
  
  // Estados para cancelar
  const [cancelando, setCancelando] = useState(false);
  
  // Estados para mensajes
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarContrato();
  }, []);

  const cargarContrato = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No estás autenticado');
        return;
      }

      const data = await fetchContratos(token);
      
      if (!data) {
        setError('No tienes un contrato activo');
        return;
      }

      setContrato(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar el contrato');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarPlan = async () => {
    try {
      // Verificar facturas pendientes
      const { tiene_pendientes, cantidad } = await verificarFacturasPendientes(contrato.id);
      
      if (tiene_pendientes) {
        setMensaje({
          tipo: 'error',
          texto: `Tienes ${cantidad} factura(s) pendiente(s). Debes pagarlas antes de cambiar de plan.`
        });
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
        return;
      }
      
      // Cargar planes disponibles
      const planesData = await fetchPlanes();
      setPlanes(planesData.filter(plan => plan.id !== contrato.plan_detalle?.id));
      setMostrarModalCambiarPlan(true);
      
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.message || 'Error al verificar facturas'
      });
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
    }
  };

  const confirmarCambioPlan = async () => {
    if (!planSeleccionado) {
      setMensaje({ tipo: 'error', texto: 'Selecciona un plan' });
      return;
    }

    setCambiandoPlan(true);
    try {
      await cambiarPlanContrato(contrato.id, planSeleccionado);
      
      setMensaje({
        tipo: 'exito',
        texto: '¡Plan actualizado exitosamente!'
      });
      
      setMostrarModalCambiarPlan(false);
      await cargarContrato(); // Recargar contrato
      
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.message || 'Error al cambiar plan'
      });
    } finally {
      setCambiandoPlan(false);
    }
  };

  const handleCancelarServicio = async () => {
    try {
      // Verificar facturas pendientes
      const { tiene_pendientes, cantidad } = await verificarFacturasPendientes(contrato.id);
      
      if (tiene_pendientes) {
        setMensaje({
          tipo: 'error',
          texto: `Tienes ${cantidad} factura(s) pendiente(s). Debes pagarlas antes de cancelar el servicio.`
        });
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
        return;
      }
      
      setMostrarModalCancelar(true);
      
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.message || 'Error al verificar facturas'
      });
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
    }
  };

  const confirmarCancelacion = async () => {
    setCancelando(true);
    try {
      await cancelarContrato(contrato.id);
      
      setMensaje({
        tipo: 'exito',
        texto: 'Servicio cancelado exitosamente. Lamentamos verte partir.'
      });
      
      setMostrarModalCancelar(false);
      await cargarContrato(); // Recargar contrato
      
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.message || 'Error al cancelar servicio'
      });
    } finally {
      setCancelando(false);
    }
  };

  const handleDescargarContrato = () => {
    // Por ahora solo muestra un mensaje, puedes implementar generación de PDF después
    setMensaje({
      tipo: 'info',
      texto: 'Funcionalidad de descarga de contrato en desarrollo'
    });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#00BCD4]" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contrato) {
    return (
      <DashboardLayout>
        <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100 text-center">
          <p className="text-[#F44336] text-lg">{error || 'No se encontró el contrato'}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Mensajes de estado */}
        <AnimatePresence>
          {mensaje.texto && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl ${
                mensaje.tipo === 'error' ? 'bg-[#FFEBEE] text-[#F44336]' :
                mensaje.tipo === 'exito' ? 'bg-[#E8F5E9] text-[#4CAF50]' :
                'bg-[#E3F2FD] text-[#00BCD4]'
              }`}
            >
              {mensaje.texto}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#212121]">Mi Contrato</h1>
            <p className="text-[#757575] mt-1">Información detallada de tu servicio</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold ${
            contrato.estado === 'activo' 
              ? 'bg-[#E8F5E9] text-[#4CAF50]' 
              : 'bg-[#FFEBEE] text-[#F44336]'
          }`}>
            {contrato.estado === 'activo' ? '● Activo' : '● Inactivo'}
          </span>
        </div>

        {/* Contract Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-6">
              Detalles del Servicio
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#00BCD4]" size={24} />
                </div>
                <div>
                  <p className="text-[#757575] text-sm">Número de Contrato</p>
                  <p className="text-lg font-bold text-[#212121]">CNT-{contrato.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wifi className="text-[#00BCD4]" size={24} />
                </div>
                <div>
                  <p className="text-[#757575] text-sm">Plan Contratado</p>
                  <p className="text-lg font-bold text-[#212121]">
                    {contrato.plan_detalle?.nombre || 'Plan No Disponible'}
                  </p>
                  {contrato.plan_detalle && (
                    <p className="text-sm text-[#757575]">
                      ⬇ {contrato.plan_detalle.velocidad_bajada} Mbps / ⬆ {contrato.plan_detalle.velocidad_subida} Mbps
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-[#00BCD4]" size={24} />
                </div>
                <div>
                  <p className="text-[#757575] text-sm">Fecha de Inicio</p>
                  <p className="text-lg font-bold text-[#212121]">
                    {new Date(contrato.fecha_inicio).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-[#00BCD4]" size={24} />
                </div>
                <div>
                  <p className="text-[#757575] text-sm">Dirección de Instalación</p>
                  <p className="text-lg font-bold text-[#212121]">{contrato.direccion}</p>
                  <p className="text-sm text-[#757575]">Zona: {contrato.zona}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-6">
              Información de Facturación
            </h3>
            <div className="space-y-6">
              <div className="p-6 bg-[#E3F2FD] rounded-xl">
                <p className="text-[#757575] text-sm mb-2">Valor Mensual</p>
                <p className="text-4xl font-bold text-[#00BCD4]">
                  ${contrato.plan_detalle?.precio?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-[#757575] mt-1">+ IVA incluido</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl">
                  <span className="text-[#212121]">Instalación</span>
                  <span className="text-[#4CAF50] font-bold">Incluida</span>
                </div>
                <div className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl">
                  <span className="text-[#212121]">Router WiFi</span>
                  <span className="text-[#4CAF50] font-bold">Incluido</span>
                </div>
                <div className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl">
                  <span className="text-[#212121]">Soporte 24/7</span>
                  <span className="text-[#4CAF50] font-bold">Incluido</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
        >
          <h3 className="text-xl font-bold text-[#212121] mb-4">
            Acciones
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCambiarPlan}
              disabled={contrato.estado !== 'activo'}
              className="p-4 bg-[#00BCD4] text-white rounded-xl hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cambiar de Plan
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDescargarContrato}
              className="p-4 border-2 border-[#00BCD4] text-[#00BCD4] rounded-xl hover:bg-[#E3F2FD] transition font-semibold flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Descargar Contrato
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancelarServicio}
              disabled={contrato.estado !== 'activo'}
              className="p-4 border-2 border-gray-300 text-[#757575] rounded-xl hover:border-[#F44336] hover:text-[#F44336] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar Servicio
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Modal Cambiar Plan */}
      <AnimatePresence>
        {mostrarModalCambiarPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#212121]">Cambiar de Plan</h2>
                <button
                  onClick={() => setMostrarModalCambiarPlan(false)}
                  className="text-[#757575] hover:text-[#212121]"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-[#757575] mb-6">
                Selecciona el nuevo plan que deseas contratar. El cambio será efectivo inmediatamente.
              </p>

              <div className="space-y-4">
                {planes.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setPlanSeleccionado(plan.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                      planSeleccionado === plan.id
                        ? 'border-[#00BCD4] bg-[#E3F2FD]'
                        : 'border-gray-200 hover:border-[#00BCD4]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-[#212121]">{plan.nombre}</h3>
                        <p className="text-[#757575] text-sm mt-1">
                          ⬇ {plan.velocidad_bajada} Mbps / ⬆ {plan.velocidad_subida} Mbps
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-[#00BCD4]">
                        ${plan.precio?.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setMostrarModalCambiarPlan(false)}
                  className="flex-1 p-4 border-2 border-gray-300 text-[#757575] rounded-xl hover:border-[#00BCD4] hover:text-[#00BCD4] transition font-semibold"
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmarCambioPlan}
                  disabled={!planSeleccionado || cambiandoPlan}
                  className="flex-1 p-4 bg-[#00BCD4] text-white rounded-xl hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cambiandoPlan ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Cambiando...
                    </>
                  ) : (
                    'Confirmar Cambio'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Cancelar Servicio */}
      <AnimatePresence>
        {mostrarModalCancelar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-[#FFEBEE] rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="text-[#F44336]" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-[#212121]">¿Cancelar Servicio?</h2>
              </div>

              <div className="bg-[#FFF3E0] p-4 rounded-xl mb-6">
                <p className="text-[#E65100] text-sm">
                  <strong>Advertencia:</strong> Esta acción cancelará tu servicio de internet permanentemente. Perderás acceso a tu plan actual y a todos los beneficios asociados.
                </p>
              </div>

              <p className="text-[#757575] mb-6">
                Lamentamos verte partir. Si tienes algún problema con el servicio, contáctanos para buscar una solución antes de cancelar.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setMostrarModalCancelar(false)}
                  className="flex-1 p-4 border-2 border-gray-300 text-[#757575] rounded-xl hover:border-[#00BCD4] hover:text-[#00BCD4] transition font-semibold"
                >
                  No, mantener servicio
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmarCancelacion}
                  disabled={cancelando}
                  className="flex-1 p-4 bg-[#F44336] text-white rounded-xl hover:bg-[#E53935] transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelando ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Cancelando...
                    </>
                  ) : (
                    'Sí, cancelar'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
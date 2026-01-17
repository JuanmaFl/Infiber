'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Download, Eye, X, AlertCircle, Loader2, Printer } from 'lucide-react';
import { fetchFacturas, descargarFacturaPDF } from '@/lib/api';

export default function MisFacturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [descargando, setDescargando] = useState(null);

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const data = await fetchFacturas(token);
      setFacturas(data);
    } catch (error) {
      console.error('Error cargando facturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'pagada': return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'pendiente': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'vencida': return 'bg-[#FFEBEE] text-[#F44336]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleVerFactura = (factura) => {
    setFacturaSeleccionada(factura);
    setMostrarModal(true);
  };

  const handleDescargarFactura = async (factura) => {
    setDescargando(factura.id);
    try {
      const blob = await descargarFacturaPDF(factura.id);
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Factura_${factura.numero_factura}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error descargando factura:', error);
      alert('Error al descargar la factura');
    } finally {
      setDescargando(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">Mis Facturas</h1>
          <p className="text-[#757575] mt-1">Historial completo de facturación</p>
        </div>

        {/* Banner Informativo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#E3F2FD] border-2 border-[#00BCD4] p-6 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0">
              <Printer className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#212121] mb-2">
                💡 Importante: Pagos en Efectivo
              </h3>
              <p className="text-[#757575]">
                Para realizar pagos en efectivo en puntos autorizados, debes <strong>descargar e imprimir tu factura</strong>. 
                Haz clic en el botón de descarga (⬇️) para obtener tu factura en formato PDF.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#00BCD4] mr-3" size={32} />
            <p className="text-[#757575]">Cargando facturas...</p>
          </div>
        ) : facturas.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border-2 border-gray-100 text-center">
            <AlertCircle className="mx-auto text-[#757575] mb-4" size={48} />
            <p className="text-[#757575]">No tienes facturas registradas</p>
          </div>
        ) : (
          /* Facturas List */
          <div className="space-y-4">
            {facturas.map((factura, index) => (
              <motion.div
                key={factura.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-[#00BCD4] transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-bold text-[#212121]">
                        Factura #{factura.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(factura.estado)}`}>
                        {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-[#757575]">Período</p>
                        <p className="text-[#212121] font-semibold">{factura.periodo}</p>
                      </div>
                      <div>
                        <p className="text-[#757575]">Emisión</p>
                        <p className="text-[#212121] font-semibold">
                          {new Date(factura.fecha_emision).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#757575]">Vencimiento</p>
                        <p className="text-[#212121] font-semibold">
                          {new Date(factura.fecha_vencimiento).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#757575]">Monto</p>
                        <p className="text-[#00BCD4] font-bold text-lg">
                          ${factura.monto.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleVerFactura(factura)}
                      className="p-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition"
                      title="Ver factura"
                    >
                      <Eye size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDescargarFactura(factura)}
                      disabled={descargando === factura.id}
                      className="p-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition disabled:opacity-50"
                      title="Descargar PDF"
                    >
                      {descargando === factura.id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Download size={20} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Ver Factura */}
      <AnimatePresence>
        {mostrarModal && facturaSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#212121]">
                  Detalle de Factura #{facturaSeleccionada.id}
                </h2>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-[#757575] hover:text-[#212121]"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Estado */}
                <div className="flex justify-center">
                  <span className={`px-6 py-3 rounded-full text-lg font-semibold ${getEstadoColor(facturaSeleccionada.estado)}`}>
                    Estado: {facturaSeleccionada.estado.toUpperCase()}
                  </span>
                </div>

                {/* Información */}
                <div className="bg-[#F5F5F5] p-6 rounded-xl space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Número de Factura:</span>
                    <span className="font-bold text-[#212121]">{facturaSeleccionada.numero_factura}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Período:</span>
                    <span className="font-bold text-[#212121]">{facturaSeleccionada.periodo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Fecha de Emisión:</span>
                    <span className="font-bold text-[#212121]">
                      {new Date(facturaSeleccionada.fecha_emision).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Fecha de Vencimiento:</span>
                    <span className="font-bold text-[#212121]">
                      {new Date(facturaSeleccionada.fecha_vencimiento).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
                    <span className="text-[#757575] text-lg">Total a Pagar:</span>
                    <span className="font-bold text-[#00BCD4] text-3xl">
                      ${facturaSeleccionada.monto.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Nota */}
                <div className="bg-[#FFF3E0] border-2 border-[#FF9800] p-4 rounded-xl">
                  <p className="text-[#E65100] text-sm">
                    <strong>📌 Recuerda:</strong> Para pagos en efectivo, descarga e imprime esta factura.
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="flex-1 p-4 border-2 border-gray-300 text-[#757575] rounded-xl hover:border-[#00BCD4] hover:text-[#00BCD4] transition font-semibold"
                  >
                    Cerrar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDescargarFactura(facturaSeleccionada)}
                    disabled={descargando === facturaSeleccionada.id}
                    className="flex-1 p-4 bg-[#00BCD4] text-white rounded-xl hover:bg-[#00ACC1] transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {descargando === facturaSeleccionada.id ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Descargando...
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        Descargar PDF
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
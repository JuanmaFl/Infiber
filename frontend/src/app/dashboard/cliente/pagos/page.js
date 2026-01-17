'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { CreditCard, Calendar, DollarSign, Loader2, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { fetchFacturas, crearLinkPagoWompi } from '@/lib/api';

export default function RealizarPago() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarFacturasPendientes();
  }, []);

  const cargarFacturasPendientes = async () => {
    try {
      const data = await fetchFacturas();
      // Filtrar solo facturas pendientes
      const pendientes = data.filter(f => f.estado === 'pendiente');
      setFacturas(pendientes);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  const handlePagarConWompi = async (factura) => {
    setProcesando(factura.id);
    setError('');
    
    try {
      const resultado = await crearLinkPagoWompi(factura.id);
      
      if (resultado.success) {
        // Abrir link de pago en nueva ventana
        const ventanaPago = window.open(resultado.payment_link, '_blank', 'width=600,height=800');
        
        // Mostrar mensaje
        alert('Se ha abierto la ventana de pago de Wompi. Completa el pago y regresa aquí para actualizar.');
        
        // Opcional: Polling para verificar el estado cada 5 segundos
        const intervalId = setInterval(async () => {
          try {
            await cargarFacturasPendientes();
            
            // Si la factura ya no está pendiente, limpiar el interval
            const facturaActualizada = await fetchFacturas();
            const facturaEncontrada = facturaActualizada.find(f => f.id === factura.id);
            
            if (facturaEncontrada && facturaEncontrada.estado !== 'pendiente') {
              clearInterval(intervalId);
              setProcesando(null);
            }
          } catch (error) {
            console.error('Error verificando estado:', error);
          }
        }, 5000);
        
        // Limpiar interval después de 5 minutos
        setTimeout(() => clearInterval(intervalId), 300000);
        
      } else {
        setError(resultado.error || 'Error al crear el link de pago');
        setProcesando(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al procesar el pago');
      setProcesando(null);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      pagada: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pagada' },
      vencida: { bg: 'bg-red-100', text: 'text-red-800', label: 'Vencida' }
    };
    
    const badge = badges[estado] || badges.pendiente;
    
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {badge.label}
      </span>
    );
  };

  const calcularDiasVencimiento = (fechaVencimiento) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diff = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    return diff;
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">Realizar Pago</h1>
          <p className="text-[#757575] mt-1">Paga tus facturas de forma segura con Wompi</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3"
          >
            <AlertCircle size={24} />
            <p>{error}</p>
          </motion.div>
        )}

        {/* Facturas Pendientes */}
        {facturas.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facturas.map((factura) => {
              const diasVencimiento = calcularDiasVencimiento(factura.fecha_vencimiento);
              const estaVencida = diasVencimiento < 0;
              const esUrgente = diasVencimiento <= 3 && diasVencimiento >= 0;

              return (
                <motion.div
                  key={factura.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${
                    estaVencida
                      ? 'border-red-500'
                      : esUrgente
                      ? 'border-yellow-500'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-[#757575]">Factura</p>
                      <p className="text-lg font-bold text-[#212121]">
                        {factura.numero_factura}
                      </p>
                    </div>
                    {getEstadoBadge(factura.estado)}
                  </div>

                  {/* Monto */}
                  <div className="mb-4 p-4 bg-gradient-to-br from-[#00BCD4] to-[#00ACC1] rounded-xl">
                    <p className="text-sm text-white/80 mb-1">Monto a pagar</p>
                    <p className="text-3xl font-bold text-white">
                      ${parseFloat(factura.monto).toLocaleString('es-CO')}
                    </p>
                  </div>

                  {/* Detalles */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-[#757575]" />
                      <span className="text-[#757575]">Vence:</span>
                      <span
                        className={`font-medium ${
                          estaVencida
                            ? 'text-red-600'
                            : esUrgente
                            ? 'text-yellow-600'
                            : 'text-[#212121]'
                        }`}
                      >
                        {new Date(factura.fecha_vencimiento).toLocaleDateString('es-CO')}
                      </span>
                    </div>

                    {estaVencida && (
                      <div className="text-sm text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle size={16} />
                        Vencida hace {Math.abs(diasVencimiento)} días
                      </div>
                    )}

                    {esUrgente && (
                      <div className="text-sm text-yellow-600 font-medium">
                        ⏰ Vence en {diasVencimiento} día(s)
                      </div>
                    )}

                    <div className="text-xs text-[#757575]">
                      <p>Período: {factura.periodo}</p>
                      <p>Plan: {factura.contrato?.plan?.nombre || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Botón de Pago */}
                  <button
                    onClick={() => handlePagarConWompi(factura)}
                    disabled={procesando === factura.id}
                    className="w-full bg-[#00BCD4] text-white py-3 rounded-xl font-semibold hover:bg-[#00ACC1] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {procesando === factura.id ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Pagar con Wompi
                        <ExternalLink size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-[#757575] text-center mt-3">
                    💳 Pago seguro con tarjeta, PSE, Nequi o Bancolombia
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-2 border-green-200 rounded-2xl p-12 text-center"
          >
            <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              ¡Todo al día!
            </h3>
            <p className="text-green-700">
              No tienes facturas pendientes por pagar
            </p>
          </motion.div>
        )}

        {/* Info adicional */}
        <div className="bg-[#E3F2FD] border-2 border-[#00BCD4] rounded-xl p-6">
          <h3 className="font-bold text-[#212121] mb-3">
            ℹ️ Información sobre pagos con Wompi
          </h3>
          <ul className="space-y-2 text-sm text-[#757575]">
            <li className="flex items-start gap-2">
              <span className="text-[#00BCD4]">•</span>
              <span>Los pagos se procesan de forma segura a través de Wompi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00BCD4]">•</span>
              <span>
                Puedes pagar con tarjeta de crédito/débito, PSE, Nequi o Bancolombia
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00BCD4]">•</span>
              <span>
                Una vez completado el pago, tu factura se actualizará automáticamente
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00BCD4]">•</span>
              <span>
                Recibirás un email de confirmación cuando el pago sea procesado
              </span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
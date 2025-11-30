'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { CreditCard, Smartphone, DollarSign, Loader2, CheckCircle } from 'lucide-react';
import { fetchFacturas, crearTransaccionWompi, crearTransaccionPayU, confirmarPago } from '@/lib/api';

export default function RealizarPago() {
  const [facturas, setFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [metodoPago, setMetodoPago] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    cargarFacturasPendientes();
  }, []);

  const cargarFacturasPendientes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const data = await fetchFacturas(token);
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

  const metodosPago = [
    { 
      id: 'wompi', 
      nombre: 'Wompi', 
      icono: Smartphone, 
      descripcion: 'Pago con tarjeta o PSE',
      color: '#00D4B4'
    },
    { 
      id: 'payu', 
      nombre: 'PayU', 
      icono: CreditCard, 
      descripcion: 'Tarjeta débito/crédito',
      color: '#66CC00'
    },
    { 
      id: 'efectivo', 
      nombre: 'Efectivo', 
      icono: DollarSign, 
      descripcion: 'Pago en oficina',
      color: '#FF9800'
    }
  ];

  const handlePago = async () => {
    if (!facturaSeleccionada || !metodoPago) {
      alert('Selecciona una factura y método de pago');
      return;
    }

    setProcesando(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');

      if (metodoPago === 'wompi') {
        // Crear transacción en Wompi
        const response = await crearTransaccionWompi(token, facturaSeleccionada.id);
        console.log('Respuesta Wompi:', response);
        
        // En producción, redirigir a checkout de Wompi
        // window.location.href = response.data.payment_link;
        
        // Por ahora, simular pago exitoso
        await simularPagoExitoso();
        
      } else if (metodoPago === 'payu') {
        // Crear transacción en PayU
        const response = await crearTransaccionPayU(token, facturaSeleccionada.id);
        console.log('Respuesta PayU:', response);
        
        // En producción, redirigir a checkout de PayU
        // window.location.href = response.data.payment_link;
        
        // Por ahora, simular pago exitoso
        await simularPagoExitoso();
        
      } else if (metodoPago === 'efectivo') {
        // Pago en efectivo - solo registrar
        await simularPagoExitoso();
      }

    } catch (err) {
      console.error('Error en pago:', err);
      setError('Error al procesar el pago. Intenta de nuevo.');
      setProcesando(false);
    }
  };

  const simularPagoExitoso = async () => {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const token = localStorage.getItem('access_token');
    
    // Confirmar pago en backend
    await confirmarPago(token, {
      factura_id: facturaSeleccionada.id,
      metodo_pago: metodoPago,
      referencia_transaccion: `TEST-${Date.now()}`
    });

    setExito(true);
    setProcesando(false);

    // Recargar facturas después de 2 segundos
    setTimeout(() => {
      setExito(false);
      setFacturaSeleccionada(null);
      setMetodoPago('');
      cargarFacturasPendientes();
    }, 2000);
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

  if (exito) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <CheckCircle className="text-[#4CAF50]" size={64} />
          <h2 className="text-2xl font-bold text-[#4CAF50]">¡Pago Exitoso!</h2>
          <p className="text-[#757575]">Tu pago ha sido procesado correctamente</p>
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
          <p className="text-[#757575] mt-1">Paga tus facturas de forma segura</p>
        </div>

        {error && (
          <div className="bg-[#FFEBEE] text-[#F44336] p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Facturas Pendientes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-4">
              Facturas Pendientes
            </h3>
            <div className="space-y-3">
              {facturas.map((factura) => (
                <div
                  key={factura.id}
                  onClick={() => setFacturaSeleccionada(factura)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                    facturaSeleccionada?.id === factura.id
                      ? 'border-[#00BCD4] bg-[#E3F2FD]'
                      : 'border-gray-200 hover:border-[#00BCD4]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[#212121]">{factura.numero}</p>
                      <p className="text-sm text-[#757575]">{factura.periodo}</p>
                      <p className="text-xs text-[#757575] mt-1">
                        Vence: {new Date(factura.fecha_vencimiento).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-[#00BCD4]">
                      ${factura.monto.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {facturas.length === 0 && (
                <div className="text-center py-8 text-[#757575]">
                  ✅ No tienes facturas pendientes
                </div>
              )}
            </div>
          </motion.div>

          {/* Métodos de Pago */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-4">
              Método de Pago
            </h3>
            <div className="space-y-3 mb-6">
              {metodosPago.map((metodo) => (
                <div
                  key={metodo.id}
                  onClick={() => setMetodoPago(metodo.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                    metodoPago === metodo.id
                      ? 'border-[#00BCD4] bg-[#E3F2FD]'
                      : 'border-gray-200 hover:border-[#00BCD4]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${metodo.color}20` }}
                    >
                      <metodo.icono style={{ color: metodo.color }} size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-[#212121]">{metodo.nombre}</p>
                      <p className="text-sm text-[#757575]">{metodo.descripcion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            {facturaSeleccionada && (
              <div className="bg-[#E3F2FD] p-4 rounded-xl mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#757575]">Total a pagar:</span>
                  <span className="text-2xl font-bold text-[#00BCD4]">
                    ${facturaSeleccionada.monto.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-[#757575]">
                  Factura: {facturaSeleccionada.numero}
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: procesando ? 1 : 1.02 }}
              whileTap={{ scale: procesando ? 1 : 0.98 }}
              onClick={handlePago}
              disabled={!facturaSeleccionada || !metodoPago || procesando}
              className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {procesando ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Procesando...
                </>
              ) : (
                'Realizar Pago'
              )}
            </motion.button>

            {metodoPago === 'efectivo' && (
              <p className="text-xs text-[#757575] text-center mt-3">
                💡 Presenta tu cédula en nuestras oficinas para completar el pago
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
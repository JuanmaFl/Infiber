'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';

export default function RealizarPago() {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [metodoPago, setMetodoPago] = useState('');
  const [procesando, setProcesando] = useState(false);

  const facturasVencidas = [
    {
      id: 3,
      numero: 'FAC-2025-003',
      periodo: 'Marzo 2025',
      monto: 70000,
      fecha_vencimiento: '2025-03-15'
    }
  ];

  const metodosPago = [
    { id: 'wompi', nombre: 'Wompi', icono: Smartphone, descripcion: 'Pago con tarjeta o PSE' },
    { id: 'payu', nombre: 'PayU', icono: CreditCard, descripcion: 'Tarjeta débito/crédito' },
    { id: 'efectivo', nombre: 'Efectivo', icono: DollarSign, descripcion: 'Pago en oficina' }
  ];

  const handlePago = async () => {
    if (!facturaSeleccionada || !metodoPago) {
      alert('Selecciona una factura y método de pago');
      return;
    }

    setProcesando(true);
    // Aquí integrarías con Wompi/PayU
    setTimeout(() => {
      alert('Pago procesado exitosamente');
      setProcesando(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">Realizar Pago</h1>
          <p className="text-[#757575] mt-1">Paga tus facturas de forma segura</p>
        </div>

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
              {facturasVencidas.map((factura) => (
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

              {facturasVencidas.length === 0 && (
                <div className="text-center py-8 text-[#757575]">
                  No tienes facturas pendientes
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
                    <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                      <metodo.icono className="text-[#00BCD4]" size={24} />
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
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePago}
              disabled={!facturaSeleccionada || !metodoPago || procesando}
              className="w-full bg-[#00BCD4] text-white py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {procesando ? 'Procesando...' : 'Realizar Pago'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
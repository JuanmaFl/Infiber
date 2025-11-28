'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Download, Eye } from 'lucide-react';

export default function MisFacturas() {
  const [facturas] = useState([
    {
      id: 1,
      numero: 'FAC-2025-001',
      periodo: 'Enero 2025',
      monto: 70000,
      fecha_emision: '2025-01-01',
      fecha_vencimiento: '2025-01-15',
      estado: 'pagada'
    },
    {
      id: 2,
      numero: 'FAC-2025-002',
      periodo: 'Febrero 2025',
      monto: 70000,
      fecha_emision: '2025-02-01',
      fecha_vencimiento: '2025-02-15',
      estado: 'pagada'
    },
    {
      id: 3,
      numero: 'FAC-2025-003',
      periodo: 'Marzo 2025',
      monto: 70000,
      fecha_emision: '2025-03-01',
      fecha_vencimiento: '2025-03-15',
      estado: 'pendiente'
    }
  ]);

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'pagada': return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'pendiente': return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'vencida': return 'bg-[#FFEBEE] text-[#F44336]';
      default: return 'bg-gray-100 text-gray-600';
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

        {/* Facturas List */}
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
                      {factura.numero}
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
                  <button className="p-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition">
                    <Eye size={20} />
                  </button>
                  <button className="p-3 bg-[#E3F2FD] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4] hover:text-white transition">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
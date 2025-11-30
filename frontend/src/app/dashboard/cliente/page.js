'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  FileText, CreditCard, Ticket, Calendar, 
  Wifi, TrendingUp, AlertCircle, CheckCircle, Loader2 
} from 'lucide-react';
import { fetchContratos, fetchFacturas, fetchTickets } from '@/lib/api';
import Link from 'next/link';

export default function DashboardCliente() {
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState({
    contrato: null,
    facturasPendientes: 0,
    facturasTotal: 0,
    totalPendiente: 0,
    proximoVencimiento: null,
    ticketsAbiertos: 0,
    ultimasFacturas: []
  });

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Cargar datos en paralelo
      const [contrato, facturas, tickets] = await Promise.all([
        fetchContratos(token),
        fetchFacturas(token),
        fetchTickets(token)
      ]);

      // Procesar facturas
      const facturasPendientes = facturas.filter(f => f.estado === 'pendiente');
      const totalPendiente = facturasPendientes.reduce((sum, f) => sum + parseFloat(f.monto), 0);
      
      // Encontrar próximo vencimiento
      const proximoVencimiento = facturasPendientes.length > 0
        ? facturasPendientes.sort((a, b) => 
            new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento)
          )[0]
        : null;

      // Contar tickets abiertos
      const ticketsAbiertos = tickets.filter(t => t.estado === 'abierto' || t.estado === 'en_proceso').length;

      setResumen({
        contrato,
        facturasPendientes: facturasPendientes.length,
        facturasTotal: facturas.length,
        totalPendiente,
        proximoVencimiento,
        ticketsAbiertos,
        ultimasFacturas: facturas.slice(0, 3)
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-[#212121]">Panel Principal</h1>
          <p className="text-[#757575] mt-1">Resumen de tu cuenta</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Contrato Activo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                <Wifi className="text-[#00BCD4]" size={24} />
              </div>
              <span className="px-3 py-1 bg-[#E8F5E9] text-[#4CAF50] rounded-full text-xs font-semibold">
                Activo
              </span>
            </div>
            <p className="text-[#757575] text-sm mb-1">Mi Plan</p>
            <p className="text-2xl font-bold text-[#212121]">
              {resumen.contrato?.plan_detalle?.nombre || 'No disponible'}
            </p>
            <p className="text-[#757575] text-sm mt-2">
              {resumen.contrato?.plan_detalle?.velocidad_bajada} Mbps
            </p>
          </motion.div>

          {/* Facturas Pendientes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FFF3E0] rounded-xl flex items-center justify-center">
                <FileText className="text-[#FF9800]" size={24} />
              </div>
              {resumen.facturasPendientes > 0 && (
                <AlertCircle className="text-[#FF9800]" size={20} />
              )}
            </div>
            <p className="text-[#757575] text-sm mb-1">Facturas Pendientes</p>
            <p className="text-2xl font-bold text-[#212121]">
              {resumen.facturasPendientes}
            </p>
            <p className="text-[#757575] text-sm mt-2">
              de {resumen.facturasTotal} total
            </p>
          </motion.div>

          {/* Total a Pagar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                <CreditCard className="text-[#00BCD4]" size={24} />
              </div>
            </div>
            <p className="text-[#757575] text-sm mb-1">Total a Pagar</p>
            <p className="text-2xl font-bold text-[#00BCD4]">
              ${resumen.totalPendiente.toLocaleString()}
            </p>
            <Link 
              href="/dashboard/cliente/pagos"
              className="text-[#00BCD4] text-sm mt-2 inline-block hover:underline"
            >
              Realizar pago →
            </Link>
          </motion.div>

          {/* Tickets Abiertos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                <Ticket className="text-[#4CAF50]" size={24} />
              </div>
            </div>
            <p className="text-[#757575] text-sm mb-1">Tickets Activos</p>
            <p className="text-2xl font-bold text-[#212121]">
              {resumen.ticketsAbiertos}
            </p>
            <Link 
              href="/dashboard/cliente/tickets"
              className="text-[#00BCD4] text-sm mt-2 inline-block hover:underline"
            >
              Ver tickets →
            </Link>
          </motion.div>
        </div>

        {/* Próximo Vencimiento */}
        {resumen.proximoVencimiento && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-[#FF9800] to-[#FF6F00] p-6 rounded-2xl shadow-sm text-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar size={32} />
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-sm mb-1">Próximo Vencimiento</p>
                <p className="text-2xl font-bold">
                  {new Date(resumen.proximoVencimiento.fecha_vencimiento).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-white/90 mt-2">
                  Factura {resumen.proximoVencimiento.numero_factura} - ${parseFloat(resumen.proximoVencimiento.monto).toLocaleString()}
                </p>
              </div>
              <Link
                href="/dashboard/cliente/pagos"
                className="px-6 py-3 bg-white text-[#FF9800] rounded-full hover:bg-gray-100 transition font-semibold"
              >
                Pagar Ahora
              </Link>
            </div>
          </motion.div>
        )}

        {/* Accesos Rápidos */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Últimas Facturas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#212121]">Últimas Facturas</h3>
              <Link 
                href="/dashboard/cliente/facturas"
                className="text-[#00BCD4] text-sm hover:underline"
              >
                Ver todas →
              </Link>
            </div>
            <div className="space-y-3">
              {resumen.ultimasFacturas.length > 0 ? (
                resumen.ultimasFacturas.map((factura) => (
                  <div 
                    key={factura.id}
                    className="flex items-center justify-between p-3 border-2 border-gray-100 rounded-xl hover:border-[#00BCD4] transition"
                  >
                    <div>
                      <p className="font-semibold text-[#212121]">{factura.numero_factura}</p>
                      <p className="text-sm text-[#757575]">{factura.periodo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#00BCD4]">${parseFloat(factura.monto).toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        factura.estado === 'pendiente' 
                          ? 'bg-[#FFF3E0] text-[#FF9800]' 
                          : 'bg-[#E8F5E9] text-[#4CAF50]'
                      }`}>
                        {factura.estado === 'pendiente' ? 'Pendiente' : 'Pagada'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[#757575] py-4">No hay facturas</p>
              )}
            </div>
          </motion.div>

          {/* Acciones Rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link href="/dashboard/cliente/contrato">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 bg-[#E3F2FD] rounded-xl cursor-pointer hover:bg-[#00BCD4] hover:text-white transition group"
                >
                  <FileText className="text-[#00BCD4] group-hover:text-white" size={24} />
                  <div>
                    <p className="font-semibold text-[#212121] group-hover:text-white">Ver Mi Contrato</p>
                    <p className="text-sm text-[#757575] group-hover:text-white/80">Detalles de tu plan</p>
                  </div>
                </motion.div>
              </Link>

              <Link href="/dashboard/cliente/tickets">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 bg-[#E3F2FD] rounded-xl cursor-pointer hover:bg-[#00BCD4] hover:text-white transition group"
                >
                  <Ticket className="text-[#00BCD4] group-hover:text-white" size={24} />
                  <div>
                    <p className="font-semibold text-[#212121] group-hover:text-white">Crear Ticket</p>
                    <p className="text-sm text-[#757575] group-hover:text-white/80">Solicita soporte técnico</p>
                  </div>
                </motion.div>
              </Link>

              <Link href="/dashboard/cliente/chat">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 bg-[#E3F2FD] rounded-xl cursor-pointer hover:bg-[#00BCD4] hover:text-white transition group"
                >
                  <CheckCircle className="text-[#00BCD4] group-hover:text-white" size={24} />
                  <div>
                    <p className="font-semibold text-[#212121] group-hover:text-white">Asistente IA</p>
                    <p className="text-sm text-[#757575] group-hover:text-white/80">Ayuda instantánea</p>
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
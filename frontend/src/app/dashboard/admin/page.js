'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { 
  Users, FileText, CreditCard, Ticket, 
  TrendingUp, DollarSign, AlertCircle, Loader2 
} from 'lucide-react';
import { fetchUsuarios, fetchContratos, fetchFacturas, fetchTickets } from '@/lib/api';

export default function DashboardAdmin() {
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalClientes: 0,
    totalContratos: 0,
    totalFacturas: 0,
    facturasPendientes: 0,
    totalPendiente: 0,
    ticketsAbiertos: 0,
    ticketsTotal: 0,
    ingresosDelMes: 0
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Cargar todos los datos
      const [usuarios, contratos, facturas, tickets] = await Promise.all([
        fetchUsuarios(token),
        fetch('https://86.48.21.76/infiber/api/contratos/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(r => r.json()),
        fetch('https://86.48.21.76/infiber/api/facturas/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(r => r.json()),
        fetch('https://86.48.21.76/infiber/api/tickets/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(r => r.json())
      ]);

      // Calcular estadísticas
      const clientes = usuarios.filter(u => u.rol === 'cliente');
      const facturasPendientes = facturas.filter(f => f.estado === 'pendiente');
      const totalPendiente = facturasPendientes.reduce((sum, f) => sum + parseFloat(f.monto), 0);
      const ticketsAbiertos = tickets.filter(t => t.estado === 'abierto' || t.estado === 'en_proceso');
      
      // Facturas del mes actual
      const mesActual = new Date().getMonth();
      const facturasMes = facturas.filter(f => {
        const fechaFactura = new Date(f.fecha_emision);
        return fechaFactura.getMonth() === mesActual && f.estado === 'pagada';
      });
      const ingresosDelMes = facturasMes.reduce((sum, f) => sum + parseFloat(f.monto), 0);

      setEstadisticas({
        totalClientes: clientes.length,
        totalContratos: contratos.length,
        totalFacturas: facturas.length,
        facturasPendientes: facturasPendientes.length,
        totalPendiente,
        ticketsAbiertos: ticketsAbiertos.length,
        ticketsTotal: tickets.length,
        ingresosDelMes
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">Panel de Administración</h1>
          <p className="text-[#757575] mt-1">Resumen general del sistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Clientes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                <Users className="text-[#00BCD4]" size={24} />
              </div>
            </div>
            <p className="text-[#757575] text-sm mb-1">Total Clientes</p>
            <p className="text-3xl font-bold text-[#212121]">{estadisticas.totalClientes}</p>
            <p className="text-[#757575] text-sm mt-2">{estadisticas.totalContratos} contratos activos</p>
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
              {estadisticas.facturasPendientes > 0 && (
                <AlertCircle className="text-[#FF9800]" size={20} />
              )}
            </div>
            <p className="text-[#757575] text-sm mb-1">Facturas Pendientes</p>
            <p className="text-3xl font-bold text-[#212121]">{estadisticas.facturasPendientes}</p>
            <p className="text-[#757575] text-sm mt-2">de {estadisticas.totalFacturas} total</p>
          </motion.div>

          {/* Por Cobrar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FFEBEE] rounded-xl flex items-center justify-center">
                <DollarSign className="text-[#F44336]" size={24} />
              </div>
            </div>
            <p className="text-[#757575] text-sm mb-1">Por Cobrar</p>
            <p className="text-3xl font-bold text-[#F44336]">
              ${estadisticas.totalPendiente.toLocaleString()}
            </p>
            <p className="text-[#757575] text-sm mt-2">Facturas pendientes</p>
          </motion.div>

          {/* Ingresos del Mes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                <TrendingUp className="text-[#4CAF50]" size={24} />
              </div>
            </div>
            <p className="text-[#757575] text-sm mb-1">Ingresos del Mes</p>
            <p className="text-3xl font-bold text-[#4CAF50]">
              ${estadisticas.ingresosDelMes.toLocaleString()}
            </p>
            <p className="text-[#757575] text-sm mt-2">Facturas pagadas</p>
          </motion.div>
        </div>

        {/* Tickets Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] p-6 rounded-2xl shadow-sm text-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Ticket size={32} />
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Tickets Activos</p>
                <p className="text-4xl font-bold">{estadisticas.ticketsAbiertos}</p>
                <p className="text-white/90 mt-1">de {estadisticas.ticketsTotal} total</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-4">Accesos Rápidos</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="/dashboard/admin/clientes" className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-center">
                <Users className="mx-auto mb-2" size={24} />
                <p className="font-semibold text-sm">Clientes</p>
              </a>
              <a href="/dashboard/admin/contratos" className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-center">
                <FileText className="mx-auto mb-2" size={24} />
                <p className="font-semibold text-sm">Contratos</p>
              </a>
              <a href="/dashboard/admin/facturas" className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-center">
                <CreditCard className="mx-auto mb-2" size={24} />
                <p className="font-semibold text-sm">Facturas</p>
              </a>
              <a href="/dashboard/admin/tickets" className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-center">
                <Ticket className="mx-auto mb-2" size={24} />
                <p className="font-semibold text-sm">Tickets</p>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
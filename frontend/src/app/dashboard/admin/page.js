'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { 
  Users, 
  FileText, 
  DollarSign, 
  AlertCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Ticket,
  CreditCard,
  Loader2
} from 'lucide-react';
import { fetchEstadisticas } from '@/lib/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardAdmin() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const data = await fetchEstadisticas();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin text-[#00BCD4]" size={48} />
        </div>
      </AdminLayout>
    );
  }

  if (!estadisticas) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-[#757575]">Error al cargar estadísticas</p>
        </div>
      </AdminLayout>
    );
  }

  const COLORS = ['#00BCD4', '#FF6B6B', '#4ECDC4', '#FFE66D'];

  // Datos para gráfica de tickets
  const ticketsData = [
    { name: 'Abiertos', value: estadisticas.tickets.abiertos },
    { name: 'En Proceso', value: estadisticas.tickets.en_proceso },
    { name: 'Resueltos', value: estadisticas.tickets.resueltos },
    { name: 'Cerrados', value: estadisticas.tickets.cerrados },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">Panel de Administración</h1>
          <p className="text-[#757575] mt-1">Vista general de la plataforma Infiber ISP</p>
        </div>

        {/* Cards de Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Clientes */}
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
            <p className="text-3xl font-bold text-[#212121]">
              {estadisticas.clientes.total}
            </p>
            <p className="text-green-600 text-sm mt-2">
              {estadisticas.clientes.activos} activos
            </p>
          </motion.div>

          {/* Contratos Activos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-[#757575] text-sm mb-1">Contratos Activos</p>
            <p className="text-3xl font-bold text-[#212121]">
              {estadisticas.contratos.activos}
            </p>
            <p className="text-[#757575] text-sm mt-2">
              {estadisticas.contratos.suspendidos} suspendidos
            </p>
          </motion.div>

          {/* Por Cobrar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-orange-600" size={24} />
              </div>
              {estadisticas.facturas.pendientes > 0 && (
                <AlertCircle className="text-orange-600" size={20} />
              )}
            </div>
            <p className="text-[#757575] text-sm mb-1">Por Cobrar</p>
            <p className="text-3xl font-bold text-orange-600">
              ${estadisticas.facturas.total_por_cobrar.toLocaleString()}
            </p>
            <p className="text-[#757575] text-sm mt-2">
              {estadisticas.facturas.pendientes} facturas pendientes
            </p>
          </motion.div>

          {/* Tickets Abiertos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-[#757575] text-sm mb-1">Tickets Abiertos</p>
            <p className="text-3xl font-bold text-[#212121]">
              {estadisticas.tickets.abiertos}
            </p>
            <p className="text-[#757575] text-sm mt-2">
              {estadisticas.tickets.en_proceso} en proceso
            </p>
          </motion.div>
        </div>

        {/* Ingresos del Mes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] p-6 rounded-2xl shadow-sm text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Ingresos del Mes</p>
              <p className="text-4xl font-bold">${estadisticas.pagos.mes_actual.toLocaleString()}</p>
              <p className="text-white/90 mt-1">Total recaudado: ${estadisticas.pagos.total_recaudado.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos Mensuales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-lg font-bold text-[#212121] mb-4">Ingresos Mensuales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={estadisticas.ingresos_mensuales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke="#00BCD4" 
                  strokeWidth={3}
                  name="Ingresos"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Estado de Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-lg font-bold text-[#212121] mb-4">Estado de Tickets</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ticketsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Tickets por Tipo y Estado de Contratos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets por Tipo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-lg font-bold text-[#212121] mb-4">Tickets por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadisticas.tickets_por_tipo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#00BCD4" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Estado de Contratos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
          >
            <h3 className="text-lg font-bold text-[#212121] mb-4">Estado de Contratos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={24} />
                  <div>
                    <p className="font-semibold text-[#212121]">Activos</p>
                    <p className="text-sm text-[#757575]">Contratos en servicio</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {estadisticas.contratos.activos}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="text-orange-600" size={24} />
                  <div>
                    <p className="font-semibold text-[#212121]">Suspendidos</p>
                    <p className="text-sm text-[#757575]">Servicio pausado</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {estadisticas.contratos.suspendidos}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <XCircle className="text-red-600" size={24} />
                  <div>
                    <p className="font-semibold text-[#212121]">Cancelados</p>
                    <p className="text-sm text-[#757575]">Servicio terminado</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {estadisticas.contratos.cancelados}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Accesos Rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100"
        >
          <h3 className="text-xl font-bold text-[#212121] mb-4">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/dashboard/admin/clientes" className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-center group">
              <Users className="mx-auto mb-2 group-hover:text-white text-[#00BCD4]" size={24} />
              <p className="font-semibold text-sm">Clientes</p>
            </a>
            <a href="/dashboard/admin/contratos" className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-center group">
              <FileText className="mx-auto mb-2 group-hover:text-white text-[#00BCD4]" size={24} />
              <p className="font-semibold text-sm">Contratos</p>
            </a>
            <a href="/dashboard/admin/facturas" className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-center group">
              <CreditCard className="mx-auto mb-2 group-hover:text-white text-[#00BCD4]" size={24} />
              <p className="font-semibold text-sm">Facturas</p>
            </a>
            <a href="/dashboard/admin/tickets" className="p-4 bg-[#E3F2FD] rounded-xl hover:bg-[#00BCD4] hover:text-white transition text-center group">
              <Ticket className="mx-auto mb-2 group-hover:text-white text-[#00BCD4]" size={24} />
              <p className="font-semibold text-sm">Tickets</p>
            </a>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
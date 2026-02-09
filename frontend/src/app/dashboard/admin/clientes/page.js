'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { 
  Search, Eye, Edit, Loader2, Phone, Mail, MapPin, CreditCard,
  UserPlus, Shield, ShieldOff, History, FileText, Ticket,
  DollarSign, TrendingUp, X, AlertCircle, CheckCircle
} from 'lucide-react';
import { fetchUsuarios } from '@/lib/api';

export default function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Modal de detalles
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [historial, setHistorial] = useState(null);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  
  // Modal de crear/editar
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [enviando, setEnviando] = useState(false);
  
  // Modal de bloqueo
  const [mostrarModalBloqueo, setMostrarModalBloqueo] = useState(false);
  const [motivoBloqueo, setMotivoBloqueo] = useState('');
  const [bloqueando, setBloqueando] = useState(false);
  
  // Formulario
  const [formulario, setFormulario] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    telefono: '',
    cedula: '',
    direccion: '',
    rol: 'cliente'
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const usuarios = await fetchUsuarios(token);
      
      // Filtrar solo clientes
      const soloClientes = usuarios.filter(u => u.rol === 'cliente');
      setClientes(soloClientes);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorial = async (clienteId) => {
    setLoadingHistorial(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://infiber.online/infiber/api/usuarios/${clienteId}/historial/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar historial');
      
      const data = await response.json();
      setHistorial(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el historial del cliente');
    } finally {
      setLoadingHistorial(false);
    }
  };

  const verDetalles = async (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModal(true);
    await cargarHistorial(cliente.id);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setFormulario({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      telefono: '',
      cedula: '',
      direccion: '',
      rol: 'cliente'
    });
    setMostrarModalCrear(true);
  };

  const abrirModalEditar = (cliente) => {
    setModoEdicion(true);
    setFormulario({
      username: cliente.username,
      email: cliente.email || '',
      password: '',
      first_name: cliente.first_name || '',
      last_name: cliente.last_name || '',
      telefono: cliente.telefono || '',
      cedula: cliente.cedula || '',
      direccion: cliente.direccion || '',
      rol: cliente.rol
    });
    setClienteSeleccionado(cliente);
    setMostrarModalCrear(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const token = localStorage.getItem('access_token');
      const url = modoEdicion 
        ? `https://infiber.online/infiber/api/usuarios/${clienteSeleccionado.id}/`
        : 'https://infiber.online/infiber/api/usuarios/';
      
      const method = modoEdicion ? 'PATCH' : 'POST';
      
      // Si es edición y no hay password, no enviarlo
      const body = { ...formulario };
      if (modoEdicion && !body.password) {
        delete body.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      alert(modoEdicion ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
      setMostrarModalCrear(false);
      cargarClientes();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el cliente');
    } finally {
      setEnviando(false);
    }
  };

  const handleBloquear = async () => {
    if (!motivoBloqueo.trim()) {
      alert('Debes especificar un motivo de bloqueo');
      return;
    }

    setBloqueando(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://infiber.online/infiber/api/usuarios/${clienteSeleccionado.id}/bloquear/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ motivo: motivoBloqueo })
      });

      if (!response.ok) throw new Error('Error al bloquear usuario');

      alert('Usuario bloqueado exitosamente');
      setMostrarModalBloqueo(false);
      setMostrarModal(false);
      setMotivoBloqueo('');
      cargarClientes();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al bloquear el usuario');
    } finally {
      setBloqueando(false);
    }
  };

  const handleDesbloquear = async () => {
    if (!confirm('¿Estás seguro de desbloquear este usuario?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://infiber.online/infiber/api/usuarios/${clienteSeleccionado.id}/desbloquear/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al desbloquear usuario');

      alert('Usuario desbloqueado exitosamente');
      setMostrarModal(false);
      cargarClientes();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al desbloquear el usuario');
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const searchTerm = busqueda.toLowerCase();
    return (
      cliente.first_name?.toLowerCase().includes(searchTerm) ||
      cliente.last_name?.toLowerCase().includes(searchTerm) ||
      cliente.username?.toLowerCase().includes(searchTerm) ||
      cliente.email?.toLowerCase().includes(searchTerm) ||
      cliente.cedula?.toLowerCase().includes(searchTerm)
    );
  });

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#212121]">Gestión de Clientes</h1>
            <p className="text-[#757575] mt-1">
              {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''} registrado{clientesFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={abrirModalCrear}
            className="bg-[#00BCD4] text-white px-6 py-3 rounded-full hover:bg-[#00ACC1] transition font-semibold flex items-center gap-2"
          >
            <UserPlus size={20} />
            Nuevo Cliente
          </motion.button>
        </div>

        {/* Búsqueda */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#757575]" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, email, cédula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
            />
          </div>
        </div>

        {/* Tabla de Clientes */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E3F2FD]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Teléfono</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#212121]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#757575]">
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente, index) => (
                    <motion.tr
                      key={cliente.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${cliente.bloqueado ? 'bg-[#F44336]' : 'bg-[#00BCD4]'} rounded-full flex items-center justify-center text-white font-semibold`}>
                            {cliente.first_name?.[0] || cliente.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#212121]">
                              {cliente.first_name} {cliente.last_name}
                            </p>
                            <p className="text-sm text-[#757575]">@{cliente.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#212121]">{cliente.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-[#212121]">{cliente.telefono || 'N/A'}</td>
                      <td className="px-6 py-4">
                        {cliente.bloqueado ? (
                          <span className="px-3 py-1 bg-[#FFEBEE] text-[#F44336] rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                            <ShieldOff size={14} />
                            Bloqueado
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-[#E8F5E9] text-[#4CAF50] rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                            <CheckCircle size={14} />
                            Activo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => verDetalles(cliente)}
                          className="p-2 bg-[#E3F2FD] text-[#00BCD4] rounded-lg hover:bg-[#00BCD4] hover:text-white transition"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => abrirModalEditar(cliente)}
                          className="p-2 bg-[#FFF3E0] text-[#FF9800] rounded-lg hover:bg-[#FF9800] hover:text-white transition"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Detalles e Historial */}
        <AnimatePresence>
          {mostrarModal && clienteSeleccionado && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-8"
              >
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${clienteSeleccionado.bloqueado ? 'bg-[#F44336]' : 'bg-[#00BCD4]'} rounded-full flex items-center justify-center text-white text-2xl font-semibold`}>
                      {clienteSeleccionado.first_name?.[0] || clienteSeleccionado.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#212121]">
                        {clienteSeleccionado.first_name} {clienteSeleccionado.last_name}
                      </h2>
                      <p className="text-[#757575]">@{clienteSeleccionado.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="text-[#757575] hover:text-[#212121] p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Estado de bloqueo */}
                  {clienteSeleccionado.bloqueado && (
                    <div className="p-4 bg-[#FFEBEE] border-2 border-[#F44336] rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldOff className="text-[#F44336]" size={24} />
                        <p className="font-bold text-[#F44336]">Usuario Bloqueado</p>
                      </div>
                      <p className="text-[#212121] mb-2">
                        <span className="font-semibold">Motivo:</span> {clienteSeleccionado.motivo_bloqueo}
                      </p>
                      <p className="text-sm text-[#757575]">
                        Bloqueado el: {new Date(clienteSeleccionado.fecha_bloqueo).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  )}

                  {/* Información de Contacto */}
                  <div>
                    <h3 className="text-xl font-bold text-[#212121] mb-4">Información de Contacto</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#E3F2FD] rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="text-[#00BCD4]" size={20} />
                          <p className="font-semibold text-[#212121]">Email</p>
                        </div>
                        <p className="text-[#757575]">{clienteSeleccionado.email || 'No registrado'}</p>
                      </div>

                      <div className="p-4 bg-[#E3F2FD] rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="text-[#00BCD4]" size={20} />
                          <p className="font-semibold text-[#212121]">Teléfono</p>
                        </div>
                        <p className="text-[#757575]">{clienteSeleccionado.telefono || 'No registrado'}</p>
                      </div>

                      <div className="p-4 bg-[#E3F2FD] rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <CreditCard className="text-[#00BCD4]" size={20} />
                          <p className="font-semibold text-[#212121]">Cédula</p>
                        </div>
                        <p className="text-[#757575]">{clienteSeleccionado.cedula || 'No registrada'}</p>
                      </div>

                      <div className="p-4 bg-[#E3F2FD] rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin className="text-[#00BCD4]" size={20} />
                          <p className="font-semibold text-[#212121]">Dirección</p>
                        </div>
                        <p className="text-[#757575]">{clienteSeleccionado.direccion || 'No registrada'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Historial y Estadísticas */}
                  {loadingHistorial ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="animate-spin text-[#00BCD4]" size={48} />
                    </div>
                  ) : historial && (
                    <>
                      {/* Estadísticas */}
                      <div>
                        <h3 className="text-xl font-bold text-[#212121] mb-4 flex items-center gap-2">
                          <TrendingUp size={24} />
                          Estadísticas
                        </h3>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="p-4 bg-[#E3F2FD] rounded-xl text-center">
                            <FileText className="mx-auto text-[#00BCD4] mb-2" size={32} />
                            <p className="text-2xl font-bold text-[#00BCD4]">{historial.estadisticas.total_contratos}</p>
                            <p className="text-sm text-[#757575]">Contratos</p>
                          </div>
                          <div className="p-4 bg-[#FFF3E0] rounded-xl text-center">
                            <DollarSign className="mx-auto text-[#FF9800] mb-2" size={32} />
                            <p className="text-2xl font-bold text-[#FF9800]">${historial.estadisticas.total_pagado.toLocaleString()}</p>
                            <p className="text-sm text-[#757575]">Total Pagado</p>
                          </div>
                          <div className="p-4 bg-[#FFEBEE] rounded-xl text-center">
                            <AlertCircle className="mx-auto text-[#F44336] mb-2" size={32} />
                            <p className="text-2xl font-bold text-[#F44336]">{historial.estadisticas.facturas_pendientes}</p>
                            <p className="text-sm text-[#757575]">Facturas Pendientes</p>
                          </div>
                          <div className="p-4 bg-[#E8F5E9] rounded-xl text-center">
                            <Ticket className="mx-auto text-[#4CAF50] mb-2" size={32} />
                            <p className="text-2xl font-bold text-[#4CAF50]">{historial.estadisticas.total_tickets}</p>
                            <p className="text-sm text-[#757575]">Tickets</p>
                          </div>
                        </div>
                      </div>

                      {/* Historial de Actividad */}
                      <div>
                        <h3 className="text-xl font-bold text-[#212121] mb-4 flex items-center gap-2">
                          <History size={24} />
                          Actividad Reciente
                        </h3>
                        
                        {/* Tickets Recientes */}
                        {historial.tickets.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-[#212121] mb-2">Últimos Tickets</h4>
                            <div className="space-y-2">
                              {historial.tickets.slice(0, 3).map(ticket => (
                                <div key={ticket.id} className="p-3 bg-[#F5F5F5] rounded-lg">
                                  <p className="font-semibold text-[#212121]">#{ticket.id} - {ticket.asunto}</p>
                                  <p className="text-sm text-[#757575]">
                                    Estado: {ticket.estado} | {new Date(ticket.creado).toLocaleDateString('es-CO')}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Facturas Recientes */}
                        {historial.facturas.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-[#212121] mb-2">Últimas Facturas</h4>
                            <div className="space-y-2">
                              {historial.facturas.slice(0, 3).map(factura => (
                                <div key={factura.id} className="p-3 bg-[#F5F5F5] rounded-lg flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold text-[#212121]">{factura.numero_factura}</p>
                                    <p className="text-sm text-[#757575]">
                                      {factura.periodo} | {factura.estado}
                                    </p>
                                  </div>
                                  <p className="font-bold text-[#00BCD4]">${parseFloat(factura.monto).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => abrirModalEditar(clienteSeleccionado)}
                      className="flex-1 bg-[#FF9800] text-white py-3 rounded-full hover:bg-[#F57C00] transition font-semibold flex items-center justify-center gap-2"
                    >
                      <Edit size={20} />
                      Editar Información
                    </button>
                    
                    {clienteSeleccionado.bloqueado ? (
                      <button
                        onClick={handleDesbloquear}
                        className="flex-1 bg-[#4CAF50] text-white py-3 rounded-full hover:bg-[#388E3C] transition font-semibold flex items-center justify-center gap-2"
                      >
                        <Shield size={20} />
                        Desbloquear Usuario
                      </button>
                    ) : (
                      <button
                        onClick={() => setMostrarModalBloqueo(true)}
                        className="flex-1 bg-[#F44336] text-white py-3 rounded-full hover:bg-[#D32F2F] transition font-semibold flex items-center justify-center gap-2"
                      >
                        <ShieldOff size={20} />
                        Bloquear Usuario
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal de Crear/Editar */}
        <AnimatePresence>
          {mostrarModalCrear && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#212121]">
                      {modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h2>
                    <button
                      onClick={() => setMostrarModalCrear(false)}
                      className="text-[#757575] hover:text-[#212121] p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#212121] font-semibold mb-2">
                        Usuario <span className="text-[#F44336]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formulario.username}
                        onChange={(e) => setFormulario({...formulario, username: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                        required
                        disabled={modoEdicion || enviando}
                      />
                    </div>

                    <div>
                      <label className="block text-[#212121] font-semibold mb-2">
                        Email {!modoEdicion && <span className="text-[#F44336]">*</span>}
                      </label>
                      <input
                        type="email"
                        value={formulario.email}
                        onChange={(e) => setFormulario({...formulario, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                        required={!modoEdicion}
                        disabled={enviando}
                      />
                    </div>

                    <div>
                      <label className="block text-[#212121] font-semibold mb-2">
                        Contraseña {!modoEdicion && <span className="text-[#F44336]">*</span>}
                        {modoEdicion && <span className="text-sm text-[#757575]"> (dejar vacío para no cambiar)</span>}
                      </label>
                      <input
                        type="password"
                        value={formulario.password}
                        onChange={(e) => setFormulario({...formulario, password: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                        required={!modoEdicion}
                        disabled={enviando}
                      />
                    </div>

                    <div>
                      <label className="block text-[#212121] font-semibold mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={formulario.first_name}
                        onChange={(e) => setFormulario({...formulario, first_name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                        disabled={enviando}
                      />
                    </div>

                    <div>
                      <label className="block text-[#212121] font-semibold mb-2">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={formulario.last_name}
                        onChange={(e) => setFormulario({...formulario, last_name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                        disabled={enviando}
                      />
                    </div>

                    <div>
                      <label className="block text-[#212121] font-semibold mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formulario.telefono}
                        onChange={(e) => setFormulario({...formulario, telefono: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                        disabled={enviando}
                      />
                    </div>

                    <div>
                      <label className="block text-[#212121] font-semibold mb-2">
                        Cédula
                      </label>
                      <input
                        type="text"
                        value={formulario.cedula}
                        onChange={(e) => setFormulario({...formulario, cedula: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121]"
                        disabled={enviando}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[#212121] font-semibold mb-2">
                        Dirección
                      </label>
                      <textarea
                        value={formulario.direccion}
                        onChange={(e) => setFormulario({...formulario, direccion: e.target.value})}
                        rows="2"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BCD4] focus:outline-none transition text-[#212121] resize-none"
                        disabled={enviando}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
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
                          Guardando...
                        </>
                      ) : (
                        modoEdicion ? 'Actualizar Cliente' : 'Crear Cliente'
                      )}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setMostrarModalCrear(false)}
                      disabled={enviando}
                      className="flex-1 border-2 border-gray-300 text-[#757575] py-3 rounded-full hover:border-[#00BCD4] hover:text-[#00BCD4] transition font-semibold disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal de Bloqueo */}
        <AnimatePresence>
          {mostrarModalBloqueo && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#FFEBEE] rounded-full flex items-center justify-center">
                    <ShieldOff className="text-[#F44336]" size={32} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#212121] text-center mb-4">
                  Bloquear Usuario
                </h2>

                <p className="text-[#757575] text-center mb-6">
                  Por favor, especifica el motivo del bloqueo. Esta acción impedirá que el usuario acceda al sistema.
                </p>

                <textarea
                  value={motivoBloqueo}
                  onChange={(e) => setMotivoBloqueo(e.target.value)}
                  placeholder="Ejemplo: Uso inadecuado del sistema, comentarios ofensivos..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F44336] focus:outline-none transition text-[#212121] resize-none mb-6"
                  disabled={bloqueando}
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleBloquear}
                    disabled={bloqueando}
                    className="flex-1 bg-[#F44336] text-white py-3 rounded-full hover:bg-[#D32F2F] transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {bloqueando ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Bloqueando...
                      </>
                    ) : (
                      <>
                        <ShieldOff size={20} />
                        Confirmar Bloqueo
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setMostrarModalBloqueo(false);
                      setMotivoBloqueo('');
                    }}
                    disabled={bloqueando}
                    className="flex-1 border-2 border-gray-300 text-[#757575] py-3 rounded-full hover:border-[#00BCD4] hover:text-[#00BCD4] transition font-semibold disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
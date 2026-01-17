const API_URL = 'https://86.48.21.76/infiber/api';

// ============ AUTENTICACIÓN ============
export const login = async (username, password) => {
  console.log('🔐 Intentando login...');
  
  const response = await fetch(`${API_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  console.log('📥 Respuesta token:', response.status);
  
  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }
  
  const data = await response.json();
  console.log('✅ Tokens obtenidos');
  
  // Guardar tokens
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  }
  
  // Verificar si el usuario está bloqueado haciendo una petición de prueba
  console.log('🔍 Verificando bloqueo...');
  try {
    const testResponse = await fetch(`${API_URL}/usuarios/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.access}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📥 Respuesta verificación:', testResponse.status);
    
    if (testResponse.status === 403) {
      const bloqueadoData = await testResponse.json();
      console.log('⚠️ Respuesta 403:', bloqueadoData);
      
      if (bloqueadoData.bloqueado) {
        console.log('🚫 Usuario bloqueado detectado!');
        // Usuario bloqueado, guardar info y lanzar error especial
        if (typeof window !== 'undefined') {
          localStorage.setItem('usuario_bloqueado', JSON.stringify(bloqueadoData));
          // Limpiar tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        throw new Error('USUARIO_BLOQUEADO');
      }
    }
  } catch (error) {
    console.log('❌ Error en verificación:', error.message);
    if (error.message === 'USUARIO_BLOQUEADO') {
      throw error;
    }
    // Si falla la verificación, continuar normalmente
  }
  
  console.log('✅ Login completado sin bloqueo');
  return data;
};

// Refresh token automático
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) throw new Error('No refresh token');

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    // Si el refresh token también expiró, cerrar sesión
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
};

// Helper para hacer peticiones con auto-refresh

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // Verificar si es usuario bloqueado
  if (response.status === 403) {
    try {
      const data = await response.json();
      if (data.bloqueado) {
        // Guardar info del bloqueo para mostrar
        if (typeof window !== 'undefined') {
          localStorage.setItem('usuario_bloqueado', JSON.stringify(data));
          window.location.href = '/bloqueado';
        }
        throw new Error('Usuario bloqueado');
      }
    } catch (error) {
      // Si no es JSON o no tiene campo bloqueado, continuar con el flujo normal
      if (error.message !== 'Usuario bloqueado') {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
  }

  // Si el token expiró (401), intentar refrescar
  if (response.status === 401) {
    try {
      const newToken = await refreshToken();
      
      // Reintentar la petición con el nuevo token
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      return retryResponse;
    } catch (error) {
      throw error;
    }
  }

  return response;
};

export const registrarUsuario = async (userData) => {
  const response = await fetch(`${API_URL}/usuarios/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  return response.json();
};

// ============ PLANES ============
export const fetchPlanes = async () => {
  const response = await fetch(`${API_URL}/planes/`);
  if (!response.ok) throw new Error('Error al cargar planes');
  return response.json();
};

// ============ TICKETS ============
export const fetchTickets = async (token) => {
  const response = await fetchWithAuth(`${API_URL}/tickets/`);
  if (!response.ok) throw new Error('Error al cargar tickets');
  return response.json();
};

export const crearTicket = async (token, ticketData) => {
  const userId = localStorage.getItem('user_id');
  
  const response = await fetchWithAuth(`${API_URL}/tickets/`, {
    method: 'POST',
    body: JSON.stringify({
      ...ticketData,
      cliente: userId
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error del servidor:', errorData);
    throw new Error(JSON.stringify(errorData));
  }
  
  return response.json();
};

export const actualizarTicket = async (token, ticketId, ticketData) => {
  const response = await fetchWithAuth(`${API_URL}/tickets/${ticketId}/`, {
    method: 'PATCH',
    body: JSON.stringify(ticketData)
  });
  if (!response.ok) throw new Error('Error al actualizar ticket');
  return response.json();
};

// ============ FACTURAS ============
export const fetchFacturas = async (token) => {
  const response = await fetchWithAuth(`${API_URL}/facturas/`);
  if (!response.ok) throw new Error('Error al cargar facturas');
  return response.json();
};

// ============ CONTRATOS ============
export const fetchContratos = async (token) => {
  const response = await fetchWithAuth(`${API_URL}/contratos/`);
  if (!response.ok) throw new Error('Error al cargar contratos');
  const data = await response.json();
  
  // Devolver el primer contrato (asumiendo que el usuario tiene uno)
  return data.length > 0 ? data[0] : null;
};

// ============ PAGOS ============
// ==========================================
// PAGOS
// ==========================================

export const fetchPagos = async () => {
  const response = await fetchWithAuth(`${API_URL}/pagos/`);
  if (!response.ok) throw new Error('Error al cargar pagos');
  return response.json();
};

// ==========================================
// WOMPI - NUEVA INTEGRACIÓN
// ==========================================

export const crearLinkPagoWompi = async (facturaId) => {
  const response = await fetchWithAuth(`${API_URL}/pagos/wompi/crear-link/`, {
    method: 'POST',
    body: JSON.stringify({ factura_id: facturaId })
  });
  if (!response.ok) throw new Error('Error al crear link de pago');
  return response.json();
};

export const consultarEstadoPago = async (transactionId) => {
  const response = await fetchWithAuth(`${API_URL}/pagos/wompi/consultar/${transactionId}/`);
  if (!response.ok) throw new Error('Error al consultar estado del pago');
  return response.json();
};

export const confirmarPagoManual = async (data) => {
  const response = await fetchWithAuth(`${API_URL}/pagos/confirmar-manual/`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al confirmar pago manual');
  return response.json();
};

// ==========================================
// FUNCIONES ANTIGUAS (mantener por compatibilidad)
// ==========================================

export const crearTransaccionWompi = async (token, facturaId) => {
  console.warn('⚠️ crearTransaccionWompi está deprecado, usa crearLinkPagoWompi');
  const response = await fetchWithAuth(`${API_URL}/pagos/wompi/`, {
    method: 'POST',
    body: JSON.stringify({ factura_id: facturaId })
  });
  if (!response.ok) throw new Error('Error al crear transacción Wompi');
  return response.json();
};

export const crearTransaccionPayU = async (token, facturaId) => {
  const response = await fetchWithAuth(`${API_URL}/pagos/payu/`, {
    method: 'POST',
    body: JSON.stringify({ factura_id: facturaId })
  });
  if (!response.ok) throw new Error('Error al crear transacción PayU');
  return response.json();
};

export const confirmarPago = async (token, pagoData) => {
  console.warn('⚠️ confirmarPago está deprecado, usa confirmarPagoManual');
  const response = await fetchWithAuth(`${API_URL}/pagos/confirmar/`, {
    method: 'POST',
    body: JSON.stringify(pagoData)
  });
  if (!response.ok) throw new Error('Error al confirmar pago');
  return response.json();
};

// ============ USUARIOS ============
export const fetchUsuarios = async (token) => {
  const response = await fetchWithAuth(`${API_URL}/usuarios/`);
  if (!response.ok) throw new Error('Error al cargar usuarios');
  return response.json();
};

export const fetchUsuario = async (token, userId) => {
  const response = await fetchWithAuth(`${API_URL}/usuarios/${userId}/`);
  if (!response.ok) throw new Error('Error al cargar usuario');
  return response.json();
};

export const actualizarUsuario = async (token, userId, userData) => {
  const response = await fetchWithAuth(`${API_URL}/usuarios/${userId}/`, {
    method: 'PATCH',
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Error al actualizar usuario');
  return response.json();
};

// ============ CHATBOT ============
export const chat = async (mensaje) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // ✅ AGREGAR ESTA LÍNEA
    },
    body: JSON.stringify({ mensaje }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en el chat');
  }

  return response.json();
};
// ============================================
// RECUPERACIÓN DE CONTRASEÑA
// ============================================

export const solicitarCodigoRecuperacion = async (email) => {
  const response = await fetch(`${API_URL}/password/solicitar-codigo/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al solicitar código');
  }

  return response.json();
};

export const verificarCodigoYResetear = async (email, codigo, nueva_password) => {
  const response = await fetch(`${API_URL}/password/verificar-resetear/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, codigo, nueva_password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al verificar código');
  }

  return response.json();
};

export const cambiarPasswordAutenticado = async (password_actual, nueva_password) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  if (!token) {
    throw new Error('No estás autenticado');
  }
  
  const response = await fetch(`${API_URL}/password/cambiar/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ password_actual, nueva_password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cambiar contraseña');
  }

  return response.json();
};

// ============================================
// GESTIÓN DE CONTRATOS
// ============================================

export const verificarFacturasPendientes = async (contratoId) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/contratos/${contratoId}/verificar-pendientes/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al verificar facturas');
  }

  return response.json();
};



export const cambiarPlanContrato = async (contratoId, nuevoPlanId) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/contratos/${contratoId}/cambiar-plan/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ nuevo_plan_id: nuevoPlanId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cambiar plan');
  }

  return response.json();
};

export const cancelarContrato = async (contratoId) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/contratos/${contratoId}/cancelar/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cancelar contrato');
  }

  return response.json();
};

// ============================================
// DESCARGAR FACTURA PDF
// ============================================

export const descargarFacturaPDF = async (facturaId) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/facturas/${facturaId}/descargar/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al descargar factura');
  }

  // Convertir respuesta a blob para descargar
  const blob = await response.blob();
  return blob;
};

// ============================================
// COMENTARIOS DE TICKETS
// ============================================

export const listarComentarios = async (ticketId) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/tickets/${ticketId}/comentarios/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al cargar comentarios');
  }

  return response.json();
};

export const agregarComentario = async (ticketId, comentario) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/tickets/${ticketId}/comentarios/crear/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ comentario }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al agregar comentario');
  }

  return response.json();
};

// ============================================
// GESTIÓN DE TICKETS (ADMIN)
// ============================================

export const asignarTecnico = async (ticketId, tecnicoId) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/tickets/${ticketId}/asignar-tecnico/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ tecnico_id: tecnicoId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al asignar técnico');
  }

  return response.json();
};

export const cambiarEstadoTicket = async (ticketId, estado) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/tickets/${ticketId}/cambiar-estado/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cambiar estado');
  }

  return response.json();
};

export const cambiarPrioridadTicket = async (ticketId, prioridad) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/tickets/${ticketId}/cambiar-prioridad/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ prioridad }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cambiar prioridad');
  }

  return response.json();
};

export const fetchTecnicos = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_URL}/usuarios/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al cargar técnicos');
  }

  const usuarios = await response.json();
  // Filtrar solo técnicos, admins y superadmins
  return usuarios.filter(u => ['tecnico', 'admin', 'superadmin'].includes(u.rol));
};

// ============================================
// ESTADÍSTICAS DASHBOARD
// ============================================

export const fetchEstadisticas = async () => {
  const response = await fetchWithAuth(`${API_URL}/estadisticas/`);
  if (!response.ok) throw new Error('Error al cargar estadísticas');
  return response.json();
};


const API_URL = 'https://86.48.21.76/infiber/api';

// ============ AUTENTICACIÓN ============
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Credenciales inválidas');
  return response.json();
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
export const fetchPagos = async (token) => {
  const response = await fetchWithAuth(`${API_URL}/pagos/`);
  if (!response.ok) throw new Error('Error al cargar pagos');
  return response.json();
};

export const crearTransaccionWompi = async (token, facturaId) => {
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
  const response = await fetch(`${API_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensaje }),
  });
  if (!response.ok) throw new Error('Error en el chat');
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
  const token = getAuthToken();
  
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
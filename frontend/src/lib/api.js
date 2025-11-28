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
  const response = await fetch(`${API_URL}/tickets/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al cargar tickets');
  return response.json();
};

export const crearTicket = async (token, ticketData) => {
  const response = await fetch(`${API_URL}/tickets/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticketData)
  });
  if (!response.ok) throw new Error('Error al crear ticket');
  return response.json();
};

export const actualizarTicket = async (token, ticketId, ticketData) => {
  const response = await fetch(`${API_URL}/tickets/${ticketId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticketData)
  });
  if (!response.ok) throw new Error('Error al actualizar ticket');
  return response.json();
};

// ============ FACTURAS ============
export const fetchFacturas = async (token) => {
  const response = await fetch(`${API_URL}/facturas/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al cargar facturas');
  return response.json();
};

// ============ CONTRATOS ============
export const fetchContratos = async (token) => {
  const response = await fetch(`${API_URL}/contratos/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al cargar contratos');
  return response.json();
};

// ============ PAGOS ============
export const fetchPagos = async (token) => {
  const response = await fetch(`${API_URL}/pagos/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al cargar pagos');
  return response.json();
};

export const crearPago = async (token, pagoData) => {
  const response = await fetch(`${API_URL}/pagos/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pagoData)
  });
  if (!response.ok) throw new Error('Error al crear pago');
  return response.json();
};

// ============ USUARIOS ============
export const fetchUsuarios = async (token) => {
  const response = await fetch(`${API_URL}/usuarios/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al cargar usuarios');
  return response.json();
};

export const fetchUsuario = async (token, userId) => {
  const response = await fetch(`${API_URL}/usuarios/${userId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al cargar usuario');
  return response.json();
};

export const actualizarUsuario = async (token, userId, userData) => {
  const response = await fetch(`${API_URL}/usuarios/${userId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
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
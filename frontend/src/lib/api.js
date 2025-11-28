const API_URL = 'https://86.48.21.76/infiber/api';

export const fetchPlanes = async () => {
  const response = await fetch(`${API_URL}/planes/`);
  return response.json();
};

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const chat = async (mensaje) => {
  const response = await fetch(`${API_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensaje }),
  });
  return response.json();
};
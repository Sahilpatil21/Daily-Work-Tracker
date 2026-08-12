import apiClient from './apiClient';

export const register = async (authData) => {
  const response = await apiClient.post('/auth/register', authData);
  return response.data;
};

export const login = async (authData) => {
  const response = await apiClient.post('/auth/login', authData);
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const updateMe = async (updateData) => {
  const response = await apiClient.put('/auth/me', updateData);
  return response.data;
};

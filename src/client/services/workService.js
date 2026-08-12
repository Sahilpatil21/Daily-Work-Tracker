import axios from 'axios';

const API_URL = '/api/work';

export const createWork = async (workData) => {
  const response = await axios.post(API_URL, workData);
  return response.data;
};

export const getAllWork = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getWorkByDate = async (date) => {
  const response = await axios.get(`${API_URL}/date/${date}`);
  return response.data;
};

export const updateWork = async (id, workData) => {
  const response = await axios.put(`${API_URL}/${id}`, workData);
  return response.data;
};

export const deleteWork = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// URL string generation for the download button, not an axios call because we want the browser to handle the file download natively
export const getDailyPDFUrl = (date, companyName) => {
  const query = new URLSearchParams({ company: companyName }).toString();
  return `${API_URL}/pdf/${date}?${query}`;
};

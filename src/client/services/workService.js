import apiClient from './apiClient';

const WORK_URL = '/work';

export const createWork = async (workData) => {
  const response = await apiClient.post(WORK_URL, workData);
  return response.data;
};

export const getAllWork = async () => {
  const response = await apiClient.get(WORK_URL);
  return response.data;
};

export const downloadDailyPDF = async (date, companyName) => {
  const response = await apiClient.get(`${WORK_URL}/pdf/${date}`, {
    params: { company: companyName },
    responseType: 'blob'
  });
  return response.data;
};

export const getWorkByDate = async (date) => {
  const response = await apiClient.get(`${WORK_URL}/date/${date}`);
  return response.data;
};

export const updateWork = async (id, workData) => {
  const response = await apiClient.put(`${WORK_URL}/${id}`, workData);
  return response.data;
};

export const deleteWork = async (id) => {
  const response = await apiClient.delete(`${WORK_URL}/${id}`);
  return response.data;
};

// URL string generation for the download button, not an axios call because we want the browser to handle the file download natively
export const getDailyPDFUrl = (date, companyName) => {
  const query = new URLSearchParams({ company: companyName }).toString();
  return `${WORK_URL}/pdf/${date}?${query}`;
};

// Get suggestions for tool names by company
export const getToolNamesByCompany = async (companyName) => {
  try {
    const response = await apiClient.get(`${WORK_URL}/suggestions/tools`, {
      params: { company: companyName }
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch tool name suggestions:', error);
    return [];
  }
};

// Get suggestions for descriptions by company
export const getDescriptionsByCompany = async (companyName) => {
  try {
    const response = await apiClient.get(`${WORK_URL}/suggestions/descriptions`, {
      params: { company: companyName }
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch description suggestions:', error);
    return [];
  }
};

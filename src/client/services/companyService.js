import apiClient from './apiClient';

const COMPANY_STORAGE_KEY = 'savedCompanyNames';

export const getSavedCompanies = () => {
  try {
    const stored = localStorage.getItem(COMPANY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read saved company names', error);
    return [];
  }
};

// Fire-and-forget server sync when possible, but always update localStorage synchronously
export const saveCompanyName = (companyName) => {
  const trimmedName = companyName?.trim();
  if (!trimmedName) return [];

  const existingNames = getSavedCompanies();
  const filtered = existingNames.filter((name) => name.toLowerCase() !== trimmedName.toLowerCase());
  const updated = [trimmedName, ...filtered].slice(0, 50);
  localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(updated));

  // Try to persist to server if auth token present
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.post('/companies', { name: trimmedName }).catch((err) => {
        // ignore network errors; localStorage still works
        console.warn('Failed to sync company to server', err?.message || err);
      });
    }
  } catch (err) {
    // ignore
  }

  return updated;
};

export const syncFromServer = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return getSavedCompanies();
    const resp = await apiClient.get('/companies');
    if (resp?.data?.success) {
      const companies = resp.data.data || [];
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(companies));
      return companies;
    }
  } catch (err) {
    console.warn('Failed to fetch saved companies from server', err?.message || err);
  }
  return getSavedCompanies();
};

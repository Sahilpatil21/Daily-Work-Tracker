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

export const saveCompanyName = (companyName) => {
  const trimmedName = companyName?.trim();
  if (!trimmedName) return [];

  const existingNames = getSavedCompanies();
  const filtered = existingNames.filter((name) => name.toLowerCase() !== trimmedName.toLowerCase());
  const updated = [trimmedName, ...filtered].slice(0, 10);
  localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

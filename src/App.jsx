import React, { useEffect, useState } from 'react';
import AuthPage from './client/pages/AuthPage';
import Dashboard from './client/pages/Dashboard';
import { getMe } from './client/services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    getMe()
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAuth = (authResponse) => {
    localStorage.setItem('authToken', authResponse.token);
    localStorage.setItem('userInfo', JSON.stringify(authResponse.data));
    localStorage.setItem('userCompanyName', authResponse.data.companyName || '');
    setUser(authResponse.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userCompanyName');
    setUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
      ) : (
        <AuthPage onAuth={handleAuth} />
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { login, register } from '../services/authService';

const AuthPage = ({ onAuth }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const action = isRegister ? register : login;
      const response = await action(formData);
      onAuth(response);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Authentication failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-8 py-8 sm:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
              <p className="text-sm text-gray-500 mt-1">{isRegister ? 'Register to start tracking work entries.' : 'Login to continue.'}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsRegister((prev) => !prev);
                setError('');
              }}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              {isRegister ? 'Already have an account?' : 'Create an account'}
            </button>
          </div>

          {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-500 focus:ring-brand-500"
                  placeholder="Your name"
                />
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-500 focus:ring-brand-500"
                  placeholder="Your company name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email or Username</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-500 focus:ring-brand-500"
                placeholder="you@example.com or username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-500 focus:ring-brand-500"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-70"
            >
              {isLoading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const EditWorkModal = ({ isOpen, onClose, work, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    toolName: '',
    description: '',
    quantity: '',
    rate: '',
    workDate: ''
  });

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (work) {
      setFormData({
        companyName: work.companyName,
        toolName: work.toolName,
        description: work.description,
        quantity: work.quantity,
        rate: work.rate,
        workDate: work.workDate
      });
    }
  }, [work]);

  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const rt = parseFloat(formData.rate) || 0;
    setAmount(qty * rt);
  }, [formData.quantity, formData.rate]);

  if (!isOpen || !work) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(work._id, {
      ...formData,
      quantity: Number(formData.quantity),
      rate: Number(formData.rate)
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="relative inline-block w-full max-w-2xl overflow-hidden text-left align-bottom transition-all transform bg-white rounded-xl shadow-xl sm:my-8 sm:align-middle text-gray-900">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Edit Work Entry</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Client Company Name *</label>
                <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tool Name *</label>
                <input type="text" name="toolName" required value={formData.toolName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea name="description" required rows="2" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 resize-none"></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                <input type="number" name="quantity" required min="1" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rate (₹) *</label>
                <input type="number" name="rate" required min="0" step="0.01" value={formData.rate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Work Date *</label>
                <input type="date" name="workDate" required value={formData.workDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="flex flex-col justify-end">
                <div className="bg-brand-50 rounded-lg px-4 py-3 border border-brand-100">
                  <span className="block text-xs font-medium text-brand-600 mb-1 uppercase tracking-wider">Calculated Amount</span>
                  <span className="text-xl font-bold text-brand-900">₹{amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70">
                {isLoading ? 'Saving...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">Delete Work Entry</h3>
          <p className="text-sm text-center text-gray-500 mb-6">Are you sure you want to delete this work entry? This action cannot be undone.</p>
          <div className="flex justify-center space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="button" onClick={onConfirm} disabled={isLoading} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70">
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CompanyNameModal = ({ isOpen, onClose, onSave, defaultName }) => {
  const [name, setName] = useState(defaultName || '');

  useEffect(() => {
    if (defaultName) setName(defaultName);
  }, [defaultName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-90 backdrop-blur-sm"></div>
        <div className="relative inline-block w-full max-w-md p-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Welcome!</h3>
            <p className="text-gray-500 mt-2">Please enter your company name to personalize your reports.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Company Name</label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="e.g. S D TOOLS"
              />
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

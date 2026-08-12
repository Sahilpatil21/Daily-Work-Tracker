import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';

const WorkForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    toolName: '',
    description: '',
    quantity: '',
    rate: '',
    workDate: new Date().toISOString().split('T')[0]
  });

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const rt = parseFloat(formData.rate) || 0;
    setAmount(qty * rt);
  }, [formData.quantity, formData.rate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      rate: Number(formData.rate)
    });
    // Reset form after submit except date
    setFormData(prev => ({
      companyName: '',
      toolName: '',
      description: '',
      quantity: '',
      rate: '',
      workDate: prev.workDate
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center space-x-2">
        <PlusCircle className="w-5 h-5 text-brand-600" />
        <h2 className="text-lg font-semibold text-gray-800">Add Daily Work</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Client Company Name *</label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="e.g. ABC Pvt Ltd"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tool Name *</label>
            <input
              type="text"
              name="toolName"
              required
              value={formData.toolName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="e.g. Drill Machine"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              required
              rows="2"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
              placeholder="Work details..."
            ></textarea>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quantity *</label>
            <input
              type="number"
              name="quantity"
              required
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rate (₹) *</label>
            <input
              type="number"
              name="rate"
              required
              min="0"
              step="0.01"
              value={formData.rate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Work Date *</label>
            <input
              type="date"
              name="workDate"
              required
              value={formData.workDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-col justify-end">
            <div className="bg-brand-50 rounded-lg px-4 py-3 border border-brand-100 mb-2">
              <span className="block text-xs font-medium text-brand-600 mb-1 uppercase tracking-wider">Calculated Amount</span>
              <span className="text-xl font-bold text-brand-900">₹{amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Work'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkForm;

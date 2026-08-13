import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { getSavedCompanies, saveCompanyName } from '../services/companyService';
import CompanyAutocomplete from './CompanyAutocomplete';
import ToolAutocomplete from './ToolAutocomplete';
import DescriptionAutocomplete from './DescriptionAutocomplete';

const WorkForm = ({ onSubmit, isLoading }) => {
  const [savedCompanies, setSavedCompanies] = useState([]);
  const [formData, setFormData] = useState({
    companyName: '',
    toolName: '',
    description: '',
    quantity: '',
    rate: '',
    workDate: new Date().toISOString().split('T')[0],
    paid: false
  });

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const companies = getSavedCompanies();
    setSavedCompanies(companies);
    if (!formData.companyName && companies.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        companyName: companies[0],
        toolName: companies[0] // Auto-fill tool name with company name
      }));
    }
  }, []);

  // Auto-fill toolName when companyName changes
  useEffect(() => {
    if (formData.companyName) {
      setFormData(prev => ({
        ...prev,
        toolName: formData.companyName
      }));
    }
  }, [formData.companyName]);

  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const rt = parseFloat(formData.rate) || 0;
    setAmount(qty * rt);
  }, [formData.quantity, formData.rate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCompanyBlur = () => {
    const trimmed = formData.companyName?.trim();
    if (!trimmed) return;
    const updated = saveCompanyName(trimmed);
    setSavedCompanies(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveCompanyName(formData.companyName);
    onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      rate: Number(formData.rate)
    });
    const companies = getSavedCompanies();
    setSavedCompanies(companies);
    const defaultCompany = companies[0] || '';
    setFormData(prev => ({
      companyName: defaultCompany,
      toolName: defaultCompany, // Set tool name same as company name
      description: '',
      quantity: '',
      rate: '',
      workDate: prev.workDate,
      paid: false
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
            <CompanyAutocomplete
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="e.g. ABC Pvt Ltd"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tool Name *</label>
            <ToolAutocomplete
              name="toolName"
              value={formData.toolName}
              onChange={handleChange}
              required
              placeholder="e.g. Drill Machine"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              companyName={formData.companyName}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <DescriptionAutocomplete
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Work details..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
              companyName={formData.companyName}
              rows={2}
            />
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

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="paid"
              id="paid"
              checked={formData.paid}
              onChange={handleChange}
              className="h-4 w-4 text-brand-600 border-gray-300 rounded"
            />
            <label htmlFor="paid" className="text-sm font-medium text-gray-700">Paid</label>
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

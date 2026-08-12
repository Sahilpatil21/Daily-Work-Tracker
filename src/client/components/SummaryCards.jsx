import React from 'react';
import { ListChecks, Package, IndianRupee } from 'lucide-react';

const SummaryCards = ({ entriesCount, totalQuantity, totalAmount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <ListChecks className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Work Entries</p>
          <p className="text-3xl font-bold text-gray-900">{entriesCount}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <Package className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Quantity</p>
          <p className="text-3xl font-bold text-gray-900">{totalQuantity}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
        <div className="bg-purple-50 p-3 rounded-lg">
          <IndianRupee className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Amount</p>
          <p className="text-3xl font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;

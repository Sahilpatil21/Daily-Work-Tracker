import React from 'react';
import { Calendar, Download } from 'lucide-react';

const DateFilter = ({ selectedDate, onDateChange, onDownloadPDF }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className="bg-brand-50 p-2 rounded-lg">
          <Calendar className="w-5 h-5 text-brand-600" />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Work History For</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
          />
        </div>
      </div>
      
      <button
        onClick={onDownloadPDF}
        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-white border-2 border-brand-100 text-brand-700 font-medium rounded-lg hover:bg-brand-50 hover:border-brand-200 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
      >
        <Download className="w-4 h-4" />
        <span>Download Daily PDF</span>
      </button>
    </div>
  );
};

export default DateFilter;

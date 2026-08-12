import React from 'react';
import { Briefcase, Settings } from 'lucide-react';

const Navbar = ({ companyName, onEditCompany }) => {
  return (
    <nav className="bg-brand-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-500 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight block leading-none">Daily Work Tracker</span>
              <span className="text-brand-300 text-xs mt-1 block">by {companyName}</span>
            </div>
          </div>
          
          <div>
            <button 
              onClick={onEditCompany}
              className="p-2 hover:bg-brand-800 rounded-full transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-brand-200" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WorkForm from '../components/WorkForm';
import SummaryCards from '../components/SummaryCards';
import WorkTable from '../components/WorkTable';
import DateFilter from '../components/DateFilter';
import { EditWorkModal, DeleteConfirmModal, CompanyNameModal } from '../components/Modals';
import * as workService from '../services/workService';

const Dashboard = () => {
  const [works, setWorks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  const [editingWork, setEditingWork] = useState(null);
  const [deletingWork, setDeletingWork] = useState(null);
  
  const [companyName, setCompanyName] = useState('S D TOOLS');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  useEffect(() => {
    // Check local storage for company name
    const storedName = localStorage.getItem('userCompanyName');
    if (storedName) {
      setCompanyName(storedName);
    } else {
      setIsCompanyModalOpen(true);
    }
  }, []);

  const handleSaveCompanyName = (name) => {
    setCompanyName(name);
    localStorage.setItem('userCompanyName', name);
    setIsCompanyModalOpen(false);
  };

  const fetchWorksByDate = async (date) => {
    try {
      setIsAppLoading(true);
      const response = await workService.getWorkByDate(date);
      if (response.success) {
        setWorks(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch works', error);
      alert('Failed to load work entries. Please try again.');
    } finally {
      setIsAppLoading(false);
    }
  };

  useEffect(() => {
    fetchWorksByDate(selectedDate);
  }, [selectedDate]);

  const handleCreateWork = async (workData) => {
    try {
      setIsLoading(true);
      const response = await workService.createWork(workData);
      if (response.success) {
        // If created work is for currently selected date, add to list
        if (workData.workDate === selectedDate) {
          setWorks([response.data, ...works]);
        }
      }
    } catch (error) {
      console.error('Failed to create work', error);
      alert(error.response?.data?.message || 'Failed to save work entry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWork = async (id, workData) => {
    try {
      setIsLoading(true);
      const response = await workService.updateWork(id, workData);
      if (response.success) {
        // If date changed to a different date, remove it from current view
        if (workData.workDate !== selectedDate) {
          setWorks(works.filter(w => w._id !== id));
        } else {
          setWorks(works.map(w => w._id === id ? response.data : w));
        }
        setEditingWork(null);
      }
    } catch (error) {
      console.error('Failed to update work', error);
      alert(error.response?.data?.message || 'Failed to update work entry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWork = async () => {
    if (!deletingWork) return;
    
    try {
      setIsLoading(true);
      const response = await workService.deleteWork(deletingWork._id);
      if (response.success) {
        setWorks(works.filter(w => w._id !== deletingWork._id));
        setDeletingWork(null);
      }
    } catch (error) {
      console.error('Failed to delete work', error);
      alert('Failed to delete work entry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const url = workService.getDailyPDFUrl(selectedDate, companyName);
    window.open(url, '_blank');
  };

  // Calculate summaries
  const totalEntries = works.length;
  const totalQuantity = works.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = works.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar companyName={companyName} onEditCompany={() => setIsCompanyModalOpen(true)} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Form Section */}
        <section>
          <WorkForm onSubmit={handleCreateWork} isLoading={isLoading} />
        </section>

        <hr className="border-gray-200" />

        {/* Work History Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Work History</h2>
          
          <DateFilter 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
            onDownloadPDF={handleDownloadPDF} 
          />
          
          {isAppLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : (
            <>
              <SummaryCards 
                entriesCount={totalEntries} 
                totalQuantity={totalQuantity} 
                totalAmount={totalAmount} 
              />
              
              <WorkTable 
                works={works} 
                onEdit={setEditingWork} 
                onDelete={setDeletingWork} 
              />
            </>
          )}
        </section>

      </main>

      {/* Modals */}
      <EditWorkModal 
        isOpen={!!editingWork} 
        onClose={() => setEditingWork(null)} 
        work={editingWork} 
        onSave={handleUpdateWork} 
        isLoading={isLoading} 
      />
      
      <DeleteConfirmModal 
        isOpen={!!deletingWork} 
        onClose={() => setDeletingWork(null)} 
        onConfirm={handleDeleteWork} 
        isLoading={isLoading} 
      />

      <CompanyNameModal
        isOpen={isCompanyModalOpen}
        onClose={() => {
          if(localStorage.getItem('userCompanyName')) setIsCompanyModalOpen(false);
        }}
        onSave={handleSaveCompanyName}
        defaultName={companyName}
      />
    </div>
  );
};

export default Dashboard;

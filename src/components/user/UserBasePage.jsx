import React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, useDisclosure } from '@heroui/react'
import { useNavigate } from "react-router-dom";
import ImportModal from './ImportModal';

const UserBasePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("Alex");
  const navigate = useNavigate();
  // This function would handle the redirect to the import page
  const handleImportClick = () => {
    navigate('/user/import');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="container mx-auto flex-1 p-4 md:p-6">
        {/* Welcome section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {username}</h1>
          <p className="text-gray-600">Here's an overview of your inventory management system.</p>
        </section>

        {/* Dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Import Inventory Card */}
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gray-100 pb-3">
              <CardHeader className="flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 bg-gray-200 rounded-md text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </span>
                <span>Import Inventory</span>
              </CardHeader>
            </CardHeader>
            <CardBody className="pt-4">
              <p className="text-gray-600 mb-4">
                Import your inventory data from Excel spreadsheets to quickly update your system.
              </p>
            </CardBody>
            <CardFooter className="bg-gray-50 px-6 py-3">
              <Button color="primary" onPress={onOpen}>
                Import file
              </Button>
            </CardFooter>
          </Card>

          {/* Inventory Summary Card */}
          {/* <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gray-100 pb-3">
              <CardHeader className="flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 bg-gray-200 rounded-md text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </span>
                <span>Inventory Summary</span>
              </CardHeader>
            </CardHeader>
            <CardBody className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">1,248</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Low Stock Items</span>
                  <span className="font-medium text-amber-600">24</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-gray-600">Out of Stock</span>
                  <span className="font-medium text-red-600">7</span>
                </div>
              </div>
            </CardBody>
          </Card> */}

          {/* Recent Activity Card */}
          {/* <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gray-100 pb-3">
              <CardHeader className="flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 bg-gray-200 rounded-md text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </span>
                <span>Recent Activity</span>
              </CardHeader>
            </CardHeader>
            <CardBody className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Inventory updated (10 minutes ago)</span>
                </div>
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">New item added (2 hours ago)</span>
                </div>
                <div className="flex items-center gap-3 pb-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-gray-600">Low stock alert (1 day ago)</span>
                </div>
              </div>
            </CardBody>
            <CardFooter className="bg-gray-50 px-6 py-3">
              <Button variant="link" className="text-gray-600 hover:text-gray-800 w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; 2025 BizStack
        </div>
      </footer>
      <ImportModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default UserBasePage;
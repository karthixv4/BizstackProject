import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, BarChart2, Settings, ChevronLeft, ChevronRight, LogOut, Menu } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, isMobile = false }) => {
  // Navigation items configuration
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Home size={20} /> },
    { id: 'users', name: 'User Management', icon: <Users size={20} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart2 size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  // Animation variants for the sidebar
  const sidebarVariants = {
    expanded: { width: '16rem' }, // 256px / 64px (w-64)
    collapsed: { width: '5rem' },  // 80px / 20px (w-20)
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Sidebar content component
  const SidebarContent = () => (
    <motion.div 
      className="h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden"
      variants={sidebarVariants}
      animate={isOpen ? "expanded" : "collapsed"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {isOpen ? (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="text-2xl font-bold text-blue-600"
          >
            BIZSTACK
          </motion.h1>
        ) : (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="flex justify-center w-full"
          >
            <h1 className="text-2xl font-bold text-blue-600">B</h1>
          </motion.span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
                ${isOpen ? 'justify-start' : 'justify-center'}
                group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full mb-1
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{item.icon}</span>
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className="ml-3"
                >
                  {item.name}
                </motion.span>
              )}
            </motion.button>
          ))}
        </nav>
      </div>
      
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <button className={`flex-shrink-0 w-full group ${isOpen ? 'flex items-center' : 'flex flex-col items-center'}`}>
          <div>
            <img
              className="h-8 w-8 rounded-full"
              src="https://i.pravatar.cc/150?img=68"
              alt="Admin"
            />
          </div>
          {isOpen ? (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              className="ml-3"
            >
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <div className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700">
                <LogOut size={14} className="mr-1" />
                <span>Log out</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <LogOut size={16} className="mt-2 text-gray-500 hover:text-gray-700" />
            </motion.div>
          )}
        </button>
      </div>
    </motion.div>
  );

  // Mobile menu overlay
  const MobileOverlay = () => {
    if (!isMobile || !isOpen) return null;

    return (
      <div className="fixed inset-0 z-30 lg:hidden">
        {/* Dark overlay behind the sidebar */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setIsOpen(false)}
        ></div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile sidebar */}
      {isMobile && (
        <>
          {/* Mobile menu button */}
          <div className="fixed top-0 left-0 z-40 m-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md bg-white shadow-md text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile overlay */}
          <MobileOverlay />
          
          {/* Mobile sidebar */}
          {isOpen && (
            <motion.div 
              className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white shadow-xl z-40"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <SidebarContent />
            </motion.div>
          )}
        </>
      )}

      {/* Desktop sidebar - always visible but can expand/collapse */}
      {!isMobile && (
        <motion.div 
          className="fixed inset-y-0 left-0 z-20"
          variants={sidebarVariants}
          animate={isOpen ? "expanded" : "collapsed"}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <SidebarContent />
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
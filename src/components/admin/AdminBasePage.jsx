import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AllUsers from './AllUsers';
import Sidebar from './Sidebar'; // Import the new Sidebar component
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

// Mock data with updated tier options (Free, Paid, Free Trial)
const initialUsers = [
    { id: 1, name: 'Selvakumar', email: 'selvakumarpr1305@gmail.com', businessName: 'Selvakumar', country: 'India', status: 'Blocked', tier: 'Free', businessType: 'Wholesale', expiryDate: '2025-05-15' },
    { id: 2, name: 'hello', email: 'karthick1031998@gmail.com', businessName: 'Xyz', country: 'INDIA', status: 'Unblocked', tier: 'Paid', businessType: 'Retail', expiryDate: '2025-06-20' },
    { id: 3, name: 'CJ', email: 'chernohyayahjagitay@gmail.com', businessName: 'CJBEM', country: 'N/A', status: 'Unblocked', tier: 'Free Trial', businessType: 'Manufacturing', expiryDate: '2025-03-30' },
    { id: 4, name: 'TextFieldValue', email: 'karthick@gmail.com', businessName: 'Abc', country: 'UK', status: 'Unblocked', tier: 'Paid', businessType: 'Services', expiryDate: '2025-04-10' },
    { id: 5, name: 'Biz', email: 'bizstack2024@gmail.com', businessName: 'Biz', country: 'Canada', status: 'Unblocked', tier: 'Free', businessType: 'Distribution', expiryDate: '2025-04-05' },
];

// Updated tier distribution with new tier options
const tierDistribution = [
    { name: 'Free', value: 2, color: '#8884d8' },
    { name: 'Paid', value: 2, color: '#82ca9d' },
    { name: 'Free Trial', value: 1, color: '#ffc658' }
];

const monthlySignups = [
    { name: 'Jan', count: 2 },
    { name: 'Feb', count: 4 },
    { name: 'Mar', count: 3 },
    { name: 'Apr', count: 5 },
    { name: 'May', count: 1 }
];

const BizstackAdmin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile view
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        };

        // Check on initial load
        checkIfMobile();
        
        // Add event listener for window resize
        window.addEventListener('resize', checkIfMobile);
        
        // Clean up
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const getExpiringUsers = () => {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        return initialUsers.filter(user => {
            const expiryDate = new Date(user.expiryDate);
            return expiryDate > today && expiryDate < thirtyDaysFromNow;
        });
    };

    const expiringUsers = getExpiringUsers();

    // Updated Dashboard stats with new tier categories
    const stats = {
        totalUsers: initialUsers.length,
        paid: initialUsers.filter(user => user.tier === 'Paid').length,
        free: initialUsers.filter(user => user.tier === 'Free').length,
        freeTrial: initialUsers.filter(user => user.tier === 'Free Trial').length,
        expiringSoon: expiringUsers.length,
        blocked: initialUsers.filter(user => user.status === 'Blocked').length,
    };

    // Render content function with updated tier display
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
                        >
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                                <p className="text-sm text-gray-500">Total Users</p>
                                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                                <p className="text-sm text-gray-500">Paid Users</p>
                                <p className="text-2xl font-bold">{stats.paid}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                                <p className="text-sm text-gray-500">Free Users</p>
                                <p className="text-2xl font-bold">{stats.free}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                                <p className="text-sm text-gray-500">Free Trial Users</p>
                                <p className="text-2xl font-bold">{stats.freeTrial}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                                <p className="text-sm text-gray-500">Blocked Users</p>
                                <p className="text-2xl font-bold">{stats.blocked}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            {/* Monthly Signups */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Monthly Signups</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={monthlySignups}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" name="New Users" fill="#3b82f6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* User Tier Distribution - Updated with new tier options */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">User Tier Distribution</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={tierDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={true}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {tierDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>
                    </>
                );
            case 'users':
                return (
                    <div className="mt-6">
                        <AllUsers />
                    </div>
                );
            // Other case statements would be included here (analytics, settings)...
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Component */}
            <Sidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                isMobile={isMobile}
            />

            {/* Main content */}
            <motion.div 
                className="flex-1 transition-all duration-300 ease-in-out"
                initial={false}
                animate={{ 
                    marginLeft: isMobile ? '0' : (sidebarOpen ? '16rem' : '5rem') 
                }}
            >
                <main className="p-4 md:p-6 pt-16 lg:pt-6">
                    {/* Welcome Message */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-blue-600">Welcome, Admin</h1>
                        <p className="text-gray-600 mt-2">Manage your users and view analytics from your dashboard</p>
                    </div>

                    {/* Render content based on active tab */}
                    {renderContent()}
                </main>
            </motion.div>
        </div>
    );
};

export default BizstackAdmin;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import AllUsers from './AllUsers';

// Mock data - keeping only what's needed for analytics
const initialUsers = [
    { id: 1, name: 'Selvakumar', email: 'selvakumarpr1305@gmail.com', businessName: 'Selvakumar', country: 'India', status: 'Blocked', tier: 'Free', businessType: 'Wholesale', expiryDate: '2025-05-15' },
    { id: 2, name: 'hello', email: 'karthick1031998@gmail.com', businessName: 'Xyz', country: 'INDIA', status: 'Unblocked', tier: 'Enterprise', businessType: 'Retail', expiryDate: '2025-06-20' },
    { id: 3, name: 'CJ', email: 'chernohyayahjagitay@gmail.com', businessName: 'CJBEM', country: 'N/A', status: 'Unblocked', tier: 'Basic', businessType: 'Manufacturing', expiryDate: '2025-03-30' },
    { id: 4, name: 'TextFieldValue', email: 'karthick@gmail.com', businessName: 'Abc', country: 'UK', status: 'Unblocked', tier: 'Premium', businessType: 'Services', expiryDate: '2025-04-10' },
    { id: 5, name: 'Biz', email: 'bizstack2024@gmail.com', businessName: 'Biz', country: 'Canada', status: 'Unblocked', tier: 'Basic', businessType: 'Distribution', expiryDate: '2025-04-05' },
];

// Analytics data
const tierDistribution = [
    { name: 'Free', value: 1, color: '#8884d8' },
    { name: 'Basic', value: 2, color: '#82ca9d' },
    { name: 'Premium', value: 1, color: '#ffc658' },
    { name: 'Enterprise', value: 1, color: '#ff8042' }
];

const monthlySignups = [
    { name: 'Jan', count: 2 },
    { name: 'Feb', count: 4 },
    { name: 'Mar', count: 3 },
    { name: 'Apr', count: 5 },
    { name: 'May', count: 1 }
];

// Import the AllUsers component (add this to your imports at the top)
// import AllUsers from './AllUsers';

const BizstackAdmin = () => {
    const [activeTab, setActiveTab] = useState('users');

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

    // Dashboard stats
    const stats = {
        totalUsers: initialUsers.length,
        premium: initialUsers.filter(user => user.tier === 'Premium' || user.tier === 'Enterprise').length,
        free: initialUsers.filter(user => user.tier === 'Free' || user.tier === 'Basic').length,
        expiringSoon: expiringUsers.length,
        blocked: initialUsers.filter(user => user.status === 'Blocked').length,
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Main content - Removed duplicate header */}
            <main className="flex-1 p-6">
                {/* Welcome Message */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">Welcome, Admin</h1>
                    <p className="text-gray-600 mt-2">Manage your users and view analytics from your dashboard</p>
                </div>

                {/* Tabs */}
                <div className="flex mb-6 bg-white rounded-lg shadow-sm">
                    <button
                        className={`flex items-center space-x-2 px-6 py-3 ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={18} />
                        <span>User Management</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 px-6 py-3 ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <PieChart size={18} />
                        <span>Analytics</span>
                    </button>
                </div>

                {/* Dashboard Stats */}
                {activeTab === 'users' && (
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
                            <p className="text-sm text-gray-500">Premium Users</p>
                            <p className="text-2xl font-bold">{stats.premium}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                            <p className="text-sm text-gray-500">Free Tier Users</p>
                            <p className="text-2xl font-bold">{stats.free}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                            <p className="text-sm text-gray-500">Expiring Soon</p>
                            <p className="text-2xl font-bold">{stats.expiringSoon}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                            <p className="text-sm text-gray-500">Blocked Users</p>
                            <p className="text-2xl font-bold">{stats.blocked}</p>
                        </div>
                    </motion.div>
                )}

                {/* User Management - This is where you would include your AllUsers component */}
                {activeTab === 'users' && (
                    <div className="mt-6">
                        {/* Uncomment this line when implementing */}
                        <AllUsers />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* User Tier Distribution */}
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

                        {/* Users by Country */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Users by Country</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={[
                                            { name: 'India', count: 2 },
                                            { name: 'UK', count: 1 },
                                            { name: 'Canada', count: 1 },
                                            { name: 'N/A', count: 1 },
                                        ]}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 60,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" name="Users" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Expiring Subscriptions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Expiring Subscriptions (Next 30 Days)</h2>
                            {expiringUsers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires On</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {expiringUsers.map(user => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8">
                                                                <img
                                                                    className="h-8 w-8 rounded-full"
                                                                    src={`https://i.pravatar.cc/150?u=${user.id || Math.random()}`}
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.tier === 'Free' ? 'bg-gray-100 text-gray-800' :
                                                                user.tier === 'Basic' ? 'bg-blue-100 text-blue-800' :
                                                                    user.tier === 'Premium' ? 'bg-purple-100 text-purple-800' :
                                                                        'bg-indigo-100 text-indigo-800'
                                                            }`}>
                                                            {user.tier}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(user.expiryDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button className="text-blue-600 hover:text-blue-900 mr-2">
                                                            Extend
                                                        </button>
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            Notify
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-10">No subscriptions expiring in the next 30 days</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default BizstackAdmin;
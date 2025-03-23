import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

const BasePage = () => {
  const navigate = useNavigate();
  
  const handleRedirect = (url) => {
    console.log("url: ", url);
    navigate(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-1/2"
        >
          <Card className="h-64 bg-blue-50 flex flex-col justify-between p-6 cursor-pointer" onPress={() => handleRedirect('/admin/base')}>
            <div>
              <h2 className="text-xl font-bold mb-2">Admin Panel</h2>
              <p className="text-gray-600">Takes you to admin all users page</p>
            </div>
            <Button variant="primary" className="w-full" onPress={() => handleRedirect('/admin/base')}>Visit</Button>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-1/2"
        >
          <Card className="h-64 bg-green-50 flex flex-col justify-between p-6 cursor-pointer" onPress={() => handleRedirect('/user/base')}>
            <div>
              <h2 className="text-xl font-bold mb-2">User Dashboard</h2>
              <p className="text-gray-600">Access your user dashboard</p>
            </div>
            <Button variant="secondary" className="w-full" onPress={() => handleRedirect('/user/base')}>Visit</Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BasePage;
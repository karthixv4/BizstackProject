import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Chip
} from "@heroui/react";
import { PieChartIcon, BarChartIcon, DollarSign, Package } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export const InventoryChartModal = ({ categories, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Process data for charts
  const chartData = useMemo(() => {
    if (!categories) return { overview: [], valueComparison: [], stockItems: [] };
    
    // Overview data (count of items per category)
    const overview = Object.entries(categories).map(([category, items]) => ({
      name: category,
      count: items.length
    }));
    
    // Value comparison (total value of inventory per category)
    const valueComparison = Object.entries(categories).map(([category, items]) => {
      const totalValue = items.reduce((sum, item) => {
        const price = parseFloat(item.PRICE || item.Price || 0);
        const stock = parseFloat(item.STOCK || item.Stock || 0);
        return sum + (price * stock);
      }, 0);
      
      return {
        name: category,
        value: totalValue
      };
    });
    
    // Stock levels per item (top 10 by stock quantity)
    let stockItems = [];
    Object.entries(categories).forEach(([category, items]) => {
      items.forEach(item => {
        const stock = parseFloat(item.STOCK || item.Stock || 0);
        const name = item.ITEM_NAME || item.Item_Name || "Unknown";
        
        if (stock > 0) {
          stockItems.push({
            name: name.length > 15 ? name.substring(0, 15) + "..." : name,
            stock,
            category
          });
        }
      });
    });
    
    // Sort and take top 10
    stockItems.sort((a, b) => b.stock - a.stock);
    stockItems = stockItems.slice(0, 10);
    
    return { overview, valueComparison, stockItems };
  }, [categories]);
  
  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-700">
            {activeTab === "valueComparison" 
              ? `Value: $${payload[0].value.toFixed(2)}` 
              : `Count: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
    >
      <ModalContent>
        <ModalHeader className="border-b">
          <div className="text-xl font-semibold">Inventory Dashboard</div>
        </ModalHeader>
        <ModalBody>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-2"
          >
            <Tabs 
              selectedKey={activeTab} 
              onSelectionChange={setActiveTab}
              aria-label="Chart View Options"
              className="mb-4"
            >
              <Tab 
                key="overview" 
                title={
                  <div className="flex items-center gap-2">
                    <PieChartIcon size={16} />
                    <span>Category Overview</span>
                  </div>
                }
              />
              <Tab 
                key="valueComparison" 
                title={
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span>Inventory Value</span>
                  </div>
                }
              />
              <Tab 
                key="stockLevels" 
                title={
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    <span>Stock Levels</span>
                  </div>
                }
              />
            </Tabs>
            
            <div className="h-96">
              {activeTab === "overview" && (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-medium">Items per Category</h3>
                    <Chip color="primary" variant="flat">
                      Total Categories: {chartData.overview.length}
                    </Chip>
                  </div>
                  
                  {chartData.overview.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.overview}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.overview.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No category data available</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "valueComparison" && (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-medium">Inventory Value by Category</h3>
                    <Chip color="primary" variant="flat">
                      Total Value: ${chartData.valueComparison.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
                    </Chip>
                  </div>
                  
                  {chartData.valueComparison.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData.valueComparison}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Value"]} />
                        <Legend />
                        <Bar dataKey="value" name="Total Value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No inventory value data available</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "stockLevels" && (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-medium">Top 10 Items by Stock Level</h3>
                  </div>
                  
                  {chartData.stockItems.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData.stockItems}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip 
                          formatter={(value, name, props) => [value, "Stock"]}
                          labelFormatter={(label) => `Item: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="stock" name="Quantity in Stock" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No stock level data available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Button component to open the chart modal
export const ChartViewButton = ({ categories }) => {
    console.log("Catg: ", categories)
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <>
      <Button 
        color="secondary" 
        startContent={<BarChartIcon size={16} />} 
        onPress={onOpen}
        className="ml-2"
      >
        Chart View
      </Button>
      
      <InventoryChartModal 
        categories={categories} 
        isOpen={isOpen} 
        onClose={onClose} 
      />
    </>
  );
};

export default ChartViewButton;
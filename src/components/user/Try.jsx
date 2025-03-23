import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import * as XLSX from "xlsx";
import { Button, Card, CardHeader, CardBody } from "@heroui/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

export default function Try({ onDataExtracted }) {

  console.log("HELLO INSIDE TRY")
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleDropFile = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExtractData = () => {
    if (!file) return;
    
    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rawData.length === 0) {
          alert("Empty file detected!");
          setLoading(false);
          return;
        }

        // Process headers
        const newHeaders = rawData[0].map((header) => header ? header.trim() : `Column${Math.random().toString(36).substr(2, 5)}`);

        // Format data and filter out empty rows
        let formattedData = rawData.slice(1)
          .filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ""))
          .map((row) => {
            return newHeaders.reduce((acc, key, index) => {
              acc[key] = row[index] ?? "";
              return acc;
            }, {});
          });
        
        // Categorize data
        const categoryHeader = newHeaders.find(h => h.toLowerCase().includes("category")) || "Category";
        const categorizedData = {};
        
        formattedData.forEach(item => {
          const category = item[categoryHeader] || "Uncategorized";
          if (!categorizedData[category]) categorizedData[category] = [];
          categorizedData[category].push(item);
        });
        
        // Call the parent component's function to handle the extracted data
        onDataExtracted({
          data: formattedData,
          categories: categorizedData,
          headers: newHeaders,
          originalHeaders: newHeaders,
          fileName: file.name
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing file. Please ensure it's a valid Excel/CSV file.");
        setLoading(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  return (
    <motion.div 
      className="w-full h-full max-h-[60vh] overflow-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="shadow-md border-0 h-full">
        <CardHeader className="flex justify-between items-center px-4 py-3 bg-white sticky top-0 z-10">
          <h1 className="text-lg font-semibold truncate">
            {file ? `Import: ${file.name}` : 'Upload Data File'}
          </h1>
        </CardHeader>

        <CardBody className="px-3 py-3 overflow-auto">
          <motion.div 
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <motion.div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center bg-white hover:bg-gray-50 cursor-pointer w-full"
              onDrop={handleDropFile}
              onDragOver={handleDragOver}
              whileHover={{ scale: 1.01, boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Upload size={36} className="text-blue-500 mb-2" />
              <p className="text-gray-700 mt-1 font-medium text-center">Upload a file or drag & drop</p>
              <p className="text-xs text-gray-500 mt-1 text-center">Excel, CSV, or TSV (max 10MB)</p>
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".csv,.xlsx,.tsv" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
              <Button 
                color="primary"
                variant="bordered" 
                size="sm"
                className="mt-3" 
                onPress={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </motion.div>
            
            {file && (
              <motion.div 
                className="mt-4 flex flex-col items-center w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center bg-blue-50 p-3 rounded-lg w-full">
                  <div className="flex-1 truncate">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button 
                    isIconOnly
                    variant="light" 
                    color="danger" 
                    size="sm"
                    onPress={handleRemoveFile}
                  >
                    <X size={14} />
                  </Button>
                </div>
                <Button 
                  color="primary" 
                  size="sm"
                  className="mt-4" 
                  onPress={handleExtractData} 
                  isLoading={loading}
                  spinner={<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                >
                  {loading ? "Extracting..." : "Extract Data"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
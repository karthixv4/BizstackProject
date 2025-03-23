import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Save, ArrowLeft } from "lucide-react";
import Try from "./Try";
import DataEditor from "./DataEditor";
import SuccessModal from "./SuccessModal"; // Import the new SuccessModal component

export default function ImportModal({ isOpen, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedData, setSavedData] = useState(null);
  
  const handleDataExtracted = (data) => {
    setExtractedData(data);
    setIsEditing(true);
  };
  
  const handleBack = () => {
    setIsEditing(false);
  };
  
  const handleSaveInventory = () => {
    // Prepare data for API submission
    const formattedData = {
      categories: Object.keys(extractedData.categories).map(category => ({
        name: category,
        items: extractedData.categories[category]
      }))
    };
    
    console.log("Sending data to API:", formattedData);
    // Here you would implement the actual API call
    
    // Store the saved data for the success modal
    setSavedData(formattedData);
    // Show success modal instead of alert
    setShowSuccessModal(true);
  };
  
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Close the main modal after success
    handleModalClose();
  };
  
  const handleModalClose = () => {
    setIsEditing(false);
    setExtractedData(null);
    onClose();
  };

  return (
    <>
      <Modal 
        backdrop="blur" 
        isOpen={isOpen} 
        onClose={handleModalClose} 
        size={isEditing ? "full" : "xl"}
        className="transition-all duration-300"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex justify-between items-center">
                {isEditing ? (
                  <div className="flex items-center">
                    <Button 
                      isIconOnly
                      variant="light" 
                      size="sm"
                      className="mr-2"
                      onPress={handleBack}
                    >
                      <ArrowLeft size={16} />
                    </Button>
                    <span>Edit: {extractedData?.fileName}</span>
                  </div>
                ) : (
                  "Import Inventory"
                )}
                
                {isEditing && (
                  <Button 
                    color="success" 
                    size="sm" 
                    startContent={<Save size={14} />} 
                    onPress={handleSaveInventory}
                  >
                    Save
                  </Button>
                )}
              </ModalHeader>
              
              <ModalBody className={isEditing ? "h-[calc(100vh-150px)]" : ""}>
                {isEditing ? (
                  <div className="h-full overflow-auto">
                    <DataEditor 
                      data={extractedData.data}
                      categories={extractedData.categories}
                      setCategories={(newCategories) => {
                        setExtractedData({
                          ...extractedData,
                          categories: newCategories
                        });
                      }}
                      headers={extractedData.headers}
                      originalHeaders={extractedData.originalHeaders}
                    />
                  </div>
                ) : (
                  <Try onDataExtracted={handleDataExtracted} />
                )}
              </ModalBody>
              
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleModalClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessModalClose} 
        importData={savedData}
      />
    </>
  );
}
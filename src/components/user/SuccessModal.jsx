import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SuccessModal({ isOpen, onClose, importData }) {
  if (!importData) return null;
  
  // Calculate totals
  const categoryCount = importData.categories.length;
  const itemCount = importData.categories.reduce(
    (total, category) => total + category.items.length, 
    0
  );

  return (
    <Modal 
      backdrop="blur" 
      isOpen={isOpen} 
      onClose={onClose} 
      size="sm"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-center">Import Successful</ModalHeader>
            
            <ModalBody>
              <div className="flex flex-col items-center justify-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20 
                  }}
                  className="mb-6"
                >
                  <CheckCircle2 
                    size={80} 
                    className="text-green-500" 
                    strokeWidth={1.5} 
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <p className="text-lg font-medium mb-1">
                    Your inventory has been imported!
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">{categoryCount}</span> {categoryCount === 1 ? 'category' : 'categories'} and <span className="font-semibold">{itemCount}</span> {itemCount === 1 ? 'item' : 'items'} added to your inventory.
                  </p>
                </motion.div>
              </div>
            </ModalBody>
            
            <ModalFooter className="justify-center">
              <Button color="primary" onPress={onClose}>
                Continue
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
import React, { useState, useEffect } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  Button, Input, Switch, Select, SelectItem
} from "@heroui/react";

const TIER_OPTIONS = ["Free", "Basic", "Premium", "Pro", "Enterprise"];
const COUNTRIES = ["INDIA", "India", "USA", "UK", "Canada", "Australia", "N/A", "Downtown"];
const BUSINESS_TYPES = ["Retail", "Food Service", "Wholesale", "Manufacturing", "Services"];

const UserDetailModal = ({ isOpen, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState({});
  
  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedUser);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">User Details</h3>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img 
                  src={editedUser.avatar} 
                  alt={editedUser.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold">{editedUser.username}</h4>
                <p className="text-gray-500">{editedUser.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input
                  value={editedUser.username || ""}
                  onChange={(e) => handleChange("username", e.target.value)}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  value={editedUser.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  fullWidth
                  type="email"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <Input
                value={editedUser.businessName || ""}
                onChange={(e) => handleChange("businessName", e.target.value)}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Business Type</label>
              <Select
                selectedKeys={editedUser.businessType ? [editedUser.businessType] : []}
                onChange={(e) => handleChange("businessType", e.target.value)}
                fullWidth
              >
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Select
                selectedKeys={editedUser.country ? [editedUser.country] : []}
                onChange={(e) => handleChange("country", e.target.value)}
                fullWidth
              >
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tier</label>
              <Select
                selectedKeys={editedUser.tier ? [editedUser.tier] : []}
                onChange={(e) => handleChange("tier", e.target.value)}
                fullWidth
              >
                {TIER_OPTIONS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <div className={`flex items-center gap-2 p-2 rounded ${editedUser.blockStatus === "Blocked" ? "bg-red-100" : ""}`}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch
                    checked={editedUser.blockStatus === "Unblocked"}
                    onChange={(e) => handleChange("blockStatus", e.target.checked ? "Unblocked" : "Blocked")}
                  />
                  <span className={editedUser.blockStatus === "Blocked" ? "text-red-600 font-medium" : ""}>
                    {editedUser.blockStatus === "Unblocked" ? "User is Unblocked" : "User is Blocked"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserDetailModal;
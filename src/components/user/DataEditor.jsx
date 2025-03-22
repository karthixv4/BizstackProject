import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ChevronDown, ChevronUp, PlusCircle, 
  Trash2, X, Filter, Edit
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";
import {
  Button,
  Input,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Switch,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

const staggerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

export default function DataEditor({ data, categories, setCategories, headers, originalHeaders }) {
  // UI state
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategoriesData, setFilteredCategoriesData] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState({});
  const { isOpen: isColumnSelectorOpen, onOpen: onColumnSelectorOpen, onClose: onColumnSelectorClose } = useDisclosure();
  
  // Editable state
  const [editingCell, setEditingCell] = useState({ row: null, col: null, category: null });
  const [editingValue, setEditingValue] = useState("");
  const [editingHeader, setEditingHeader] = useState(null);
  const [editingHeaderValue, setEditingHeaderValue] = useState("");

  // Modal state
  const { isOpen: isNewCategoryOpen, onOpen: onNewCategoryOpen, onClose: onNewCategoryClose } = useDisclosure();
  const [newCategoryName, setNewCategoryName] = useState("");
  const { isOpen: isEditHeaderOpen, onOpen: onEditHeaderOpen, onClose: onEditHeaderClose } = useDisclosure();

  // Reference for dropdown menu to prevent auto-close
  const dropdownMenuRef = useRef(null);

  // Initialize expanded categories
  useEffect(() => {
    if (Object.keys(categories).length > 0) {
      const initial = {};
      Object.keys(categories).forEach(cat => {
        initial[cat] = true;
      });
      setExpandedCategories(initial);
    }
  }, [categories]);

  // Initialize visible columns
  useEffect(() => {
    if (headers.length > 0) {
      const initial = {};
      headers.forEach(header => {
        initial[header] = true;
      });
      setVisibleColumns(initial);
    }
  }, [headers]);

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCategoriesData(categories);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = {};
    
    Object.entries(categories).forEach(([category, items]) => {
      const filteredItems = items.filter(item => {
        return Object.values(item).some(value => 
          value && String(value).toLowerCase().includes(searchTermLower)
        );
      });
      
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    
    setFilteredCategoriesData(filtered);
  }, [searchTerm, categories]);

  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  const toggleColumnVisibility = (column, e) => {
    // Prevent dropdown from closing
    if (e) {
      e.stopPropagation();
    }

    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleEditHeader = (header) => {
    setEditingHeader(header);
    setEditingHeaderValue(header);
    onEditHeaderOpen();
  };

  const saveEditedHeader = () => {
    if (!editingHeader || editingHeaderValue.trim() === "") return;
    
    // Create new headers array with updated name
    const newHeaders = headers.map(h => h === editingHeader ? editingHeaderValue : h);
    
    // Update all categories data with new header name
    const newCategories = {};
    Object.entries(categories).forEach(([category, items]) => {
      newCategories[category] = items.map(item => {
        const newItem = { ...item };
        if (item[editingHeader] !== undefined) {
          newItem[editingHeaderValue] = item[editingHeader];
          if (editingHeader !== editingHeaderValue) {
            delete newItem[editingHeader];
          }
        }
        return newItem;
      });
    });
    
    // Update visible columns
    const newVisibleColumns = { ...visibleColumns };
    newVisibleColumns[editingHeaderValue] = visibleColumns[editingHeader];
    if (editingHeader !== editingHeaderValue) {
      delete newVisibleColumns[editingHeader];
    }
    setVisibleColumns(newVisibleColumns);
    
    // Update state
    setCategories(newCategories);
    setEditingHeader(null);
    onEditHeaderClose();
  };

  const handleEditCell = (category, rowIndex, colName, value) => {
    setEditingCell({ row: rowIndex, col: colName, category });
    setEditingValue(value);
  };

  const saveEditedCell = () => {
    if (editingCell.row === null || editingCell.col === null) return;
    
    const { category, row, col } = editingCell;
    const newCategories = { ...categories };
    
    if (newCategories[category] && newCategories[category][row]) {
      newCategories[category][row][col] = editingValue;
      setCategories(newCategories);
    }
    
    setEditingCell({ row: null, col: null, category: null });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveEditedCell();
    } else if (e.key === "Escape") {
      setEditingCell({ row: null, col: null, category: null });
    }
  };

  const addNewItem = (category) => {
    const newCategories = { ...categories };
    const newItem = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    
    // Set category value
    const categoryHeader = originalHeaders.find(h => h.toLowerCase().includes("category")) || "Category";
    newItem[categoryHeader] = category;
    
    if (!newCategories[category]) {
      newCategories[category] = [];
    }
    
    newCategories[category].push(newItem);
    setCategories(newCategories);
  };

  const addNewVariant = (category, itemIndex) => {
    if (!categories[category]?.[itemIndex]) return;
    
    const newCategories = { ...categories };
    const baseItem = { ...newCategories[category][itemIndex] };
    
    // Find the variant header
    const variantHeader = originalHeaders.find(h => h.toLowerCase().includes("variant")) || "Variant";
    
    // Create a new variant entry
    const newVariant = { ...baseItem };
    newVariant[variantHeader] = "";
    
    newCategories[category].splice(itemIndex + 1, 0, newVariant);
    setCategories(newCategories);
  };

  const removeItem = (category, itemIndex) => {
    const newCategories = { ...categories };
    
    if (newCategories[category]) {
      newCategories[category].splice(itemIndex, 1);
      
      // Remove the category if it's empty
      if (newCategories[category].length === 0) {
        delete newCategories[category];
      }
      
      setCategories(newCategories);
    }
  };

  const removeCategory = (category) => {
    const newCategories = { ...categories };
    delete newCategories[category];
    setCategories(newCategories);
  };

  const addNewCategory = () => {
    if (newCategoryName && newCategoryName.trim()) {
      const categoryName = newCategoryName.trim();
      const newCategories = { ...categories };
      newCategories[categoryName] = [];
      setCategories(newCategories);
      setExpandedCategories(prev => ({
        ...prev,
        [categoryName]: true
      }));
      setNewCategoryName("");
      onNewCategoryClose();
    }
  };

  const toggleTrackStock = (category, itemIndex) => {
    const newCategories = { ...categories };
    
    if (newCategories[category] && newCategories[category][itemIndex]) {
      const item = newCategories[category][itemIndex];
      item.TrackStock = item.TrackStock === true ? false : true;
      setCategories(newCategories);
    }
  };

  // Function to clean up data by removing empty rows when importing
  const cleanImportedData = (data) => {
    const cleanedData = {};
    
    Object.entries(data).forEach(([category, items]) => {
      // Filter out rows where all fields are empty
      const nonEmptyItems = items.filter(item => {
        return Object.entries(item).some(([key, value]) => {
          return value !== "" && value !== null && value !== undefined;
        });
      });
      
      if (nonEmptyItems.length > 0) {
        cleanedData[category] = nonEmptyItems;
      }
    });
    
    return cleanedData;
  };

  const getCategoriesDataToShow = () => {
    // Use filtered data if search term is active, otherwise use all categories
    const dataToFilter = searchTerm ? filteredCategoriesData : categories;
    
    if (activeCategory === "all") {
      return dataToFilter;
    }
    
    // Check if the active category exists in the filtered data
    if (dataToFilter[activeCategory]) {
      return {
        [activeCategory]: dataToFilter[activeCategory]
      };
    }
    
    // Return empty object if the category doesn't exist in filtered data
    return {};
  };

  const getVisibleHeaders = () => {
    return headers.filter(header => visibleColumns[header]);
  };

  return (
    <motion.div 
      className="mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ backgroundColor: "#f5f5f7" }}
    >
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 p-4">
        <div className="flex-1">
          <div className="text-sm font-medium mb-2">Filter Category</div>
          <div className="flex flex-wrap gap-2">
            <Chip
              className="cursor-pointer"
              color={activeCategory === "all" ? "primary" : "default"}
              variant={activeCategory === "all" ? "solid" : "flat"}
              onClick={() => handleCategoryFilter("all")}
            >
              All
            </Chip>
            {Object.keys(categories).map((category) => (
              <Chip
                key={category}
                className="cursor-pointer"
                color={activeCategory === category ? "primary" : "default"}
                variant={activeCategory === category ? "solid" : "flat"}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Chip>
            ))}
          </div>
        </div>
        
        <div className="flex-1 md:max-w-xs">
          <div className="text-sm font-medium mb-2">Search Items</div>
          <Input
            placeholder="Type to search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search size={16} className="text-gray-400" />}
            size="sm"
            className="w-full"
          />
        </div>
      </div>
      
      {/* Column Visibility */}
      <div className="mb-6 px-4">
        <Dropdown 
          isOpen={isColumnSelectorOpen} 
          onOpenChange={isOpen => isOpen ? onColumnSelectorOpen() : onColumnSelectorClose()}
          closeOnSelect={false}
        >
          <DropdownTrigger>
            <Button 
              variant="flat" 
              color="default" 
              startContent={<Filter size={16} />}
              endContent={isColumnSelectorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              size="sm"
            >
              Column Visibility
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Column visibility options"
            className="p-2"
            ref={dropdownMenuRef}
            disallowEmptySelection
            selectionMode="multiple"
            selectedKeys={Object.entries(visibleColumns)
              .filter(([_, visible]) => visible)
              .map(([header]) => header)}
            onSelectionChange={keys => {
              const newVisibleColumns = { ...visibleColumns };
              headers.forEach(header => {
                newVisibleColumns[header] = keys.has(header);
              });
              setVisibleColumns(newVisibleColumns);
            }}
          >
            {headers.map((header) => (
              <DropdownItem
                key={header}
                startContent={
                  <div className={`w-4 h-4 rounded ${visibleColumns[header] ? 'bg-primary' : 'bg-gray-200'}`} 
                       onClick={(e) => toggleColumnVisibility(header, e)}></div>
                }
                endContent={
                  <Button 
                    color="default" 
                    variant="light" 
                    size="sm" 
                    isIconOnly 
                    onPress={(e) => { 
                      e.stopPropagation(); 
                      handleEditHeader(header);
                    }}
                  >
                    <Edit size={14} />
                  </Button>
                }
                textValue={header}
              >
                {header}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      
      {/* Button to add new category */}
      <div className="mb-4 px-4">
        <Button color="primary" startContent={<PlusCircle size={16} />} onPress={onNewCategoryOpen}>
          Add Category
        </Button>
      </div>
      
      {/* Categories and Items */}
      <motion.div 
        className="space-y-6 px-4 pb-4"
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {Object.entries(getCategoriesDataToShow()).map(([category, items]) => (
            <motion.div 
              key={category}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white"
            >
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleCategoryExpansion(category)}
                >
                  <motion.div
                    animate={{ rotate: expandedCategories[category] ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className="mr-2" />
                  </motion.div>
                  <span className="font-medium text-lg">Category: {category}</span>
                  <Chip size="sm" className="ml-2">{items.length} items</Chip>
                </div>
                <div className="flex gap-2">
                  <Button 
                    color="primary" 
                    size="sm" 
                    startContent={<PlusCircle size={16} />}
                    onPress={() => addNewItem(category)}
                  >
                    Add Item
                  </Button>
                  <Button 
                    color="danger" 
                    variant="light" 
                    size="sm" 
                    startContent={<Trash2 size={16} />}
                    onPress={() => removeCategory(category)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              
              <AnimatePresence>
                {expandedCategories[category] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <Table 
                        aria-label={`Items in ${category} category`}
                        removeWrapper
                        selectionMode="none"
                        classNames={{
                          base: "min-w-full",
                          table: "min-w-full",
                        }}
                      >
                        <TableHeader>
                          {getVisibleHeaders().map((header) => (
                            <TableColumn key={header} className="text-xs font-medium uppercase tracking-wider">
                              {header}
                            </TableColumn>
                          ))}
                          <TableColumn className="text-right text-xs font-medium uppercase tracking-wider">
                            Actions
                          </TableColumn>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, itemIndex) => (
                            <TableRow key={itemIndex}>
                              {getVisibleHeaders().map((header) => (
                                <TableCell key={`${itemIndex}-${header}`}>
                                  {header === "TrackStock" ? (
                                    <Switch 
                                      checked={item[header] === true}
                                      onChange={() => toggleTrackStock(category, itemIndex)}
                                      size="sm"
                                    />
                                  ) : editingCell.row === itemIndex && 
                                     editingCell.col === header && 
                                     editingCell.category === category ? (
                                    <Input
                                      type="text"
                                      value={editingValue}
                                      onChange={(e) => setEditingValue(e.target.value)}
                                      onBlur={saveEditedCell}
                                      onKeyDown={handleKeyDown}
                                      size="sm"
                                      className="w-full"
                                      autoFocus
                                    />
                                  ) : (
                                    <div 
                                      className="py-1 px-1 hover:bg-blue-50 cursor-pointer rounded"
                                      onClick={() => handleEditCell(category, itemIndex, header, item[header])}
                                    >
                                      {item[header] || "-"}
                                    </div>
                                  )}
                                </TableCell>
                              ))}
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    color="primary" 
                                    variant="flat" 
                                    size="sm"
                                    isIconOnly
                                    onPress={() => addNewVariant(category, itemIndex)}
                                    title="Add Variant"
                                  >
                                    <PlusCircle size={14} />
                                  </Button>
                                  <Button 
                                    color="danger" 
                                    variant="flat" 
                                    size="sm"
                                    isIconOnly
                                    onPress={() => removeItem(category, itemIndex)}
                                    title="Remove Item"
                                  >
                                    <X size={14} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Show message when no results found */}
        {Object.keys(getCategoriesDataToShow()).length === 0 && (
          <div className="p-8 text-center bg-white rounded-xl shadow-sm">
            <p className="text-lg text-gray-600">
              {searchTerm ? "No matching items found. Try a different search term." : "No items found in the selected category."}
            </p>
          </div>
        )}
      </motion.div>

      {/* New Category Modal */}
      <Modal
        isOpen={isNewCategoryOpen}
        onClose={onNewCategoryClose}
        placement="center"
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add New Category</ModalHeader>
          <ModalBody>
            <Input 
              label="Category Name"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onNewCategoryClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={addNewCategory}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Header Modal */}
      <Modal
        isOpen={isEditHeaderOpen}
        onClose={onEditHeaderClose}
        placement="center"
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Edit Column Header</ModalHeader>
          <ModalBody>
            <Input 
              label="Header Name"
              placeholder="Enter header name"
              value={editingHeaderValue}
              onChange={(e) => setEditingHeaderValue(e.target.value)}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onEditHeaderClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={saveEditedHeader}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
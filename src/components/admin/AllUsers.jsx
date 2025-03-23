import React, { useState, useMemo, useEffect } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  User, Chip, Pagination, Input, Button, Dropdown,
  DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem
} from "@heroui/react";
import { PlusIcon, SearchIcon, ChevronDownIcon } from "../../utils/Icons";
import { useNavigate } from "react-router-dom";
import jsonData from '../../utils/bizstack-datas.json';
import UserDetailModal from "./UserDetailModal"; // Import the modal component

// Constants
const STATUS_COLOR_MAP = {
  Blocked: "danger",
  Unblocked: "success",
};

const COLUMNS = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Business Name", uid: "businessName", sortable: true },
  { name: "Country", uid: "country", sortable: true },
  { name: "Status", uid: "blockStatus", sortable: true },
  { name: "Tier", uid: "tier", sortable: true },
  { name: "Email", uid: "email", sortable: true }
];

const STATUS_OPTIONS = ["All", "Blocked", "Unblocked"];
const BUSINESS_TYPES = ["All", "Retail", "Food Service", "Wholesale", "Manufacturing", "Services"];
const TIER_OPTIONS = ["All", "Free", "Basic", "Premium", "Pro", "Enterprise"];
const COUNTRIES = ["All", "INDIA", "India", "USA", "UK", "Canada", "Australia", "N/A", "Downtown"];

export default function AllUsers() {
  const navigate = useNavigate();
  
  // State
  const [users, setUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [visibleColumns, setVisibleColumns] = useState(new Set(COLUMNS.map(col => col.uid)));
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Load data
  useEffect(() => {
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    // Extract and normalize user data from nested structure
    const extractedUsers = Object.entries(jsonData.Bizstack).map(([id, userData]) => {
      // Access account details - typically in the first account (0)
      const accountData = userData.accounts?.[0] || {};
      
      return {
        id: id,
        username: userData.username || `user_${Math.floor(Math.random() * 1000)}`,
        email: userData.email || `user${Math.floor(Math.random() * 1000)}@example.com`,
        businessName: accountData.businessName || `Business_${Math.floor(Math.random() * 1000)}`,
        country: getRandomElement(COUNTRIES.filter(c => c !== "All")), // Excluding "All" for realistic data
        blockStatus: getRandomElement(["Blocked", "Unblocked"]),
        tier: getRandomElement(TIER_OPTIONS.filter(t => t !== "All")), // Excluding "All"
        businessType: getRandomElement(BUSINESS_TYPES.filter(b => b !== "All")), // Excluding "All"
        avatar: `https://i.pravatar.cc/150?u=${userData.email || Math.random()}`,
      };
    });
    
    setUsers(extractedUsers);
  }, []);

  // Filter items based on all criteria
  const filteredItems = useMemo(() => {
    let items = [...users];
    
    // Text search filter
    if (filterValue.trim()) {
      const lowercasedFilter = filterValue.toLowerCase();
      items = items.filter(item => 
        (item.username?.toLowerCase().includes(lowercasedFilter)) ||
        (item.email?.toLowerCase().includes(lowercasedFilter)) ||
        (item.businessName?.toLowerCase().includes(lowercasedFilter))
      );
    }
    
    // Status filter
    if (statusFilter !== "All") {
      items = items.filter(item => item.blockStatus === statusFilter);
    }
    
    // Business type filter
    if (businessTypeFilter !== "All") {
      items = items.filter(item => item.businessType === businessTypeFilter);
    }
    
    // Tier filter
    if (tierFilter !== "All") {
      items = items.filter(item => item.tier === tierFilter);
    }
    
    // Country filter
    if (countryFilter !== "All") {
      // Handle case-insensitive country matching
      items = items.filter(item => 
        item.country.toLowerCase() === countryFilter.toLowerCase()
      );
    }
    
    return items;
  }, [users, filterValue, statusFilter, businessTypeFilter, tierFilter, countryFilter]);

  // Sort items - Fixed: properly map 'name' field to 'username' for sorting
  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return filteredItems;
    
    return [...filteredItems].sort((a, b) => {
      // Fix: map 'name' sorting key to 'username' field
      const key = sortConfig.key === 'name' ? 'username' : sortConfig.key;
      
      // Handle possible undefined values
      let aValue = a[key] || "";
      let bValue = b[key] || "";
      
      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      // Return sort comparison
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });
  }, [filteredItems, sortConfig]);

  // Paginate items
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / rowsPerPage));
  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return sortedItems.slice(startIdx, startIdx + rowsPerPage);
  }, [sortedItems, currentPage, rowsPerPage]);

  // Visible columns
  const headerColumns = useMemo(() => 
    COLUMNS.filter(column => visibleColumns.has(column.uid)),
    [visibleColumns]
  );

  // Handlers
  const handleSort = (columnUid) => {
    setSortConfig(prevConfig => {
      // If clicking the same column, cycle through sort states
      if (prevConfig.key === columnUid) {
        // Cycle through: ascending -> descending -> no sort
        if (prevConfig.direction === "ascending") {
          return { key: columnUid, direction: "descending" };
        } else if (prevConfig.direction === "descending") {
          return { key: null, direction: "ascending" }; // Reset sort
        }
      }
      // New column, start with ascending
      return { key: columnUid, direction: "ascending" };
    });
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  const handleClearAllFilters = () => {
    setFilterValue("");
    setStatusFilter("All");
    setBusinessTypeFilter("All");
    setTierFilter("All");
    setCountryFilter("All");
    setCurrentPage(1);
  };

  // Cell renderer
  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: item.avatar,
              fallback: item.username?.charAt(0) || "U",
            }}
            description={item.email}
            name={item.username?.length > 15 ? `${item.username.substring(0, 15)}...` : item.username}
          />
        );
      case "businessName":
        return (
          <p className="text-sm capitalize">{item.businessName || "—"}</p>
        );
      case "blockStatus":
        return (
          <Chip
            className="capitalize"
            color={STATUS_COLOR_MAP[item.blockStatus] || "default"}
            size="sm"
            variant="flat"
          >
            {item.blockStatus || "Unknown"}
          </Chip>
        );
      case "country":
      case "tier":
      case "email":
        return (
          <p className="text-sm">{item[columnKey] || "—"}</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-md"
            placeholder="Search by name, email, or business name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => {
              setFilterValue("");
              setCurrentPage(1);
            }}
            onChange={(e) => {
              setFilterValue(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex gap-2 flex-wrap">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon />}
                  variant="flat"
                >
                  Status: {statusFilter}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filter by Status"
                selectionMode="single"
                selectedKeys={new Set([statusFilter])}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (selected) {
                    setStatusFilter(selected);
                    setCurrentPage(1);
                  }
                }}
              >
                {STATUS_OPTIONS.map((status) => (
                  <DropdownItem key={status} className="capitalize">
                    {status}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              variant="flat"
              endContent={<SearchIcon />}
              onClick={() => setAdvancedFiltersVisible(!advancedFiltersVisible)}
            >
              {advancedFiltersVisible ? "Hide Filters" : "Advanced Filters"}
            </Button>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Columns"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={visibleColumns}
                onSelectionChange={setVisibleColumns}
              >
                {COLUMNS.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button 
              color="primary" 
              onClick={() => setIsAddUserOpen(true)} 
              endContent={<PlusIcon />}
            >
              Add New
            </Button>
          </div>
        </div>

        {/* Advanced filters */}
        {advancedFiltersVisible && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-1">Business Type</label>
              <Select
                placeholder="Select business type"
                selectedKeys={[businessTypeFilter]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (selected) {
                    setBusinessTypeFilter(selected);
                    setCurrentPage(1);
                  }
                }}
                className="w-full"
              >
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tier</label>
              <Select
                placeholder="Select tier"
                selectedKeys={[tierFilter]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (selected) {
                    setTierFilter(selected);
                    setCurrentPage(1);
                  }
                }}
                className="w-full"
              >
                {TIER_OPTIONS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Select
                placeholder="Select country"
                selectedKeys={[countryFilter]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (selected) {
                    setCountryFilter(selected);
                    setCurrentPage(1);
                  }
                }}
                className="w-full"
              >
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                color="danger" 
                variant="light" 
                className="w-full"
                onClick={handleClearAllFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            Total {filteredItems.length} users
          </span>
          <label className="flex items-center text-gray-500 text-sm">
            Rows per page:
            <select
              className="ml-2 bg-white border rounded px-2 py-1"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 15, 20, 50].map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          aria-label="User Management Table"
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          sortDescriptor={sortConfig.key ? { column: sortConfig.key, direction: sortConfig.direction } : undefined}
          onSortChange={(descriptor) => {
            handleSort(descriptor.column);
          }}
          classNames={{
            wrapper: "max-h-[600px]",
            th: "bg-blue-100 text-blue-800 font-semibold py-3",
            tr: "hover:bg-blue-50 transition-colors cursor-pointer",
          }}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                <div className="flex items-center gap-1 text-base">
                  {column.name}
                  {sortConfig.key === column.uid && (
                    <span className="ml-1 text-blue-600">
                      {sortConfig.direction === "ascending" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </TableColumn>
            )}
          </TableHeader>
          <TableBody 
            emptyContent={
              <div className="py-8 text-center">
                No users found matching your filters.
              </div>
            }
            items={paginatedItems}
          >
            {(item) => (
              <TableRow 
                key={item.id || item.email} 
                onClick={() => handleRowClick(item)}
              >
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="py-4 flex justify-between items-center">
        <span className="text-gray-500 text-sm">
          {selectedKeys.size > 0 ? `${selectedKeys.size} selected` : ""}
        </span>
        
        <Pagination
          showControls
          page={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
          classNames={{
            wrapper: "gap-0 overflow-visible",
            item: "bg-white",
            cursor: "bg-blue-500 text-white font-bold"
          }}
        />
        
        <div className="hidden sm:flex gap-2">
          <Button
            isDisabled={currentPage === 1}
            size="sm"
            variant="flat"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Button
            isDisabled={currentPage === totalPages || totalPages === 0}
            size="sm"
            variant="flat"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedItem}
        onSave={handleSaveUser}
      />
      
      {/* Add User Modal placeholder */}
      {isAddUserOpen && (
        <div className="modal">
          {/* Add user form would go here */}
          <Button onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
        </div>
      )}
    </div>
  );
}
import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@heroui/react";
import { motion } from "framer-motion";
import { User, Settings, LogOut, Menu } from "lucide-react";

export const NavBar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Projects", href: "/projects" },
    { name: "Analytics", href: "/analytics" },
    { name: "Settings", href: "/settings" }
  ];

  return (
    <Navbar className="py-2 px-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Mobile menu button - only visible on small screens */}
      {/* <div className="flex md:hidden">
        <Button
          className="p-0 bg-transparent min-w-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </Button>
      </div> */}

      {/* Brand logo - centered on mobile */}
      <NavbarBrand className="flex-1 md:flex-none justify-center md:justify-start">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-bold text-xl text-blue-600">
              BIZSTACK
            </p>
          </motion.div>
        </Link>
      </NavbarBrand>
    
      
      {/* User profile and notification buttons */}
      <NavbarContent justify="end" className="flex-1 md:flex-none">
        <div className="flex items-center gap-2">
          <NavbarItem className="hidden sm:flex">
            <Button 
              as={Link} 
              href="/notifications" 
              variant="light"
              className="text-gray-700 bg-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </Button>
          </NavbarItem>

          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button 
                  className="p-0 bg-transparent min-w-0"
                  radius="full"
                  variant="light"
                >
                  <Avatar
                    src="https://i.pravatar.cc/150?u=admin"
                    size="sm"
                    className="transition-transform border-2 border-gray-200"
                    isBordered
                    color="primary"
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold text-blue-600">admin@bizstack.com</p>
                </DropdownItem>
                <DropdownItem key="profile" startContent={<User size={18} />}>
                  My Profile
                </DropdownItem>
                <DropdownItem key="settings" startContent={<Settings size={18} />}>
                  Account Settings
                </DropdownItem>
                <DropdownItem key="logout" startContent={<LogOut size={18} />} className="text-danger" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </div>
      </NavbarContent>
      
      {/* Mobile menu - conditionally rendered */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md z-50 md:hidden border-b border-gray-200">
          <div className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`py-3 px-4 rounded-md font-medium text-sm transition-colors ${
                  activeItem === item.name ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsMenuOpen(false);
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </Navbar>
  );
};
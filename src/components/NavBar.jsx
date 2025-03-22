import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";
import { motion } from "framer-motion";

export const NavBar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const navItems = [
    { name: "Home", href: "/", isActive: false },
    { name: "Home", href: "/", isActive: true },
    { name: "Home", href: "/", isActive: false },
  ];

  return (
    <Navbar className="py-4 backdrop-blur-md bg-white/70 border-b border-gray-100">
      <NavbarBrand>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p 
            className="font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            BIZSTACK
          </motion.p>
        </motion.div>
      </NavbarBrand>
      
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {navItems.map((item, index) => (
          <NavbarItem key={item.name} isActive={item.isActive}>
            <motion.div
              onHoverStart={() => setHoveredItem(item.name)}
              onHoverEnd={() => setHoveredItem(null)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                color={item.isActive ? "primary" : "foreground"} 
                href={item.href}
                className="relative px-2 py-1 font-medium"
              >
                {item.name}
                {item.isActive || hoveredItem === item.name ? (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : null}
              </Link>
            </motion.div>
          </NavbarItem>
        ))}
      </NavbarContent>
      
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10,
              duration: 0.5, 
              delay: 0.3 
            }}
          >
            <Link href="#" className="font-medium">Login</Link>
          </motion.div>
        </NavbarItem>
        <NavbarItem>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              as={Link} 
              href="#" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg"
            >
              Sign Up
            </Button>
          </motion.div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
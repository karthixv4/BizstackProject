import { useState } from 'react'
import {Button} from "@heroui/react";
import { NavBar } from './components/NavBar';
// import Loader from './components/loader/Loader';
// import ExcelHandler from './components/ExcelHandler';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminBasePage from './components/admin/AdminBasePage';
import  AllUsers from './components/admin/AllUsers'
import UserBasePage from './components/user/UserBasePage';
import ImportData from './components/user/Try';
import BasePage from './components/BasePage';
function App() {

  return (
    <>
    <NavBar />
    {/* <AdminBasePage /> */}
    
    <Routes>
    <Route path="/all/resources" element={<AllUsers />} />
    <Route path="/user/base" element={<UserBasePage />} />
    <Route path="/user/import" element={<ImportData />} />
    <Route path='/' element={<BasePage />} />
    </Routes>
    {/* <ExcelHandler /> */}
    {/* <Loader /> */}
    </>
  )
}

export default App

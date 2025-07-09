import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { InterviewProvider } from '../context/InterviewContext';

const Layout = () => {
  return (
    <InterviewProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </InterviewProvider>
  );
};

export default Layout;
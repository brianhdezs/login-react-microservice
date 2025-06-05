import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, showNavbar = true, showFooter = true }) => {
  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "main-content" : ""}>
        <main className="fade-in-up">
          {children}
        </main>
      </div>
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;
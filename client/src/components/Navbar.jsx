import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    navigate('/login');
  };

  return (
    <nav className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">CRM Dashboard</h1>
      <ul className="flex space-x-6">
        <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
        <li><Link to="/leads" className="hover:underline">Leads</Link></li>
        <li><Link to="/campaigns" className="hover:underline">Campaigns</Link></li>
        <li><Link to="/workflows" className="hover:underline">Workflows</Link></li>
        <li>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import { FaHome, FaUsers, FaCog, FaChartLine, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isInvestorOpen, setIsInvestorOpen] = useState(false);

  const toggleInvestorDropdown = () => {
    setIsInvestorOpen(!isInvestorOpen);
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
     
      <nav className="flex-grow p-4 space-y-4">
        <Link to="/dashboard" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded">
          <FaHome />
          <span>Dashboard</span>
        </Link>

        <Link to="/users" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded">
          <FaUsers />
          <span>Users</span>
        </Link>

        <a href="#" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded">
          <FaChartLine />
          <span>Reports</span>
        </a>
        
        <a href="#" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded">
          <FaCog />
          <span>Settings</span>
        </a>

        {/* Investor Dropdown */}
        <div className="relative">
          <button
            className="flex items-center justify-between w-full hover:bg-gray-700 p-2 rounded"
            onClick={toggleInvestorDropdown}
          >
            <span className="flex items-center space-x-3">
              <FaUsers />
              <span>Investor</span>
            </span>
            {isInvestorOpen ? <FaAngleUp /> : <FaAngleDown />}
          </button>

          {isInvestorOpen && (
            <div className="pl-8 mt-2 space-y-2">
              <Link
                to="/create-investor"
                className="block hover:bg-gray-700 p-2 rounded text-sm"
              >
                Create Investor
              </Link>
              <Link
                to="/investors"
                className="block hover:bg-gray-700 p-2 rounded text-sm"
              >
                Manage Investor
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

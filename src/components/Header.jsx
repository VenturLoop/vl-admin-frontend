import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage to log the user out
    localStorage.removeItem("authToken");

    // Redirect the user to the login page
    navigate("/");
  };

  return (
    <header className="w-full bg-gray-200 px-4 py-3 shadow">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">VentureLoop Admin Panel</h1>

        <div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

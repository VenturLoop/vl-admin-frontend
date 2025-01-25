import Sidebar from "./Sidebar"; // Sidebar component
import Header from "./Header"; // Header component

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar: Fixed to the screen */}
      <div className="w-64 h-screen bg-gray-800 sticky top-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header: Start after the sidebar */}
        <div className="w-full bg-gray-200 px-4 py-3 shadow">
          <Header />
        </div>

        {/* Content: Scrollable */}
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

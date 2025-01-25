import Dashboard from "../components/Dashboard";

const DashboardPage = () => {
  return (
    <div className="flex">
      <main className="flex-grow bg-gray-100 p-4">
        <Dashboard />
      </main>
    </div>
  );
};

export default DashboardPage;

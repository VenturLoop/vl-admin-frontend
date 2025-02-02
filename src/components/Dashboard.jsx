import { useState, useEffect } from "react";
import axios from "axios";
import PageLoader from "./PageLoder";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [premiumUsers, setPremiumUsers] = useState(null);
  const [investorCount, setInvestorCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersResponse, premiumResponse, investorResponse] = await Promise.all([
          axios.get("https://backendv3-wmen.onrender.com/api//users/count"),
          axios.get("https://backendv3-wmen.onrender.com/api/premium/count"),
          axios.get("https://backendv3-wmen.onrender.com/api/investor-count"),
        ]);

        setTotalUsers(usersResponse.data.count || 0);
        setPremiumUsers(premiumResponse.data.count || 0);
        setInvestorCount(investorResponse.data.count || 0);
        setError("");
      } catch (err) {
        console.error("Error fetching counts:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <PageLoader/>
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold">Total Users</h2>
        <p className="text-3xl font-bold">{totalUsers}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold">Premium Users</h2>
        <p className="text-3xl font-bold">{premiumUsers}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold">Investors</h2>
        <p className="text-3xl font-bold">{investorCount}</p>
      </div>
    </div>
  );
};

export default Dashboard;

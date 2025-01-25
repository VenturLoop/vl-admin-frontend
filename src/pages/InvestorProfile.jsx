import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageLoader from "../components/PageLoder";

const InvestorProfile = () => {
  const { id } = useParams(); // Get the investor ID from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const response = await axios.get(
          `https://backendv3-wmen.onrender.com/api/get-investor/${id}`
        );
        setInvestor(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching investor:", err);
        setError("Failed to load investor details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [id]);

  const handleEditClick = () => {
    navigate(`/edit-investor/${id}`);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!investor) {
    return <div className="text-center mt-4">No data found.</div>;
  }

  return (
    <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
      <div className="flex flex-col md:flex-row">
        {/* Profile Picture and Edit Button */}
        <div className="md:w-1/3 text-center mb-8 md:mb-0">
          <img
            src={investor.investor.image}
            alt={`${investor.investor.name}'s Profile`}
            className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-indigo-800 transition-transform duration-300 hover:scale-105 ring ring-gray-300"
          />
          <button
            onClick={handleEditClick}
            className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 ring ring-gray-300 hover:ring-indigo-300"
          >
            Edit Profile
          </button>
        </div>

        {/* Investor Details */}
        <div className="md:w-2/3 md:pl-8">
          <h1 className="text-2xl font-bold text-indigo-800 mb-2">{investor.name}</h1>
          <p className="text-gray-600 mb-6">{investor.investor.description}</p>

          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Geography</h2>
          <p className="text-gray-700 mb-6">{investor.investor.geography}</p>

          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Investment Stages</h2>
          <p className="text-gray-700 mb-6">{investor.investor.investmentStages}</p>

          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Investor Type</h2>
          <p className="text-gray-700 mb-6">{investor.investor.investorType}</p>

          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Contact Information</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <a
                href={investor.investor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {investor.investor.website}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvestorProfile;

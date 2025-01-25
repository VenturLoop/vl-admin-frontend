import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import countries from "./Countries";

const UpdateInvestorForm = () => {
  const { id } = useParams(); // Get the investor ID from the URL
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    image: "",
    portfolioCompanies: [{ name: "", logo: "", link: "" }], // Default to an empty array
    description: "",
    geography: "",
    investmentStages: "",
    businessModel: "",
    investorType: "",
    sectorInterested: "",
    checkSize: "",
    headquarter: "",
    contactLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch existing investor data when the component mounts
  useEffect(() => {
    const fetchInvestorData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://backendv3-wmen.onrender.com/api/get-investor/${id}`
        );
        const fetchedData = response.data;
        setFormData({
          name: fetchedData.investor.name || "",
          website: fetchedData.investor.website || "",
          image: fetchedData.investor.image || "",
          portfolioCompanies: Array.isArray(fetchedData.investor.portfolioCompanies)
            ? fetchedData.investor.portfolioCompanies
            : [{ name: "", logo: "", link: "" }],
          description: fetchedData.investor.description || "",
          geography: fetchedData.investor.geography || "",
          investmentStages: fetchedData.investor.investmentStages || "",
          businessModel: fetchedData.investor.businessModel || "",
          investorType: fetchedData.investor.investorType || "",
          sectorInterested: fetchedData.investor.sectorInterested || "",
          checkSize: fetchedData.investor.checkSize || "",
          headquarter: fetchedData.investor.headquarter || "",
          contactLink: fetchedData.investor.contactLink || "",
        });
      } catch (err) {
        setError("Error fetching investor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorData();
  }, [id]);

  // Handle input change for main fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle input change for portfolio companies
  const handlePortfolioChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPortfolio = [...formData.portfolioCompanies];
    updatedPortfolio[index][name] = value;
    setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
  };

  // Add a new portfolio company
  const addPortfolioCompany = () => {
    setFormData({
      ...formData,
      portfolioCompanies: [
        ...formData.portfolioCompanies,
        { name: "", logo: "", link: "" },
      ],
    });
  };

  // Remove a portfolio company
  const removePortfolioCompany = (index) => {
    const updatedPortfolio = formData.portfolioCompanies.filter((_, i) => i !== index);
    setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
  };

  // Handle form submission for update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Send a PUT request to update the investor
      const response = await axios.put(
        `https://backendv3-wmen.onrender.com/api/update-investor/${id}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess("Investor updated successfully!");
      navigate("/investors"); // Redirect to investors page after update
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-300 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Investor</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Investor Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {/* Website */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {/* Image */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Portfolio Companies */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Portfolio Companies</label>
          {formData.portfolioCompanies.map((company, index) => (
            <div key={index} className="mb-2 flex items-center space-x-2">
              <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={company.name}
                onChange={(e) => handlePortfolioChange(index, e)}
                className="flex-1 border-gray-300 rounded-lg p-2"
                required
              />
              <input
                type="url"
                name="logo"
                placeholder="Logo URL"
                value={company.logo}
                onChange={(e) => handlePortfolioChange(index, e)}
                className="flex-1 border-gray-300 rounded-lg p-2"
              />
              <input
                type="url"
                name="link"
                placeholder="Website Link"
                value={company.link}
                onChange={(e) => handlePortfolioChange(index, e)}
                className="flex-1 border-gray-300 rounded-lg p-2"
              />
              <button
                type="button"
                onClick={() => removePortfolioCompany(index)}
                className="text-red-500 font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPortfolioCompany}
            className="text-blue-500 font-semibold mt-2"
          >
            + Add Portfolio Company
          </button>
        </div>

          {/* Investor Type Dropdown */}
          <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Investor Type</label>
          <select
            name="investorType"
            value={formData.investorType}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Investor Type</option>
            <option value="Angel Investors">Angel Investors</option>
            <option value="Venture Capitalists (VCs)">Venture Capitalists (VCs)</option>
            <option value="Micro VCs">Micro VCs</option>
            <option value="Corporate Venture Capital (CVC)">Corporate Venture Capital (CVC)</option>
            <option value="Accelerators and Incubators">Accelerators and Incubators</option>
            <option value="Private Equity (PE) Investors">Private Equity (PE) Investors</option>
            <option value="Family Offices">Family Offices</option>
            <option value="Crowdfunding Investors">Crowdfunding Investors</option>
            <option value="Syndicates (Angel Syndicates/VC Syndicates)">Syndicates (Angel Syndicates/VC Syndicates)</option>
            <option value="Hedge Funds">Hedge Funds</option>
            <option value="Sovereign Wealth Funds">Sovereign Wealth Funds</option>
            <option value="Government Grants and Funds">Government Grants and Funds</option>
            <option value="Strategic Investors">Strategic Investors</option>
            <option value="Banks (Debt Financing)">Banks (Debt Financing)</option>
            <option value="Friends and Family">Friends and Family</option>
            <option value="Bootstrap (Self-Funding)">Bootstrap (Self-Funding)</option>
            <option value="Fund of Funds (FoF)">Fund of Funds (FoF)</option>
            <option value="Social Impact Investors">Social Impact Investors</option>
            <option value="Pension Funds">Pension Funds</option>
          </select>
        </div>

        {/* Investment Stages Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Investment Stages</label>
          <select
            name="investmentStages"
            value={formData.investmentStages}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Investment Stage</option>
            {["Idea Stage", "Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Series D (and beyond)", "IPO (Initial Public Offering)", "Growth Stage"].map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* Business Model Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Business Model</label>
          <select
            name="businessModel"
            value={formData.businessModel}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Business Model</option>
            {[
              "C2B (Consumer to Business)",
              "D2C (Direct to Consumer)",
              "B2G (Business to Government)",
              "G2B (Government to Business)",
              "G2C (Government to Consumer)",
              "P2P (Peer to Peer)",
              "B2B SaaS (Software as a Service for Businesses)",
              "C2C SaaS (Consumer to Consumer Software)",
              "B2E (Business to Employee)",
              "B2B Marketplace",
              "B2C Marketplace",
              "B2B2G (Business to Business to Government)",
              "Franchise Model",
              "Subscription Model",
              "Freemium Model",
              "On-Demand Model",
              "Aggregator Model",
              "White Labeling",
              "Licensing Model",
            ].map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Check Size Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Check Size</label>
          <select
            name="checkSize"
            value={formData.checkSize}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Check Size</option>
            {[
              "$10,000 - $100,000",
              "$100,000 - $500,000",
              "$500,000 - $2 million",
              "$2 million - $10 million",
              "$10 million - $25 million",
              "$25 million - $100 million+",
              "$500,000 - $50 million+",
              "$10 million - $100 million+",
            ].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Geography Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Geography</label>
          <select
            name="geography"
            value={formData.geography}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Geography</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>


        {/* Other Fields */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "description", label: "Description", type: "text" },
            { name: "geography", label: "Geography", type: "text" },
            { name: "sectorInterested", label: "Sector Interested", type: "text" },
            { name: "headquarter", label: "Headquarter", type: "text" },
            { name: "contactLink", label: "Contact Link", type: "url" },
          ].map(({ name, label, type }) => (
            <div key={name} className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg p-2"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg font-semibold mt-4"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Investor"}
        </button>
      </form>
    </div>
  );
};

export default UpdateInvestorForm;

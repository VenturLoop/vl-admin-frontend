import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Import constants (if needed)
import {
  businessModels,
  sectors,
  investorTypes,
  geographies,
  investmentStages,
} from "./constants";

const EditInvestorPage = () => {
  const { id } = useParams(); // Get the investor ID from the route
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    image: "",
    imageSource: "url",
    description: "",
    geography: "",
    investmentStages: "",
    businessModel: [],
    investorType: "",
    sectorInterested: [],
    checkSize: "",
    headquarter: "",
    contactLink: "",
    portfolioCompanies: [],
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchInvestorData = async () => {
      try {
        const response = await axios.get(
          `https://backendv3-wmen.onrender.com/api/get-investor/${id}`
        );
        const data = response.data;

        // Log the API response to verify the structure
        console.log("API Response:", data);

        // Map portfolioCompanies to include logoType
        const portfolioCompanies = data.investor.portfolioCompanies.map(
          (company) => ({
            name: company.name || "",
            logo: company.logo || "",
            logoSource: company.logo ? "url" : "upload", // Set logoSource based on existing logo
            link: company.link || "",
          })
        );

        // Update formData with the fetched data
        setFormData({
          name: data.investor.name || "",
          website: data.investor.website || "",
          image: data.investor.image || "",
          imageSource: data.investor.image ? "url" : "upload",
          description: data.investor.description || "",
          geography: data.investor.geography || "",
          investmentStages: data.investor.investmentStages || "",
          businessModel: data.investor.businessModel || [],
          investorType: data.investor.investorType || "",
          sectorInterested: data.investor.sectorInterested || [],
          checkSize: data.investor.checkSize || "",
          headquarter: data.investor.headquarter || "",
          contactLink: data.investor.contactLink || "",
          portfolioCompanies: portfolioCompanies, // Set portfolioCompanies with mapped data
        });
      } catch (error) {
        console.error("Error fetching investor data:", error);
        setError("Failed to fetch investor data.");
      }
    };
    fetchInvestorData();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.website || !formData.description) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `https://backendv3-wmen.onrender.com/api/update-investor/${id}`,
        formData
      );

      if (response.status === 200) {
        setSuccess("Investor updated successfully!");
        navigate("/investors");
      }
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error);
      setError(
        error.response?.data?.message ||
        "An error occurred while updating the investor."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes for arrays (e.g., businessModel, sectorInterested)
  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const newValue = prevState[name].includes(value)
        ? prevState[name].filter((item) => item !== value)
        : [...prevState[name], value];
      return { ...prevState, [name]: newValue };
    });
  };

  // Handle removing selected items from arrays
  const handleRemoveSelection = (type, value) => {
    if (type === "sectorInterested") {
      setFormData((prev) => ({
        ...prev,
        sectorInterested: prev.sectorInterested.filter(
          (item) => item !== value
        ),
      }));
    } else if (type === "businessModel") {
      setFormData((prev) => ({
        ...prev,
        businessModel: prev.businessModel.filter((item) => item !== value),
      }));
    }
  };

  // Handle image source change
  const handleImageSourceChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      imageSource: value,
      image: "", // Reset the image field when switching sources
    }));
  };


  // Remove a portfolio company

  const toggleLogoType = (index, type) => {
    setFormData((prevState) => {
      const updatedPortfolio = [...prevState.portfolioCompanies];
      updatedPortfolio[index].logoSource = type;
      updatedPortfolio[index].logo = ""; // Reset the logo field when switching types
      return { ...prevState, portfolioCompanies: updatedPortfolio };
    });
  };

  const removeCompany = (index) => {
    const updatedCompanies = formData.portfolioCompanies.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, portfolioCompanies: updatedCompanies });
  };

  // Handle portfolio company field changes
  const handlePortfolioChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPortfolio = [...formData.portfolioCompanies];
    updatedPortfolio[index][name] = value;
    setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
  };

  // Add a new portfolio company
  const addPortfolioCompany = () => {
    setFormData((prev) => ({
      ...prev,
      portfolioCompanies: [
        ...prev.portfolioCompanies,
        { name: "", logo: "", logoSource: "upload", link: "" },
      ],
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append("file", file);

    try {
      setImageLoading(true);
      const response = await axios.post(
        "https://backendv3-wmen.onrender.com/api/fileUpload",
        imageFormData
      );

      if (response.data.status && response.data.data) {
        const url = response.data.data[0].url;
        const updatedPortfolio = [...formData.portfolioCompanies];
        updatedPortfolio[index].logo = url;
        setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
        setSuccess("Image uploaded successfully!");
        setError("");
      } else {
        setError("Image upload failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while uploading the image.");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Update Investor</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
            required
          />
        </div>


        <div>
          <label className="block text-sm font-medium">Profile Image Source</label>
          <div className="items-center space-x-4 mt-2">
            <button
              type="button"
              onClick={() => handleImageSourceChange({ target: { value: "url" } })}
              className={`w-24 h-10 p-2 text-center rounded-l ${formData.imageSource === "url" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() => handleImageSourceChange({ target: { value: "upload" } })}
              className={`w-24 h-10 p-2 text-center rounded-r ${formData.imageSource === "upload" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              Upload
            </button>
          </div>

          {/* Display Profile Image Input Based on Source */}
          {formData.imageSource === "url" ? (
            <div>
              <label className="block text-sm font-medium mt-3">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
                placeholder="Enter Image URL"
              />
              {/* Display Image Preview */}
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mt-3">Upload Image</label>
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, "profile")}
                className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
              />
              {/* Display Uploaded Image Preview */}
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Uploaded Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Website Field */}
        <div>
          <label className="block text-sm font-medium">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
            required
          />
        </div>

        {/* Portfolio Companies */}
        <div>
          <h2 className="text-lg font-semibold">Portfolio Companies</h2>
          {formData.portfolioCompanies.map((company, index) => (
            <div
              key={index}
              className="space-y-4 mt-4 border p-4 rounded-lg bg-gray-800"
            >
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium">
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={company.name}
                  onChange={(e) => handlePortfolioChange(index, e)}
                  className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                  required
                />
              </div>

              {/* Logo Selection */}
              <div>
                <label className="block text-sm font-medium">
                  Company Logo
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded ${company.logoSource === "upload"
                      ? "bg-blue-600"
                      : "bg-gray-700"
                      }`}
                    onClick={() => toggleLogoType(index, "upload")}
                  >
                    Upload Image
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded ${company.logoSource === "url"
                      ? "bg-blue-600"
                      : "bg-gray-700"
                      }`}
                    onClick={() => toggleLogoType(index, "url")}
                  >
                    Enter URL
                  </button>
                </div>

                {company.logoSource === "upload" ? (
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, index)}
                    className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white mt-2"
                  />
                ) : (
                  <input
                    type="url"
                    name="logo"
                    value={company.logo}
                    onChange={(e) => handlePortfolioChange(index, e)}
                    className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white mt-2"
                    placeholder="Enter Image URL"
                  />
                )}

                {/* Display Logo Preview */}
                {company.logo && (
                  <img
                    src={company.logo}
                    alt="Logo"
                    className="h-16 mt-2 rounded-lg shadow-md"
                  />
                )}
              </div>

              {/* Company Link */}
              <div>
                <label className="block text-sm font-medium">
                  Company Website
                </label>
                <input
                  type="url"
                  name="link"
                  value={company.link}
                  onChange={(e) => handlePortfolioChange(index, e)}
                  className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                  required
                />
              </div>

              {/* Remove Company Button */}
              <button
                type="button"
                onClick={() => removeCompany(index)}
                className="bg-red-600 text-white px-4 py-2 rounded mt-2"
              >
                Remove Company
              </button>
            </div>
          ))}

          {/* Add New Company Button */}
          <button
            type="button"
            onClick={addPortfolioCompany}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Add Another Company
          </button>
        </div>

        {/* Geography Field */}
        <div>
          <label className="block text-sm font-medium">Geography</label>
          <select
            name="geography"
            value={formData.geography}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
          >
            <option value="">Select Geography</option>
            {geographies.map((geo) => (
              <option key={geo} value={geo}>
                {geo}
              </option>
            ))}
          </select>
        </div>

        {/* Investment Stages Field */}
        <div>
          <label className="block text-sm font-medium">Investment Stages</label>
          <select
            name="investmentStages"
            value={formData.investmentStages}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
          >
            <option value="">Select Investment Stage</option>
            {investmentStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* Investor Type Field */}
        <div>
          <label className="block text-sm font-medium">Investor Type</label>
          <select
            name="investorType"
            value={formData.investorType}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
          >
            <option value="">Select Investor Type</option>
            {investorTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Interested Field */}
        <div>
          <label className="block text-sm font-medium">Sector Interested</label>
          <div className="space-x-4 mb-4">
            {sectors.map((sector) => (
              <button
                type="button"
                key={sector}
                onClick={() =>
                  handleCheckboxChange({
                    target: { name: "sectorInterested", value: sector },
                  })
                }
                className={`p-2 mb-2 ${formData.sectorInterested.includes(sector)
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300"
                  } rounded`}
              >
                {sector}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap space-x-2">
            {formData.sectorInterested?.map((selectedItem) => (
              <div
                key={selectedItem}
                className="bg-green-600 text-white px-4 py-1 rounded flex items-center space-x-2"
              >
                <span>{selectedItem}</span>
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveSelection("sectorInterested", selectedItem)
                  }
                  className="text-xs font-semibold text-red-500"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Business Model Field */}
        <div>
          <label className="block text-sm font-medium">Business Model</label>
          <div className="space-x-4 mb-4">
            {businessModels.map((model) => (
              <button
                type="button"
                key={model}
                onClick={() =>
                  handleCheckboxChange({
                    target: { name: "businessModel", value: model },
                  })
                }
                className={`p-2 mb-2 ${formData.businessModel.includes(model)
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300"
                  } rounded`}
              >
                {model}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap space-x-2">
            {formData.businessModel?.map((selectedItem) => (
              <div
                key={selectedItem}
                className="bg-green-600 text-white px-4 py-1 rounded flex items-center space-x-2"
              >
                <span>{selectedItem}</span>
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveSelection("businessModel", selectedItem)
                  }
                  className="text-xs font-semibold text-red-500"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Check Size */}
        <div>
          <label className="block text-sm font-medium">Check Size</label>
          <input
            type="text"
            name="checkSize"
            value={formData.checkSize}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
            required
          />
        </div>

        {/* Headquarter */}
        <div>
          <label className="block text-sm font-medium">Headquarter</label>
          <input
            type="text"
            name="headquarter"
            value={formData.headquarter}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
            required
          />
        </div>

        {/* Contact Link */}
        <div>
          <label className="block text-sm font-medium">Contact Link</label>
          <input
            type="url"
            name="contactLink"
            value={formData.contactLink}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            "Update Investor"
          )}
        </button>

        {/* Error and Success Messages */}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
};

export default EditInvestorPage;

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

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import countries from "./Countries";

// const UpdateInvestorForm = () => {
//   const { id } = useParams(); // Get the investor ID from the URL
//   const [formData, setFormData] = useState({
//     name: "",
//     website: "",
//     image: "",
//     portfolioCompanies: [
//       { name: "", logo: "", logoSource: "upload", link: "" },
//     ], // Added logoSource
//     description: "",
//     geography: "",
//     investmentStages: "",
//     businessModel: "",
//     investorType: "",
//     sectorInterested: "",
//     checkSize: "",
//     headquarter: "",
//     contactLink: "",
//   });

//   const checkSizes = [
//     "$10,000 - $100,000",
//     "$100,000 - $500,000",
//     "$500,000 - $2 million",
//     "$2 million - $10 million",
//     "$10 million - $25 million",
//     "$25 million - $100 million+",
//   ];

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [imagePreview, setImagePreview] = useState(""); // For investor image preview
//   const [portfolioPreviews, setPortfolioPreviews] = useState([]); // For portfolio logo previews
//   const navigate = useNavigate();

//   // Fetch existing investor data when the component mounts
//   useEffect(() => {
//     const fetchInvestorData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `https://backendv3-wmen.onrender.com/api/get-investor/${id}`
//         );
//         console.log("Fetched Data:", response.data); // Debugging

//         const fetchedData = response.data.investor;

//         if (!fetchedData) {
//           setError("No investor data found.");
//           return;
//         }

//         setFormData({
//           name: fetchedData.name || "",
//           website: fetchedData.website || "",
//           image: fetchedData.image || "",
//           portfolioCompanies: Array.isArray(fetchedData.portfolioCompanies)
//             ? fetchedData.portfolioCompanies.map((company) => ({
//                 ...company,
//                 logoSource: company.logo ? "url" : "upload", // Set logoSource based on existing data
//               }))
//             : [{ name: "", logo: "", logoSource: "upload", link: "" }],
//           description: fetchedData.description || "",
//           geography: fetchedData.geography || "",
//           investmentStages: fetchedData.investmentStages || "",
//           businessModel: fetchedData.businessModel || "",
//           investorType: fetchedData.investorType || "",
//           sectorInterested: fetchedData.sectorInterested || "",
//           checkSize: fetchedData.checkSize || "",
//           headquarter: fetchedData.headquarter || "",
//           contactLink: fetchedData.contactLink || "",
//         });

//         // Set image preview for investor image
//         if (fetchedData.image) {
//           setImagePreview(fetchedData.image);
//         }

//         // Set image previews for portfolio companies
//         if (Array.isArray(fetchedData.portfolioCompanies)) {
//           setPortfolioPreviews(
//             fetchedData.portfolioCompanies.map((company) => company.logo || "")
//           );
//         }
//       } catch (err) {
//         setError("Error fetching investor data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvestorData();
//   }, [id]);

//   // Handle input change for main fields
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle image source change (URL or Upload)
//   const handleImageSourceChange = (e) => {
//     const { value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       imageSource: value,
//       image: "", // Reset the image field when switching sources
//     }));
//     setImagePreview(""); // Reset image preview
//   };

//   // Handle portfolio logo source change (URL or Upload)
//   const handlePortfolioLogoSourceChange = (index, e) => {
//     const { value } = e.target;
//     const updatedPortfolio = [...formData.portfolioCompanies];
//     updatedPortfolio[index].logoSource = value;
//     updatedPortfolio[index].logo = ""; // Reset the logo field when switching sources
//     setFormData({ ...formData, portfolioCompanies: updatedPortfolio });

//     // Reset portfolio logo preview
//     const updatedPreviews = [...portfolioPreviews];
//     updatedPreviews[index] = "";
//     setPortfolioPreviews(updatedPreviews);
//   };

//   // Handle image upload
//   const handleImageUpload = async (e, field, index = null) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Generate a temporary URL for image preview
//     const tempUrl = URL.createObjectURL(file);
//     if (field === "image") {
//       setImagePreview(tempUrl); // Set preview for investor image
//     } else if (field === "portfolioLogo" && index !== null) {
//       const updatedPreviews = [...portfolioPreviews];
//       updatedPreviews[index] = tempUrl;
//       setPortfolioPreviews(updatedPreviews); // Set preview for portfolio logo
//     }

//     const imageFormData = new FormData();
//     imageFormData.append("file", file);

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "https://backendv3-wmen.onrender.com/api/fileUpload",
//         imageFormData
//       );

//       if (response.data.status && response.data.data) {
//         const url = response.data.data[0].url;
//         if (field === "image") {
//           setFormData((prev) => ({ ...prev, image: url }));
//         } else if (field === "portfolioLogo" && index !== null) {
//           const updatedPortfolio = [...formData.portfolioCompanies];
//           updatedPortfolio[index].logo = url;
//           setFormData((prev) => ({
//             ...prev,
//             portfolioCompanies: updatedPortfolio,
//           }));
//         }
//         setSuccess("Image uploaded successfully!");
//         setError("");
//       } else {
//         setError("Image upload failed. Please try again.");
//       }
//     } catch (err) {
//       setError("An error occurred while uploading the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle portfolio company input change
//   const handlePortfolioChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedPortfolio = [...formData.portfolioCompanies];
//     updatedPortfolio[index][name] = value;
//     setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
//   };

//   // Add a new portfolio company
//   const addPortfolioCompany = () => {
//     setFormData((prev) => ({
//       ...prev,
//       portfolioCompanies: [
//         ...prev.portfolioCompanies,
//         { name: "", logo: "", logoSource: "upload", link: "" },
//       ],
//     }));
//     setPortfolioPreviews((prev) => [...prev, ""]); // Add an empty preview for the new company
//   };

//   // Remove a portfolio company
//   const removePortfolioCompany = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       portfolioCompanies: prev.portfolioCompanies.filter((_, i) => i !== index),
//     }));
//     setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index)); // Remove the corresponding preview
//   };

//   // Handle form submission for update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       // Send a PUT request to update the investor
//       const response = await axios.put(
//         `https://backendv3-wmen.onrender.com/api/update-investor/${id}`,
//         formData,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setSuccess("Investor updated successfully!");
//       navigate("/investors"); // Redirect to investors page after update
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto bg-gray-300 shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-semibold mb-4">Edit Investor</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {success && <p className="text-green-500 mb-4">{success}</p>}
//       <form onSubmit={handleSubmit}>
//         {/* Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investor Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//             required
//           />
//         </div>

//         {/* Website */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Website
//           </label>
//           <input
//             type="url"
//             name="website"
//             value={formData.website}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//             required
//           />
//         </div>

//         {/* Image */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Image URL or Upload
//           </label>
//           <div className="flex items-center space-x-2">
//             <select
//               name="imageSource"
//               onChange={handleImageSourceChange}
//               className="border-gray-300 rounded-lg p-2"
//             >
//               <option value="url">URL</option>
//               <option value="upload">Upload</option>
//             </select>
//             {formData.imageSource === "url" ? (
//               <input
//                 type="url"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleChange}
//                 className="flex-1 border-gray-300 rounded-lg p-2"
//               />
//             ) : (
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleImageUpload(e, "image")}
//                 className="flex-1 border-gray-300 rounded-lg p-2"
//               />
//             )}
//           </div>
//           {imagePreview && (
//             <div className="mt-2">
//               <img
//                 src={imagePreview}
//                 alt="Investor Preview"
//                 className="w-24 h-24 object-cover rounded-lg"
//               />
//             </div>
//           )}
//         </div>

//         {/* Portfolio Companies */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Portfolio Companies
//           </label>
//           {formData.portfolioCompanies.map((company, index) => (
//             <div key={index} className="mb-2 flex flex-col space-y-2">
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Company Name"
//                   value={company.name}
//                   onChange={(e) => handlePortfolioChange(index, e)}
//                   className="flex-1 border-gray-300 rounded-lg p-2"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removePortfolioCompany(index)}
//                   className="text-red-500 font-semibold"
//                 >
//                   Remove
//                 </button>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <select
//                   name="logoSource"
//                   onChange={(e) => handlePortfolioLogoSourceChange(index, e)}
//                   className="border-gray-300 rounded-lg p-2"
//                 >
//                   <option value="url">URL</option>
//                   <option value="upload">Upload</option>
//                 </select>
//                 {company.logoSource === "url" ? (
//                   <input
//                     type="url"
//                     name="logo"
//                     placeholder="Logo URL"
//                     value={company.logo}
//                     onChange={(e) => handlePortfolioChange(index, e)}
//                     className="flex-1 border-gray-300 rounded-lg p-2"
//                   />
//                 ) : (
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) =>
//                       handleImageUpload(e, "portfolioLogo", index)
//                     }
//                     className="flex-1 border-gray-300 rounded-lg p-2"
//                   />
//                 )}
//               </div>
//               {portfolioPreviews[index] && (
//                 <div className="mt-2">
//                   <img
//                     src={portfolioPreviews[index]}
//                     alt={`Portfolio Company ${index + 1} Preview`}
//                     className="w-24 h-24 object-cover rounded-lg"
//                   />
//                 </div>
//               )}
//               <input
//                 type="url"
//                 name="link"
//                 placeholder="Website Link"
//                 value={company.link}
//                 onChange={(e) => handlePortfolioChange(index, e)}
//                 className="flex-1 border-gray-300 rounded-lg p-2"
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addPortfolioCompany}
//             className="text-blue-500 font-semibold mt-2"
//           >
//             + Add Portfolio Company
//           </button>
//         </div>

//         {/* Investor Type Dropdown */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investor Type
//           </label>
//           <select
//             name="investorType"
//             value={formData.investorType || ""}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Investor Type</option>
//             <option value="Angel Investors">Angel Investors</option>
//             <option value="Venture Capitalists (VCs)">
//               Venture Capitalists (VCs)
//             </option>
//             <option value="Micro VCs">Micro VCs</option>
//             <option value="Corporate Venture Capital (CVC)">
//               Corporate Venture Capital (CVC)
//             </option>
//             <option value="Accelerators and Incubators">
//               Accelerators and Incubators
//             </option>
//             <option value="Private Equity (PE) Investors">
//               Private Equity (PE) Investors
//             </option>
//             <option value="Family Offices">Family Offices</option>
//             <option value="Crowdfunding Investors">
//               Crowdfunding Investors
//             </option>
//             <option value="Syndicates (Angel Syndicates/VC Syndicates)">
//               Syndicates (Angel Syndicates/VC Syndicates)
//             </option>
//             <option value="Hedge Funds">Hedge Funds</option>
//             <option value="Sovereign Wealth Funds">
//               Sovereign Wealth Funds
//             </option>
//             <option value="Government Grants and Funds">
//               Government Grants and Funds
//             </option>
//             <option value="Strategic Investors">Strategic Investors</option>
//             <option value="Banks (Debt Financing)">
//               Banks (Debt Financing)
//             </option>
//             <option value="Friends and Family">Friends and Family</option>
//             <option value="Bootstrap (Self-Funding)">
//               Bootstrap (Self-Funding)
//             </option>
//             <option value="Fund of Funds (FoF)">Fund of Funds (FoF)</option>
//             <option value="Social Impact Investors">
//               Social Impact Investors
//             </option>
//             <option value="Pension Funds">Pension Funds</option>
//           </select>
//         </div>

//         {/* Sector Interested - Multiple Item Selection */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Sector Interested
//           </label>
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               placeholder="Add a sector (e.g., Technology, Healthcare)"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && e.target.value.trim()) {
//                   const newSector = e.target.value.trim();
//                   if (!formData.sectorInterested.includes(newSector)) {
//                     setFormData((prev) => ({
//                       ...prev,
//                       sectorInterested: [...prev.sectorInterested, newSector],
//                     }));
//                   }
//                   e.target.value = ""; // Clear the input
//                 }
//               }}
//               className="flex-1 border-gray-300 rounded-lg p-2"
//             />
//           </div>
//           <div className="mt-2 flex flex-wrap gap-2">
//             {formData.sectorInterested.map((sector, index) => (
//               <div
//                 key={index}
//                 className="flex items-center bg-blue-100 text-blue-800 rounded-lg px-3 py-1 text-sm"
//               >
//                 {sector}
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setFormData((prev) => ({
//                       ...prev,
//                       sectorInterested: prev.sectorInterested.filter(
//                         (_, i) => i !== index
//                       ),
//                     }));
//                   }}
//                   className="ml-2 text-red-500 hover:text-red-700"
//                 >
//                   &times;
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Business Model - Multiple Item Selection */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Business Model
//           </label>
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               placeholder="Add a business model (e.g., B2B, SaaS)"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && e.target.value.trim()) {
//                   const newModel = e.target.value.trim();
//                   if (!formData.businessModel.includes(newModel)) {
//                     setFormData((prev) => ({
//                       ...prev,
//                       businessModel: [...prev.businessModel, newModel],
//                     }));
//                   }
//                   e.target.value = ""; // Clear the input
//                 }
//               }}
//               className="flex-1 border-gray-300 rounded-lg p-2"
//             />
//           </div>
//           <div className="mt-2 flex flex-wrap gap-2">
//             {formData.businessModel.map((model, index) => (
//               <div
//                 key={index}
//                 className="flex items-center bg-green-100 text-green-800 rounded-lg px-3 py-1 text-sm"
//               >
//                 {model}
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setFormData((prev) => ({
//                       ...prev,
//                       businessModel: prev.businessModel.filter(
//                         (_, i) => i !== index
//                       ),
//                     }));
//                   }}
//                   className="ml-2 text-red-500 hover:text-red-700"
//                 >
//                   &times;
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Check Size Dropdown */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Check Size
//           </label>
//           <select
//             name="checkSize"
//             value={formData.checkSize}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Check Size</option>
//             {[
//               "$10,000 - $100,000",
//               "$100,000 - $500,000",
//               "$500,000 - $2 million",
//               "$2 million - $10 million",
//               "$10 million - $25 million",
//               "$25 million - $100 million+",
//               "$500,000 - $50 million+",
//               "$10 million - $100 million+",
//             ].map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ... (rest of the code remains the same) ... */}

//         {/* Investment Stages Dropdown */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investment Stages
//           </label>
//           <select
//             name="investmentStages"
//             value={formData.investmentStages}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Investment Stage</option>
//             {[
//               "Idea Stage",
//               "Pre-Seed",
//               "Seed",
//               "Series A",
//               "Series B",
//               "Series C",
//               "Series D (and beyond)",
//               "IPO (Initial Public Offering)",
//               "Growth Stage",
//             ].map((stage) => (
//               <option key={stage} value={stage}>
//                 {stage}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Business Model Dropdown */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Business Model
//           </label>
//           <select
//             name="businessModel"
//             value={formData.businessModel}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Business Model</option>
//             {[
//               "C2B (Consumer to Business)",
//               "D2C (Direct to Consumer)",
//               "B2G (Business to Government)",
//               "G2B (Government to Business)",
//               "G2C (Government to Consumer)",
//               "P2P (Peer to Peer)",
//               "B2B SaaS (Software as a Service for Businesses)",
//               "C2C SaaS (Consumer to Consumer Software)",
//               "B2E (Business to Employee)",
//               "B2B Marketplace",
//               "B2C Marketplace",
//               "B2B2G (Business to Business to Government)",
//               "Franchise Model",
//               "Subscription Model",
//               "Freemium Model",
//               "On-Demand Model",
//               "Aggregator Model",
//               "White Labeling",
//               "Licensing Model",
//             ].map((model) => (
//               <option key={model} value={model}>
//                 {model}
//               </option>
//             ))}
//           </select>
//         </div>
//         {/* Check Size */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Check Size
//           </label>
//           <select
//             name="checkSize"
//             value={formData.checkSize}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Check Size</option>
//             {checkSizes.map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Geography */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Geography
//           </label>
//           <select
//             name="geography"
//             value={formData.geography}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Geography</option>
//             {countries.map((country) => (
//               <option key={country} value={country}>
//                 {country}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Additional Fields */}
//         {[
//           { name: "description", label: "Description", type: "text" },
//           { name: "headquarter", label: "Headquarter", type: "text" },
//           { name: "contactLink", label: "Contact Link", type: "url" },
//         ].map(({ name, label, type }) => (
//           <div className="mb-4" key={name}>
//             <label className="block text-gray-700 font-medium mb-2">
//               {label}
//             </label>
//             <input
//               type={type}
//               name={name}
//               value={formData[name]}
//               onChange={handleChange}
//               className="w-full border-gray-300 rounded-lg p-2"
//             />
//           </div>
//         ))}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white p-2 rounded"
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Update Investor"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateInvestorForm;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import countries from "./Countries";

// const UpdateInvestorForm = () => {
//   const { id } = useParams(); // Get the investor ID from the URL
//   const [formData, setFormData] = useState({
//     name: "",
//     website: "",
//     image: "",
//     portfolioCompanies: [{ name: "", logo: "", link: "" }], // Default to an empty array
//     description: "",
//     geography: "",
//     investmentStages: "",
//     businessModel: "",
//     investorType: "",
//     sectorInterested: "",
//     checkSize: "",
//     headquarter: "",
//     contactLink: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   // Fetch existing investor data when the component mounts
//   useEffect(() => {
//     const fetchInvestorData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `https://backendv3-wmen.onrender.com/api/get-investor/${id}`
//         );
//         console.log("Fetched Data:", response.data); // Debugging

//         const fetchedData = response.data.investor;

//         if (!fetchedData) {
//           setError("No investor data found.");
//           return;
//         }

//         setFormData({
//           name: fetchedData.name || "",
//           website: fetchedData.website || "",
//           image: fetchedData.image || "",
//           portfolioCompanies: Array.isArray(fetchedData.portfolioCompanies)
//             ? fetchedData.portfolioCompanies
//             : [{ name: "", logo: "", link: "" }],
//           description: fetchedData.description || "",
//           geography: fetchedData.geography || "",
//           investmentStages: fetchedData.investmentStages || "",
//           businessModel: fetchedData.businessModel || "",
//           investorType: fetchedData.investorType || "",
//           sectorInterested: fetchedData.sectorInterested || "",
//           checkSize: fetchedData.checkSize || "",
//           headquarter: fetchedData.headquarter || "",
//           contactLink: fetchedData.contactLink || "",
//         });

//       } catch (err) {
//         setError("Error fetching investor data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvestorData();
//   }, [id]);

//   // Handle input change for main fields
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle input change for portfolio companies
//   const handlePortfolioChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedPortfolio = [...formData.portfolioCompanies];
//     updatedPortfolio[index][name] = value;
//     setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
//   };

//   // Add a new portfolio company
//   const addPortfolioCompany = () => {
//     setFormData({
//       ...formData,
//       portfolioCompanies: [
//         ...formData.portfolioCompanies,
//         { name: "", logo: "", link: "" },
//       ],
//     });
//   };

//   // Remove a portfolio company
//   const removePortfolioCompany = (index) => {
//     const updatedPortfolio = formData.portfolioCompanies.filter(
//       (_, i) => i !== index
//     );
//     setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
//   };

//   // Handle form submission for update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       // Send a PUT request to update the investor
//       const response = await axios.put(
//         `https://backendv3-wmen.onrender.com/api/update-investor/${id}`,
//         formData,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setSuccess("Investor updated successfully!");
//       navigate("/investors"); // Redirect to investors page after update
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto bg-gray-300 shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-semibold mb-4">Edit Investor</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {success && <p className="text-green-500 mb-4">{success}</p>}
//       <form onSubmit={handleSubmit}>
//         {/* Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investor Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//             required
//           />
//         </div>

//         {/* Website */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Website
//           </label>
//           <input
//             type="url"
//             name="website"
//             value={formData.website}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//             required
//           />
//         </div>

//         {/* Image */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Image URL
//           </label>
//           <input
//             type="url"
//             name="image"
//             value={formData.image}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           />
//         </div>

//         {/* Portfolio Companies */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Portfolio Companies
//           </label>
//           {formData.portfolioCompanies.map((company, index) => (
//             <div key={index} className="mb-2 flex items-center space-x-2">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Company Name"
//                 value={company.name}
//                 onChange={(e) => handlePortfolioChange(index, e)}
//                 className="flex-1 border-gray-300 rounded-lg p-2"
//                 required
//               />
//               <input
//                 type="url"
//                 name="logo"
//                 placeholder="Logo URL"
//                 value={company.logo}
//                 onChange={(e) => handlePortfolioChange(index, e)}
//                 className="flex-1 border-gray-300 rounded-lg p-2"
//               />
//               <input
//                 type="url"
//                 name="link"
//                 placeholder="Website Link"
//                 value={company.link}
//                 onChange={(e) => handlePortfolioChange(index, e)}
//                 className="flex-1 border-gray-300 rounded-lg p-2"
//               />
//               <button
//                 type="button"
//                 onClick={() => removePortfolioCompany(index)}
//                 className="text-red-500 font-semibold"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addPortfolioCompany}
//             className="text-blue-500 font-semibold mt-2"
//           >
//             + Add Portfolio Company
//           </button>
//         </div>

//         {/* Investor Type Dropdown */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investor Type
//           </label>
//           <select
//             name="investorType"
//             value={formData.investorType || ""}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Investor Type</option>
//             <option value="Angel Investors">Angel Investors</option>
//             <option value="Venture Capitalists (VCs)">
//               Venture Capitalists (VCs)
//             </option>
//             <option value="Micro VCs">Micro VCs</option>
//             <option value="Corporate Venture Capital (CVC)">
//               Corporate Venture Capital (CVC)
//             </option>
//             <option value="Accelerators and Incubators">
//               Accelerators and Incubators
//             </option>
//             <option value="Private Equity (PE) Investors">
//               Private Equity (PE) Investors
//             </option>
//             <option value="Family Offices">Family Offices</option>
//             <option value="Crowdfunding Investors">
//               Crowdfunding Investors
//             </option>
//             <option value="Syndicates (Angel Syndicates/VC Syndicates)">
//               Syndicates (Angel Syndicates/VC Syndicates)
//             </option>
//             <option value="Hedge Funds">Hedge Funds</option>
//             <option value="Sovereign Wealth Funds">
//               Sovereign Wealth Funds
//             </option>
//             <option value="Government Grants and Funds">
//               Government Grants and Funds
//             </option>
//             <option value="Strategic Investors">Strategic Investors</option>
//             <option value="Banks (Debt Financing)">
//               Banks (Debt Financing)
//             </option>
//             <option value="Friends and Family">Friends and Family</option>
//             <option value="Bootstrap (Self-Funding)">
//               Bootstrap (Self-Funding)
//             </option>
//             <option value="Fund of Funds (FoF)">Fund of Funds (FoF)</option>
//             <option value="Social Impact Investors">
//               Social Impact Investors
//             </option>
//             <option value="Pension Funds">Pension Funds</option>
//           </select>
//         </div>

//         {/* Investment Stages Dropdown */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investment Stages
//           </label>
//           <select
//             name="investmentStages"
//             value={formData.investmentStages}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Investment Stage</option>
//             {[
//               "Idea Stage",
//               "Pre-Seed",
//               "Seed",
//               "Series A",
//               "Series B",
//               "Series C",
//               "Series D (and beyond)",
//               "IPO (Initial Public Offering)",
//               "Growth Stage",
//             ].map((stage) => (
//               <option key={stage} value={stage}>
//                 {stage}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Business Model Dropdown */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Business Model
//           </label>
//           <select
//             name="businessModel"
//             value={formData.businessModel}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Business Model</option>
//             {[
//               "C2B (Consumer to Business)",
//               "D2C (Direct to Consumer)",
//               "B2G (Business to Government)",
//               "G2B (Government to Business)",
//               "G2C (Government to Consumer)",
//               "P2P (Peer to Peer)",
//               "B2B SaaS (Software as a Service for Businesses)",
//               "C2C SaaS (Consumer to Consumer Software)",
//               "B2E (Business to Employee)",
//               "B2B Marketplace",
//               "B2C Marketplace",
//               "B2B2G (Business to Business to Government)",
//               "Franchise Model",
//               "Subscription Model",
//               "Freemium Model",
//               "On-Demand Model",
//               "Aggregator Model",
//               "White Labeling",
//               "Licensing Model",
//             ].map((model) => (
//               <option key={model} value={model}>
//                 {model}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Check Size Dropdown */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Check Size
//           </label>
//           <select
//             name="checkSize"
//             value={formData.checkSize}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Check Size</option>
//             {[
//               "$10,000 - $100,000",
//               "$100,000 - $500,000",
//               "$500,000 - $2 million",
//               "$2 million - $10 million",
//               "$10 million - $25 million",
//               "$25 million - $100 million+",
//               "$500,000 - $50 million+",
//               "$10 million - $100 million+",
//             ].map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Geography Dropdown */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Geography
//           </label>
//           <select
//             name="geography"
//             value={formData.geography}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Geography</option>
//             {countries.map((country) => (
//               <option key={country} value={country}>
//                 {country}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Other Fields */}
//         <div className="grid grid-cols-2 gap-4">
//           {[
//             { name: "description", label: "Description", type: "text" },
//             { name: "geography", label: "Geography", type: "text" },
//             {
//               name: "sectorInterested",
//               label: "Sector Interested",
//               type: "text",
//             },
//             { name: "headquarter", label: "Headquarter", type: "text" },
//             { name: "contactLink", label: "Contact Link", type: "url" },
//           ].map(({ name, label, type }) => (
//             <div key={name} className="mb-4">
//               <label className="block text-gray-700 font-medium mb-2">
//                 {label}
//               </label>
//               <input
//                 type={type}
//                 name={name}
//                 value={formData[name]}
//                 onChange={handleChange}
//                 className="w-full border-gray-300 rounded-lg p-2"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded-lg font-semibold mt-4"
//           disabled={loading}
//         >
//           {loading ? "Updating..." : "Update Investor"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateInvestorForm;

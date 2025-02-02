import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Import constants
import {
  businessModels,
  sectors,
  investorTypes,
  geographies,
  investmentStages,
} from "./constants";

const InvestorForm = () => {
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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===================================

  const [uploadedProfileImagePreview, setUploadedProfileImagePreview] =
    useState(""); // For uploaded file preview
  const [urlProfileImagePreview, setUrlProfileImagePreview] = useState(""); // For URL preview

  // =================================

  const [uploadedPortfolioPreviews, setUploadedPortfolioPreviews] = useState(
    []
  ); // For uploaded portfolio logos
  const [urlPortfolioPreviews, setUrlPortfolioPreviews] = useState([]); // For URL portfolio logos

  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const newValue = prevState[name].includes(value)
        ? prevState[name].filter((item) => item !== value)
        : [...prevState[name], value];
      return { ...prevState, [name]: newValue };
    });
  };

  const handleImageSourceChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      imageSource: value,
      image: "", // Reset the image field when switching sources
    }));
  };

  const removeCompany = (index) => {
    const updatedCompanies = formData.portfolioCompanies.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, portfolioCompanies: updatedCompanies });
  };

  const addPortfolioCompany = () => {
    setFormData((prev) => ({
      ...prev,
      portfolioCompanies: [
        ...prev.portfolioCompanies,
        { name: "", logo: "", logoSource: "upload", link: "" },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.website || !formData.description) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true); // Set loading to true when submission starts
      setError(""); // Clear any previous error
      setSuccess(""); // Clear any previous success message

      console.log("Form Data:", formData); // Log form data

      const response = await axios.post(
        "https://venturloop-backend-v-20.onrender.com/api/create-investor",
        formData
      );

      if (response.status === 200) {
        setSuccess("Investor added successfully!");

        // Reset form data after successful submission
        setFormData({
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
      } else {
        setError("Error occurred while submitting the form.");
      }

      navigate("/investors"); // Redirect after successful submission
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        setError("Server error: " + error.response.data.message);
      } else if (error.request) {
        console.error("Network Error:", error.request);
        setError("Network error: Please check your internet connection.");
      } else {
        console.error("Error:", error.message);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Set loading to false when submission is complete
    }
  };

  // =================================

  const handleImageUpload = async (e, field, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set preview for uploaded file
    if (field === "image") {
      setUploadedProfileImagePreview(URL.createObjectURL(file));
    } else if (field === "portfolioLogo" && index !== null) {
      const updatedPreviews = [...uploadedPortfolioPreviews];
      updatedPreviews[index] = URL.createObjectURL(file);
      setUploadedPortfolioPreviews(updatedPreviews);
    }

    const imageFormData = new FormData();
    imageFormData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://backendv3-wmen.onrender.com/api/fileUpload",
        imageFormData
      );

      if (response.data.status && response.data.data) {
        const url = response.data.data[0].url;
        if (field === "image") {
          setFormData((prev) => ({ ...prev, image: url }));
        } else if (field === "portfolioLogo" && index !== null) {
          const updatedPortfolio = [...formData.portfolioCompanies];
          updatedPortfolio[index].logo = url;
          setFormData((prev) => ({
            ...prev,
            portfolioCompanies: updatedPortfolio,
          }));
        }
        setSuccess("Image uploaded successfully!");
        setError("");
      } else {
        setError("Image upload failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while uploading the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Set preview for Profile Image URL
    if (name === "image" && formData.imageSource === "url") {
      setUrlProfileImagePreview(value);
    }
  };

  // ==============================

  const handleRemoveSelection = (type, value) => {
    if (type === "businessModel") {
      setFormData((prev) => ({
        ...prev,
        businessModel: prev.businessModel.filter((item) => item !== value),
      }));
    } else if (type === "sectorInterested") {
      setFormData((prev) => ({
        ...prev,
        sectorInterested: prev.sectorInterested.filter(
          (item) => item !== value
        ),
      }));
    }
  };

  const handlePortfolioChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPortfolio = [...formData.portfolioCompanies];
    updatedPortfolio[index][name] = value;
    setFormData({ ...formData, portfolioCompanies: updatedPortfolio });

    // Set preview for Portfolio Logo URL
    if (name === "logo" && updatedPortfolio[index].logoSource === "url") {
      const updatedPreviews = [...urlPortfolioPreviews];
      updatedPreviews[index] = value;
      setUrlPortfolioPreviews(updatedPreviews);
    }
  };

  const handlePortfolioLogoSourceChange = (index, e) => {
    const { value } = e.target;
    const updatedPortfolio = [...formData.portfolioCompanies];
    updatedPortfolio[index].logoSource = value;
    updatedPortfolio[index].logo = "";
    setFormData({ ...formData, portfolioCompanies: updatedPortfolio });

    // Reset previews when switching sources
    const updatedUploadedPreviews = [...uploadedPortfolioPreviews];
    updatedUploadedPreviews[index] = "";
    setUploadedPortfolioPreviews(updatedUploadedPreviews);

    const updatedUrlPreviews = [...urlPortfolioPreviews];
    updatedUrlPreviews[index] = "";
    setUrlPortfolioPreviews(updatedUrlPreviews);
  };

  function handleLogoSourceToggle(index, source) {
    const updatedCompanies = [...formData.portfolioCompanies];
    updatedCompanies[index].logoSource = source;
    setFormData({
      ...formData,
      portfolioCompanies: updatedCompanies,
    });
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Create Investor</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Image Source: Profile Image */}
        {/* <div>
          <label className="block text-sm font-medium">
            Profile Image Source
          </label>
          <select
            name="imageSource"
            value={formData.imageSource}
            onChange={handleImageSourceChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
          >
            <option value="url">URL</option>
            <option value="upload">Upload</option>
          </select>
          {formData.imageSource === "url" ? (
            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
              />
              {urlProfileImagePreview && (
                <div className="mt-4">
                  <img
                    src={urlProfileImagePreview}
                    alt="URL Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, "image")}
                className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
              />
              {uploadedProfileImagePreview && (
                <div className="mt-4">
                  <img
                    src={uploadedProfileImagePreview}
                    alt="Uploaded Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}
        </div> */}

        {/* Profile Image Source Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Profile Image Source
          </label>
          <div className="">
            {" "}
            {/* Added gap between buttons */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, imageSource: "url" })}
              className={`flex-1 p-2 w-24 h-10 mr-4 text-center rounded-lg transition ${
                formData.imageSource === "url"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, imageSource: "upload" })
              }
              className={`flex-1 w-24 h-10 p-2 text-center rounded-lg transition ${
                formData.imageSource === "upload"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              Upload
            </button>
          </div>

          {formData.imageSource === "url" ? (
            <div className="mt-3">
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
              />
              {urlProfileImagePreview && (
                <div className="mt-4">
                  <img
                    src={urlProfileImagePreview}
                    alt="URL Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-3">
              <label className="block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, "image")}
                className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
              />
              {uploadedProfileImagePreview && (
                <div className="mt-4">
                  <img
                    src={uploadedProfileImagePreview}
                    alt="Uploaded Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}
        </div>

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
              <div>
                <label className="block text-sm font-medium">
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={company.name}
                  onChange={(e) => handlePortfolioChange(index, e)}
                  className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
                  required
                />
              </div>

              {/* Company Logo Source Toggle */}
              <div>
                <label className="block text-sm font-medium">Logo Source</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => handleLogoSourceToggle(index, "url")}
                    className={`px-4 py-2 rounded ${
                      company.logoSource === "url"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLogoSourceToggle(index, "upload")}
                    className={`px-4 py-2 rounded ${
                      company.logoSource === "upload"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    Upload
                  </button>
                </div>

                {/* Conditionally render logo URL or upload input */}
                {company.logoSource === "url" ? (
                  <div>
                    <label className="block text-sm font-medium">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      name="logo"
                      value={company.logo}
                      onChange={(e) => handlePortfolioChange(index, e)}
                      className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
                    />
                    {urlPortfolioPreviews[index] && (
                      <div className="mt-4">
                        <img
                          src={urlPortfolioPreviews[index]}
                          alt="URL Preview"
                          className="w-32 h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mt-3">
                      Upload Logo
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleImageUpload(e, "portfolioLogo", index)
                      }
                      className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
                    />
                    {uploadedPortfolioPreviews[index] && (
                      <div className="mt-4">
                        <img
                          src={uploadedPortfolioPreviews[index]}
                          alt="Uploaded Preview"
                          className="w-32 h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Company Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={company.link}
                  onChange={(e) => handlePortfolioChange(index, e)}
                  className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => removeCompany(index)}
                className="bg-red-600 text-white px-4 py-2 rounded mt-2"
              >
                Remove Company
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPortfolioCompany}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Add Company
          </button>
        </div>

        {/* Geography */}
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

        {/* Investment Stages */}
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

        {/* Investor Type Dropdown */}
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

        {/* Sector Interested */}
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
                className={`p-2 mb-2 ${
                  formData.sectorInterested.includes(sector)
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300"
                } rounded`}
              >
                {sector}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap space-x-2">
            {formData.sectorInterested.map((selectedItem) => (
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

        {/* Business Model */}
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
                className={`p-2 mb-2 ${
                  formData.businessModel.includes(model)
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300"
                } rounded`}
              >
                {model}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap space-x-2">
            {formData.businessModel.map((selectedItem) => (
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
          <label className="block text-sm font-medium">
            Check Size In Millions
          </label>
          <input
            type="text" // Make it a text input to allow string values
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
            className="w-full p-3 h-60 border border-gray-600 rounded bg-gray-800 text-white"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded"
          disabled={loading} // Disable the button when loading
        >
          {loading ? "Creating Investor..." : "Create Investor"}
        </button>
      </form>
    </div>
  );
};

export default InvestorForm;

// import { useState } from "react";
// import axios from "axios";
// import countries from "../pages/Countries"

// const CreateInvestorForm = () => {
//   const initialFormState = {
//     name: "",
//     website: "",
//     image: "",
//     imageSource: "upload", // "upload" or "url"
//     portfolioCompanies: [{ name: "", logo: "", logoSource: "upload", link: "" }], // Added logoSource
//     description: "",
//     geography: "",
//     investmentStages: [],
//     businessModel: [],
//     investorType: "",
//     sectorInterested: [],
//     checkSize: "",
//     headquarter: "",
//     contactLink: "",
//   };

//   const [formData, setFormData] = useState(initialFormState);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const investmentStagesOptions = [
//     "Idea Stage", "Pre-Seed", "Seed", "Series A",
//     "Series B", "Series C", "Series D", "IPO",
//     "Growth Stage"
//   ];

//   const sectorInterestedOptions = [
//     "Technology", "Healthcare", "Finance",
//     "Education", "Retail", "Energy",
//     "Agriculture", "Transportation", "Entertainment"
//   ];

//   const checkSizes = [
//     "$10,000 - $100,000", "$100,000 - $500,000",
//     "$500,000 - $2 million", "$2 million - $10 million",
//     "$10 million - $25 million", "$25 million - $100 million+"
//   ];

//   const businessModelOptions = [
//     "C2B (Consumer to Business)",
//     "D2C (Direct to Consumer)",
//     "B2G (Business to Government)",
//     "G2B (Government to Business)",
//     "G2C (Government to Consumer)",
//     "P2P (Peer to Peer)",
//     "B2B SaaS (Software as a Service for Businesses)",
//     "C2C SaaS (Consumer to Consumer Software)",
//     "B2E (Business to Employee)",
//     "B2B Marketplace",
//     "B2C Marketplace",
//     "B2B2G (Business to Business to Government)",
//     "Franchise Model",
//     "Subscription Model",
//     "Freemium Model",
//     "On-Demand Model",
//     "Aggregator Model",
//     "White Labeling",
//     "Licensing Model",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

// const handleImageSourceChange = (e) => {
//   const { value } = e.target;
//   setFormData((prev) => ({
//     ...prev,
//     imageSource: value,
//     image: "", // Reset the image field when switching sources
//   }));
// };

// const handlePortfolioLogoSourceChange = (index, e) => {
//   const { value } = e.target;
//   const updatedPortfolio = [...formData.portfolioCompanies];
//   updatedPortfolio[index].logoSource = value;
//   updatedPortfolio[index].logo = ""; // Reset the logo field when switching sources
//   setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
// };

// const handleImageUpload = async (e, field, index = null) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const imageFormData = new FormData();
//   imageFormData.append("file", file);

//   try {
//     setLoading(true);
//     const response = await axios.post(
//       "https://backendv3-wmen.onrender.com/api/fileUpload",
//       imageFormData
//     );

//     if (response.data.status && response.data.data) {
//       const url = response.data.data[0].url;
//       if (field === "image") {
//         setFormData((prev) => ({ ...prev, image: url }));
//       } else if (field === "portfolioLogo" && index !== null) {
//         const updatedPortfolio = [...formData.portfolioCompanies];
//         updatedPortfolio[index].logo = url;
//         setFormData((prev) => ({
//           ...prev,
//           portfolioCompanies: updatedPortfolio,
//         }));
//       }
//       setSuccess("Image uploaded successfully!");
//       setError("");
//     } else {
//       setError("Image upload failed. Please try again.");
//     }
//   } catch (err) {
//     setError("An error occurred while uploading the image.");
//   } finally {
//     setLoading(false);
//   }
// };

// const handlePortfolioChange = (index, e) => {
//   const { name, value } = e.target;
//   const updatedPortfolio = [...formData.portfolioCompanies];
//   updatedPortfolio[index][name] = value;
//   setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
// };

// const addPortfolioCompany = () => {
//   setFormData((prev) => ({
//     ...prev,
//     portfolioCompanies: [
//       ...prev.portfolioCompanies,
//       { name: "", logo: "", logoSource: "upload", link: "" },
//     ],
//   }));
// };

//   const handleAddItem = (field, value) => {
//     if (!formData[field].includes(value)) {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: [...prev[field], value],
//       }));
//     }
//   };

//   const handleRemoveItem = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: prev[field].filter((item) => item !== value),
//     }));
//   };

//   const removePortfolioCompany = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       portfolioCompanies: prev.portfolioCompanies.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Prepare data to send
//     const payload = {
//       ...formData,
//       investmentStages: formData.investmentStages.join(", "), // Convert array to comma-separated string
//       portfolioCompanies: formData.portfolioCompanies.map((company) => ({
//         name: company.name,
//         logo: company.logo,
//         link: company.link,
//       })),
//     };

//     // Remove unnecessary fields
//     delete payload.imageSource;
//     delete payload.portfolioCompanies.logoSource;

//     console.log("Payload being sent:", payload); // Log the payload to verify data

//     try {
//       // Send data to server
//       const response = await fetch(
//         "https://venturloop-backend-v-20.onrender.com/api/create-investor",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       // Check if response is OK
//       if (!response.ok) {
//         const errorResponse = await response.json();
//         console.error("Error Response:", errorResponse); // Log response to debug
//         throw new Error(errorResponse.message || "Failed to create investor.");
//       }

//       await response.json(); // If success, proceed with the response
//       setSuccess("Investor created successfully!");
//       // Reset form
//       setFormData(initialFormState);
//     } catch (err) {
//       console.error("Error during form submission:", err.message); // Log full error message
//       setError(err.message || "An error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto bg-gray-300 shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-semibold mb-4">Create Investor</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {success && <p className="text-green-500 mb-4">{success}</p>}
//       <form onSubmit={handleSubmit}>
//         {/* Investor Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">Investor Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         {/* Website */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">Website</label>
//           <input
//             type="url"
//             name="website"
//             value={formData.website}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         {/* Image Source Toggle */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">Image Source</label>
//           <div className="flex items-center gap-4">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="imageSource"
//                 value="upload"
//                 checked={formData.imageSource === "upload"}
//                 onChange={handleImageSourceChange}
//                 className="mr-2"
//               />
//               Upload Image
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="imageSource"
//                 value="url"
//                 checked={formData.imageSource === "url"}
//                 onChange={handleImageSourceChange}
//                 className="mr-2"
//               />
//               Provide Image URL
//             </label>
//           </div>
//         </div>

//         {/* Image Upload or URL Input */}
//         {formData.imageSource === "upload" ? (
//           <div className="mb-4">
//             <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleImageUpload(e, "image")}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//         ) : (
//           <div className="mb-4">
//             <label className="block text-gray-700 font-medium mb-2">Image URL</label>
//             <input
//               type="url"
//               name="image"
//               value={formData.image}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               placeholder="Enter image URL"
//             />
//           </div>
//         )}

//         {/* Display Image Preview */}
//         {formData.image && (
//           <div className="mb-4">
//             <label className="block text-gray-700 font-medium mb-2">Image Preview</label>
//             <img
//               src={formData.image}
//               alt="Uploaded"
//               className="mt-2 w-32 h-32 object-cover"
//             />
//           </div>
//         )}

//         {/* Portfolio Companies */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">Portfolio Companies</label>
//           {formData.portfolioCompanies.map((company, index) => (
//             <div key={index} className="mb-4 p-4 border rounded">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Company Name"
//                 value={company.name}
//                 onChange={(e) => handlePortfolioChange(index, e)}
//                 className="w-full p-2 border rounded mb-2"
//                 required
//               />
//               <input
//                 type="url"
//                 name="link"
//                 placeholder="Website Link"
//                 value={company.link}
//                 onChange={(e) => handlePortfolioChange(index, e)}
//                 className="w-full p-2 border rounded mb-2"
//               />

//               {/* Portfolio Logo Source Toggle */}
//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Logo Source</label>
//                 <div className="flex items-center gap-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name={`portfolioLogoSource-${index}`}
//                       value="upload"
//                       checked={company.logoSource === "upload"}
//                       onChange={(e) => handlePortfolioLogoSourceChange(index, e)}
//                       className="mr-2"
//                     />
//                     Upload Logo
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name={`portfolioLogoSource-${index}`}
//                       value="url"
//                       checked={company.logoSource === "url"}
//                       onChange={(e) => handlePortfolioLogoSourceChange(index, e)}
//                       className="mr-2"
//                     />
//                     Provide Logo URL
//                   </label>
//                 </div>
//               </div>

//               {/* Portfolio Logo Upload or URL Input */}
//               {company.logoSource === "upload" ? (
//                 <div className="mb-4">
//                   <label className="block text-gray-700 font-medium mb-2">Upload Logo</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleImageUpload(e, "portfolioLogo", index)}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//               ) : (
//                 <div className="mb-4">
//                   <label className="block text-gray-700 font-medium mb-2">Logo URL</label>
//                   <input
//                     type="url"
//                     name="logo"
//                     value={company.logo}
//                     onChange={(e) => handlePortfolioChange(index, e)}
//                     className="w-full p-2 border rounded"
//                     placeholder="Enter logo URL"
//                   />
//                 </div>
//               )}

//               {/* Display Portfolio Logo Preview */}
//               {company.logo && (
//                 <div className="mb-4">
//                   <label className="block text-gray-700 font-medium mb-2">Logo Preview</label>
//                   <img
//                     src={company.logo}
//                     alt="Portfolio Logo"
//                     className="mt-2 w-32 h-32 object-cover"
//                   />
//                 </div>
//               )}

//               <button
//                 type="button"
//                 onClick={() => removePortfolioCompany(index)}
//                 className="bg-red-500 text-white p-2 rounded"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addPortfolioCompany}
//             className="bg-blue-500 text-white p-2 rounded"
//           >
//             + Add Portfolio Company
//           </button>
//         </div>

//   {/* Investor Type */}
//   <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investor Type
//           </label>
//           <select
//             name="investorType"
//             value={formData.investorType}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Investor Type</option>
//             {[
//               "Angel Investors",
//               "Venture Capitalists (VCs)",
//               "Micro VCs",
//               "Corporate Venture Capital (CVC)",
//               "Accelerators and Incubators",
//               "Private Equity (PE) Investors",
//               "Family Offices",
//               "Crowdfunding Investors",
//               "Syndicates (Angel Syndicates/VC Syndicates)",
//               "Hedge Funds",
//               "Sovereign Wealth Funds",
//               "Government Grants and Funds",
//               "Strategic Investors",
//               "Banks (Debt Financing)",
//               "Friends and Family",
//               "Bootstrap (Self-Funding)",
//               "Fund of Funds (FoF)",
//               "Social Impact Investors",
//               "Pension Funds",
//             ].map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Investment Stages */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investment Stages
//           </label>
//           <div className="flex flex-wrap border border-gray-300 rounded-lg p-2">
//             {investmentStagesOptions.map((stage) => (
//               <button
//                 key={stage}
//                 type="button"
//                 onClick={() => handleAddItem("investmentStages", stage)}
//                 className={`px-3 py-1 m-1 rounded-full ${
//                   formData.investmentStages.includes(stage)
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {stage}
//               </button>
//             ))}
//           </div>
//           <div className="mt-2 flex flex-wrap">
//             {formData.investmentStages.map((stage) => (
//               <span
//                 key={stage}
//                 className="bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center"
//               >
//                 {stage}
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveItem("investmentStages", stage)}
//                   className="ml-2 text-white hover:text-red-500"
//                 >
//                   &times;
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Sector Interested */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Sector Interested
//           </label>
//           <div className="flex flex-wrap border border-gray-300 rounded-lg p-2">
//             {sectorInterestedOptions.map((sector) => (
//               <button
//                 key={sector}
//                 type="button"
//                 onClick={() => handleAddItem("sectorInterested", sector)}
//                 className={`px-3 py-1 m-1 rounded-full ${
//                   formData.sectorInterested.includes(sector)
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {sector}
//               </button>
//             ))}
//           </div>
//           <div className="mt-2 flex flex-wrap">
//             {formData.sectorInterested.map((sector) => (
//               <span
//                 key={sector}
//                 className="bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center"
//               >
//                 {sector}
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveItem("sectorInterested", sector)}
//                   className="ml-2 text-white hover:text-red-500"
//                 >
//                   &times;
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Business Model
//           </label>
//           <div className="flex flex-wrap border border-gray-300 rounded-lg p-2">
//             {businessModelOptions.map((model) => (
//               <button
//                 key={model}
//                 type="button"
//                 onClick={() => handleAddItem("businessModel", model)}
//                 className={`px-3 py-1 m-1 rounded-full ${
//                   formData.businessModel.includes(model)
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {model}
//               </button>
//             ))}
//           </div>
//           <div className="mt-2">
//             <strong>Selected Business Models:</strong>
//             <div className="flex flex-wrap mt-2">
//               {formData.businessModel.map((model) => (
//                 <span
//                   key={model}
//                   className="bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center"
//                 >
//                   {model}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveItem("businessModel", model)}
//                     className="ml-2 text-white hover:text-red-500"
//                   >
//                     &times;
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>
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
//           {loading ? "Submitting..." : "Create Investor"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateInvestorForm;

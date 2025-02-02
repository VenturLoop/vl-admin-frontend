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


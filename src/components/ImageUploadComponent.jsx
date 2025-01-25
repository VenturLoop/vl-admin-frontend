import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageUploadComponent = () => {
  const dispatch = useDispatch();
  const [imageUri, setImageUri] = useState(null); // For storing the selected image URI
  const [isUploading, setIsUploading] = useState(false);

  // Toast container setup (for showing notifications)
  Toast.configure();

  const pickImage = async (event) => {
    try {
      const file = event.target.files[0]; // Get the selected file
      if (file) {
        const imageUri = URL.createObjectURL(file); // Create a local URL for the selected image
        setImageUri(imageUri); // Set the image URI

        // Dispatch action to store image in Redux state
        dispatch(setProfilePhoto(imageUri));

        // Upload the image
        await uploadImage(file);
      } else {
        Toast.error("No image selected. Please try again.");
      }
    } catch (error) {
      handleImagePickError(error); // Handle errors
    }
  };

  // Helper function to handle image upload
  const uploadImage = async (file) => {
    try {
      setIsUploading(true); // Start uploading

      const formData = new FormData();
      formData.append('file', file); // Append the selected file to FormData

      const response = await axios.post(
        'https://backend-v2-osaw.onrender.com/api/fileUpload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data?.status && response.data?.data?.length) {
        const uploadedUri = response.data.data[0]?.url || null; // Get the uploaded URI
        if (uploadedUri) {
          dispatch(setProfilePhoto(uploadedUri)); // Dispatch to store the uploaded image URL in Redux state
        } else {
          throw new Error('Invalid response from server.');
        }
      } else {
        throw new Error('Unexpected response format.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Toast.error('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false); // Stop uploading
    }
  };

  // Helper function to handle errors
  const handleImagePickError = (error) => {
    console.error('Image pick error:', error);
    Toast.error('Failed to pick image. Please try again.');
  };

  return (
    <div className="image-upload-container">
      <h2>Upload Profile Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={pickImage}
        disabled={isUploading}
      />

      {imageUri && !isUploading && (
        <div className="image-preview">
          <img src={imageUri} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        </div>
      )}

      {isUploading && <p>Uploading...</p>}
    </div>
  );
};

const setProfilePhoto = (uri) => ({
  type: 'SET_PROFILE_PHOTO',
  payload: uri,
});

export default ImageUploadComponent;

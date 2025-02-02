// FileUpload.js
import React, { useState } from 'react';
import AWS from 'aws-sdk';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Initialize AWS SDK
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID, // Your IAM User Access Key
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY, // Your IAM User Secret Key
    region: 'us-east-1', // Your region
  });

  const s3 = new AWS.S3();

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onUpload = () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const params = {
      Bucket: 'my-image-upload-bucket', // Your bucket name
      Key: selectedFile.name,
      Body: selectedFile,
      ContentType: selectedFile.type,
    };

    setUploadStatus('Uploading...');

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
        setUploadStatus('Error uploading file.');
      } else {
        console.log('File uploaded successfully:', data);
        setUploadStatus('File uploaded successfully!');
      }
    });
  };

  return (
    <div>
      <h1>Upload an Image to S3</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload}>Upload</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default FileUpload;

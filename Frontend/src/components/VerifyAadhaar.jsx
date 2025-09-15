import React, { useState, useRef } from "react";

export default function AadhaarVerify() {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontImagePreview, setFrontImagePreview] = useState(null);
  const [backImagePreview, setBackImagePreview] = useState(null);
  const [dragActiveFront, setDragActiveFront] = useState(false);
  const [dragActiveBack, setDragActiveBack] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  // Aadhaar number validation
  const validateAadhaarNumber = (number) => {
    const aadhaarRegex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
    return aadhaarRegex.test(number);
  };

  // Handle Aadhaar number input
  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 12) {
      setAadhaarNumber(value);
      if (errors.aadhaar) {
        setErrors({ ...errors, aadhaar: "" });
      }
    }
  };

  // Handle file upload for front/back images
  const handleFileUpload = (file, type) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "front") {
          setFrontImage(file);
          setFrontImagePreview(e.target.result);
          if (errors.frontImage) {
            setErrors({ ...errors, frontImage: "" });
          }
        } else {
          setBackImage(file);
          setBackImagePreview(e.target.result);
          if (errors.backImage) {
            setErrors({ ...errors, backImage: "" });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "front") {
      setDragActiveFront(true);
    } else {
      setDragActiveBack(true);
    }
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "front") {
      setDragActiveFront(false);
    } else {
      setDragActiveBack(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === "front") {
      setDragActiveFront(false);
    } else {
      setDragActiveBack(false);
    }

    const files = e.dataTransfer.files;
    if (files && files) {
      handleFileUpload(files, type);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e, type) => {
    const file = e.target.files;
    if (file) {
      handleFileUpload(file, type);
    }
  };

  // Remove uploaded image
  const removeImage = (type) => {
    if (type === "front") {
      setFrontImage(null);
      setFrontImagePreview(null);
      if (frontInputRef.current) frontInputRef.current.value = "";
    } else {
      setBackImage(null);
      setBackImagePreview(null);
      if (backInputRef.current) backInputRef.current.value = "";
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!aadhaarNumber) {
      newErrors.aadhaar = "Aadhaar number is required";
    } else if (!validateAadhaarNumber(aadhaarNumber)) {
      newErrors.aadhaar = "Please enter a valid 12-digit Aadhaar number";
    }

    if (!frontImage) {
      newErrors.frontImage = "Front side image is required";
    }

    if (!backImage) {
      newErrors.backImage = "Back side image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for API submission
      const formData = new FormData();
      formData.append("aadhaarNumber", aadhaarNumber);
      formData.append("frontImage", frontImage);
      formData.append("backImage", backImage);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would make the actual API call
      // const response = await fetch('/api/aadhaar/verify', {
      //   method: 'POST',
      //   body: formData
      // });

      alert("Aadhaar verification documents submitted successfully! You will be notified once verification is complete.");
      
      // Reset form
      setAadhaarNumber("");
      setFrontImage(null);
      setBackImage(null);
      setFrontImagePreview(null);
      setBackImagePreview(null);
      if (frontInputRef.current) frontInputRef.current.value = "";
      if (backInputRef.current) backInputRef.current.value = "";

    } catch (error) {
      alert("Failed to submit verification documents. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-2">
          Aadhaar Verification
        </h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Aadhaar Not Verified
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Please provide your 12-digit Aadhaar number and upload clear images of both sides of your Aadhaar card for manual verification.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Aadhaar Number Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Aadhaar Number
          </h3>
          <div>
            <label htmlFor="aadhaar" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your 12-digit Aadhaar number
            </label>
            <input
              type="text"
              id="aadhaar"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              placeholder="XXXX XXXX XXXX"
              className={`w-full px-4 py-3 text-lg rounded-lg border-2 shadow-sm focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                errors.aadhaar 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-gray-300 focus:border-green-500"
              }`}
            />
            {errors.aadhaar && (
              <p className="mt-2 text-sm text-red-600">{errors.aadhaar}</p>
            )}
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Front Side Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Front Side of Aadhaar Card
            </h3>
            
            {!frontImagePreview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragActiveFront
                    ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                    : errors.frontImage
                    ? "border-red-300 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onDragEnter={(e) => handleDragEnter(e, "front")}
                onDragLeave={(e) => handleDragLeave(e, "front")}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "front")}
                onClick={() => frontInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={frontInputRef}
                  onChange={(e) => handleFileInputChange(e, "front")}
                  accept="image/*"
                  className="hidden"
                />
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Drop front side image here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click to browse • JPG, PNG (max 5MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={frontImagePreview}
                  alt="Front side preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage("front")}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {errors.frontImage && (
              <p className="mt-2 text-sm text-red-600">{errors.frontImage}</p>
            )}
          </div>

          {/* Back Side Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Back Side of Aadhaar Card
            </h3>
            
            {!backImagePreview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragActiveBack
                    ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                    : errors.backImage
                    ? "border-red-300 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onDragEnter={(e) => handleDragEnter(e, "back")}
                onDragLeave={(e) => handleDragLeave(e, "back")}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "back")}
                onClick={() => backInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={backInputRef}
                  onChange={(e) => handleFileInputChange(e, "back")}
                  accept="image/*"
                  className="hidden"
                />
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Drop back side image here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click to browse • JPG, PNG (max 5MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={backImagePreview}
                  alt="Back side preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage("back")}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {errors.backImage && (
              <p className="mt-2 text-sm text-red-600">{errors.backImage}</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-3">
            Important Instructions
          </h3>
          <ul className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
            <li>• Ensure both images are clear and readable</li>
            <li>• All text and numbers should be visible</li>
            <li>• Images should be in good lighting without shadows</li>
            <li>• Maximum file size: 5MB per image</li>
            <li>• Supported formats: JPG, PNG</li>
            <li>• Verification process may take 2-3 business days</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg min-w-64 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 hover:shadow-xl"
            } text-white`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit for Verification"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from "react";

export default function ImageBox({ file }) {
  const [editMode, setEditMode] = useState(false);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100); // Default brightness is set to 100
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultedImageUrl, setResultedImageUrl] = useState(null);

  useEffect(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleToggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
  };

  const handleContrastChange = (e) => {
    setContrast(parseInt(e.target.value));
  };

  const handleBrightnessChange = (e) => {
    setBrightness(parseInt(e.target.value));
  };

  const handleDiscardChanges = () => {
    setContrast(0);
    setBrightness(100); // Reset brightness to default value
    setEditMode(false);
  };

  const handleSaveChanges = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("contrast", contrast);
    formData.append("brightness", brightness);

    fetch("http://192.168.43.56:5600/save-changes", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Changes saved successfully");
          setResultedImageUrl(`/uploads/resulted_image.jpg`);
        } else {
          console.error("Failed to save changes");
        }
      })
      .catch((error) => {
        console.error("Error saving changes:", error);
      });

    // Reset edit mode and adjustments
    setEditMode(false);
    setContrast(0);
    setBrightness(100); // Reset brightness to default value
  };

  const handleViewResultedImage = () => {
    fetch("http://localhost:5600/resulted-image")
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Failed to fetch resulted image");
      })
      .then((blob) => {
        setResultedImageUrl(URL.createObjectURL(blob));
      })
      .catch((error) => {
        console.error("Error fetching resulted image:", error);
      });
  };

  return (
    <div className="flex bg-lightDark px-6 py-6 rounded shadow">
      <div className="w-1/2">
        {editMode
          ? previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-64 w-auto rounded"
                style={{
                  filter: `contrast(${contrast}%) brightness(${brightness}%)`,
                }}
              />
            )
          : previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-64 w-auto rounded"
              />
            )}
      </div>

      <div className="flex-1 px-3">
        <div className="mb-4">
          <h2 className="text-gray-300">{file.name}</h2>
          <small className="text-gray-400/80 block -mt-1">{file.type}</small>
        </div>

        {editMode ? (
          <div className="mb-4">
            <div className="mb-4">
              <label htmlFor="contrast" className="text-gray-300">
                Contrast
              </label>
              <input
                type="range"
                id="contrast"
                name="contrast"
                min="0"
                max="200"
                value={contrast}
                onChange={handleContrastChange}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="brightness" className="text-gray-300">
                Brightness
              </label>
              <input
                type="range"
                id="brightness"
                name="brightness"
                min="0"
                max="200" // Adjust the maximum value according to your preference
                value={brightness}
                onChange={handleBrightnessChange}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <button
                onClick={handleSaveChanges}
                className="bg-purple-600 text-white py-2 px-4 rounded text-sm mr-2"
              >
                Save Changes
              </button>
              <button
                onClick={handleDiscardChanges}
                className="bg-red-600 text-white py-2 px-4 rounded text-sm"
              >
                Discard Changes
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={handleToggleEditMode}
              className="bg-purple-600 text-white py-2 px-4 rounded text-sm"
            >
              Edit
            </button>
            {resultedImageUrl ? (
              <button
                onClick={handleViewResultedImage}
                className="bg-blue-600 text-white py-2 px-4 rounded text-sm ml-2"
              >
                View Resulted Image
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

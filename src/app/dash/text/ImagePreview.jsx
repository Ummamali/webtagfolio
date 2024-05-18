import React, { useState, useEffect } from "react";

const ImagePreview = ({ file, size }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div>
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          style={{
            height: size.height,
            width: "auto",
            maxWidth: size.width,
            borderRadius: "3px",
          }}
        />
      ) : (
        <p>No image selected</p>
      )}
    </div>
  );
};

export default ImagePreview;

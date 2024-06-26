import Image from "next/image";
import React, { useState, useEffect } from "react";

const ImagePreview = ({ file, className }) => {
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
        <div className={"relative " + className}>
          <Image
            src={previewUrl}
            alt={"Preview"}
            fill={true}
            style={{ objectFit: "contain" }}
          />
        </div>
      ) : (
        <p>No image selected</p>
      )}
    </div>
  );
};

export default ImagePreview;

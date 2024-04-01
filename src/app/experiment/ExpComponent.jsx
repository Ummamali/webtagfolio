"use client";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const ImageAnalyzer = () => {
  const [images, setImages] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      await tf.ready();
      const model = await cocoSsd.load();
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading the model:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    const uploadedImages = [];
    const uploadedPredictions = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      uploadedImages.push(imageUrl);

      const imageElement = document.createElement("img");
      imageElement.src = imageUrl;

      try {
        const predictions = await detectObjects(imageElement);
        uploadedPredictions.push(predictions);
      } catch (error) {
        console.error("Error detecting objects:", error);
        uploadedPredictions.push([]);
      }
    }

    setImages(uploadedImages);
    setPredictions(uploadedPredictions);
  };

  const detectObjects = async (imageElement) => {
    const model = await cocoSsd.load();
    const predictions = await model.detect(imageElement);
    return predictions;
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        multiple
      />
      {images.map((imageUrl, index) => (
        <div key={index}>
          <img
            src={imageUrl}
            alt={`Uploaded ${index}`}
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
          <div>
            {predictions[index] &&
              predictions[index].map((prediction, idx) => (
                <div key={idx}>
                  <p>
                    {prediction.class} - {Math.round(prediction.score * 100)}%
                  </p>
                  <img
                    src={imageUrl}
                    alt={`Object ${idx}`}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageAnalyzer;

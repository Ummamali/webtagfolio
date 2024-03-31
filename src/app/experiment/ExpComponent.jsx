"use client";
import React, { useState } from "react";
import ColorThief from "colorthief";
import tinycolor from "tinycolor2";
import { findClosestColorName } from "../../utilFuncs/utilFuncs";

const ImageAccentColors = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [accentColors, setAccentColors] = useState([]);
  const [colorNames, setColorNames] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);

    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;

    const colorThief = new ColorThief();

    // Load the image and get the dominant color palette
    imageElement.onload = () => {
      const colors = colorThief.getPalette(imageElement, 5);

      const colorNames = colors.map((c) => {
        const tc = tinycolor({ r: c[0], g: c[1], b: c[2] });
        if (tc.toName()) {
          return tc.toName();
        } else {
          return findClosestColorName(c[0], c[1], c[2]);
        }
      });

      console.log(colorNames);
      setAccentColors(colors);
    };
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
          <div>
            <h3>Accent Colors:</h3>
            <ul>
              {accentColors.map((color, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: `rgb(${color.join(",")})`,
                    padding: "5px",
                  }}
                >
                  {`Color ${index + 1}`}{" "}
                  {/* You can customize the label here */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAccentColors;

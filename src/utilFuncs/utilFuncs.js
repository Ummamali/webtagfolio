import tinycolor from "tinycolor2";
import ColorThief from "colorthief";

export function isValidEmail(email) {
  // Regular expression for a basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regular expression
  return emailRegex.test(email);
}

export function findObjectWithProperties(array, properties) {
  return array.find((obj) => {
    for (let key in properties) {
      if (obj[key] !== properties[key]) {
        return false;
      }
    }
    return true;
  });
}

function suggestColors(images) {
  let result = [];
  for (const file of images) {
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
    };
  }
}

export function countOccurrences(array) {
  const counts = {};
  array.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return counts;
}

export async function getPrimaryColors(imageFile) {
  var colorThief = new ColorThief();

  // Create an image element
  var img = new Image();

  // Define a promise to handle asynchronous loading of the image
  var imgPromise = new Promise((resolve, reject) => {
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject(new Error("Failed to load image."));
    };
  });

  // Set the image source
  img.src = URL.createObjectURL(imageFile);

  // When the image is loaded, get the primary color palette
  return imgPromise.then((img) => {
    // Get the primary color palette
    var palette = colorThief.getPalette(img, 5); // Change the number to get more or fewer colors
    return palette;
  });
}

export function findClosestColorName(...rgb) {
  // Convert RGB to TinyColor object
  // Convert RGB to TinyColor object
  const color = tinycolor({ r: rgb[0], g: rgb[1], b: rgb[2] });

  // Get final hue
  const hue = color.toHsl().h;

  const colorRanges = {
    red: [0, 20], // Red: Hue range from 0 to 20 degrees
    green: [90, 150], // Green: Hue range from 90 to 150 degrees
    blue: [210, 270], // Blue: Hue range from 210 to 270 degrees
    yellow: [40, 70], // Yellow: Hue range from 40 to 70 degrees
    brown: [20, 40], // Brown: Hue range from 20 to 40 degrees
    orange: [20, 40], // Orange: Hue range from 20 to 40 degrees
    purple: [270, 310], // Purple: Hue range from 270 to 310 degrees
    pink: [310, 340], // Pink: Hue range from 310 to 340 degrees
    cyan: [180, 210], // Cyan: Hue range from 180 to 210 degrees
    magenta: [300, 330], // Magenta: Hue range from 300 to 330 degrees
    lime: [70, 90], // Lime: Hue range from 70 to 90 degrees
    maroon: [340, 360], // Maroon: Hue range from 340 to 360 degrees
    navy: [210, 240], // Navy: Hue range from 210 to 240 degrees
    olive: [60, 80], // Olive: Hue range from 60 to 80 degrees
    teal: [170, 190], // Teal: Hue range from 170 to 190 degrees
  };

  // Determine color name based on hue range
  let colorName = "Unknown";
  for (const [name, [minHue, maxHue]] of Object.entries(colorRanges)) {
    if (hue >= minHue && hue <= maxHue) {
      colorName = name;
      break;
    }
  }

  return colorName;
}

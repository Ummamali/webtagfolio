import React, { useState } from "react";
import ImagePreview from "./ImagePreview";

export default function ImageBox({ file }) {
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [userFeedback, setUserFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [starsSelected, setStarsSelected] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  const detectText = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://192.168.43.56:5500/extract-text", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setExtractedText(data.text);
        if (!data.text) {
          alert("No text detected in the image.");
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error detecting text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTextFile = async () => {
    setIsDownloading(true);
    if (!extractedText) {
      alert("No text to download.");
      setIsDownloading(false);
      return;
    }

    try {
      const response = await fetch("http://192.168.43.56:5500/download-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: extractedText }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "extracted_text.txt";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error("Error downloading text file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFeedbackChange = (event) => {
    setUserFeedback(event.target.value);
  };

  const handleStarClick = (stars) => {
    setStarsSelected(stars);
  };

  const handleSubmitFeedback = () => {
    // Submit feedback to the system
    console.log("Submitted feedback:", {
      stars: starsSelected,
      feedback: userFeedback,
    });

    // Hide feedback section
    setShowFeedback(false);
    setFeedbackSubmitted(true);

    // Reset feedback fields
    setUserFeedback("");
    setStarsSelected(0);

    // Clear feedback submitted message after 1 second
    setTimeout(() => {
      setFeedbackSubmitted(false);
    }, 1000);
  };

  const handleCancelFeedback = () => {
    // Hide feedback section
    setShowFeedback(false);

    // Reset feedback fields
    setUserFeedback("");
    setStarsSelected(0);
  };
  const handleDetailClick = async () => {
    try {
      const response = await fetch("http://localhost:5500/text-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: extractedText }),
      });

      if (response.ok) {
        const data = await response.json();
        setTextDetail(data.detail);
        setShowDetail(true);
      }
    } catch (error) {
      console.error("Error fetching text detail:", error);
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  return (
    <div className="flex bg-gray-800 p-3 rounded shadow">
      <ImagePreview file={file} size={{ height: "140px" }} />
      <div className="flex-1 px-3">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-gray-300">{file.name}</h2>
            <small className="text-gray-400/80 block -mt-1">{file.type}</small>
          </div>
          <div className="flex space-x-4">
            <button
              className={`bg-mainAccent bg-purple-200 border-white text-purple-900 py-2 px-4 rounded text-sm ${
                isLoading ? "bg-gray-400/20" : ""
              }`}
              onClick={detectText}
              disabled={isLoading}
            >
              {isLoading ? "Detecting..." : "Detect Text"}
            </button>
            <button
              className={`bg-mainAccent bg-purple-200 border-white text-purple-900 py-2 px-4 rounded text-sm ${
                isDownloading ? "bg-gray-400/20" : ""
              }`}
              onClick={downloadTextFile}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download Text(.txt)"}
            </button>
            <button
              className="bg-mainAccent bg-purple-200 border-white text-purple-900 py-2 px-4 rounded text-sm"
              onClick={() => setShowFeedback(true)}
            >
              Feedback
            </button>
            <button
              className={`bg-mainAccent bg-purple-200 border-white text-purple-900 py-2 px-4 rounded text-sm`}
              onClick={handleDetailClick}
              disabled={!extractedText}
            >
              Detail
            </button>
          </div>
        </div>
        <div>
          <textarea
            className="w-full h-40 border bg-purple-900 text-purple-100 border-white p-2 rounded-md resize-none"
            value={extractedText}
            readOnly
            placeholder="Extracted Text"
          />
        </div>
        {showFeedback && (
          <div className="mt-6">
            <div className="mb-2 text-gray-300">Rating & Reviews</div>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-300 mr-2">Tap to Rate</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl cursor-pointer ${
                    star <= starsSelected ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              className="w-full h-20 border bg-purple-900 text-purple-100 border-white p-2 rounded-md resize-none mb-2"
              value={userFeedback}
              onChange={handleFeedbackChange}
              placeholder="Provide feedback..."
            />
            <div className="flex justify-end">
              <button
                className="bg-mainAccent bg-purple-200 border-white text-purple-900 py-2 px-4 rounded text-sm mr-4"
                onClick={handleSubmitFeedback}
              >
                Submit
              </button>
              <button
                className="bg-mainAccent bg-purple-200 border-white text-purple-900 py-2 px-4 rounded text-sm"
                onClick={handleCancelFeedback}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {feedbackSubmitted && (
          <div className="mt-2 text-green-500">
            Feedback submitted successfully!
          </div>
        )}
        {showDetail && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex justify-end">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={handleCloseDetail}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-gray-800">
                <h3 className="text-lg font-semibold mb-2">Text Details</h3>
                <p>{textDetail}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

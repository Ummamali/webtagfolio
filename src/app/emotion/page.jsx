"use client"
import React, { useState } from 'react';

const ImageAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch("http://localhost:5000/emotion", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      const data = await response.json();
      setResult(data.Emotion)
      setShowResult(true);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Emotional Analysis</h1>
      
      {!showResult ? (
        <div>
          {image && (
            
            <div style={styles.imageContainer}>
              <img src={URL.createObjectURL(image)} alt="Uploaded" style={styles.image} />
              <p style={styles.fileName}>File Name: {image.name}</p>
            </div>
          )}
          
          <div style={styles.uploadContainer} className=''>
            <label htmlFor="fileInput" style={styles.uploadLabel}>
              <input
                id="fileInput"
                type="file"
                multiple={true}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              Upload Image
            </label>
            <button onClick={handleUploadImage} style={styles.analyzeButton} disabled={!image}>
              Analyze Image
            </button>
          </div>
          
        </div>
        
      ) : (
        <div>
          {image && (
            
            <div style={styles.imageContainer}>
              <img src={URL.createObjectURL(image)} alt="Uploaded" style={styles.image} />
              <p style={styles.fileName}>File Name: {image.name}</p>
              <div className='flex-1 '>
                <h3 className='text-white float-left'>Emotion: </h3>
                <span className="float-left border border-collapse rounded px-2 mt-0.5 ml-2 border-purple-500 text-purple-500 ">{result}</span>
              </div>
              
            </div>
            
            
          )}
          
          
          <div style={styles.uploadContainer} className=''>
            <label htmlFor="fileInput" style={styles.uploadLabel}>
              <input
                id="fileInput"
                type="file"
                multiple={true}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              Upload Image
            </label>
            <button onClick={handleUploadImage} style={styles.analyzeButton} disabled={!image}>
              Analyze Image
            </button>
          </div>
          
        </div>
        
          
        
      )}
    </div>
  );
};

export default ImageAnalyzer;

const styles = {
  container: {
    backgroundColor: '#202121',
    padding: '20px',
    textAlign: 'center',
    minHeight: '100vh',
  },
  title: {
    color: 'white',
    fontSize: '32px',
    marginBottom: '20px',
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  uploadLabel: {
    marginTop: '10px',
    backgroundColor: '#2220df',
    color: 'white',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  analyzeButton: {
    backgroundColor: '#2220df',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '10px',
    
  },
  imageContainer: {
    borderRadius:  '5px',
    width:'fixed content',
    margin: 'auto',
    border: '2px solid #666175',
    padding: '10px',
    marginTop: '20px',
    display: 'flex',
    flexDirection:'column'
  },
  image: {
    maxWidth: '100px',
    maxHeight: '100px',
  },
  fileName: {
    textAlign:'left',
    color: 'white',
    marginTop: '10px',
  },
  resultContainer: {
    marginTop: '20px',
  },
  resultText: {
    color: 'white',
    fontSize: '20px',
    marginBottom: '20px',
  },
  backButton: {
    backgroundColor: '#2220df',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '15px',
    cursor: 'pointer',
  },
};
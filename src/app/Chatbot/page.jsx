"use client";
import React, { useState } from "react";
import Image from "next/image";
import "./chatbot.css";

export default function Chatbot(){
    const [inputText, setInputText] = useState('');

    const handleInputChange = (e) =>{
        setInputText(e.target.value);
    }

    const handleSendMessage= ()=>{
        console.log("Sending Message:" , {inputText});
        setInputText('');
    }
    return(
        <div className="c-screen ">
            <div className="title text-white">
                <h1>NLP Chatbot</h1>
            </div>
            <div className="center-container">
                <div className="image-container ">
                    <Image className="bucket-image"
                        src={"/bucket.jpg"}
                        alt="Stranger thing Poster"
                        width = {250}
                        height = {400}
                    />
                    <p className="image-text">Active Bucket: Stranger things</p>
                </div>
            </div>
            <div className="chatbox">
                <label className="query-label">Query:</label>
                <div className="input-button">
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Write your Query..."
                        className="rectangle-input"
                    />
                    <Image
                        src={"/send.png"}
                        alt="send icon"
                        width={256}
                        height={256}
                        className="send-button"
                        onClick={handleSendMessage}
                    />
                </div>
               
            </div>
            
        </div>
        
    );
}
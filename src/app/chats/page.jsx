"use client";
import React, { useState } from "react";
import Image from "next/image";
import "./chatbot.css";

export default function Chatbot() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() != "") {
      const inputWords = inputText.toLowerCase().split(" ");
      const imageMap = {
        jim: "/images/jim.jpeg",
        max: "/images/max.jpeg",
        billy: "/images/billy.jpeg",
        steve: "/images/steve.jpeg",
        eleven: "/images/eleven.jpg",
        // Add more commands and their corresponding image paths here
      };
      console.log(inputWords);

      let foundCommand = false;
      const newMessages = [];
      inputWords.forEach((word) => {
        if (imageMap.hasOwnProperty(word)) {
          const imagePath = imageMap[word];
          console.log(imagePath);
          newMessages.push(
            { text: inputText, isUser: true },
            { imagePath, isUser: false }
          );
          newMessages.push({
            text: "Here is the image of " + word,
            isUser: false,
          });
          setInputText("");
          foundCommand = true;
        }
        if (
          inputText.toLowerCase() === "hi" ||
          inputText.toLowerCase() === "hello" ||
          inputText.toLowerCase() === "hey"
        ) {
          newMessages.push(
            { text: inputText, isUser: true },
            { text: "Hello, how can I help you?", isUser: false }
          );
          setInputText("");
          foundCommand = true;
        }
      });

      if (!foundCommand) {
        newMessages.push({ text: inputText, isUser: true });
        newMessages.push({
          text: "Sorry, we can't find the queried media.",
          isUser: false,
        });
      }
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      setInputText("");
    }
  };

  return (
    <div className="c-screen ">
      <div className="title text-white">
        <h1>NLP Chatbot</h1>
      </div>
      <div className="center-container">
        <div className="image-container ">
          <Image
            className="bucket-image"
            src={"/images/test.jpg"}
            alt="Stranger thing Poster"
            width={250}
            height={400}
          />
          <p className="image-text">Active Bucket: Stranger things</p>
        </div>
      </div>
      <div className="chatbox">
        <div className="chatbox-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.isUser ? "user-message" : "bot-message"
              }`}
            >
              {message.text}
              {message.imagePath && (
                <img
                  src={message.imagePath}
                  alt={message.text}
                  width={250}
                  height={250}
                />
              )}
            </div>
          ))}
        </div>
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

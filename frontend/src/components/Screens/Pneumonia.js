import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../css/Pneumonia.css"; 

const Pneumonia = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [predictedText, setPredictedText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(""); 
  const [displayedDetails, setDisplayedDetails] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please select an image");
      return;
    }

    const formData = new FormData();
    const randomSuffix =
      Math.floor(Math.random() * (99999999 - 100000 + 1)) + 100000;
    const originalFileName = image.name;
    const fileExtension = originalFileName.substring(
      originalFileName.lastIndexOf(".")
    );
    const uniqueFileName = originalFileName.replace(
      fileExtension,
      `_${randomSuffix}${fileExtension}`
    );
    const uniqueFile = new File([image], uniqueFileName, { type: image.type });
    formData.append("image", uniqueFile);

    const userInfo = localStorage.getItem("userInfo");
    let token = "";
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      token = parsedUserInfo.data.token.access;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/disease/pneumonia/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPredictedText(response.data.predicted_text);
      const responseDetails = response.data.details || response.data.Details;
      setDetails(responseDetails);

      setLoading(false);
      streamDetails(responseDetails);
    } catch (err) {
      setError("Error uploading the image");
      setLoading(false);
    }
  };

  const streamDetails = (details) => {
    let idx = -2; 
    setDisplayedDetails("");

    const interval = setInterval(() => {
      if (idx < details.length - 2) {
        setDisplayedDetails((prev) => prev + details[idx + 1]);
        idx += 1;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  const handleClear = () => {
    setImage(null);
    setImagePreview(null);
    setPredictedText("");
    setDetails("");
    setDisplayedDetails("");
    setError("");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
      className="pneumonia-container"
    >
      <h1 className="pneumonia-header">Upload X-ray Image</h1>
      <form className="pneumonia-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
        <div className="button-group">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="upload-button"
          >
            {loading ? "Uploading..." : "Upload"}
          </motion.button>
          <motion.button
            type="button"
            onClick={handleClear}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="clear-button"
          >
            Clear
          </motion.button>
        </div>
      </form>
      {loading && <p className="status-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {imagePreview && (
        <div className="section-container">
          <h3>Uploaded Image:</h3>
          <img
            src={imagePreview}
            alt="Uploaded X-ray"
            className="uploaded-image"
          />
        </div>
      )}

      {predictedText && (
        <div className="section-container">
          <h3>Prediction Result:</h3>
          <p
            className="prediction-text"
            style={{
              color: predictedText.includes("PNEUMONIA") ? "red" : "green",
            }}
          >
            {predictedText}
          </p>
        </div>
      )}

      {displayedDetails && (
        <div className="section-container">
          <h3>Details:</h3>
          <p className="details-text">{displayedDetails}</p>
          <p>
            <em>Remember, please consult a doctor for more details.</em>
          </p>
        </div>
      )}

      <div className="bottom-button-container">
        <Button variant="dark" onClick={() => navigate("/get-pneumonia-records")}>
          Get Previous Predictions
        </Button>
      </div>
    </motion.div>
  );
};

export default Pneumonia;

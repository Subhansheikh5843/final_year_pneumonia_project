import React from "react";
import '../css/About.css';
import cardData from "../../data/AboutData";


const ModelCard = ({ image, alt, title, description, longDescription }) => (
  <div className="model-card animate-card">
    <div className="card-image-container">
      <img src={image} alt={alt} className="card-image" />
    </div>
    <div className="card-body">
      <h3>{title}</h3>
      <p className="short-description">{description}</p>
      <p className="long-description">{longDescription}</p>
    </div>
  </div>
);

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="hero-section animate-hero">
        <h1>About Me</h1>
        <p>
        Empowering healthcare through AI driven innovation, our platform delivers precise diagnostics and personalized treatment solutions for a healthier tomorrow.
        </p>
      </div>
      <div className="project-description">
        <p>
Our Automated Medical Diagnosis platform integrates state-of-the-art machine learning and deep learning to deliver fast, reliable pneumonia detection from chest X-ray images. Leveraging pretrained CNN architectures Inception V3, our system analyzes each upload to classify it as PNEUMONIA or NORMAL and provides a detailed probability score. The intuitive interface lets users upload new X-rays, review historical predictions, and generate downloadable diagnostic reports. Designed for both clinicians and patients, our solution streamlines workflow, supports early intervention, and drives better health outcomes.
        </p>
      </div>
      <div className="cards-container">
        {cardData.map((card, index) => (
          <ModelCard
            key={index}
            image={card.image}
            alt={card.alt}
            title={card.title}
            description={card.description}
            longDescription={card.longDescription}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutPage;

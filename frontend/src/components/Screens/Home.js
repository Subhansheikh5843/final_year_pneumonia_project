import React from "react";
import ServiceCard from "./ServiceCard";
import "../css/Home.css";
import serviceData from "../../data/Homedata";

const Home = () => {
  return (
    <>
      <div className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Transforming Medical Diagnosis with AI Excellence</h1>
            <p>
              Welcome to our AI-powered healthcare platform, where advanced
              machine learning meets compassionate care. Our cutting-edge system
              leverages deep learning and state-of-the-art algorithms to deliver
              precise, personalized medical diagnoses and actionable insights.
              Experience the future of healthcare—empowering you to take control
              of your well-being through innovative technology and expert
              analysis.
            </p>
          </div>
        </section>

        <section className="section__container service__container" id="service">
          <div className="service__header">
            <div className="service__header__content">
              <h2 className="section__header">Our Special Service</h2>
              <p>
                Automated medical diagnosis website offers state-of-the-art
                healthcare solutions powered by machine learning and deep
                learning models. By analyzing chest X-ray images, our system
                delivers rapid, accurate pneumonia detection—classifying each
                upload as either “PNEUMONIA” or “NORMAL.” Users simply upload
                their X-ray, and within seconds receive a clear diagnosis and
                probability score. To further support clinicians and patients,
                our platform logs historical results and provides an easy-to-use
                interface for reviewing past predictions. Our goal is to
                streamline diagnostic workflows, improve early detection, and
                make high-quality care more accessible to everyone
              </p>
            </div>
          </div>
          <div className="service__grid">
            {serviceData.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                content={service.content}
                link={service.link}
                iconClass={service.iconClass}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

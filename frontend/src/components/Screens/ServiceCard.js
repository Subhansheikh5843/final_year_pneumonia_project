import React from "react";
import { Link } from "react-router-dom";
import "../css/service_cards.css";

const ServiceCard = ({ title, content, link, iconClass }) => {
  return (
    <>
      <div className="service__card">
        {iconClass && (
          <span>
            <img src={iconClass} alt="img" />
          </span>
        )}
        <h4>{title}</h4>
        <p>{content}</p>
        <Link to={link}>Click Me</Link>
      </div>
    </>
  );
};

export default ServiceCard;

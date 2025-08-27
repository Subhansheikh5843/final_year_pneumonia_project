import React from "react";
import "../css/contact.css";
import doctors from "../../data/ContactData";

const DoctorCard = ({ doctor }) => (
  <div className="doctor-card animate-card">
    <div className="doctor-image-container">
 
       <img src={doctor.image} alt={doctor.name} className="doctor-image" />
     </div>

    <div className="doctor-details">
      <h2>{doctor.name}</h2>
      <h4>{doctor.specialty}</h4>
      <p><strong>Hospital:</strong> {doctor.hospital}</p>
      <p><strong>Address:</strong> {doctor.address}</p>

      {doctor.phone && (
        <p><strong>Phone:</strong> {doctor.phone}</p>
      )}
      <p><strong>Timing:</strong> {doctor.timing}</p>

      {doctor.appointmentLink ? (
        <a
          href={doctor.appointmentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="appointment-button"
        >
          Book Appointment
        </a>
      ) : null}
    </div>
  </div>
);

const ContactPage = () => (
  <div className="contact-page">
    <div className="hero-section animate-hero">
      <h1>Contact Our Expert Doctors</h1>
      <p>
        For specialized consultation and advanced medical diagnosis services,
        reach out to our trusted network of experts in Lahore.
      </p>
    </div>
    <div className="project-contact-description animate-fade">
      <p>
        Our AI Medical Diagnosis project is dedicated to revolutionizing healthcare with cutting-edge
        technology. Whether you need a diagnosis, treatment consultation, or personalized care advice,
        our affiliated doctors are here to help. Please find below our list of expert doctors along
        with their contact details.
      </p>
    </div>
    <div className="doctor-cards-container">
      {doctors.map((doc, index) => (
        <DoctorCard key={index} doctor={doc} />
      ))}
    </div>
  </div>
);

export default ContactPage;

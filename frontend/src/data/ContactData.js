import doc1 from "../assets/doc1.jpeg";
import doc2 from "../assets/doc2.jpeg";
import doc3 from "../assets/doc3.jpeg";
import doc4 from "../assets/doc4_lady.jpeg";

const doctors = [
  {
    name: "Dr. Asif Hanif",
    specialty: "Pulmonologist (Pneumonia Specialist)",
    hospital: "Omar Hospital & Cardiac Centre / Mayo Hospital, Lahore",
    address: "Jail Road / Mayo Hospital, Lahore",
    phone: "04238900939",
    timing: "Mon–Sat: 3:00 PM – 5:30 PM",
    image: doc1,
    appointmentLink:
      "https://www.oladoc.com/pakistan/lahore/dr/pulmonologist/asif-hanif/14841",
  },

  {
    name: "Prof. Saleem Uz Zaman Adhami",
    specialty: "Head of Pulmonology",
    hospital: "Shalamar Hospital, Lahore",
    address: "Shalamar Hospital, Lahore",
    phone: null,
    timing: "Check hospital portal",
    image: doc3,
    appointmentLink: "https://shalamarhospital.org.pk/pulmonology/",
  },
  {
    name: "Dr. Aamer Iqbal",
    specialty: "Asthma Specialist, Pulmonologist",
    hospital: "Mid City Hospital, Jail Road, Lahore",
    address: "10-C Jail Rd, Shadman II, Shadman, Lahore",
    phone: "04238900939",
    timing: "Mon & Fri: 5:00 PM – 6:00 PM ",
    image: doc2,
    appointmentLink:
      "https://oladoc.com/pakistan/lahore/dr/asthma-specialist/aamer-iqbal/12471", 
  },
  {
    name: "Dr. Noor Ul Arfeen",
    specialty: "Pulmonologist",
    hospital:
      "Doctors Hospital (Johar Town), Lahore",
    address:
      "Johar Town / 262-263 West Wood Colony, Lahore",
    phone: "04237498596",
    timing:
      "Doctors Hospital: Mon–Thu: 1:00 PM – 2:00 PM",
    image: doc4 ,
    appointmentLink: "https://official.drnoorularfeen.com/services/", // 
  },

];
export default doctors;

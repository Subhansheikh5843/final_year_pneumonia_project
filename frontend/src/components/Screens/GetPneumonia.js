import axios from "axios";
import React, { useEffect, useState } from "react";

const GetPneumonia = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    const userInfo = localStorage.getItem("userInfo");
    let token = "";
    if (userInfo) {
      const { data } = JSON.parse(userInfo);
      token = data.token.access;
    }

    try {
      const response = await axios.get(
        "http://localhost:8000/api/disease/user-pneumonia-records/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(response.data);
    } catch {
      setError("Error fetching records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteAllRecords = async () => {
    const userInfo = localStorage.getItem("userInfo");
    let token = "";
    if (userInfo) {
      const { data } = JSON.parse(userInfo);
      token = data.token.access;
    }

    try {
      const { data } = await axios.delete(
        "http://localhost:8000/api/disease/pneumonia/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(data.message);
      setRecords([]);
    } catch {
      alert("Failed to delete predictions.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        User Pneumonia Records
      </h2>
      <button
        onClick={deleteAllRecords}
        style={{
          backgroundColor: "#ff4d4d",
          color: "#fff",
          padding: "0.8rem 1.5rem",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "2rem",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Delete All Predictions
      </button>
      {records.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {records.map((record) => (
            <div
              key={record.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <img
                  src={`http://localhost:8000${record.image}`}
                  alt="X-ray"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                  X-ray Image
                </p>
              </div>
              <div
                style={{
                  flex: "1",
                  marginLeft: "1rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  Prediction:
                </p>
                <p
                  style={{
                    color: record.predicted_text.includes("PNEUMONIA")
                      ? "red"
                      : "green",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  {record.predicted_text || "Pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{ textAlign: "center", fontSize: "1.2rem", marginTop: "2rem" }}
        >
          No records found.
        </p>
      )}
    </div>
  );
};

export default GetPneumonia;

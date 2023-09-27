import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const generatePDF = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/generate",
        formData,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <h1>Generate PDF from .pug File</h1>
      <div>
        <label>Name:</label>
        <input type="text" name="name" onChange={handleChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="text" name="email" onChange={handleChange} />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type="text" name="phone" onChange={handleChange} />
      </div>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
}

export default App;

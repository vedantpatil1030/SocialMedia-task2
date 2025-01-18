import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import a CSS file for styling

const App = () => {
  const [name, setName] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [images, setImages] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const fetchSubmissions = async () => {
    const response = await axios.get("https://social-media-task-s5ay.vercel.app/submissions");
    setSubmissions(response.data);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("socialHandle", socialHandle);
    Array.from(images).forEach((image) => {
      formData.append("images", image);
    });

    await axios.post("https://social-media-task-s5ay.vercel.app/submit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setName("");
    setSocialHandle("");
    setImages([]);
    fetchSubmissions();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Social Media Submissions</h1>
      </header>

      <main>
        <section className="submission-form">
          <h2>Submit Your Details</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Enter your social media handle"
              value={socialHandle}
              onChange={(e) => setSocialHandle(e.target.value)}
              className="form-input"
            />
            <input
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
              className="form-input"
            />
            <button type="submit" className="form-button">Submit</button>
          </form>
        </section>

        <section className="dashboard">
          <h2>Admin Dashboard</h2>
          <div className="submissions-list">
            {submissions.map((user) => (
              <div key={user._id} className="submission-card">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-handle">{user.socialHandle}</p>
                <div className="images-container">
                  {user.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={`https://social-media-task-s5ay.vercel.app${image}`}
                      alt={`User upload ${idx}`}
                      className="user-image"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;


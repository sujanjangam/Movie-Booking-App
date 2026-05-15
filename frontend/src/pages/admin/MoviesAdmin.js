import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import axios from "../../api/axios";

const MoviesAdmin = () => {
  const [movie, setMovie] = useState({ title: "", duration: "", language: "", poster: "" });
  const [movies, setMovies] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(res.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/movies", movie, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Movie added successfully!");
      setMovie({ title: "", duration: "", language: "", poster: "" });
      fetchMovies();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add movie");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="content">
        <h1>Movies Management</h1>

        <div className="form-section">
          <h2>Add New Movie</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={movie.title}
              onChange={(e) => setMovie({ ...movie, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 148 min)"
              value={movie.duration}
              onChange={(e) => setMovie({ ...movie, duration: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Language"
              value={movie.language}
              onChange={(e) => setMovie({ ...movie, language: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Poster URL"
              value={movie.poster}
              onChange={(e) => setMovie({ ...movie, poster: e.target.value })}
            />
            <button type="submit">Add Movie</button>
          </form>
        </div>

        <div className="list-section">
          <h2>All Movies</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Language</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m._id}>
                  <td>{m.title}</td>
                  <td>{m.duration}</td>
                  <td>{m.language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoviesAdmin;

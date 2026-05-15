import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import axios from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ movies: 0, shows: 0, theatres: 0 });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [movies, shows, theatres] = await Promise.all([
          axios.get("/movies", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/shows", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/theatres", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats({
          movies: movies.data.length,
          shows: shows.data.length,
          theatres: theatres.data.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="content">
        <h1>Dashboard</h1>
        <div className="cards">
          <div className="card">
            <h3>Total Movies</h3>
            <p className="stat">{stats.movies}</p>
          </div>
          <div className="card">
            <h3>Total Shows</h3>
            <p className="stat">{stats.shows}</p>
          </div>
          <div className="card">
            <h3>Total Theatres</h3>
            <p className="stat">{stats.theatres}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

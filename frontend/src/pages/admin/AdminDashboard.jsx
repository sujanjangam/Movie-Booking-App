import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import axios from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ movies: 0, shows: 0, theatres: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const [movies, shows, theatres] = await Promise.all([
          axios.get("/movies"),
          axios.get("/shows"),
          axios.get("/theatres"),
        ]);
        setStats({
          movies: movies.data.length,
          shows: shows.data.length,
          theatres: theatres.data.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="content">
        <h1>Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

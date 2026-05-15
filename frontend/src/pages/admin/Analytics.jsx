import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "../../styles/Analytics.css";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/analytics");
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loader">Loading analytics...</div>;
  if (!data) return <div>Failed to load analytics</div>;

  return (
    <div className="analytics-container">
      <h2>📊 Analytics Dashboard</h2>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-value">{data.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{data.revenue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Occupancy Rate</h3>
          <p className="stat-value">{data.occupancyRate}%</p>
        </div>
      </div>

      <div className="analytics-section">
        <h3>📈 Bookings Trend</h3>
        <div className="trend-list">
          {data.bookingsTrend.map((d) => (
            <div key={d._id} className="trend-item">
              <span className="trend-date">{d._id}</span>
              <span className="trend-count">{d.count} bookings</span>
              <span className="trend-revenue">₹{d.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h3>🎬 Top Movies</h3>
        <div className="top-movies">
          {data.topMovies.map((movie, idx) => (
            <div key={movie._id} className="movie-item">
              <span className="movie-rank">#{idx + 1}</span>
              <span className="movie-title">{movie.title}</span>
              <span className="movie-bookings">{movie.bookings} bookings</span>
              <span className="movie-revenue">₹{movie.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

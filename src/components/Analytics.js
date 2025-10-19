import React from 'react';
import { Link } from 'react-router-dom';
import './shared/PageStyles.css';

const Analytics = () => {
  return (
    <div className="page-analytics">
      {/* Background Elements */}
      <div className="background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
        <div className="bg-blob bg-blob-4"></div>
        <div className="bg-blob bg-blob-5"></div>
        <div className="bg-blob bg-blob-6"></div>
        <div className="bg-blob bg-blob-7"></div>
        <div className="bg-blob bg-blob-8"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="glass-nav">
        <div className="nav-container">
          <div className="nav-left">
            <h1 className="logo">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>StudyPets</Link>
            </h1>
          </div>
          <div className="nav-right">
            <Link to="/dashboard" className="glass-btn secondary">Back to Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="main-container">
        <main className="main-content">
          <div className="content-wrapper">
            <div className="page-header">
              <h1>Analytics</h1>
              <p>Detailed insights into your study patterns and productivity metrics</p>
            </div>
            
            <div className="analytics-grid">
              <div className="glass-card">
                <h3>Study Time Trends</h3>
                <p>Coming soon - Interactive charts showing your study patterns over time</p>
              </div>
              <div className="glass-card">
                <h3>Focus Analysis</h3>
                <p>Coming soon - Detailed breakdown of your focus levels and distractions</p>
              </div>
              <div className="glass-card">
                <h3>Productivity Metrics</h3>
                <p>Coming soon - Comprehensive productivity statistics and insights</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;

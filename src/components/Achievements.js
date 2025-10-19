import React from 'react';
import { Link } from 'react-router-dom';
import './shared/PageStyles.css';

const Achievements = () => {
  return (
    <div className="page-achievements">
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
              <h1>Achievements</h1>
              <p>Unlock achievements and milestones as you build consistent study habits</p>
            </div>
            
            <div className="achievements-grid">
              <div className="glass-card">
                <h3>🏆 Study Streak Master</h3>
                <p>Study for 7 consecutive days</p>
                <div className="achievement-status">Coming soon</div>
              </div>
              <div className="glass-card">
                <h3>🎯 Focus Champion</h3>
                <p>Maintain 90% focus for 1 hour</p>
                <div className="achievement-status">Coming soon</div>
              </div>
              <div className="glass-card">
                <h3>⏰ Time Master</h3>
                <p>Study for 100 hours total</p>
                <div className="achievement-status">Coming soon</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Achievements;

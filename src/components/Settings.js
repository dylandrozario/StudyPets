import React from 'react';
import { Link } from 'react-router-dom';
import './shared/PageStyles.css';

const Settings = () => {
  return (
    <div className="page-settings">
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
              <h1>Settings</h1>
              <p>Customize your experience and configure your preferences</p>
            </div>
            
            <div className="settings-grid">
              <div className="glass-card">
                <h3>Pet Preferences</h3>
                <p>Customize your pet's appearance and personality</p>
                <button className="glass-btn primary">Configure</button>
              </div>
              <div className="glass-card">
                <h3>Study Settings</h3>
                <p>Configure study session timers and focus tracking</p>
                <button className="glass-btn primary">Configure</button>
              </div>
              <div className="glass-card">
                <h3>Notifications</h3>
                <p>Manage notification preferences and alerts</p>
                <button className="glass-btn primary">Configure</button>
              </div>
              <div className="glass-card">
                <h3>Website Blocking</h3>
                <p>Configure smart website blocking based on pet status</p>
                <button className="glass-btn primary">Configure</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;

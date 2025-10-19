import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
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

      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo-text">StudyPets</div>
          <nav className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <a href="#features" className="nav-link">Features</a>
            <a href="#getting-started" className="nav-link">Getting Started</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">StudyPets</h1>
        <div className="hero-tagline">
          1 pet.<br />
          1 focus.
        </div>
        <div className="hero-slogan">Virtual productivity companion</div>
        <p className="hero-description">
          Monitor your focus and study habits through interactive tracking and receive personalized suggestions to optimize your productivity with your virtual pet companion.
        </p>
        
        <div className="hero-buttons">
          <Link to="/dashboard" className="hero-btn primary">
            Start Studying →
          </Link>
          <Link to="/study" className="hero-btn secondary">
            Study Session ☆
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">
              <div className="section-icon">🐾</div>
              Features
            </h2>
            <p className="section-subtitle">
              Everything you need to build better study habits and take care of your virtual pet
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Focus Tracking</h3>
              <p className="feature-description">
                Real-time focus detection through activity monitoring. Stay on track and keep your pet happy with consistent study sessions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Analytics Dashboard</h3>
              <p className="feature-description">
                Detailed insights into your study patterns, productivity metrics, and progress over time with beautiful visualizations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Achievement System</h3>
              <p className="feature-description">
                Unlock achievements and milestones as you build consistent study habits. Celebrate your progress with your pet.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Reward Economy</h3>
              <p className="feature-description">
                Earn coins by studying and spend them on items to keep your pet happy and healthy. Build a thriving virtual ecosystem.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Study Calendar</h3>
              <p className="feature-description">
                Plan and track your study sessions with an interactive calendar. Set goals and maintain consistent study schedules.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3 className="feature-title">Customizable Settings</h3>
              <p className="feature-description">
                Personalize your experience with customizable settings, pet preferences, and study session configurations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Guide Section */}
      <section className="installation-section" id="getting-started">
        <div className="installation-container">
          <div className="section-header">
            <h2 className="section-title">
              <div className="section-icon">🚀</div>
              Getting Started
            </h2>
            <p className="section-subtitle">
              Follow these simple steps to begin your StudyPets journey
            </p>
          </div>
          
          <div className="installation-grid">
            <div className="installation-steps">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Create Your Pet</h3>
                  <p>Start by visiting the dashboard and creating your virtual pet companion. Choose your pet's appearance and personality.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Start Study Session</h3>
                  <p>Begin your first study session using our focus tracking system. Choose from Pomodoro, custom timer, or focus mode.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Track Your Progress</h3>
                  <p>Monitor your focus levels and study habits through our analytics dashboard. Watch your pet's happiness grow with your progress.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Earn Rewards</h3>
                  <p>Collect coins and achievements as you study. Visit the shop to buy items and keep your pet happy and healthy.</p>
                </div>
              </div>
            </div>
            
            <div className="quick-start">
              <h3>Quick Start</h3>
              <div className="quick-start-list">
                <div className="quick-start-item">
                  <div className="check-icon">✓</div>
                  <div className="quick-start-text">No installation required</div>
                </div>
                <div className="quick-start-item">
                  <div className="check-icon">✓</div>
                  <div className="quick-start-text">Works in any modern browser</div>
                </div>
                <div className="quick-start-item">
                  <div className="check-icon">✓</div>
                  <div className="quick-start-text">Start studying immediately</div>
                </div>
                <div className="quick-start-item">
                  <div className="check-icon">✓</div>
                  <div className="quick-start-text">Data saved locally</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { 
  formatTime, 
  loadPetStats, 
  loadCurrency, 
  loadSettings,
  getPetEmoji,
  showNotification,
  checkBlockingStatus
} from '../utils/studyPetsUtils';

const Dashboard = () => {
  const [isFocused] = useState(true);
  const [studyTime] = useState(0);
  const [happiness, setHappiness] = useState(85);
  const [energy, setEnergy] = useState(70);
  const [focusPercentage] = useState(95);
  const [sessionTime] = useState(0);
  const [streak] = useState(3);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [achievements] = useState(0);
  const [currency, setCurrency] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [blockingStatus, setBlockingStatus] = useState(false);
  const [blockedAttempts, setBlockedAttempts] = useState(0);

  const canvasRef = useRef(null);

  useEffect(() => {
    loadPetStatsData();
    loadCurrencyData();
    loadAggregatedTotals();
    updateBlockingStatus();
    
    // Initialize chart directly in useEffect
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const data = [85, 90, 88, 92, 95, 93, 97, 95, 98, 96];
      drawChart(ctx, canvas, data);
    }
  }, []);

  useEffect(() => {
    updatePetStatsDisplay();
  }, [happiness, energy]);

  const loadPetStatsData = () => {
    const stats = loadPetStats();
    setHappiness(stats.happiness);
    setEnergy(stats.energy);
    // focusPercentage is now a constant value, not loaded from stats
  };

  const loadCurrencyData = () => {
    const currentCurrency = loadCurrency();
    setCurrency(currentCurrency);
  };

  const loadAggregatedTotals = () => {
    const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
    const totalMs = sessions.reduce((sum, s) => sum + (s.totalTime || 0), 0);
    setTotalStudyTime(Math.floor(totalMs / 1000));
  };

  const updatePetStatsDisplay = () => {
    // This will be handled by the useEffect hook
  };

  const updatePetEmoji = () => {
    return getPetEmoji(happiness, energy);
  };

  const feedPet = () => {
    setEnergy(Math.min(100, energy + 10));
    setHappiness(Math.min(100, happiness + 3));
    showNotification('Pet is well fed! 🍎');
    animatePet('fed');
  };

  const playWithPet = () => {
    setHappiness(Math.min(100, happiness + 8));
    setEnergy(Math.max(0, energy - 5));
    showNotification('Pet had fun playing! 🎾');
    animatePet('play');
  };

  const restPet = () => {
    setEnergy(Math.min(100, energy + 15));
    setHappiness(Math.min(100, happiness + 2));
    showNotification('Pet is well rested! 😴');
    animatePet('rest');
  };

  const petPet = () => {
    setHappiness(Math.min(100, happiness + 5));
    setEnergy(Math.min(100, energy + 3));
    showNotification('Pet is happy!');
    animatePet('happy');
  };

  const animatePet = (action) => {
    const petAvatar = document.getElementById('petAvatar');
    if (petAvatar) {
      petAvatar.classList.add(`pet-${action}`);
      setTimeout(() => {
        petAvatar.classList.remove(`pet-${action}`);
      }, 1000);
    }
  };

  const drawChart = (ctx, canvas, data) => {
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    drawGrid(ctx, width, height);
    drawLine(ctx, width, height, data);
    drawPoints(ctx, width, height, data);
  };

  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawLine = (ctx, width, height, data) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1d4ed8');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = (width / (data.length - 1)) * index;
      const y = height - (value / 100) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    ctx.shadowColor = 'transparent';
  };

  const drawPoints = (ctx, width, height, data) => {
    data.forEach((value, index) => {
      const x = (width / (data.length - 1)) * index;
      const y = height - (value / 100) * height;
      
      drawPoint(ctx, x, y);
    });
  };

  const drawPoint = (ctx, x, y) => {
    const pointGradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
    pointGradient.addColorStop(0, '#ffffff');
    pointGradient.addColorStop(0.6, '#3b82f6');
    pointGradient.addColorStop(1, '#1d4ed8');
    
    ctx.fillStyle = pointGradient;
    ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add inner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.arc(x - 1, y - 1, 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  const updateBlockingStatus = () => {
    const settings = loadSettings();
    const petStats = loadPetStats();
    
    const isBlocking = checkBlockingStatus(petStats, settings);
    setBlockingStatus(isBlocking);
    
    const attempts = JSON.parse(localStorage.getItem('blockedAttempts') || '[]');
    setBlockedAttempts(attempts.length);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="page-dashboard">
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
            <button className="menu-toggle" onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h1 className="logo">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>StudyPets</Link>
            </h1>
          </div>
          <div className="nav-right">
            <div className="currency-display">
              <div className="currency-icon">💰</div>
              <span className="currency-amount">{currency}</span>
            </div>
            <div className="focus-indicator">
              <div className={`focus-dot ${!isFocused ? 'distracted' : ''}`}></div>
              <span>{isFocused ? 'Focused' : 'Distracted'}</span>
            </div>
            <div className="notification-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <div className="notification-badge"></div>
            </div>
            <div className="profile-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>
      </nav>

      <div className="main-container">
        {/* Sidebar */}
        <aside className={`glass-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-content">
            <div className="sidebar-item active">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
              <span>Dashboard</span>
            </div>
            <div className="sidebar-item">
              <Link to="/analytics">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                </svg>
                <span>Analytics</span>
              </Link>
            </div>
            <div className="sidebar-item">
              <Link to="/calendar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Calendar</span>
              </Link>
            </div>
            <div className="sidebar-item">
              <Link to="/achievements">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span>Achievements</span>
              </Link>
            </div>
            <div className="sidebar-item">
              <Link to="/study">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span>Study Session</span>
              </Link>
            </div>
            <div className="sidebar-item">
              <Link to="/shop">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>Shop</span>
              </Link>
            </div>
            <div className="sidebar-item">
              <Link to="/settings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                </svg>
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${sidebarCollapsed ? 'full-width' : ''}`}>
          <div className="content-wrapper">
            {/* Welcome Section */}
            <div className="welcome-section">
              <h2 className="welcome-title">Hello!</h2>
              <p className="welcome-subtitle">Keep your pet happy by staying focused on your studies</p>
            </div>

            {/* Main Grid */}
            <div className="main-grid">
              {/* Pet Component */}
              <div className="pet-container glass-card">
                <div className="pet-header">
                  <h3>Your Pet</h3>
                  <div className="pet-level">Level 1</div>
                </div>
                <div className="pet-display">
                  <div className="pet-avatar" id="petAvatar" onClick={petPet}>{updatePetEmoji()}</div>
                  <div className="pet-stats">
                    <div className="stat">
                      <span className="stat-label">Happiness</span>
                      <div className="stat-bar">
                        <div className="stat-fill" style={{ width: `${happiness}%` }}></div>
                      </div>
                      <span className="stat-value">{Math.round(happiness)}%</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Energy</span>
                      <div className="stat-bar">
                        <div className="stat-fill" style={{ width: `${energy}%` }}></div>
                      </div>
                      <span className="stat-value">{Math.round(energy)}%</span>
                    </div>
                  </div>
                  <div className="pet-buttons">
                    <button className="pet-btn feed-btn" onClick={feedPet} title="Feed Pet">
                      <span>🍎</span>
                      <span>Feed</span>
                    </button>
                    <button className="pet-btn play-btn" onClick={playWithPet} title="Play with Pet">
                      <span>🎾</span>
                      <span>Play</span>
                    </button>
                    <button className="pet-btn rest-btn" onClick={restPet} title="Let Pet Rest">
                      <span>😴</span>
                      <span>Rest</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Blocking Status */}
              {blockingStatus && (
                <div className="blocking-status glass-card">
                  <div className="blocking-header">
                    <h3>🚫 Website Blocking Active</h3>
                    <div className="blocking-indicator">
                      <div className="indicator-dot"></div>
                      <span>Entertainment sites blocked</span>
                    </div>
                  </div>
                  <div className="blocking-info">
                    <p>Your pet needs more care before you can access entertainment sites.</p>
                    <div className="blocking-stats">
                      <div className="blocking-stat">
                        <span className="stat-label">Blocked Attempts:</span>
                        <span className="stat-value">{blockedAttempts}</span>
                      </div>
                    </div>
                  </div>
                  <div className="blocking-actions">
                    <Link to="/study" className="glass-btn primary">Study to Improve</Link>
                    <Link to="/settings" className="glass-btn">Manage Settings</Link>
                  </div>
                </div>
              )}

              {/* Dashboard */}
              <div className="dashboard glass-card">
                <div className="dashboard-header">
                  <h3>Study Dashboard</h3>
                  <div className="dashboard-time">{formatTime(studyTime)}</div>
                </div>
                <div className="dashboard-content">
                  <div className="metric">
                    <div className="metric-icon">🎯</div>
                    <div className="metric-info">
                      <div className="metric-value">{focusPercentage}%</div>
                      <div className="metric-label">Focus Rate</div>
                    </div>
                  </div>
                  <div className="metric">
                    <div className="metric-icon">⏱️</div>
                    <div className="metric-info">
                      <div className="metric-value">{formatTime(sessionTime)}</div>
                      <div className="metric-label">Session Time</div>
                    </div>
                  </div>
                  <div className="metric">
                    <div className="metric-icon">🔥</div>
                    <div className="metric-info">
                      <div className="metric-value">{streak}</div>
                      <div className="metric-label">Day Streak</div>
                    </div>
                  </div>
                </div>
                <div className="chart-container">
                  <canvas ref={canvasRef} width="300" height="150"></canvas>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats glass-card">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{formatTime(totalStudyTime)}</div>
                  <div className="stat-title">Total Study Time</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{focusPercentage}%</div>
                  <div className="stat-title">Average Focus</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{Math.round(happiness)}%</div>
                  <div className="stat-title">Pet Happiness</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{achievements}</div>
                  <div className="stat-title">Achievements</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

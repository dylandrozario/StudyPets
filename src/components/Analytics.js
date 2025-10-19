import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './shared/PageStyles.css';
import './Analytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Generate mock analytics data
  useEffect(() => {
    const generateMockData = () => {
      const days = timeRange === 'week' ? 
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
        ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      
      const studyTime = days.map(() => Math.floor(Math.random() * 300) + 60); // 60-360 minutes
      const focusTime = studyTime.map(time => Math.floor(time * (0.7 + Math.random() * 0.2))); // 70-90% of study time
      const distractions = days.map(() => Math.floor(Math.random() * 15) + 2); // 2-17 distractions
      
      return {
        days,
        studyTime,
        focusTime,
        distractions,
        totalStudyTime: studyTime.reduce((sum, time) => sum + time, 0),
        totalFocusTime: focusTime.reduce((sum, time) => sum + time, 0),
        totalDistractions: distractions.reduce((sum, dist) => sum + dist, 0),
        averageFocusPercentage: Math.round((focusTime.reduce((sum, time) => sum + time, 0) / studyTime.reduce((sum, time) => sum + time, 0)) * 100)
      };
    };

    setAnalyticsData(generateMockData());
  }, [timeRange]);

  if (!analyticsData) {
    return <div>Loading analytics...</div>;
  }

  // Study Time Line Chart
  const studyTimeChartData = {
    labels: analyticsData.days,
    datasets: [
      {
        label: 'Study Time (minutes)',
        data: analyticsData.studyTime,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Focus Time (minutes)',
        data: analyticsData.focusTime,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Distractions Bar Chart
  const distractionsChartData = {
    labels: analyticsData.days,
    datasets: [
      {
        label: 'Distractions Count',
        data: analyticsData.distractions,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ],
  };

  // Focus Percentage Doughnut Chart
  const focusPercentageData = {
    labels: ['Focused', 'Distracted'],
    datasets: [
      {
        data: [analyticsData.averageFocusPercentage, 100 - analyticsData.averageFocusPercentage],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  };

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
              <h1>Analytics Dashboard</h1>
              <p>Detailed insights into your study patterns and productivity metrics</p>
            </div>

            {/* Time Range Selector */}
            <div className="time-range-selector glass-card">
              <h3>Time Range</h3>
              <div className="time-range-buttons">
                <button 
                  className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
                  onClick={() => setTimeRange('week')}
                >
                  This Week
                </button>
                <button 
                  className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
                  onClick={() => setTimeRange('month')}
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Main Analytics Layout */}
            <div className="analytics-layout">
              {/* Sidebar with Metrics */}
              <div className="analytics-sidebar">
                <div className="sidebar-section glass-card">
                  <h3>Summary Stats</h3>
                  <div className="stat-item">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                      <div className="stat-number">{Math.round(analyticsData.totalStudyTime / 60)}h {analyticsData.totalStudyTime % 60}m</div>
                      <div className="stat-label">Total Study Time</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                      <div className="stat-number">{Math.round(analyticsData.totalFocusTime / 60)}h {analyticsData.totalFocusTime % 60}m</div>
                      <div className="stat-label">Total Focus Time</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                      <div className="stat-number">{analyticsData.averageFocusPercentage}%</div>
                      <div className="stat-label">Average Focus</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-content">
                      <div className="stat-number">{analyticsData.totalDistractions}</div>
                      <div className="stat-label">Total Distractions</div>
                    </div>
                  </div>
                </div>

                <div className="sidebar-section glass-card">
                  <h3>Key Insights</h3>
                  <div className="insight-item">
                    <div className="insight-icon">📈</div>
                    <div className="insight-text">
                      <strong>Best Study Day:</strong><br />
                      {analyticsData.days[analyticsData.studyTime.indexOf(Math.max(...analyticsData.studyTime))]}
                    </div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-icon">🎯</div>
                    <div className="insight-text">
                      <strong>Focus Rate:</strong><br />
                      {analyticsData.averageFocusPercentage}% - {analyticsData.averageFocusPercentage >= 80 ? 'Excellent!' : analyticsData.averageFocusPercentage >= 60 ? 'Good' : 'Needs improvement'}
                    </div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-icon">⚡</div>
                    <div className="insight-text">
                      <strong>Average Session:</strong><br />
                      {Math.round(analyticsData.totalStudyTime / analyticsData.days.length)} min/day
                    </div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-icon">🔄</div>
                    <div className="insight-text">
                      <strong>Distraction Rate:</strong><br />
                      {Math.round(analyticsData.totalDistractions / analyticsData.days.length)} per day
                    </div>
                  </div>
                </div>

                <div className="sidebar-section glass-card">
                  <h3>Performance Metrics</h3>
                  <div className="metric-item">
                    <div className="metric-label">Study Consistency</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{width: `${Math.min(100, (analyticsData.totalStudyTime / analyticsData.days.length) / 3 * 100)}%`}}></div>
                    </div>
                    <div className="metric-value">{Math.round((analyticsData.totalStudyTime / analyticsData.days.length) / 3 * 100)}%</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Focus Quality</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{width: `${analyticsData.averageFocusPercentage}%`}}></div>
                    </div>
                    <div className="metric-value">{analyticsData.averageFocusPercentage}%</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Distraction Control</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{width: `${Math.max(0, 100 - (analyticsData.totalDistractions / analyticsData.days.length) * 10)}%`}}></div>
                    </div>
                    <div className="metric-value">{Math.max(0, 100 - (analyticsData.totalDistractions / analyticsData.days.length) * 10)}%</div>
                  </div>
                </div>
              </div>

              {/* Main Charts Area */}
              <div className="charts-main">
                <div className="charts-grid">
                  {/* Study Time Chart */}
                  <div className="chart-container glass-card">
                    <div className="chart-header">
                      <h3>Study Time Trends</h3>
                      <p>Daily study and focus time comparison</p>
                    </div>
                    <div className="chart-wrapper">
                      <Line data={studyTimeChartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Distractions Chart */}
                  <div className="chart-container glass-card">
                    <div className="chart-header">
                      <h3>Distractions Analysis</h3>
                      <p>Daily distraction count tracking</p>
                    </div>
                    <div className="chart-wrapper">
                      <Bar data={distractionsChartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Focus Percentage Chart */}
                  <div className="chart-container glass-card">
                    <div className="chart-header">
                      <h3>Focus Percentage</h3>
                      <p>Overall focus vs distraction ratio</p>
                    </div>
                    <div className="chart-wrapper">
                      <Doughnut data={focusPercentageData} options={doughnutOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;

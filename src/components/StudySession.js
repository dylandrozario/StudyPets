import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "../utils/faceDetection/detector";
import './shared/PageStyles.css';
import './StudySession.css';

const StudySession = () => {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [mesh, setMesh] = useState(false);
  const [tags, setTags] = useState(false);
  const [dir, setDir] = useState(true);
  const [focusData, setFocusData] = useState({
    yaw: 0,
    turn: 0,
    zDistance: 0,
    xDistance: 0,
    isFocused: true,
    baselineTurn: 110, // Initialize baseline turn angle to 110
    deviation: 0 // Deviation from baseline
  });

  const inputResolution = {
    width: 730,
    height: 640,
  };

  const videoConstraints = {
    width: inputResolution.width,
    height: inputResolution.height,
    facingMode: "user",
  };

  const handleVideoLoad = async (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    
    await runDetector(video, canvasRef.current, (data) => {
      if (data) {
        // Use only turn angle for distraction detection
        const baselineTurn = 110; // Baseline turn angle
        const currentTurn = data.turn;
        
        // Flag distraction if turn angle is above 160 or below 50
        const isFocused = currentTurn >= 50 && currentTurn <= 160;
        
        setFocusData({
          ...data,
          isFocused,
          baselineTurn,
          deviation: Math.abs(currentTurn - baselineTurn)
        });
      }
    });
    setLoaded(true);
  };

  return (
    <div className="page-study-session">
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
              <h1>Study Session</h1>
              <p>Turn angle detection - monitors range from 50° to 160° (baseline: 110°)</p>
            </div>

            <div className="study-session-layout">
              {/* Focus Status */}
              <div className="focus-status glass-card">
                <div className={`focus-indicator ${focusData.isFocused ? 'focused' : 'distracted'}`}>
                  <div className="focus-dot"></div>
                  <span>{focusData.isFocused ? 'Focused' : 'Distracted'}</span>
                </div>
                <div className="focus-details">
                  <div className="detail-item">
                    <span className="label">Current Turn:</span>
                    <span className="value">{Math.round(focusData.turn)}°</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Baseline Turn:</span>
                    <span className="value">{focusData.baselineTurn}°</span>
                  </div>
                  <div className={`detail-item ${focusData.deviation > 30 ? 'deviation-danger' : focusData.deviation > 20 ? 'deviation-warning' : ''}`}>
                    <span className="label">Deviation:</span>
                    <span className="value">{Math.round(focusData.deviation)}°</span>
                  </div>
                  <div className="detail-item threshold-info">
                    <span className="label">Range:</span>
                    <span className="value">50° - 160°</span>
                  </div>
                </div>
              </div>

              {/* Camera Section */}
              <div className="camera-section glass-card">
                <div className="camera-header">
                  <h3>Face Detection</h3>
                  {!loaded && <div className="loading-text">Loading camera...</div>}
                </div>
                
                <div className="camera-container">
                  <Webcam
                    width={inputResolution.width}
                    height={inputResolution.height}
                    style={{ visibility: "hidden", position: "absolute" }}
                    videoConstraints={videoConstraints}
                    onLoadedData={handleVideoLoad}
                  />
                  <canvas
                    ref={canvasRef}
                    width={inputResolution.width}
                    height={inputResolution.height}
                    style={{ position: "absolute", border: "2px solid rgba(255, 255, 255, 0.2)", borderRadius: "8px" }}
                  />
                </div>

                {/* Controls */}
                <div className="controls-section">
                  <div className="control-group">
                    <label className="control-label">
                      <input 
                        type="checkbox" 
                        id="show-mesh"
                        checked={mesh} 
                        onChange={() => setMesh(!mesh)} 
                      />
                      <span>Show Mesh</span>
                    </label>
                    <label className="control-label">
                      <input 
                        type="checkbox" 
                        id="show-tags"
                        checked={tags} 
                        onChange={() => setTags(!tags)} 
                      />
                      <span>Show Tags</span>
                    </label>
                    <label className="control-label">
                      <input 
                        type="checkbox" 
                        id="show-dir"
                        checked={dir} 
                        onChange={() => setDir(!dir)} 
                      />
                      <span>Show Direction</span>
                    </label>
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

export default StudySession;

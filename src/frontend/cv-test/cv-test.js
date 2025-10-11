// Face Detection Test Page - Based on face-direction-detection repository
class FaceDetectionTest {
    constructor() {
        this.webcamStream = null;
        this.detectionActive = false;
        this.faceDetectionModel = null;
        this.canvas = null;
        this.ctx = null;
        this.video = null;
        this.processingFrame = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.canvas = document.getElementById('faceCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.video = document.getElementById('webcamVideo');
        this.log('Face detection test page initialized. Click "Start Webcam" to begin.');
    }

    setupEventListeners() {
        document.getElementById('startWebcam').addEventListener('click', () => {
            this.startWebcam();
        });

        document.getElementById('stopWebcam').addEventListener('click', () => {
            this.stopWebcam();
        });

        document.getElementById('startDetection').addEventListener('click', () => {
            this.startDetection();
        });

        document.getElementById('stopDetection').addEventListener('click', () => {
            this.stopDetection();
        });
    }

    async startWebcam() {
        try {
            this.log('Requesting webcam access...');
            
            this.webcamStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });

            this.video.srcObject = this.webcamStream;
            
            this.video.onloadedmetadata = () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.log(`Webcam started: ${this.video.videoWidth}x${this.video.videoHeight}`);
                this.updateStatus('webcamStatus', 'Active');
            };

            this.log('Webcam access granted!');
            
        } catch (error) {
            this.log(`Webcam error: ${error.message}`);
            this.updateStatus('webcamStatus', 'Error');
        }
    }

    stopWebcam() {
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(track => track.stop());
            this.webcamStream = null;
            
            this.video.srcObject = null;
            this.canvas.width = 0;
            this.canvas.height = 0;
            
            this.log('Webcam stopped');
            this.updateStatus('webcamStatus', 'Stopped');
            this.updateStatus('detectionStatus', 'Stopped');
            this.detectionActive = false;
        }
    }

    async startDetection() {
        if (!this.webcamStream) {
            this.log('Please start webcam first!');
            return;
        }

        try {
            this.log('Loading face landmarks detection model...');
            this.updateStatus('detectionStatus', 'Loading...');
            
            // Debug: Check if faceLandmarksDetection is available
            console.log('faceLandmarksDetection:', faceLandmarksDetection);
            console.log('SupportedModels:', faceLandmarksDetection.SupportedModels);
            
            // Load TensorFlow.js face landmarks detection model
            this.faceDetectionModel = await faceLandmarksDetection.createDetector(
                faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
                {
                    runtime: 'tfjs',
                    refineLandmarks: true,
                    maxFaces: 1
                }
            );

            this.detectionActive = true;
            this.log('Face landmarks detection model loaded successfully!');
            this.updateStatus('detectionStatus', 'Active');
            
            // Start the detection loop
            this.detectionLoop();
            
        } catch (error) {
            console.error('Full error:', error);
            this.log(`Face detection error: ${error.message}`);
            this.updateStatus('detectionStatus', 'Error');
        }
    }

    stopDetection() {
        this.detectionActive = false;
        this.log('Face detection stopped');
        this.updateStatus('detectionStatus', 'Stopped');
        this.updateStatus('faceDetected', 'No');
        this.updateStatus('faceDirectionText', 'N/A');
        this.updateStatus('landmarksCount', '0');
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        document.getElementById('faceDirection').textContent = 'No Face Detected';
    }

    async detectionLoop() {
        if (!this.detectionActive || this.processingFrame) return;

        this.processingFrame = true;
        
        try {
            if (!this.video || !this.video.videoWidth || !this.faceDetectionModel) {
                console.log('Detection loop skipped:', {
                    detectionActive: this.detectionActive,
                    video: !!this.video,
                    videoWidth: this.video?.videoWidth,
                    model: !!this.faceDetectionModel
                });
                this.processingFrame = false;
                requestAnimationFrame(() => this.detectionLoop());
                return;
            }

            // Debug video element
            console.log('Video element:', {
                videoWidth: this.video.videoWidth,
                videoHeight: this.video.videoHeight,
                readyState: this.video.readyState,
                paused: this.video.paused,
                ended: this.video.ended,
                currentTime: this.video.currentTime,
                duration: this.video.duration
            });
            
            // Try both video and canvas detection
            let predictions;
            try {
                // First try with video element
                predictions = await this.faceDetectionModel.estimateFaces(this.video);
                console.log('Video detection predictions:', predictions.length);
                
                // If no predictions, try with canvas
                if (predictions.length === 0) {
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCanvas.width = this.video.videoWidth;
                    tempCanvas.height = this.video.videoHeight;
                    tempCtx.drawImage(this.video, 0, 0);
                    
                    predictions = await this.faceDetectionModel.estimateFaces(tempCanvas);
                    console.log('Canvas detection predictions:', predictions.length);
                }
            } catch (error) {
                console.error('Detection error:', error);
                predictions = [];
            }
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (predictions.length > 0) {
                const face = predictions[0]; // Use first detected face
                console.log('Face detected:', face);
                this.drawFaceLandmarks(face);
                this.detectFaceDirection(face);
                this.updateStatus('faceDetected', 'Yes');
                this.updateStatus('landmarksCount', face.keypoints.length);
            } else {
                this.updateStatus('faceDetected', 'No');
                this.updateStatus('faceDirectionText', 'N/A');
                this.updateStatus('landmarksCount', '0');
                document.getElementById('faceDirection').textContent = 'No Face Detected';
            }
            
        } catch (error) {
            console.error('Detection error:', error);
            this.log(`Detection error: ${error.message}`);
        } finally {
            this.processingFrame = false;
            // Continue the loop
            requestAnimationFrame(() => this.detectionLoop());
        }
    }

    drawFaceLandmarks(face) {
        const keypoints = face.keypoints;
        
        // Draw face landmarks
        this.ctx.fillStyle = '#00ff00';
        keypoints.forEach(keypoint => {
            const x = keypoint.x * this.canvas.width;
            const y = keypoint.y * this.canvas.height;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
        // Draw face bounding box
        const box = face.box;
        const x = box.xMin * this.canvas.width;
        const y = box.yMin * this.canvas.height;
        const width = box.width * this.canvas.width;
        const height = box.height * this.canvas.height;
        
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
    }

    detectFaceDirection(face) {
        const keypoints = face.keypoints;
        
        // Key landmarks for direction detection
        const noseTip = keypoints[1]; // Nose tip
        const leftEye = keypoints[33]; // Left eye
        const rightEye = keypoints[362]; // Right eye
        const leftMouth = keypoints[61]; // Left mouth corner
        const rightMouth = keypoints[291]; // Right mouth corner
        
        if (noseTip && leftEye && rightEye && leftMouth && rightMouth) {
            // Calculate face direction based on landmark positions
            const eyeDistance = Math.abs(leftEye.x - rightEye.x);
            const mouthDistance = Math.abs(leftMouth.x - rightMouth.x);
            const nosePosition = noseTip.x;
            const eyeCenter = (leftEye.x + rightEye.x) / 2;
            const mouthCenter = (leftMouth.x + rightMouth.x) / 2;
            
            // Determine face direction
            let direction = 'Front';
            
            if (nosePosition < eyeCenter - 0.02) {
                direction = 'Left';
            } else if (nosePosition > eyeCenter + 0.02) {
                direction = 'Right';
            } else if (mouthCenter < eyeCenter - 0.01) {
                direction = 'Down';
            } else if (mouthCenter > eyeCenter + 0.01) {
                direction = 'Up';
            }
            
            this.updateStatus('faceDirectionText', direction);
            document.getElementById('faceDirection').textContent = `Face: ${direction}`;
            
            // Log detailed information
            this.log(`Face direction: ${direction} (Nose: ${nosePosition.toFixed(3)}, Eye Center: ${eyeCenter.toFixed(3)})`);
        }
    }

    updateStatus(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    log(message) {
        const logElement = document.getElementById('statusLog');
        if (logElement) {
            const timestamp = new Date().toLocaleTimeString();
            logElement.innerHTML += `<div>[${timestamp}] ${message}</div>`;
            logElement.scrollTop = logElement.scrollHeight;
        }
        console.log(`[Face Detection] ${message}`);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new FaceDetectionTest();
});
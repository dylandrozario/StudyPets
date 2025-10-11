// Enhanced Study Session Manager
class StudySession {
    constructor() {
        this.session = null;
        this.timer = null;
        this.focusTimer = null;
        this.isRunning = false;
        this.isPaused = false;
        this.webcamStream = null;
        this.currencyEarned = 0;
        
        // Pet stats
        this.petStats = {
            happiness: 80,
            energy: 75
        };
        
        // Enhanced focus data
        this.focusData = {
            isFocused: true,
            lastActivity: Date.now(),
            distractions: 0,
            totalFocusTime: 0,
            totalTime: 0
        };
        
        // Simple distraction detection
        this.distractionDetection = {
            initialized: false,
            lastMouseMove: Date.now(),
            lastKeyboardActivity: Date.now(),
            mouseIdleTime: 0,
            keyboardIdleTime: 0,
            distractionTimer: null,
            distractionThreshold: 3000, // 3 seconds of inactivity = distraction
            isActive: false
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initializeWebcam();
        this.loadPetStats();
        // Initialize simple distraction detection
        setTimeout(() => {
            this.initializeDistractionDetection();
        }, 1000);
    }

    // ==================== Event Listeners ====================
    setupEventListeners() {
        // Session option selection
        document.querySelectorAll('.session-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectSessionOption(option);
            });
        });

        // Custom timer input
        document.getElementById('customDuration').addEventListener('input', (e) => {
            this.updateCustomTimer(e.target.value);
        });

        // Start session button
        document.getElementById('startSessionBtn').addEventListener('click', () => {
            this.startSession();
        });

        // Close modal button
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Control buttons
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('endBtn').addEventListener('click', () => {
            this.endSession();
        });

        // Activity tracking
        document.addEventListener('mousemove', () => this.updateActivity());
        document.addEventListener('keydown', () => this.updateActivity());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    // ==================== Session Management ====================
    selectSessionOption(option) {
        // Remove previous selection
        document.querySelectorAll('.session-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection to clicked option
        option.classList.add('selected');
        
        // Show/hide custom timer input
        const customTimer = document.getElementById('customTimer');
        if (option.dataset.type === 'custom') {
            customTimer.style.display = 'block';
        } else {
            customTimer.style.display = 'none';
        }
    }

    updateCustomTimer(duration) {
        // Update the display or validation logic here
        console.log('Custom duration:', duration);
    }

    startSession() {
        const selectedOption = document.querySelector('.session-option.selected');
        if (!selectedOption) {
            this.showNotification('Please select a session type');
            return;
        }

        const sessionType = selectedOption.dataset.type;
        let duration = 25 * 60 * 1000; // Default 25 minutes

        if (sessionType === 'custom') {
            const customDuration = parseInt(document.getElementById('customDuration').value);
            if (customDuration && customDuration > 0) {
                duration = customDuration * 60 * 1000;
            }
        } else if (sessionType === 'pomodoro') {
            duration = 25 * 60 * 1000;
        } else if (sessionType === 'focus') {
            duration = null; // No time limit
        }

        this.session = {
            type: sessionType,
            duration: duration,
            startTime: Date.now(),
            totalTime: 0,
            focusTime: 0,
            distractions: 0
        };

        this.isRunning = true;
        this.isPaused = false;
        
        // Hide setup modal and show session interface
        document.getElementById('sessionSetup').style.display = 'none';
        document.getElementById('studySession').style.display = 'block';
        
        // Start timers
        this.startTimers();
        this.updateSessionUI();
        
        this.showNotification('Study session started! 🎯');
    }

    closeModal() {
        // Redirect to dashboard
        window.location.href = '../dashboard/index.html';
    }

    togglePause() {
        if (this.isPaused) {
            this.resumeSession();
        } else {
            this.pauseSession();
        }
    }

    pauseSession() {
        this.isPaused = true;
        clearInterval(this.timer);
        clearInterval(this.focusTimer);
        
        document.getElementById('pauseBtn').textContent = '▶️ Resume';
        document.getElementById('focusStatus').textContent = 'Paused';
        document.getElementById('focusDot').style.background = '#f59e0b';
        
        this.showNotification('Session paused ⏸️');
    }

    resumeSession() {
        this.isPaused = false;
        this.startTimers();
        
        document.getElementById('pauseBtn').textContent = '⏸️ Pause';
        document.getElementById('focusStatus').textContent = 'Focused';
        document.getElementById('focusDot').style.background = '#10b981';
        
        this.showNotification('Session resumed ▶️');
    }

    endSession() {
        if (confirm('Are you sure you want to end this study session?')) {
            this.completeSession();
        }
    }

    completeSession() {
        this.isRunning = false;
        this.isPaused = false;
        
        clearInterval(this.timer);
        clearInterval(this.focusTimer);
        
        // Stop webcam
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(track => track.stop());
        }
        
        // Stop distraction detection
        if (this.distractionDetection.distractionTimer) {
            clearTimeout(this.distractionDetection.distractionTimer);
        }
        this.distractionDetection.initialized = false;
        
        // Calculate final stats
        const sessionDuration = Date.now() - this.session.startTime;
        const focusPercentage = this.session.focusTime > 0 ? 
            Math.round((this.session.focusTime / sessionDuration) * 100) : 0;
        
        // Save session to localStorage
        this.saveSessionToLocalStorage();
        
        // Update currency
        this.updateCurrency();
        
        // Show completion message
        this.showNotification(`Session completed! Focus: ${focusPercentage}% 🎉`);
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
            window.location.href = '../dashboard/index.html';
        }, 2000);
    }

    // ==================== Timer Management ====================
    startTimers() {
        // Main session timer
        this.timer = setInterval(() => {
            if (this.isRunning && !this.isPaused) {
                this.updateSessionTimer();
            }
        }, 1000);

        // Focus tracking timer
        this.focusTimer = setInterval(() => {
            if (this.isRunning && !this.isPaused) {
                this.updateFocusTracking();
            }
        }, 1000);
    }

    updateSessionTimer() {
        const elapsed = Date.now() - this.session.startTime;
        this.session.totalTime = elapsed;
        
        // Update timer display
        const remaining = this.session.duration ? this.session.duration - elapsed : elapsed;
        const displayTime = this.session.duration ? Math.max(0, remaining) : elapsed;
        
        document.getElementById('timerDisplay').textContent = this.formatTime(displayTime);
        document.getElementById('sessionTime').textContent = this.formatTime(elapsed);
        
        // Update progress bar
        if (this.session.duration) {
            const progress = Math.min(100, (elapsed / this.session.duration) * 100);
            document.querySelector('.progress-bar').style.setProperty('--progress', `${progress}%`);
        }
        
        // Auto-end session if duration reached
        if (this.session.duration && elapsed >= this.session.duration) {
            this.completeSession();
        }
    }

    updateFocusTracking() {
        const now = Date.now();
        const timeSinceActivity = now - this.focusData.lastActivity;
        
        // Check if user is focused (active within last 30 seconds)
        const wasFocused = this.focusData.isFocused;
        this.focusData.isFocused = timeSinceActivity < 30000;
        
        // Update focus time
        if (this.focusData.isFocused) {
            this.focusData.totalFocusTime += 1000;
            this.session.focusTime += 1000;
        } else if (wasFocused && !this.focusData.isFocused) {
            this.focusData.distractions++;
            this.session.distractions++;
            this.updatePetStats('distracted');
        }
        
        // Update UI
        this.updateFocusUI();
        this.updatePetStats();
    }

    // ==================== Pet Management ====================
    updatePetStats(action = null) {
        if (action === 'distracted') {
            this.petStats.happiness = Math.max(0, this.petStats.happiness - 5);
            this.petStats.energy = Math.max(0, this.petStats.energy - 3);
        } else if (this.focusData.isFocused) {
            // Gradually increase stats when focused
            this.petStats.happiness = Math.min(100, this.petStats.happiness + 0.1);
            this.petStats.energy = Math.min(100, this.petStats.energy + 0.05);
        }
        
        // Update pet avatar based on stats
        this.updatePetAvatar();
        
        // Update stat bars
        document.getElementById('happinessBar').style.width = `${this.petStats.happiness}%`;
        document.getElementById('happinessValue').textContent = `${Math.round(this.petStats.happiness)}%`;
        document.getElementById('energyBar').style.width = `${this.petStats.energy}%`;
        document.getElementById('energyValue').textContent = `${Math.round(this.petStats.energy)}%`;
    }

    updatePetAvatar() {
        const avatar = document.getElementById('petAvatar');
        const happiness = this.petStats.happiness;
        const energy = this.petStats.energy;
        
        if (happiness >= 70 && energy >= 70) {
            avatar.textContent = '😺'; // Happy
        } else if (happiness >= 40 && energy >= 40) {
            avatar.textContent = '🐱'; // Neutral
        } else {
            avatar.textContent = '😿'; // Sad
        }
    }

    // ==================== Webcam Management ====================
    async initializeWebcam() {
        try {
            this.webcamStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });
            
            const video = document.getElementById('webcamVideo');
            video.srcObject = this.webcamStream;
            
            console.log('Webcam initialized successfully');
        } catch (error) {
            console.error('Webcam initialization failed:', error);
            this.showNotification('Webcam access denied. Session will continue without video.');
        }
    }

    // ==================== UI Updates ====================
    updateSessionUI() {
        const titles = {
            pomodoro: 'Pomodoro Session',
            custom: 'Custom Timer',
            focus: 'Focus Mode',
            goal: 'Goal-based Session'
        };
        
        const title = titles[this.session.type] || 'Study Session';
        document.getElementById('sessionTitle').textContent = title;
        document.getElementById('sessionType').textContent = title;
    }

    updateFocusUI() {
        const focusPercentage = this.session.totalTime > 0 ? 
            Math.round((this.session.focusTime / this.session.totalTime) * 100) : 0;
        
        document.getElementById('focusPercentage').textContent = `${focusPercentage}%`;
        document.getElementById('distractions').textContent = this.focusData.distractions;
        
        // Update focus indicator
        const focusDot = document.getElementById('focusDot');
        const focusStatus = document.getElementById('focusStatus');
        
        if (this.focusData.isFocused) {
            focusDot.style.background = '#10b981';
            focusStatus.textContent = 'Focused';
        } else {
            focusDot.style.background = '#ef4444';
            focusStatus.textContent = 'Distracted';
        }
    }

    updateActivity() {
        this.focusData.lastActivity = Date.now();
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.focusData.isFocused = false;
            this.focusData.distractions++;
        } else {
            this.updateActivity();
        }
    }

    // ==================== Data Management ====================
    updateCurrency() {
        // Earn 1 currency per minute of focused time
        const focusedMinutes = Math.floor(this.focusData.totalFocusTime / 60000);
        this.currencyEarned = focusedMinutes;
        
        // Update currency display
        document.getElementById('currencyEarned').textContent = `💰 ${this.currencyEarned}`;
        
        // Save to localStorage
        const currentCurrency = parseInt(localStorage.getItem('studyPetsCurrency') || '0');
        localStorage.setItem('studyPetsCurrency', currentCurrency + this.currencyEarned);
    }

    saveSessionToLocalStorage() {
        try {
            const focusMs = this.session.focusTime;
            const unfocusMs = Math.max(0, this.session.totalTime - focusMs);
            const distractions = this.session.distractions || 0;

            const sessionData = {
                id: Date.now().toString(),
                user_id: 'local_user', // local user identifier
                started_at: new Date(this.session.startTime).toISOString(),
                ended_at: new Date().toISOString(),
                duration_ms: this.session.totalTime,
                focused_ms: focusMs,
                unfocused_ms: unfocusMs,
                distractions,
                streak_after: 0, // later compute; leave 0 for now
                meta: { type: this.session.type },
                // Pet stats
                pet_happiness: this.petStats.happiness,
                pet_energy: this.petStats.energy,
                pet_focus_level: this.calculateFocusLevel(),
                pet_state: this.getPetState()
            };

            // Load existing sessions
            const existingSessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
            existingSessions.push(sessionData);
            
            // Save back to localStorage
            localStorage.setItem('studySessions', JSON.stringify(existingSessions));
            console.log('Session saved to localStorage:', sessionData);
            
            // Also save pet stats
            this.savePetStatsToLocalStorage();
        } catch (e) {
            console.error('Failed saving session:', e);
        }
    }

    // ==================== Pet Stats Management ====================
    loadPetStats() {
        try {
            // Load from localStorage
            const savedStats = localStorage.getItem('studyPetsPetStats');
            if (savedStats) {
                const stats = JSON.parse(savedStats);
                this.petStats.happiness = stats.happiness || 80;
                this.petStats.energy = stats.energy || 75;
                console.log('Loaded pet stats from localStorage:', this.petStats);
            } else {
                // Use default stats
                this.petStats.happiness = 80;
                this.petStats.energy = 75;
                console.log('Using default pet stats:', this.petStats);
            }
            
            // Update UI with loaded stats
            this.updatePetStats();
        } catch (e) {
            console.error('Failed loading pet stats:', e);
            // Use default stats
            this.petStats.happiness = 80;
            this.petStats.energy = 75;
        }
    }

    savePetStatsToLocalStorage() {
        try {
            // Save to localStorage
            localStorage.setItem('studyPetsPetStats', JSON.stringify(this.petStats));
            console.log('Pet stats saved to localStorage:', this.petStats);
        } catch (e) {
            console.error('Failed saving pet stats:', e);
        }
    }

    calculateFocusLevel() {
        if (!this.session || this.session.totalTime === 0) return 0;
        return Math.round((this.session.focusTime / this.session.totalTime) * 100);
    }

    getPetState() {
        const happiness = this.petStats.happiness;
        const energy = this.petStats.energy;
        
        if (happiness >= 70 && energy >= 70) return 'happy';
        if (happiness >= 40 && energy >= 40) return 'neutral';
        return 'sad';
    }

    // ==================== Utility Functions ====================
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showNotification(message) {
        console.log('Notification:', message);
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10000;
            font-size: 0.9rem;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // ==================== Simple Distraction Detection ====================
    initializeDistractionDetection() {
        try {
            console.log('Initializing simple distraction detection...');
            
            // Add event listeners for mouse and keyboard activity
            document.addEventListener('mousemove', () => {
                this.distractionDetection.lastMouseMove = Date.now();
                this.handleActivity();
            });
            
            document.addEventListener('keydown', () => {
                this.distractionDetection.lastKeyboardActivity = Date.now();
                this.handleActivity();
            });
            
            document.addEventListener('click', () => {
                this.distractionDetection.lastMouseMove = Date.now();
                this.handleActivity();
            });
            
            // Start monitoring for inactivity
            this.startInactivityMonitoring();
            
            this.distractionDetection.initialized = true;
            console.log('Distraction detection initialized successfully');
            
            // Show debug panel
            const debugPanel = document.getElementById('headPoseDebug');
            if (debugPanel) {
                debugPanel.style.display = 'block';
            }
            
            this.showNotification('Distraction detection active! 👀');
            
        } catch (error) {
            console.error('Distraction detection initialization failed:', error);
            this.showNotification('Distraction detection failed');
        }
    }

    handleActivity() {
        // User is active - stop distraction timer if running
        if (this.distractionDetection.distractionTimer) {
            clearTimeout(this.distractionDetection.distractionTimer);
            this.distractionDetection.distractionTimer = null;
            console.log('Activity detected - distraction timer stopped');
        }
        
        // Update focus state
        if (!this.focusData.isFocused) {
            this.focusData.isFocused = true;
            this.showNotification('Back to studying! 🎯');
            this.updatePetState('happy');
            this.updateFocusIndicator();
        }
    }

    startInactivityMonitoring() {
        const checkInactivity = () => {
            const now = Date.now();
            const mouseIdleTime = now - this.distractionDetection.lastMouseMove;
            const keyboardIdleTime = now - this.distractionDetection.lastKeyboardActivity;
            
            // Update debug panel
            this.updateDistractionDebugPanel(mouseIdleTime, keyboardIdleTime);
            
            // Check if user has been inactive for too long
            if (mouseIdleTime > this.distractionDetection.distractionThreshold && 
                keyboardIdleTime > this.distractionDetection.distractionThreshold) {
                
                if (this.focusData.isFocused) {
                    console.log('Inactivity detected - starting distraction timer');
                    this.focusData.isFocused = false;
                    this.startDistractionTimer();
                    this.updateFocusIndicator();
                }
            }
            
            // Continue monitoring
            if (this.distractionDetection.initialized) {
                requestAnimationFrame(checkInactivity);
            }
        };
        
        checkInactivity();
    }

    startDistractionTimer() {
        if (this.distractionDetection.distractionTimer) {
            console.log('Distraction timer already running');
            return;
        }
        
        console.log('Starting distraction timer - will trigger in', this.distractionDetection.distractionThreshold, 'ms');
        
        this.distractionDetection.distractionTimer = setTimeout(() => {
            // Distraction confirmed after threshold time
            this.focusData.distractions++;
            this.showNotification('Stay focused! 👀');
            this.updatePetState('sad');
            this.updateDistractionCount();
            console.log('Distraction detected! Total:', this.focusData.distractions);
        }, this.distractionDetection.distractionThreshold);
    }

    updateDistractionDebugPanel(mouseIdleTime, keyboardIdleTime) {
        const mouseIdleSeconds = Math.round(mouseIdleTime / 1000);
        const keyboardIdleSeconds = Math.round(keyboardIdleTime / 1000);
        const thresholdSeconds = Math.round(this.distractionDetection.distractionThreshold / 1000);
        
        document.getElementById('pitchValue').textContent = `${mouseIdleSeconds}s`;
        document.getElementById('yawValue').textContent = `${keyboardIdleSeconds}s`;
        document.getElementById('rollValue').textContent = `${thresholdSeconds}s`;
        document.getElementById('lookingForward').textContent = 
            this.focusData.isFocused ? 'Yes' : 'No';
        document.getElementById('distractionCount').textContent = this.focusData.distractions;
    }

    updateFocusIndicator() {
        // Update focus percentage display
        const focusPercentage = this.focusData.isFocused ? 100 : 0;
        const focusElement = document.getElementById('focusPercentage');
        if (focusElement) {
            focusElement.textContent = `${focusPercentage}%`;
        }
        
        // Update focus indicator color
        const focusIndicator = document.querySelector('.focus-indicator');
        if (focusIndicator) {
            focusIndicator.style.backgroundColor = this.focusData.isFocused ? '#10b981' : '#ef4444';
        }
    }

    updateDistractionCount() {
        // Update UI elements that show distraction count
        const distractionElements = document.querySelectorAll('.distraction-count');
        distractionElements.forEach(el => {
            el.textContent = this.focusData.distractions;
        });
        
        // Update the main distraction display
        const mainDistractionElement = document.getElementById('distractions');
        if (mainDistractionElement) {
            mainDistractionElement.textContent = this.focusData.distractions;
        }
    }

    updatePetState(mood) {
        // Update pet mood based on head pose detection
        if (mood === 'happy') {
            this.petStats.happiness = Math.min(100, this.petStats.happiness + 5);
            this.petStats.energy = Math.min(100, this.petStats.energy + 2);
        } else if (mood === 'sad') {
            this.petStats.happiness = Math.max(0, this.petStats.happiness - 10);
            this.petStats.energy = Math.max(0, this.petStats.energy - 5);
        }
        
        // Update pet emoji based on stats
        this.updatePetEmoji();
        
        // Update pet stats display
        this.updatePetStats();
        
        // Save pet stats
        this.savePetStatsToLocalStorage();
    }

    updatePetEmoji() {
        const petAvatar = document.getElementById('petAvatar');
        if (!petAvatar) return;

        const happiness = this.petStats.happiness;
        const energy = this.petStats.energy;

        // Use same logic as dashboard for consistency
        if (happiness >= 70 && energy >= 70) {
            petAvatar.textContent = '😺'; // happy cat
        } else if (happiness >= 40 && energy >= 40) {
            petAvatar.textContent = '🐱'; // neutral cat
        } else {
            petAvatar.textContent = '😿'; // sad cat
        }
    }

    updatePetStats() {
        // Update happiness bar and value
        const happinessBar = document.getElementById('happinessBar');
        const happinessValue = document.getElementById('happinessValue');
        
        if (happinessBar) {
            happinessBar.style.width = `${this.petStats.happiness}%`;
        }
        if (happinessValue) {
            happinessValue.textContent = `${Math.round(this.petStats.happiness)}%`;
        }

        // Update energy bar and value
        const energyBar = document.getElementById('energyBar');
        const energyValue = document.getElementById('energyValue');
        
        if (energyBar) {
            energyBar.style.width = `${this.petStats.energy}%`;
        }
        if (energyValue) {
            energyValue.textContent = `${Math.round(this.petStats.energy)}%`;
        }
    }
}

// Initialize study session when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StudySession();
});



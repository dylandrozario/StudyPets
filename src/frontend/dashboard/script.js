// StudyPets Dashboard - Interactive JavaScript
class StudyPets {
    constructor() {
        this.isFocused = true;
        this.isPaused = false;
        this.studyTime = 0;
        this.happiness = 50;
        this.energy = 50;
        this.focusPercentage = 0;
        this.sessionTime = 0;
        this.streak = 0;
        this.totalStudyTime = 0;
        this.achievements = 0;
        
        // Timers
        this.studyTimer = null;
        this.energyTimer = null;
        this.focusTimer = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initializeChart();
        this.loadAggregatedTotalsFromSessions();
        this.loadPetStats();
        this.updateDisplay();
        this.updateCurrencyDisplay();
        this.updateBlockingStatus();
    }

    // ==================== Data Management ====================
    loadPetStats() {
        try {
            // Load from localStorage
            const savedStats = localStorage.getItem('studyPetsPetStats');
            if (savedStats) {
                const stats = JSON.parse(savedStats);
                this.happiness = stats.happiness || 85;
                this.energy = stats.energy || 70;
                console.log('Loaded pet stats from localStorage:', { happiness: this.happiness, energy: this.energy });
            } else {
                // Use default values
                this.happiness = 85;
                this.energy = 70;
                console.log('Using default pet stats:', { happiness: this.happiness, energy: this.energy });
            }
            
            // Update UI after loading
            this.updatePetStatsDisplay();
        } catch (e) {
            console.error('Failed loading pet stats:', e);
            // Use default values
            this.happiness = 85;
            this.energy = 70;
            this.updatePetStatsDisplay();
        }
    }

    loadCurrency() {
        const saved = localStorage.getItem('studyPetsCurrency');
        return saved ? parseInt(saved) : 0;
    }

    saveCurrency(amount) {
        localStorage.setItem('studyPetsCurrency', amount.toString());
    }

    earnCurrency(amount) {
        const currentCurrency = this.loadCurrency();
        const newCurrency = currentCurrency + amount;
        this.saveCurrency(newCurrency);
        this.updateCurrencyDisplay();
        this.showNotification(`Earned ${amount} coins! 💰`, 'success');
    }

    // ==================== Event Listeners ====================
    setupEventListeners() {
        this.setupMenuToggle();
        this.setupSidebarLinks();
        this.setupPetInteractions();
        this.setupNavButtons();
        this.setupDashboardControls();
        this.setupResponsiveHandlers();
    }

    setupMenuToggle() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                this.toggleSidebar(menuToggle, sidebar);
            });
        }
    }

    toggleSidebar(menuToggle, sidebar) {
                sidebar.classList.toggle('collapsed');
                menuToggle.classList.toggle('active');
                
                const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '0' : '280px';
        }
    }

    setupSidebarLinks() {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                const link = item.querySelector('a');
                if (link) {
                    return; // Let links handle navigation
                }
                
                e.preventDefault();
                this.selectSidebarItem(item, sidebarItems, index);
            });
        });
    }

    selectSidebarItem(selectedItem, allItems, index) {
        allItems.forEach(i => i.classList.remove('active'));
        selectedItem.classList.add('active');
                this.handleSidebarNavigation(index);
    }

    setupPetInteractions() {
        const petContainer = document.querySelector('.pet-container');
        const petDisplay = document.querySelector('.pet-display');
        
        if (petDisplay) {
            const buttonContainer = this.createPetButtons();
            petDisplay.appendChild(buttonContainer);
            this.attachPetButtonEvents(buttonContainer);
        }
    }

    createPetButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'pet-buttons';
        buttonContainer.innerHTML = `
            <button class="pet-btn feed-btn" title="Feed Pet">
                <span>🍎</span>
                <span>Feed</span>
            </button>
            <button class="pet-btn play-btn" title="Play with Pet">
                <span>🎾</span>
                <span>Play</span>
            </button>
            <button class="pet-btn rest-btn" title="Let Pet Rest">
                <span>😴</span>
                <span>Rest</span>
            </button>
        `;
        return buttonContainer;
    }

    attachPetButtonEvents(buttonContainer) {
        const buttons = {
            '.feed-btn': () => this.feedPet(),
            '.play-btn': () => this.playWithPet(),
            '.rest-btn': () => this.restPet()
        };

        Object.entries(buttons).forEach(([selector, handler]) => {
            const button = buttonContainer.querySelector(selector);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }

    setupNavButtons() {
        const buttons = {
            '.notification-icon': () => this.showNotifications(),
            '.profile-icon': () => this.showProfile()
        };

        Object.entries(buttons).forEach(([selector, handler]) => {
            const button = document.querySelector(selector);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }

    setupDashboardControls() {
        const dashboardHeader = document.querySelector('.dashboard-header');
        
        if (dashboardHeader) {
            const controlsContainer = this.createDashboardControls();
            dashboardHeader.appendChild(controlsContainer);
            this.attachControlEvents(controlsContainer);
        }
    }

    createDashboardControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'dashboard-controls';
        controlsContainer.innerHTML = `
            <button class="control-btn reset-btn" title="Reset Session">
                <span>🔄</span>
                <span>Reset</span>
            </button>
            <button class="control-btn pause-btn" title="Pause Timer">
                <span>⏸️</span>
                <span>Pause</span>
            </button>
            <button class="control-btn export-btn" title="Export Data">
                <span>📊</span>
                <span>Export</span>
            </button>
        `;
        return controlsContainer;
    }

    attachControlEvents(controlsContainer) {
        const controls = {
            '.reset-btn': () => this.resetSession(),
            '.pause-btn': () => this.togglePause(),
            '.export-btn': () => this.exportData()
        };

        Object.entries(controls).forEach(([selector, handler]) => {
            const button = controlsContainer.querySelector(selector);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }

    setupResponsiveHandlers() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (window.innerWidth <= 768 && menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && sidebar) {
                sidebar.classList.remove('open');
            }
        });
    }

    // ==================== Aggregated Stats (no live timers on dashboard) ====================
    loadAggregatedTotalsFromSessions() {
        const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
        const totalMs = sessions.reduce((sum, s) => sum + (s.totalTime || 0), 0);
        this.studyTime = 0;        // dashboard does not tick
        this.sessionTime = 0;      // dashboard does not tick
        this.totalStudyTime = Math.floor(totalMs / 1000);
    }

    updateStudyTime() {
                this.studyTime++;
                this.sessionTime++;
                this.totalStudyTime++;
                this.updateHappiness(1);
                
                // Earn currency every 30 seconds of focused study
                if (this.studyTime % 30 === 0) {
                    this.earnCurrency(5);
                }
    }

    simulateFocusTracking() {
        this.focusTimer = setInterval(() => {
            const random = Math.random();
            if (random < 0.1) { // 10% chance to lose focus
                this.setFocus(false);
            } else if (random < 0.15) { // 5% chance to regain focus
                this.setFocus(true);
            }
        }, 3000);
    }

    cleanup() {
        if (this.studyTimer) clearInterval(this.studyTimer);
        if (this.energyTimer) clearInterval(this.energyTimer);
        if (this.focusTimer) clearInterval(this.focusTimer);
    }

    // ==================== Focus Management ====================
    setFocus(focused) {
        this.isFocused = focused;
        this.updateFocusIndicator();
    }

    updateFocusIndicator() {
        const focusDot = document.getElementById('focusDot');
        const focusStatus = document.getElementById('focusStatus');
        
        if (focusDot && focusStatus) {
            if (this.isFocused) {
            focusDot.classList.remove('distracted');
            focusStatus.textContent = 'Focused';
        } else {
            focusDot.classList.add('distracted');
            focusStatus.textContent = 'Distracted';
            }
        }
    }

    // ==================== Pet Management ====================
    updateHappiness(change) {
        this.happiness = Math.max(0, Math.min(100, this.happiness + change));
        this.updatePetAnimation();
    }
        
    updatePetAnimation() {
        const petAvatar = document.getElementById('petAvatar');
        if (petAvatar) {
        if (this.happiness > 80) {
            petAvatar.style.animation = 'float-pet 6s ease-in-out infinite';
        } else if (this.happiness > 50) {
            petAvatar.style.animation = 'float-pet 8s ease-in-out infinite';
        } else {
            petAvatar.style.animation = 'float-pet 10s ease-in-out infinite';
        }
    }
        this.updatePetEmoji();
    }

    feedPet() {
        this.energy = Math.min(100, this.energy + 10);
        this.happiness = Math.min(100, this.happiness + 3);
        this.showNotification('Pet is well fed! 🍎');
        this.animatePet('fed');
    }

    playWithPet() {
        this.happiness = Math.min(100, this.happiness + 8);
        this.energy = Math.max(0, this.energy - 5);
        this.showNotification('Pet had fun playing! 🎾');
        this.animatePet('play');
    }

    restPet() {
        this.energy = Math.min(100, this.energy + 15);
        this.happiness = Math.min(100, this.happiness + 2);
        this.showNotification('Pet is well rested! 😴');
        this.animatePet('rest');
    }

    petPet() {
        this.happiness = Math.min(100, this.happiness + 5);
        this.energy = Math.min(100, this.energy + 3);
        this.showNotification('Pet is happy!');
        this.animatePet('happy');
    }

    animatePet(action) {
        const petAvatar = document.getElementById('petAvatar');
        if (petAvatar) {
            petAvatar.classList.add(`pet-${action}`);
            
            setTimeout(() => {
                petAvatar.classList.remove(`pet-${action}`);
            }, 1000);
        }
    }

    // ==================== UI Updates ====================
    updateDisplay() {
        this.updatePetStatsDisplay(); // Use the new comprehensive method
        this.updateStudyTimeDisplay();
        this.updateFocusPercentage();
        this.updatePetHappiness();
        this.updateAchievements();
    }

    updatePetEmoji() {
        const petAvatar = document.getElementById('petAvatar');
        if (!petAvatar) return;

        const happiness = this.happiness;
        const energy = this.energy;

        // Use same logic as study session for consistency
        if (happiness >= 70 && energy >= 70) {
            petAvatar.textContent = '😺'; // happy cat
        } else if (happiness >= 40 && energy >= 40) {
            petAvatar.textContent = '🐱'; // neutral cat
        } else {
            petAvatar.textContent = '😿'; // sad cat
        }
    }

    updatePetStatsDisplay() {
        console.log('Updating pet stats display:', { happiness: this.happiness, energy: this.energy });
        
        // Update happiness bar and value
        const happinessBar = document.getElementById('happinessBar');
        const happinessValue = document.getElementById('happinessValue');
        
        if (happinessBar) {
        happinessBar.style.width = `${this.happiness}%`;
            console.log('Updated happiness bar to:', `${this.happiness}%`);
        }
        if (happinessValue) {
        happinessValue.textContent = `${Math.round(this.happiness)}%`;
            console.log('Updated happiness value to:', `${Math.round(this.happiness)}%`);
        }

        // Update energy bar and value
        const energyBar = document.getElementById('energyBar');
        const energyValue = document.getElementById('energyValue');
        
        if (energyBar) {
        energyBar.style.width = `${this.energy}%`;
            console.log('Updated energy bar to:', `${this.energy}%`);
        }
        if (energyValue) {
        energyValue.textContent = `${Math.round(this.energy)}%`;
            console.log('Updated energy value to:', `${Math.round(this.energy)}%`);
        }

        // Update pet emoji
        this.updatePetEmoji();
    }

    updateHappinessBar() {
        const happinessBar = document.getElementById('happinessBar');
        const happinessValue = document.getElementById('happinessValue');
        
        if (happinessBar) happinessBar.style.width = `${this.happiness}%`;
        if (happinessValue) happinessValue.textContent = `${Math.round(this.happiness)}%`;
    }

    updateEnergyBar() {
        const energyBar = document.getElementById('energyBar');
        const energyValue = document.getElementById('energyValue');
        
        if (energyBar) energyBar.style.width = `${this.energy}%`;
        if (energyValue) energyValue.textContent = `${Math.round(this.energy)}%`;
    }

    updateStudyTimeDisplay() {
        const elements = {
            'studyTime': this.studyTime,
            'sessionTime': this.sessionTime,
            'totalStudyTime': this.totalStudyTime
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.formatTime(value);
            }
        });
    }

    updateFocusPercentage() {
        const focusPercentageElement = document.getElementById('focusPercentage');
        const avgFocusElement = document.getElementById('avgFocus');
        
        this.focusPercentage = this.calculateFocusPercentage();
        const percentage = Math.round(this.focusPercentage);
        
        if (focusPercentageElement) focusPercentageElement.textContent = `${percentage}%`;
        if (avgFocusElement) avgFocusElement.textContent = `${percentage}%`;
    }

    updatePetHappiness() {
        const petHappinessElement = document.getElementById('petHappiness');
        if (petHappinessElement) {
        petHappinessElement.textContent = `${Math.round(this.happiness)}%`;
        }
    }

    updateAchievements() {
        const achievementsElement = document.getElementById('achievements');
        if (achievementsElement) {
        this.achievements = this.calculateAchievements();
        achievementsElement.textContent = this.achievements;
        }
    }

    updateCurrencyDisplay() {
        const currency = this.loadCurrency();
        const navCurrencyAmount = document.getElementById('navCurrencyAmount');
        if (navCurrencyAmount) {
            navCurrencyAmount.textContent = currency;
        }
    }

    // ==================== Calculations ====================
    calculateFocusPercentage() {
        const baseFocus = this.isFocused ? 95 : 60;
        const timeBonus = Math.min(10, this.studyTime / 60);
        return Math.min(100, baseFocus + timeBonus);
    }

    calculateAchievements() {
        let count = 0;
        if (this.studyTime >= 60) count++; // 1 minute of study
        if (this.happiness >= 80) count++; // Happy pet
        if (this.streak >= 3) count++; // 3 day streak
        if (this.totalStudyTime >= 1800) count++; // 30 minutes total
        return count;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    // ==================== Chart Management ====================
    initializeChart() {
        const canvas = document.getElementById('focusChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = [85, 90, 88, 92, 95, 93, 97, 95, 98, 96];
        
        this.drawChart(ctx, canvas, data);
    }

    drawChart(ctx, canvas, data) {
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        this.drawGrid(ctx, width, height);
        this.drawLine(ctx, width, height, data);
        this.drawPoints(ctx, width, height, data);
    }

    drawGrid(ctx, width, height) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        }
        
    drawLine(ctx, width, height, data) {
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
    }
        
    drawPoints(ctx, width, height, data) {
        data.forEach((value, index) => {
            const x = (width / (data.length - 1)) * index;
            const y = height - (value / 100) * height;
            
            this.drawPoint(ctx, x, y);
        });
    }

    drawPoint(ctx, x, y) {
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
    }

    // ==================== Navigation ====================
    handleSidebarNavigation(index) {
        const sections = ['dashboard', 'analytics', 'calendar', 'achievements', 'settings'];
        const currentSection = sections[index];
        
        this.hideAllContentSections();
        this.showContentSection(currentSection);
        this.showNotification(`Switched to ${this.capitalizeFirst(currentSection)}`);
    }

    hideAllContentSections() {
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
    }
        
    showContentSection(sectionName) {
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ==================== Session Management ====================
    resetSession() {
        if (this.confirmAction('Are you sure you want to reset your current session?')) {
            this.studyTime = 0;
            this.sessionTime = 0;
            this.showNotification('Session reset! 🔄');
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.updatePauseButton();
        this.showNotification(this.isPaused ? 'Session paused ⏸️' : 'Session resumed ▶️');
    }

    updatePauseButton() {
        const pauseBtn = document.querySelector('.pause-btn span:first-child');
        const pauseText = document.querySelector('.pause-btn span:last-child');
        
        if (pauseBtn && pauseText) {
            if (this.isPaused) {
                pauseBtn.textContent = '▶️';
                pauseText.textContent = 'Resume';
            } else {
                pauseBtn.textContent = '⏸️';
                pauseText.textContent = 'Pause';
            }
        }
    }

    exportData() {
        const data = this.collectExportData();
        this.downloadData(data);
        this.showNotification('Data exported! 📊');
    }

    collectExportData() {
        return {
            studyTime: this.studyTime,
            totalStudyTime: this.totalStudyTime,
            happiness: this.happiness,
            energy: this.energy,
            focusPercentage: this.focusPercentage,
            streak: this.streak,
            achievements: this.achievements,
            exportDate: new Date().toISOString()
        };
    }

    downloadData(data) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `studypets-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    confirmAction(message) {
        return confirm(message);
    }

    // ==================== Modal Management ====================
    showNotifications() {
        const notifications = [
            'Great focus session! 🎯',
            'Pet reached level 2! ⭐',
            'New achievement unlocked! 🏆',
            'Study streak: 5 days! 🔥'
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        this.showNotification(randomNotification);
        
        this.removeNotificationBadge();
    }

    removeNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.style.display = 'none';
        }
    }

    showProfile() {
        const profileData = this.getProfileData();
        const profileContent = this.createProfileContent(profileData);
        this.showModal('Profile', profileContent);
    }

    getProfileData() {
        return {
            name: 'Study Buddy',
            level: 1,
            totalStudyTime: this.formatTime(this.totalStudyTime),
            achievements: this.achievements,
            streak: this.streak
        };
    }
        
    createProfileContent(profileData) {
        return `
            <div class="profile-content">
                <div class="profile-avatar">
                    <div class="mini-dog">
                        <div class="mini-dog-head"></div>
                        <div class="mini-dog-ears">
                            <div class="mini-dog-ear"></div>
                            <div class="mini-dog-ear"></div>
                        </div>
                    </div>
                </div>
                <h3>${profileData.name}</h3>
                <div class="profile-stats">
                    <div class="stat">
                        <span>Level:</span>
                        <span>${profileData.level}</span>
                    </div>
                    <div class="stat">
                        <span>Total Study Time:</span>
                        <span>${profileData.totalStudyTime}</span>
                    </div>
                    <div class="stat">
                        <span>Achievements:</span>
                        <span>${profileData.achievements}</span>
                    </div>
                    <div class="stat">
                        <span>Current Streak:</span>
                        <span>${profileData.streak} days</span>
                    </div>
                </div>
            </div>
        `;
    }

    showModal(title, content) {
        this.removeExistingModal();
        
        const modal = this.createModal(title, content);
        document.body.appendChild(modal);
        
        this.setupModalEvents(modal);
    }

    removeExistingModal() {
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            existingModal.remove();
        }
        }
        
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        return modal;
    }

    setupModalEvents(modal) {
        const closeButton = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => modal.remove());
        }
        
        if (backdrop) {
            backdrop.addEventListener('click', () => modal.remove());
        }
        
        // Escape key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // ==================== Notifications ====================
    showNotification(message, type = 'info') {
        const notification = this.createNotificationElement(message, type);
        document.body.appendChild(notification);
        
        this.scheduleNotificationRemoval(notification);
    }

    createNotificationElement(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const styles = this.getNotificationStyles(type);
        Object.assign(notification.style, styles);
        
        return notification;
    }

    getNotificationStyles(type) {
        const baseStyles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        };

        const typeStyles = {
            success: { background: 'linear-gradient(135deg, #10b981, #059669)' },
            error: { background: 'linear-gradient(135deg, #ef4444, #dc2626)' },
            info: { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }
        };

        return { ...baseStyles, ...typeStyles[type] };
    }

    scheduleNotificationRemoval(notification) {
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
            setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ==================== Blocking Status ====================
    updateBlockingStatus() {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        const petStats = JSON.parse(localStorage.getItem('studyPetsPetStats') || '{}');
        const blockingStatus = document.getElementById('blockingStatus');
        const blockedAttemptsCount = document.getElementById('blockedAttemptsCount');
        
        if (!settings.smartBlocking) {
            if (blockingStatus) blockingStatus.style.display = 'none';
            return;
        }
        
        // Check if pet meets thresholds
        const happinessOk = (petStats.happiness || 85) >= (settings.happinessThreshold || 70);
        const energyOk = (petStats.energy || 70) >= (settings.energyThreshold || 60);
        const focusOk = (petStats.focusPercentage || 95) >= (settings.focusThreshold || 80);
        const allMet = happinessOk && energyOk && focusOk;
        
        if (allMet) {
            if (blockingStatus) blockingStatus.style.display = 'none';
        } else {
            if (blockingStatus) blockingStatus.style.display = 'block';
            
            // Update blocked attempts count
            const attempts = JSON.parse(localStorage.getItem('blockedAttempts') || '[]');
            if (blockedAttemptsCount) {
                blockedAttemptsCount.textContent = attempts.length;
            }
        }
    }
}

// ==================== Global Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    window.studyPets = new StudyPets();
    
    // Add interactive features
    setupInteractiveFeatures();
});

function setupInteractiveFeatures() {
    // Pet interaction
    document.addEventListener('click', (e) => {
        if (e.target.closest('.pet-avatar')) {
            const studyPets = window.studyPets;
            if (studyPets) {
                studyPets.petPet();
            }
        }
        
        // Add click effects to glass cards
        if (e.target.closest('.glass-card')) {
            const card = e.target.closest('.glass-card');
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        }
    });
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
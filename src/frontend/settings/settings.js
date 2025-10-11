// Settings Page JavaScript
class SettingsPage {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettingsToUI();
    }

    // ==================== Data Management ====================
    loadSettings() {
        const saved = localStorage.getItem('settings');
        if (saved) {
            return JSON.parse(saved);
        }
        
        const defaultSettings = this.getDefaultSettings();
        localStorage.setItem('settings', JSON.stringify(defaultSettings));
        return defaultSettings;
    }

    getDefaultSettings() {
        return {
            focusTracking: true,
            studyReminders: false,
            breakReminders: true,
            focusSensitivity: 7,
            petName: 'Study Buddy',
            petColor: '#fbbf24',
            petPersonality: 'cheerful',
            petAnimations: true,
            soundNotifications: false,
            desktopNotifications: true,
            notificationVolume: 50,
            // Smart website blocking settings
            smartBlocking: true,
            happinessThreshold: 70,
            energyThreshold: 60,
            focusThreshold: 80,
            blockingStrictness: 'moderate',
            entertainmentSites: [
                'youtube.com', 'tiktok.com', 'twitter.com', 'netflix.com', 'instagram.com', 
                'reddit.com', 'twitch.tv', 'discord.com', 'pinterest.com', 'facebook.com',
                'snapchat.com', 'tumblr.com', '9gag.com', 'buzzfeed.com', 'vice.com',
                'vox.com', 'theverge.com', 'techcrunch.com', 'mashable.com'
            ]
        };
    }

    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    // ==================== Event Listeners ====================
    setupEventListeners() {
        this.setupMenuToggle();
        this.setupSidebarLinks();
        this.setupToggleSwitches();
        this.setupRangeInputs();
        this.setupTextInputs();
        this.setupDataManagementButtons();
        this.setupEntertainmentSitesButtons();
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
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.querySelector('a')) {
                    return; // Let links handle navigation
                }
                this.selectSidebarItem(item, sidebarItems);
            });
        });
    }

    selectSidebarItem(selectedItem, allItems) {
        allItems.forEach(i => i.classList.remove('active'));
        selectedItem.classList.add('active');
    }

    setupToggleSwitches() {
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                this.handleToggleSwitch(toggle);
            });
        });
    }

    handleToggleSwitch(toggle) {
        const setting = toggle.dataset.setting;
        const isActive = toggle.classList.contains('active');
        
        if (isActive) {
            toggle.classList.remove('active');
            this.settings[setting] = false;
        } else {
            toggle.classList.add('active');
            this.settings[setting] = true;
        }
        
        this.saveSettings();
        this.showNotification(`${setting} ${isActive ? 'disabled' : 'enabled'}`);
    }

    setupRangeInputs() {
        document.querySelectorAll('.range-input').forEach(range => {
            range.addEventListener('input', (e) => {
                this.handleRangeInput(e.target);
            });
        });
    }

    handleRangeInput(range) {
        const setting = range.dataset.setting;
        const value = range.value;
        
        this.settings[setting] = parseInt(value);
        this.saveSettings();
        this.updateRangeDisplay(range, setting, value);
    }

    updateRangeDisplay(range, setting, value) {
        const valueDisplay = range.parentElement.querySelector('.range-value');
        if (valueDisplay) {
            if (setting === 'notificationVolume') {
                valueDisplay.textContent = `${value}%`;
            } else {
                valueDisplay.textContent = value;
            }
        }
    }

    setupTextInputs() {
        document.querySelectorAll('input[type="text"], select, input[type="color"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleTextInput(e.target);
            });
        });
    }

    handleTextInput(input) {
        const setting = input.dataset.setting;
        this.settings[setting] = input.value;
        this.saveSettings();
        this.showNotification(`${setting} updated`);
    }

    setupDataManagementButtons() {
        const buttons = {
            exportDataBtn: () => this.exportAllData(),
            clearCacheBtn: () => this.clearCache(),
            resetDataBtn: () => this.resetAllData()
        };

        Object.entries(buttons).forEach(([id, handler]) => {
            const button = document.getElementById(id);
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

    // ==================== UI Loading ====================
    loadSettingsToUI() {
        this.loadToggleSwitches();
        this.loadRangeInputs();
        this.loadTextInputs();
    }

    loadToggleSwitches() {
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            const setting = toggle.dataset.setting;
            if (this.settings[setting]) {
                toggle.classList.add('active');
            }
        });
    }

    loadRangeInputs() {
        document.querySelectorAll('.range-input').forEach(range => {
            const setting = range.dataset.setting;
            range.value = this.settings[setting];
            
            const valueDisplay = range.parentElement.querySelector('.range-value');
            if (valueDisplay) {
                if (setting === 'notificationVolume') {
                    valueDisplay.textContent = `${this.settings[setting]}%`;
                } else {
                    valueDisplay.textContent = this.settings[setting];
                }
            }
        });
    }

    loadTextInputs() {
        document.querySelectorAll('input[type="text"], select, input[type="color"]').forEach(input => {
            const setting = input.dataset.setting;
            if (this.settings[setting]) {
                input.value = this.settings[setting];
            }
        });
    }

    // ==================== Data Management ====================
    exportAllData() {
        const allData = this.collectAllData();
        this.downloadData(allData);
        this.showNotification('All data exported successfully! 📊');
    }

    collectAllData() {
        return {
            settings: this.settings,
            studySessions: JSON.parse(localStorage.getItem('studySessions') || '[]'),
            achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
            studyStats: this.getStudyStats(),
            exportDate: new Date().toISOString()
        };
    }

    getStudyStats() {
        return {
            totalStudyTime: 1247,
            totalSessions: 45,
            averageFocus: 89,
            bestStreak: 12
        };
    }

    downloadData(data) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `studypets-complete-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    clearCache() {
        if (this.confirmAction('Are you sure you want to clear all cached data? This will not affect your study progress.')) {
            this.performCacheClear();
            this.showNotification('Cache cleared successfully! 🧹');
        }
    }

    performCacheClear() {
        const itemsToRemove = ['tempData', 'cache'];
        itemsToRemove.forEach(item => {
            localStorage.removeItem(item);
        });
    }

    resetAllData() {
        const warningMessage = '⚠️ WARNING: This will permanently delete ALL your data including study progress, achievements, and settings. This action cannot be undone. Are you absolutely sure?';
        const finalWarning = 'Last chance! This will delete everything. Continue?';
        
        if (this.confirmAction(warningMessage) && this.confirmAction(finalWarning)) {
            this.performDataReset();
        }
    }

    performDataReset() {
        localStorage.clear();
        this.showNotification('All data has been reset. The page will reload.', 5000);
        
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    confirmAction(message) {
        return confirm(message);
    }

    // ==================== Notifications ====================
    showNotification(message, duration = 3000) {
        const notification = this.createNotificationElement(message);
        document.body.appendChild(notification);
        
        this.scheduleNotificationRemoval(notification, duration);
    }

    createNotificationElement(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const styles = {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: 'rgba(16, 185, 129, 0.9)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            zIndex: '1000',
            animation: 'slideInRight 0.3s ease-out',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        };
        
        Object.assign(notification.style, styles);
        return notification;
    }

    scheduleNotificationRemoval(notification, duration) {
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // ==================== Entertainment Sites Management ====================
    setupEntertainmentSitesButtons() {
        const manageButton = document.getElementById('manageEntertainmentSites');
        if (manageButton) {
            manageButton.addEventListener('click', () => {
                this.showEntertainmentSitesModal();
            });
        }
    }

    showEntertainmentSitesModal() {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        const modal = this.createEntertainmentSitesModal();
        document.body.appendChild(modal);
        
        // Force reflow to ensure modal is rendered
        modal.offsetHeight;
        
        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }

    createEntertainmentSitesModal() {
        const modal = document.createElement('div');
        modal.className = 'entertainment-sites-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove(); document.body.style.overflow = '';"></div>
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>Manage Entertainment Sites</h3>
                    <button class="modal-close" onclick="this.closest('.entertainment-sites-modal').remove(); document.body.style.overflow = '';">×</button>
                </div>
                <div class="modal-body">
                    <div class="blocking-info">
                        <p>These sites will be blocked unless your pet's levels are above the thresholds:</p>
                        <div class="threshold-display">
                            <span>Happiness: ${this.settings.happinessThreshold}%</span>
                            <span>Energy: ${this.settings.energyThreshold}%</span>
                            <span>Focus: ${this.settings.focusThreshold}%</span>
                        </div>
                    </div>
                    <div class="add-site-section">
                        <input type="text" id="newEntertainmentSiteInput" placeholder="Enter website (e.g., facebook.com)" class="glass-input">
                        <button id="addEntertainmentSiteBtn" class="glass-btn primary">Add Site</button>
                    </div>
                    <div class="entertainment-sites-list" id="entertainmentSitesList">
                        ${this.renderEntertainmentSitesList()}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="glass-btn" onclick="this.closest('.entertainment-sites-modal').remove(); document.body.style.overflow = '';">Close</button>
                </div>
            </div>
        `;
        
        // Add event listeners for the modal
        this.setupEntertainmentSitesModalEvents(modal);
        
        // Add escape key listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        return modal;
    }

    renderEntertainmentSitesList() {
        return this.settings.entertainmentSites.map(site => `
            <div class="entertainment-site-item">
                <span class="site-name">${site}</span>
                <button class="remove-site-btn" data-site="${site}">Remove</button>
            </div>
        `).join('');
    }

    setupEntertainmentSitesModalEvents(modal) {
        const addBtn = modal.querySelector('#addEntertainmentSiteBtn');
        const newSiteInput = modal.querySelector('#newEntertainmentSiteInput');
        const sitesList = modal.querySelector('#entertainmentSitesList');
        
        addBtn.addEventListener('click', () => {
            const site = newSiteInput.value.trim();
            if (site && !this.settings.entertainmentSites.includes(site)) {
                this.settings.entertainmentSites.push(site);
                this.saveSettings();
                sitesList.innerHTML = this.renderEntertainmentSitesList();
                newSiteInput.value = '';
                this.setupRemoveEntertainmentButtons(sitesList);
                this.showNotification(`Added ${site} to entertainment list`);
            }
        });
        
        newSiteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });
        
        this.setupRemoveEntertainmentButtons(sitesList);
    }

    setupRemoveEntertainmentButtons(container) {
        container.querySelectorAll('.remove-site-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const site = btn.dataset.site;
                this.settings.entertainmentSites = this.settings.entertainmentSites.filter(s => s !== site);
                this.saveSettings();
                container.innerHTML = this.renderEntertainmentSitesList();
                this.setupRemoveEntertainmentButtons(container);
                this.showNotification(`Removed ${site} from entertainment list`);
            });
        });
    }

    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
        document.body.style.overflow = '';
    }
}

// ==================== Global Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    new SettingsPage();
});
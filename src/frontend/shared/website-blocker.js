// Smart Website Blocker Service - Pet Level Based
class SmartWebsiteBlocker {
    constructor() {
        this.settings = this.loadSettings();
        this.petStats = this.loadPetStats();
        this.isBlockingActive = false;
        this.init();
    }

    init() {
        this.checkBlockingStatus();
        this.setupPetStatsListener();
        this.setupPageLoadListener();
        this.setupNavigationWarning();
        this.startPeriodicCheck();
    }

    loadSettings() {
        const saved = localStorage.getItem('settings');
        return saved ? JSON.parse(saved) : this.getDefaultSettings();
    }

    loadPetStats() {
        try {
            const saved = localStorage.getItem('studyPetsPetStats');
            if (saved) {
                const stats = JSON.parse(saved);
                return {
                    happiness: stats.happiness || 85,
                    energy: stats.energy || 70,
                    focusPercentage: stats.focusPercentage || 95
                };
            }
        } catch (e) {
            console.error('Failed to load pet stats:', e);
        }
        
        return {
            happiness: 85,
            energy: 70,
            focusPercentage: 95
        };
    }

    getDefaultSettings() {
        return {
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

    checkBlockingStatus() {
        if (!this.settings.smartBlocking) {
            this.isBlockingActive = false;
            return;
        }

        // Update pet stats
        this.petStats = this.loadPetStats();
        
        // Check if pet meets the thresholds
        const meetsThresholds = this.checkPetThresholds();
        
        if (meetsThresholds) {
            this.isBlockingActive = false;
            console.log('Pet levels are high enough - entertainment sites allowed');
        } else {
            this.isBlockingActive = true;
            console.log('Pet levels too low - blocking entertainment sites');
        }

        if (this.isBlockingActive) {
            this.checkCurrentPage();
        }
    }

    checkPetThresholds() {
        const happinessOk = this.petStats.happiness >= this.settings.happinessThreshold;
        const energyOk = this.petStats.energy >= this.settings.energyThreshold;
        const focusOk = this.petStats.focusPercentage >= this.settings.focusThreshold;
        
        console.log('Pet threshold check:', {
            happiness: `${this.petStats.happiness}% (need ${this.settings.happinessThreshold}%)`,
            energy: `${this.petStats.energy}% (need ${this.settings.energyThreshold}%)`,
            focus: `${this.petStats.focusPercentage}% (need ${this.settings.focusThreshold}%)`,
            allMet: happinessOk && energyOk && focusOk
        });
        
        return happinessOk && energyOk && focusOk;
    }

    setupPetStatsListener() {
        // Listen for pet stats changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'studyPetsPetStats' || e.key === 'settings') {
                this.settings = this.loadSettings();
                this.checkBlockingStatus();
            }
        });
    }

    setupPageLoadListener() {
        // Check immediately on page load
        if (this.isBlockingActive) {
            this.checkCurrentPage();
        }
    }

    startPeriodicCheck() {
        // Check every 5 seconds for changes
        setInterval(() => {
            this.checkBlockingStatus();
        }, 5000);
    }

    checkCurrentPage() {
        const currentDomain = window.location.hostname;
        
        if (this.isEntertainmentSite(currentDomain)) {
            this.blockCurrentPage();
        }
    }

    isEntertainmentSite(domain) {
        return this.settings.entertainmentSites.some(site => {
            switch (this.settings.blockingStrictness) {
                case 'strict':
                    return domain === site;
                case 'moderate':
                    return domain === site || domain.endsWith('.' + site);
                case 'loose':
                    return domain.includes(site) || site.includes(domain);
                default:
                    return domain === site;
            }
        });
    }

    blockCurrentPage() {
        // Replace page content with blocking page
        document.body.innerHTML = this.createSmartBlockingPage();
        this.setupSmartBlockingPageEvents();
    }

    createSmartBlockingPage() {
        const missingStats = this.getMissingStats();
        
        return `
            <div class="smart-blocking-page">
                <div class="blocking-container glass-card">
                    <div class="blocking-icon">🚫</div>
                    <h1>Entertainment Blocked</h1>
                    <p>Your pet needs more care before you can access entertainment sites!</p>
                    
                    <div class="pet-status">
                        <div class="pet-avatar">${this.getPetEmoji()}</div>
                        <div class="pet-levels">
                            <div class="level-item ${this.petStats.happiness >= this.settings.happinessThreshold ? 'met' : 'missing'}">
                                <span class="level-label">Happiness:</span>
                                <span class="level-value">${Math.round(this.petStats.happiness)}%</span>
                                <span class="level-requirement">(need ${this.settings.happinessThreshold}%)</span>
                            </div>
                            <div class="level-item ${this.petStats.energy >= this.settings.energyThreshold ? 'met' : 'missing'}">
                                <span class="level-label">Energy:</span>
                                <span class="level-value">${Math.round(this.petStats.energy)}%</span>
                                <span class="level-requirement">(need ${this.settings.energyThreshold}%)</span>
                            </div>
                            <div class="level-item ${this.petStats.focusPercentage >= this.settings.focusThreshold ? 'met' : 'missing'}">
                                <span class="level-label">Focus:</span>
                                <span class="level-value">${Math.round(this.petStats.focusPercentage)}%</span>
                                <span class="level-requirement">(need ${this.settings.focusThreshold}%)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="blocking-actions">
                        <button class="glass-btn primary" id="studyToImprove">Study to Improve Pet</button>
                        <button class="glass-btn" id="takeCareOfPet">Take Care of Pet</button>
                    </div>
                    
                    <div class="improvement-tips">
                        <h3>💡 How to Improve Your Pet's Levels</h3>
                        <ul>
                            <li><strong>Happiness:</strong> Stay focused during study sessions</li>
                            <li><strong>Energy:</strong> Take regular breaks and use items from the shop</li>
                            <li><strong>Focus:</strong> Avoid distractions and maintain good study habits</li>
                        </ul>
                    </div>
                    
                    <div class="blocking-footer">
                        <p>Once your pet's levels are high enough, you'll be able to access entertainment sites!</p>
                    </div>
                </div>
            </div>
        `;
    }

    getMissingStats() {
        const missing = [];
        if (this.petStats.happiness < this.settings.happinessThreshold) {
            missing.push('happiness');
        }
        if (this.petStats.energy < this.settings.energyThreshold) {
            missing.push('energy');
        }
        if (this.petStats.focusPercentage < this.settings.focusThreshold) {
            missing.push('focus');
        }
        return missing;
    }

    getPetEmoji() {
        const avgLevel = (this.petStats.happiness + this.petStats.energy + this.petStats.focusPercentage) / 3;
        if (avgLevel >= 80) return '😸';
        if (avgLevel >= 60) return '😺';
        if (avgLevel >= 40) return '😿';
        return '😾';
    }

    setupSmartBlockingPageEvents() {
        const studyBtn = document.getElementById('studyToImprove');
        const careBtn = document.getElementById('takeCareOfPet');
        
        if (studyBtn) {
            studyBtn.addEventListener('click', () => {
                this.redirectToStudyPage();
            });
        }
        
        if (careBtn) {
            careBtn.addEventListener('click', () => {
                this.redirectToDashboard();
            });
        }
        
        // Update stats periodically
        this.updateSmartBlockingStats();
        setInterval(() => {
            this.updateSmartBlockingStats();
        }, 2000);
    }

    redirectToStudyPage() {
        window.location.href = '../study/study.html';
    }

    redirectToDashboard() {
        window.location.href = '../dashboard/index.html';
    }

    updateSmartBlockingStats() {
        // Reload pet stats
        this.petStats = this.loadPetStats();
        
        // Update the display
        const levelItems = document.querySelectorAll('.level-item');
        levelItems.forEach(item => {
            const label = item.querySelector('.level-label').textContent.toLowerCase().replace(':', '');
            const valueEl = item.querySelector('.level-value');
            const requirementEl = item.querySelector('.level-requirement');
            
            let currentValue, threshold;
            if (label.includes('happiness')) {
                currentValue = Math.round(this.petStats.happiness);
                threshold = this.settings.happinessThreshold;
            } else if (label.includes('energy')) {
                currentValue = Math.round(this.petStats.energy);
                threshold = this.settings.energyThreshold;
            } else if (label.includes('focus')) {
                currentValue = Math.round(this.petStats.focusPercentage);
                threshold = this.settings.focusThreshold;
            }
            
            valueEl.textContent = `${currentValue}%`;
            requirementEl.textContent = `(need ${threshold}%)`;
            
            // Update class based on whether threshold is met
            if (currentValue >= threshold) {
                item.classList.add('met');
                item.classList.remove('missing');
            } else {
                item.classList.add('missing');
                item.classList.remove('met');
            }
        });
        
        // Update pet emoji
        const petAvatar = document.querySelector('.pet-avatar');
        if (petAvatar) {
            petAvatar.textContent = this.getPetEmoji();
        }
        
        // Check if all thresholds are now met
        if (this.checkPetThresholds()) {
            this.showNotification('Your pet is now happy enough! Refreshing page...');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    setupNavigationWarning() {
        // Intercept clicks on external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const url = new URL(link.href);
                const domain = url.hostname;
                
                if (this.isEntertainmentSite(domain) && this.isBlockingActive) {
                    e.preventDefault();
                    this.showNavigationWarning(domain, link.href);
                }
            }
        });

        // Intercept form submissions that might navigate to blocked sites
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const action = form.action;
            if (action) {
                try {
                    const url = new URL(action);
                    const domain = url.hostname;
                    
                    if (this.isEntertainmentSite(domain) && this.isBlockingActive) {
                        e.preventDefault();
                        this.showNavigationWarning(domain, action);
                    }
                } catch (err) {
                    // Invalid URL, ignore
                }
            }
        });
    }

    showNavigationWarning(domain, url) {
        const modal = document.createElement('div');
        modal.className = 'navigation-warning-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>🚫 Site Blocked</h3>
                    <button class="modal-close" onclick="this.closest('.navigation-warning-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="warning-content">
                        <p><strong>${domain}</strong> is blocked because your pet's levels are too low!</p>
                        <div class="pet-status-mini">
                            <div class="pet-avatar-mini">${this.getPetEmoji()}</div>
                            <div class="levels-mini">
                                <div class="level-mini ${this.petStats.happiness >= this.settings.happinessThreshold ? 'met' : 'missing'}">
                                    Happiness: ${Math.round(this.petStats.happiness)}% (need ${this.settings.happinessThreshold}%)
                                </div>
                                <div class="level-mini ${this.petStats.energy >= this.settings.energyThreshold ? 'met' : 'missing'}">
                                    Energy: ${Math.round(this.petStats.energy)}% (need ${this.settings.energyThreshold}%)
                                </div>
                                <div class="level-mini ${this.petStats.focusPercentage >= this.settings.focusThreshold ? 'met' : 'missing'}">
                                    Focus: ${Math.round(this.petStats.focusPercentage)}% (need ${this.settings.focusThreshold}%)
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="warning-actions">
                        <button class="glass-btn primary" id="studyToImprove">Study to Improve Pet</button>
                        <button class="glass-btn" id="takeCareOfPet">Take Care of Pet</button>
                        <button class="glass-btn danger" id="forceNavigate">Force Navigate Anyway</button>
                    </div>
                    <div class="warning-tips">
                        <p><strong>💡 Tip:</strong> Study for a few minutes to improve your pet's levels, then you can access entertainment sites!</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('#studyToImprove').addEventListener('click', () => {
            modal.remove();
            window.location.href = '../study/study.html';
        });
        
        modal.querySelector('#takeCareOfPet').addEventListener('click', () => {
            modal.remove();
            window.location.href = '../dashboard/index.html';
        });
        
        modal.querySelector('#forceNavigate').addEventListener('click', () => {
            this.trackBlockedAttempt(domain);
            modal.remove();
            window.open(url, '_blank');
        });

        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    trackBlockedAttempt(domain) {
        const attempts = JSON.parse(localStorage.getItem('blockedAttempts') || '[]');
        attempts.push({
            domain: domain,
            timestamp: Date.now(),
            petStats: { ...this.petStats }
        });
        localStorage.setItem('blockedAttempts', JSON.stringify(attempts));
        
        this.showNotification(`Blocked attempt to ${domain} has been tracked`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'smart-blocking-notification';
        notification.textContent = message;
        
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(16, 185, 129, 0.9)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        };
        
        Object.assign(notification.style, styles);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize smart website blocker
document.addEventListener('DOMContentLoaded', () => {
    new SmartWebsiteBlocker();
});

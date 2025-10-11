// Achievements Page JavaScript
class AchievementsPage {
    constructor() {
        this.achievements = this.loadAchievements();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAchievements();
        this.updateStats();
    }

    // ==================== Data Management ====================
    loadAchievements() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            return JSON.parse(saved);
        }
        
        const defaultAchievements = this.getDefaultAchievements();
        localStorage.setItem('achievements', JSON.stringify(defaultAchievements));
        return defaultAchievements;
    }

    getDefaultAchievements() {
        return [
            {
                id: 'first_focus',
                name: 'First Focus',
                description: 'Stay focused for 1 minute straight',
                icon: '🎯',
                progress: 1,
                maxProgress: 1,
                earned: true,
                earnedAt: Date.now() - 86400000,
                reward: 'Pet happiness +10'
            },
            {
                id: 'happy_pet',
                name: 'Happy Pet',
                description: 'Keep your pet at 80% happiness for 1 hour',
                icon: '😊',
                progress: 1,
                maxProgress: 1,
                earned: true,
                earnedAt: Date.now() - 172800000,
                reward: 'New pet animation unlocked'
            },
            {
                id: 'study_streak',
                name: 'Study Streak',
                description: 'Focus for 25 minutes straight',
                icon: '🔥',
                progress: 2,
                maxProgress: 3,
                earned: false,
                reward: 'Energy boost +20'
            },
            {
                id: 'distraction_free',
                name: 'Distraction Free',
                description: 'No distractions for 10 minutes',
                icon: '🧘',
                progress: 0,
                maxProgress: 1,
                earned: false,
                reward: 'Focus bonus +15%'
            },
            {
                id: 'early_bird',
                name: 'Early Bird',
                description: 'Study before 8 AM for 5 days',
                icon: '🌅',
                progress: 3,
                maxProgress: 5,
                earned: false,
                reward: 'Morning energy boost'
            },
            {
                id: 'night_owl',
                name: 'Night Owl',
                description: 'Study after 10 PM for 3 days',
                icon: '🦉',
                progress: 1,
                maxProgress: 3,
                earned: false,
                reward: 'Late night focus bonus'
            },
            {
                id: 'weekend_warrior',
                name: 'Weekend Warrior',
                description: 'Study for 2 hours on weekends',
                icon: '⚔️',
                progress: 0,
                maxProgress: 1,
                earned: false,
                reward: 'Weekend productivity boost'
            },
            {
                id: 'consistency_king',
                name: 'Consistency King',
                description: 'Study every day for 7 days',
                icon: '👑',
                progress: 4,
                maxProgress: 7,
                earned: false,
                reward: 'Royal pet crown'
            }
        ];
    }

    saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }

    // ==================== Event Listeners ====================
    setupEventListeners() {
        this.setupMenuToggle();
        this.setupSidebarLinks();
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
                    return; // Let the link handle navigation
                }
                this.selectSidebarItem(item, sidebarItems);
            });
        });
    }

    selectSidebarItem(selectedItem, allItems) {
        allItems.forEach(i => i.classList.remove('active'));
        selectedItem.classList.add('active');
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

    // ==================== Achievement Rendering ====================
    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const card = this.createAchievementCard(achievement);
            grid.appendChild(card);
        });
    }

    createAchievementCard(achievement) {
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.earned ? 'earned' : ''}`;
        
        const progressPercent = this.calculateProgressPercent(achievement);
        card.innerHTML = this.createAchievementCardHTML(achievement, progressPercent);
        
        this.addAchievementCardEvents(card, achievement);
        
        return card;
    }

    calculateProgressPercent(achievement) {
        return (achievement.progress / achievement.maxProgress) * 100;
    }

    createAchievementCardHTML(achievement, progressPercent) {
        return `
            ${achievement.earned ? '<div class="earned-badge">EARNED</div>' : ''}
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-progress">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="progress-text">${achievement.progress}/${achievement.maxProgress}</div>
        `;
    }

    addAchievementCardEvents(card, achievement) {
        if (achievement.earned) {
            card.addEventListener('click', () => {
                this.showAchievementDetails(achievement);
            });
        }
    }

    // ==================== Stats Management ====================
    updateStats() {
        const stats = this.calculateStats();
        this.updateStatsDisplay(stats);
    }

    calculateStats() {
        const earnedCount = this.achievements.filter(a => a.earned).length;
        const totalCount = this.achievements.length;
        const completionRate = Math.round((earnedCount / totalCount) * 100);
        
        const level = Math.floor(earnedCount / 3) + 1;
        const nextLevelProgress = ((earnedCount % 3) / 3) * 100;
        
        return {
            earnedCount,
            totalCount,
            completionRate,
            level,
            nextLevelProgress
        };
    }

    updateStatsDisplay(stats) {
        const elements = {
            'totalAchievements': stats.earnedCount,
            'achievementRate': `${stats.completionRate}%`,
            'currentLevel': stats.level,
            'nextLevel': `${Math.round(stats.nextLevelProgress)}%`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // ==================== Achievement Details ====================
    showAchievementDetails(achievement) {
        const modalContent = this.createAchievementDetailContent(achievement);
        this.showModal('Achievement Unlocked!', modalContent);
    }

    createAchievementDetailContent(achievement) {
        return `
            <div class="achievement-detail">
                <div class="achievement-icon-large">${achievement.icon}</div>
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
                <div class="achievement-reward">
                    <strong>Reward:</strong> ${achievement.reward}
                </div>
                <div class="achievement-date">
                    <strong>Earned:</strong> ${this.formatEarnedDate(achievement.earnedAt)}
                </div>
            </div>
        `;
    }

    formatEarnedDate(timestamp) {
        return new Date(timestamp).toLocaleDateString();
    }

    // ==================== Achievement Management ====================
    updateAchievementProgress(achievementId, progress) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.earned) {
            achievement.progress = Math.min(progress, achievement.maxProgress);
            
            if (achievement.progress >= achievement.maxProgress) {
                this.unlockAchievement(achievement);
            }
            
            this.saveAchievements();
            this.renderAchievements();
            this.updateStats();
        }
    }

    unlockAchievement(achievement) {
        achievement.earned = true;
        achievement.earnedAt = Date.now();
        this.showAchievementUnlockedNotification(achievement);
    }

    showAchievementUnlockedNotification(achievement) {
        // Create a notification for the unlocked achievement
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${achievement.icon}</div>
                <div class="notification-text">
                    <div class="notification-title">Achievement Unlocked!</div>
                    <div class="notification-name">${achievement.name}</div>
                </div>
            </div>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minWidth: '300px'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // ==================== Achievement Categories ====================
    getAchievementsByCategory() {
        const categories = {
            focus: this.achievements.filter(a => a.id.includes('focus') || a.id.includes('streak')),
            time: this.achievements.filter(a => a.id.includes('early') || a.id.includes('night') || a.id.includes('weekend')),
            consistency: this.achievements.filter(a => a.id.includes('consistency') || a.id.includes('distraction')),
            pet: this.achievements.filter(a => a.id.includes('pet') || a.id.includes('happy'))
        };
        
        return categories;
    }

    getAchievementStats() {
        const earned = this.achievements.filter(a => a.earned);
        const inProgress = this.achievements.filter(a => !a.earned && a.progress > 0);
        const notStarted = this.achievements.filter(a => !a.earned && a.progress === 0);
        
        return {
            earned: earned.length,
            inProgress: inProgress.length,
            notStarted: notStarted.length,
            total: this.achievements.length
        };
    }

    // ==================== Modal Management ====================
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
}

// ==================== Global Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    new AchievementsPage();
});

// ==================== Achievement Styles ====================
const achievementStyles = document.createElement('style');
achievementStyles.textContent = `
    .achievement-detail {
        text-align: center;
    }
    
    .achievement-icon-large {
        font-size: 5rem;
        margin-bottom: 1rem;
    }
    
    .achievement-detail h3 {
        margin: 0 0 1rem 0;
        color: #1f2937;
        font-size: 1.5rem;
        font-weight: 600;
    }
    
    .achievement-detail p {
        color: #6b7280;
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }
    
    .achievement-reward,
    .achievement-date {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .achievement-reward strong,
    .achievement-date strong {
        color: #1f2937;
    }
    
    .achievement-notification {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-icon {
        font-size: 2rem;
    }
    
    .notification-text {
        flex: 1;
    }
    
    .notification-title {
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
    }
    
    .notification-name {
        font-size: 0.9rem;
        opacity: 0.9;
    }
`;
document.head.appendChild(achievementStyles);
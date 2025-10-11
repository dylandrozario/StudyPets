// Calendar Page JavaScript
class CalendarPage {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.studySessions = this.loadStudySessions();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCalendar();
        this.updateUpcomingSessions();
    }

    // ==================== Data Management ====================
    loadStudySessions() {
        const saved = localStorage.getItem('studySessions');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return this.getDefaultStudySessions();
    }

    getDefaultStudySessions() {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dayAfterTomorrow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        return {
            [today]: [
                { time: '14:00', subject: 'Math Review', duration: 2, notes: 'Chapter 5 exercises' }
            ],
            [tomorrow]: [
                { time: '09:00', subject: 'Science', duration: 1.5, notes: 'Biology chapter 3' }
            ],
            [dayAfterTomorrow]: [
                { time: '15:00', subject: 'History Essay', duration: 3, notes: 'World War II research' }
            ]
        };
    }

    saveStudySessions() {
        localStorage.setItem('studySessions', JSON.stringify(this.studySessions));
    }

    // ==================== Event Listeners ====================
    setupEventListeners() {
        this.setupMenuToggle();
        this.setupCalendarNavigation();
        this.setupAddSessionButton();
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

    setupCalendarNavigation() {
        const prevButton = document.getElementById('prevMonth');
        const nextButton = document.getElementById('nextMonth');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.navigateMonth(-1);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.navigateMonth(1);
            });
        }
    }

    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    setupAddSessionButton() {
        const addButton = document.getElementById('addSessionBtn');
        if (addButton) {
            addButton.addEventListener('click', () => {
                this.showAddSessionModal();
            });
        }
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

    // ==================== Calendar Rendering ====================
    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonthElement = document.getElementById('currentMonth');
        
        if (!calendarGrid || !currentMonthElement) return;
        
        this.updateMonthDisplay(currentMonthElement);
        this.clearCalendar(calendarGrid);
        this.renderCalendarDays(calendarGrid);
    }

    updateMonthDisplay(currentMonthElement) {
        const monthNames = this.getMonthNames();
        currentMonthElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    getMonthNames() {
        return [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
    }

    clearCalendar(calendarGrid) {
        calendarGrid.innerHTML = '';
    }

    renderCalendarDays(calendarGrid) {
        const calendarData = this.getCalendarData();
        
        this.renderEmptyDays(calendarGrid, calendarData.startingDayOfWeek);
        this.renderMonthDays(calendarGrid, calendarData);
    }

    getCalendarData() {
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { firstDay, lastDay, daysInMonth, startingDayOfWeek };
    }

    renderEmptyDays(calendarGrid, startingDayOfWeek) {
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }
    }

    renderMonthDays(calendarGrid, calendarData) {
        for (let day = 1; day <= calendarData.daysInMonth; day++) {
            const dayElement = this.createDayElement(day);
            calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(day) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.dataset.date = this.formatDateString(day);
        
        this.applyDayStyling(dayElement, day);
        this.addDayContent(dayElement);
        this.addDayEventListeners(dayElement);
        
        return dayElement;
    }

    formatDateString(day) {
        const year = this.currentDate.getFullYear();
        const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    }

    applyDayStyling(dayElement, day) {
        if (this.isToday(day)) {
            dayElement.classList.add('today');
        }
        
        const dateKey = dayElement.dataset.date;
        if (this.studySessions[dateKey]) {
            dayElement.classList.add('has-study');
        }
    }

    isToday(day) {
        const today = new Date();
        return this.currentDate.getFullYear() === today.getFullYear() &&
               this.currentDate.getMonth() === today.getMonth() &&
               day === today.getDate();
    }

    addDayContent(dayElement) {
        const day = parseInt(dayElement.dataset.date.split('-')[2]);
        const dateKey = dayElement.dataset.date;
        
        dayElement.innerHTML = `
            <div class="day-number">${day}</div>
            ${this.renderStudySessionsForDay(dateKey)}
        `;
    }

    addDayEventListeners(dayElement) {
        dayElement.addEventListener('click', () => {
            this.selectDate(dayElement.dataset.date);
        });
    }

    renderStudySessionsForDay(dateKey) {
        const sessions = this.studySessions[dateKey] || [];
        return sessions.slice(0, 2).map(session => 
            `<div class="study-session">${session.time} - ${session.subject}</div>`
        ).join('');
    }

    // ==================== Date Selection ====================
    selectDate(dateString) {
        this.selectedDate = new Date(dateString);
        this.updateDateSelection(dateString);
        this.showDayDetails(dateString);
    }

    updateDateSelection(dateString) {
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        
        const selectedDay = document.querySelector(`[data-date="${dateString}"]`);
        if (selectedDay) {
            selectedDay.classList.add('selected');
        }
    }

    // ==================== Day Details ====================
    showDayDetails(dateString) {
        const sessions = this.studySessions[dateString] || [];
        const date = new Date(dateString);
        const dateStr = this.formatDateDisplay(date);
        
        const modalContent = this.createDayDetailsContent(dateStr, sessions, dateString);
        this.showModal('Study Sessions', modalContent);
    }

    formatDateDisplay(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    createDayDetailsContent(dateStr, sessions, dateString) {
        return `
            <div class="day-details">
                <h3>${dateStr}</h3>
                <div class="sessions-list">
                    ${sessions.length > 0 ? 
                        this.renderSessionsList(sessions) :
                        '<p>No study sessions scheduled for this day.</p>'
                    }
                </div>
                <button class="add-session-day-btn" onclick="calendarPage.showAddSessionModal('${dateString}')">
                    Add Session
                </button>
            </div>
        `;
    }

    renderSessionsList(sessions) {
        return sessions.map(session => `
            <div class="session-detail">
                <div class="session-time">${session.time}</div>
                <div class="session-subject">${session.subject}</div>
                <div class="session-duration">${session.duration} hours</div>
            </div>
        `).join('');
    }

    // ==================== Session Management ====================
    showAddSessionModal(dateString = null) {
        const defaultDate = dateString || this.selectedDate.toISOString().split('T')[0];
        const defaultTime = this.getCurrentTime();
        
        const modalContent = this.createAddSessionForm(defaultDate, defaultTime);
        this.showModal('Add Study Session', modalContent);
        
        this.setupSessionFormHandler();
    }

    getCurrentTime() {
        return new Date().toTimeString().slice(0, 5);
    }

    createAddSessionForm(defaultDate, defaultTime) {
        return `
            <form class="add-session-form" id="addSessionForm">
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="sessionDate" value="${defaultDate}" required>
                </div>
                <div class="form-group">
                    <label>Time</label>
                    <input type="time" id="sessionTime" value="${defaultTime}" required>
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <input type="text" id="sessionSubject" placeholder="e.g., Math, Science, History" required>
                </div>
                <div class="form-group">
                    <label>Duration (hours)</label>
                    <input type="number" id="sessionDuration" min="0.5" max="8" step="0.5" value="2" required>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="sessionNotes" placeholder="Optional notes about this session"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-btn" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button type="submit" class="save-btn">Save Session</button>
                </div>
            </form>
        `;
    }

    setupSessionFormHandler() {
        const form = document.getElementById('addSessionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveStudySession();
            });
        }
    }

    saveStudySession() {
        const sessionData = this.getSessionFormData();
        
        if (this.validateSessionData(sessionData)) {
            this.addSessionToCalendar(sessionData);
            this.updateCalendarDisplay();
            this.closeModal();
            this.showNotification('Study session added successfully! 📅');
        }
    }

    getSessionFormData() {
        return {
            date: document.getElementById('sessionDate').value,
            time: document.getElementById('sessionTime').value,
            subject: document.getElementById('sessionSubject').value,
            duration: parseFloat(document.getElementById('sessionDuration').value),
            notes: document.getElementById('sessionNotes').value
        };
    }

    validateSessionData(sessionData) {
        return sessionData.date && sessionData.time && sessionData.subject && sessionData.duration > 0;
    }

    addSessionToCalendar(sessionData) {
        if (!this.studySessions[sessionData.date]) {
            this.studySessions[sessionData.date] = [];
        }
        
        this.studySessions[sessionData.date].push({
            time: sessionData.time,
            subject: sessionData.subject,
            duration: sessionData.duration,
            notes: sessionData.notes
        });
        
        this.sortSessionsByTime(sessionData.date);
        this.saveStudySessions();
    }

    sortSessionsByTime(date) {
        this.studySessions[date].sort((a, b) => a.time.localeCompare(b.time));
    }

    updateCalendarDisplay() {
        this.renderCalendar();
        this.updateUpcomingSessions();
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }

    // ==================== Upcoming Sessions ====================
    updateUpcomingSessions() {
        const upcomingSessions = this.getUpcomingSessions();
        const sessionsContainer = document.querySelector('.upcoming-sessions');
        
        if (sessionsContainer) {
            this.clearExistingSessions(sessionsContainer);
            this.renderUpcomingSessions(sessionsContainer, upcomingSessions);
        }
    }

    clearExistingSessions(sessionsContainer) {
        const existingItems = sessionsContainer.querySelectorAll('.session-item');
        existingItems.forEach(item => item.remove());
    }

    renderUpcomingSessions(sessionsContainer, upcomingSessions) {
        upcomingSessions.forEach(session => {
            const sessionItem = this.createSessionItem(session);
            sessionsContainer.appendChild(sessionItem);
        });
    }

    createSessionItem(session) {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        sessionItem.innerHTML = `
            <div>
                <div class="session-time">${session.displayDate}</div>
                <div class="session-duration">${session.duration} hours - ${session.subject}</div>
            </div>
        `;
        return sessionItem;
    }

    getUpcomingSessions() {
        const upcoming = [];
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        Object.keys(this.studySessions).forEach(dateStr => {
            const sessionDate = new Date(dateStr);
            if (sessionDate >= today && sessionDate <= nextWeek) {
                this.studySessions[dateStr].forEach(session => {
                    const displayDate = this.formatUpcomingSessionDate(sessionDate);
                    upcoming.push({
                        ...session,
                        displayDate: `${displayDate}, ${session.time}`,
                        date: dateStr
                    });
                });
            }
        });
        
        return this.sortAndLimitUpcomingSessions(upcoming);
    }

    formatUpcomingSessionDate(sessionDate) {
        return sessionDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    sortAndLimitUpcomingSessions(upcoming) {
        return upcoming
            .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
            .slice(0, 5);
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

    // ==================== Notifications ====================
    showNotification(message) {
        const notification = this.createNotificationElement(message);
        document.body.appendChild(notification);
        
        this.scheduleNotificationRemoval(notification);
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

    scheduleNotificationRemoval(notification) {
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// ==================== Global Initialization ====================
let calendarPage;
document.addEventListener('DOMContentLoaded', () => {
    calendarPage = new CalendarPage();
});

// ==================== Form Styles ====================
const formStyles = document.createElement('style');
formStyles.textContent = `
    .add-session-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .form-group label {
        font-weight: 500;
        color: #374151;
    }
    
    .form-group input,
    .form-group textarea {
        padding: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: #1f2937;
        font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #3b82f6;
        background: rgba(255, 255, 255, 0.15);
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1rem;
    }
    
    .cancel-btn,
    .save-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .cancel-btn {
        background: rgba(255, 255, 255, 0.1);
        color: #6b7280;
    }
    
    .save-btn {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
    }
    
    .cancel-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .save-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .day-details {
        text-align: center;
    }
    
    .sessions-list {
        margin: 1rem 0;
    }
    
    .session-detail {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .add-session-day-btn {
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        margin-top: 1rem;
    }
`;
document.head.appendChild(formStyles);
// Analytics with localStorage Data
document.addEventListener('DOMContentLoaded', () => {
    console.log('Analytics page loaded');
    
    // Wait a bit for everything to be ready
    setTimeout(() => {
        createCharts();
    }, 1000);
});

function createCharts() {
    console.log('Creating charts...');
    
    // Load session data from localStorage
    const sessionData = loadSessionData();
    
    // Create focus chart
    const focusCanvas = document.getElementById('focusChart');
    if (focusCanvas) {
        const ctx = focusCanvas.getContext('2d');
        drawFocusChart(ctx, focusCanvas, sessionData);
        console.log('Focus chart created');
    } else {
        console.error('Focus canvas not found');
    }
    
    // Create time chart
    const timeCanvas = document.getElementById('timeChart');
    if (timeCanvas) {
        const ctx = timeCanvas.getContext('2d');
        drawTimeChart(ctx, timeCanvas, sessionData);
        console.log('Time chart created');
    } else {
        console.error('Time canvas not found');
    }
}

function loadSessionData() {
    try {
        const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
        console.log('Loaded sessions from localStorage:', sessions.length);
        return sessions;
    } catch (e) {
        console.error('Failed to load session data:', e);
        return [];
    }
}

function processFocusData(sessions) {
    // Group sessions by day of week and calculate average focus percentage
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Monday to Sunday
    const sessionCounts = [0, 0, 0, 0, 0, 0, 0];
    
    sessions.forEach(session => {
        const date = new Date(session.started_at);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday=0, Sunday=6
        
        if (session.duration_ms > 0) {
            const focusPercentage = Math.round((session.focused_ms / session.duration_ms) * 100);
            weeklyData[adjustedDay] += focusPercentage;
            sessionCounts[adjustedDay]++;
        }
    });
    
    // Calculate averages
    const averages = weeklyData.map((total, index) => {
        return sessionCounts[index] > 0 ? Math.round(total / sessionCounts[index]) : 0;
    });
    
    // If no data, use sample data
    if (averages.every(val => val === 0)) {
        return [85, 92, 78, 88, 95, 70, 65];
    }
    
    return averages;
}

function processTimeData(sessions) {
    // Group sessions by day and calculate total study time in hours
    const weeklyHours = [0, 0, 0, 0, 0, 0, 0]; // Monday to Sunday
    
    sessions.forEach(session => {
        const date = new Date(session.started_at);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday=0, Sunday=6
        
        const hours = session.duration_ms / (1000 * 60 * 60); // Convert ms to hours
        weeklyHours[adjustedDay] += hours;
    });
    
    // Round to 1 decimal place
    const roundedHours = weeklyHours.map(hours => Math.round(hours * 10) / 10);
    
    // If no data, use sample data
    if (roundedHours.every(val => val === 0)) {
        return [2.5, 3.2, 1.8, 2.9, 4.1, 1.2, 0.8];
    }
    
    return roundedHours;
}

function drawFocusChart(ctx, canvas, sessionData) {
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
    
    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Focus Percentage Chart', width / 2, 30);
    
    // Process session data for focus percentages
    const data = processFocusData(sessionData);
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (width / (data.length - 1)) * index;
        const y = height - 60 - ((value - 50) / 50) * (height - 100);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#3b82f6';
    data.forEach((value, index) => {
        const x = (width / (data.length - 1)) * index;
        const y = height - 60 - ((value - 50) / 50) * (height - 100);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Arial';
    labels.forEach((label, index) => {
        const x = (width / labels.length) * (index + 0.5);
        ctx.fillText(label, x, height - 10);
    });
}

function drawTimeChart(ctx, canvas, sessionData) {
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
    
    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Study Time Chart (Hours)', width / 2, 30);
    
    // Process session data for study time
    const data = processTimeData(sessionData);
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const maxValue = Math.max(...data);
    const barWidth = width / data.length * 0.7;
    const barSpacing = width / data.length * 0.3;
    
    ctx.fillStyle = '#10b981';
    
    data.forEach((value, index) => {
        const x = (width / data.length) * index + barSpacing / 2;
        const barHeight = (value / maxValue) * (height - 100);
        const y = height - 60 - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Arial';
    labels.forEach((label, index) => {
        const x = (width / labels.length) * (index + 0.5);
        ctx.fillText(label, x, height - 10);
    });
}

// Simple sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            menuToggle.classList.toggle('active');
            
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '0' : '280px';
            }
        });
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Recreate charts with new period
            setTimeout(() => {
                createCharts();
            }, 100);
        });
    });
});
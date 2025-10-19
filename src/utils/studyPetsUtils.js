// StudyPets - Shared Utilities
// Common functionality used across React components

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const loadPetStats = () => {
  try {
    const savedStats = localStorage.getItem('studyPetsPetStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      return {
        happiness: stats.happiness || 85,
        energy: stats.energy || 70,
        focusPercentage: stats.focusPercentage || 95
      };
    }
    return {
      happiness: 85,
      energy: 70,
      focusPercentage: 95
    };
  } catch (e) {
    console.error('Failed loading pet stats:', e);
    return {
      happiness: 85,
      energy: 70,
      focusPercentage: 95
    };
  }
};

export const savePetStats = (stats) => {
  try {
    localStorage.setItem('studyPetsPetStats', JSON.stringify(stats));
  } catch (e) {
    console.error('Failed saving pet stats:', e);
  }
};

export const loadCurrency = () => {
  const saved = localStorage.getItem('studyPetsCurrency');
  return saved ? parseInt(saved) : 0;
};

export const saveCurrency = (amount) => {
  localStorage.setItem('studyPetsCurrency', amount.toString());
};

export const loadSettings = () => {
  try {
    const saved = localStorage.getItem('settings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      smartBlocking: true,
      happinessThreshold: 70,
      energyThreshold: 60,
      focusThreshold: 80,
      blockingStrictness: 'moderate',
      entertainmentSites: []
    };
  } catch (e) {
    console.error('Failed loading settings:', e);
    return {
      smartBlocking: true,
      happinessThreshold: 70,
      energyThreshold: 60,
      focusThreshold: 80,
      blockingStrictness: 'moderate',
      entertainmentSites: []
    };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem('settings', JSON.stringify(settings));
  } catch (e) {
    console.error('Failed saving settings:', e);
  }
};

export const loadStudySessions = () => {
  try {
    const saved = localStorage.getItem('studySessions');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed loading study sessions:', e);
    return [];
  }
};

export const saveStudySessions = (sessions) => {
  try {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed saving study sessions:', e);
  }
};

export const getPetEmoji = (happiness, energy) => {
  if (happiness >= 70 && energy >= 70) {
    return '😺'; // happy cat
  } else if (happiness >= 40 && energy >= 40) {
    return '🐱'; // neutral cat
  } else {
    return '😿'; // sad cat
  }
};

export const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  const styles = {
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
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
               type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
               'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  };
  
  Object.assign(notification.style, styles);
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

export const calculateFocusPercentage = (isFocused, studyTime) => {
  const baseFocus = isFocused ? 95 : 60;
  const timeBonus = Math.min(10, studyTime / 60);
  return Math.min(100, baseFocus + timeBonus);
};

export const calculateAchievements = (studyTime, happiness, streak, totalStudyTime) => {
  let count = 0;
  if (studyTime >= 60) count++; // 1 minute of study
  if (happiness >= 80) count++; // Happy pet
  if (streak >= 3) count++; // 3 day streak
  if (totalStudyTime >= 1800) count++; // 30 minutes total
  return count;
};

export const updatePetStats = (currentStats, changes) => {
  const newStats = { ...currentStats };
  
  if (changes.happiness !== undefined) {
    newStats.happiness = Math.max(0, Math.min(100, newStats.happiness + changes.happiness));
  }
  
  if (changes.energy !== undefined) {
    newStats.energy = Math.max(0, Math.min(100, newStats.energy + changes.energy));
  }
  
  if (changes.focusPercentage !== undefined) {
    newStats.focusPercentage = Math.max(0, Math.min(100, changes.focusPercentage));
  }
  
  return newStats;
};

export const checkBlockingStatus = (petStats, settings) => {
  if (!settings.smartBlocking) {
    return false;
  }
  
  const happinessOk = petStats.happiness >= settings.happinessThreshold;
  const energyOk = petStats.energy >= settings.energyThreshold;
  const focusOk = petStats.focusPercentage >= settings.focusThreshold;
  
  return !(happinessOk && energyOk && focusOk);
};

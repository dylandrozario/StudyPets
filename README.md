# StudyPets - React Application

A beautiful liquid glass virtual pet study companion built with React and JavaScript.

## Features

- 🎯 **Focus Tracking** - Real-time focus detection through activity monitoring
- 📊 **Analytics Dashboard** - Detailed insights into study patterns and productivity metrics
- 🏆 **Achievement System** - Unlock achievements and milestones as you build study habits
- 💰 **Reward Economy** - Earn coins by studying and spend them on pet items
- 📅 **Study Calendar** - Plan and track study sessions with an interactive calendar
- ⚙️ **Customizable Settings** - Personalize your experience with customizable settings
- 🚫 **Website Blocking** - Smart blocking of entertainment sites based on pet status

## Technology Stack

- **Frontend**: React 18.2.0 with JavaScript (no TypeScript)
- **Routing**: React Router DOM 6.8.0
- **Styling**: CSS with glass morphism design
- **Build Tool**: Create React App (react-scripts)
- **Browser Extension**: Chrome Extension Manifest V3

## Project Structure

```
src/
├── components/           # React components
│   ├── LandingPage.js   # Landing page component
│   ├── Dashboard.js     # Main dashboard component
│   ├── Analytics.js     # Analytics page component
│   ├── Calendar.js      # Calendar page component
│   ├── Achievements.js # Achievements page component
│   ├── StudySession.js  # Study session component
│   ├── CVTest.js       # Computer vision test component
│   ├── Shop.js         # Pet shop component
│   ├── Settings.js     # Settings page component
│   ├── Dashboard.css   # Dashboard-specific styles
│   └── shared/         # Shared components and styles
│       └── PageStyles.css
├── utils/              # Utility functions
│   └── studyPetsUtils.js
├── App.js             # Main App component with routing
├── App.css            # App-specific styles
├── index.js           # React entry point
└── index.css          # Global styles

browser-extension/     # Chrome extension files
├── manifest.json      # Extension manifest
├── popup.html         # Extension popup
├── popup.js          # Extension popup logic
├── popup.css         # Extension popup styles
├── background.js     # Extension background script
├── content.js        # Extension content script
└── blocked-page.html # Blocked page template

face-direction-detection/ # Preserved original CV functionality
└── src/              # Original face detection code
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StudyPets
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with the production-ready application.

## Browser Extension

The StudyPets browser extension works alongside the React application to provide website blocking functionality.

### Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `browser-extension` folder
4. The extension will now appear in your Chrome toolbar

### Features

- Smart website blocking based on pet status
- Real-time pet status monitoring
- Quick access to StudyPets application
- Blocked attempts tracking

## Key Components

### Dashboard Component

The main dashboard provides:
- Pet status monitoring (happiness, energy)
- Study session tracking
- Focus percentage display
- Interactive pet care buttons
- Real-time notifications

### Utility Functions

The `studyPetsUtils.js` file contains shared functionality:
- Local storage management
- Pet stats calculations
- Notification system
- Time formatting
- Achievement calculations

## Data Storage

The application uses browser localStorage to persist:
- Pet statistics (happiness, energy, focus)
- User settings and preferences
- Study session data
- Currency and achievements
- Blocked website attempts

## Styling

The application uses a glass morphism design system with:
- Semi-transparent backgrounds
- Backdrop blur effects
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Consistent color scheme with green accents

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App
- `npm run lint` - Run ESLint

### Code Structure

- Components are functional components using React hooks
- State management uses React's built-in useState and useEffect
- Routing handled by React Router DOM
- Styling uses CSS modules and shared stylesheets
- Utility functions are modularized for reusability

## Preserved Features

The `face-direction-detection` folder has been preserved as requested and contains the original computer vision functionality for focus detection.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
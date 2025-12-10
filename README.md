# AURA BEAM ✨

A real-time social aura tracking app where friends can give or take "aura points" from each other with reasons. Built with React, Firebase, and AI-powered sentiment detection.

## 🌟 Features

### Core Functionality
- **Aura Points System**: Give or take aura points from friends with custom reasons
- **Real-time Updates**: Live feed and leaderboard powered by Firestore
- **Friend Network**: Add friends and build your social circle
- **Vibe Check**: Send aura to friends with "Glaze" (positive) or "Roast" (negative) transactions
- **AI Sentiment Detection**: Powered by Google Gemini AI to detect message sentiment
- **Live Chat**: Real-time group chat with sentiment indicators

### Privacy & Security
- **Friend-Based Feed**: Only see transactions involving you or your friends
- **Friend-Only Interactions**: Can only send aura to friends
- **Firestore Security Rules**: Robust backend security

### User Experience
- **Neo-Brutalist Design**: Bold, modern UI with vibrant colors
- **Mobile-First**: Fully responsive design optimized for mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Dynamic Color Scaling**: Magnitude slider with gradient color transitions
- **Profile Customization**: Choose from 9 emoji avatars and custom codenames

### Settings & Configuration
- **Profile Management**: Edit avatar and codename
- **Client-Side API Keys**: Optional user-provided Gemini API keys to reduce server costs
- **Account Information**: View email, user ID, and aura points

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Neo-Brutalist Theme
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **AI**: Google Gemini API (sentiment detection, slang translation)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ (specified in `.nvmrc`)
- Yarn package manager
- Firebase account
- Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "AURA BEAM"
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Google & Email/Password)
   - Create a Firestore database
   - Copy your Firebase config

4. **Set up environment variables**
   
   Create a `.env.local` file:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Deploy Firestore security rules**
   ```bash
   firebase deploy --only firestore
   ```

6. **Run development server**
   ```bash
   yarn dev
   ```

## 🎮 Usage

### Getting Started
1. Sign up with Google or Email/Password
2. Choose a unique codename (3-12 characters)
3. Add friends by searching for their codenames
4. Start giving or taking aura!

### Sending Aura
1. Click the "+" button to open Vibe Check
2. Choose "Glaze" (positive) or "Roast" (negative)
3. Select a friend from the dropdown
4. Adjust the magnitude (10-10,000 points)
5. Add a reason (supports `/slang` for AI translation)
6. Confirm transaction

### Feed Visibility
You can see transactions where:
- You are the sender or receiver
- At least one party is your friend
- Both parties are your friends

### Using Your Own API Key
1. Go to Settings (gear icon)
2. Get a free API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
3. Paste it in the "AI API Key" section
4. Click "Save Key"

## 🏗️ Project Structure

```
AURA BEAM/
├── src/
│   ├── components/
│   │   ├── tabs/
│   │   │   ├── FeedTab.tsx          # Transaction feed with filtering
│   │   │   ├── LeaderboardTab.tsx   # Ranked user list
│   │   │   ├── FriendsTab.tsx       # Friend management
│   │   │   └── ChatTab.tsx          # Live chat
│   │   ├── AuraAction.tsx           # Vibe Check modal
│   │   ├── BrutalButton.tsx         # Neo-brutalist button
│   │   ├── CodenamePage.tsx         # Initial setup
│   │   ├── FeedItem.tsx             # Transaction display
│   │   ├── Header.tsx               # User profile header
│   │   ├── SettingsPage.tsx         # Settings & profile
│   │   └── Tabs.tsx                 # Tab navigation
│   ├── services/
│   │   └── ai.ts                    # Gemini AI integration
│   ├── App.tsx                      # Main app component
│   ├── firebase.ts                  # Firebase config
│   ├── theme.ts                     # Design system
│   ├── types.ts                     # TypeScript types
│   └── index.css                    # Global styles
├── firestore.rules                  # Security rules
├── firebase.json                    # Firebase config
└── package.json
```

## 🔐 Security

### Firestore Rules
- Users can only create/update their own profile
- Users can update friend-related fields of others
- Users can update aura field during transactions
- All users can read profiles
- Transactions are read-only after creation

### API Key Management
- Server-side key stored in `.env.local` (gitignored)
- Optional client-side keys stored in localStorage
- Keys never sent to your server

## 🎨 Design System

### Colors
- **Primary**: `#00F0FF` (Cyan)
- **Secondary**: `#FACC15` (Yellow)
- **Accent**: `#FF4D00` (Orange)
- **Background**: `#FFFAEB` (Cream)

### Typography
- **Font**: "Outfit" (Google Fonts)
- **Headings**: Bold, uppercase, neo-brutalist style

### Components
- **Borders**: 2px solid black
- **Shadows**: 4px offset for depth
- **Animations**: Smooth transitions with Framer Motion

## 📱 Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push

### Firebase Hosting
```bash
yarn build
firebase deploy --only hosting
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Google Gemini AI for sentiment detection
- Firebase for backend infrastructure
- Framer Motion for smooth animations
- Lucide for beautiful icons

## 🐛 Known Issues

- AI translation requires valid Gemini API key
- Real-time updates require active internet connection
- Mobile browsers may have slight animation delays

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React, Firebase, and AI**

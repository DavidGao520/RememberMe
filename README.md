# 🎂 RememberMe

A beautiful birthday reminder app with AI-powered gift recommendations. Never forget a friend's birthday again!

**Live Demo:** https://rememberme-bday.web.app

## ✨ Features

- 🗓️ **Birthday Tracking** - Never miss an important date with beautiful countdown timers
- 🎁 **AI Gift Recommendations** - Get personalized gift ideas based on your friends' interests
- 🔍 **Search & Filter** - Easily find friends by name or filter by upcoming birthdays
- 📊 **Smart Dashboard** - Visual overview of all birthdays with urgency indicators
- 🎨 **Modern UI/UX** - Stunning dark theme with glassmorphism design
- 📱 **Fully Responsive** - Works beautifully on all devices
- ⚡ **Real-time Updates** - Instant sync across all your devices

## 🚀 Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Firebase** - Authentication & Firestore database
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing

## 🎨 Design Highlights

- **Dark Theme** - Premium dark UI with warm gradient accents
- **Glassmorphism** - Modern frosted glass effects
- **Custom Typography** - Playfair Display & Outfit fonts
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Grid** - Adaptive layouts for all screen sizes

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/DavidGao520/RememberMe.git

# Navigate to the project
cd RememberMe

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Copy your Firebase config to `src/firebase.js`
3. Set up Firestore database with the following structure:
   ```
   users/{userId}/friends/{friendId}
   ```

## 📝 Project Structure

```
RememberMe/
├── src/
│   ├── components/      # React components
│   │   ├── Dashboard.jsx
│   │   ├── FriendCard.jsx
│   │   ├── Signin.jsx
│   │   └── ...
│   ├── styles/          # Global styles
│   │   └── globals.css
│   ├── firebase.js      # Firebase configuration
│   ├── giftApi.js       # Gift recommendation API
│   └── App.jsx          # Main app component
├── public/              # Static assets
└── package.json
```

## 🎯 Usage

1. **Sign Up/Login** - Create an account or sign in
2. **Add Friends** - Click "Add Friend" to track birthdays
3. **View Dashboard** - See all your friends' birthdays at a glance
4. **Get Gift Ideas** - Click "Get Gift Recommendation" for AI-powered suggestions
5. **Search & Filter** - Use the search bar and filters to find specific friends

## 🌟 Key Features Explained

### Birthday Countdown
- Visual countdown rings show days until each birthday
- Color-coded urgency indicators (red for this week, yellow for this month)
- Automatic sorting by upcoming dates

### Gift Recommendations
- AI-powered suggestions based on interests
- Budget-friendly options
- Expandable gift cards with details

### Smart Filtering
- Filter by urgency (This Week, This Month, Later)
- Search by name or interest
- Real-time updates

## 🚢 Deployment

The app is deployed on Firebase Hosting:

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the movie "Coco" - remembering those we love
- Design inspired by modern glassmorphism trends
- Built with ❤️ for never forgetting what matters

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ by [DavidGao520](https://github.com/DavidGao520)

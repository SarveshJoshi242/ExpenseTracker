# 💰 ExpenseTracker Pro

A full-stack expense tracking application with a React Native mobile app, Node.js backend, React admin panel, and WhatsApp CRM integration.

## 🏗️ Architecture

```
ExpenseTracker/
├── 📱 mobile/              # React Native Expo App (Android + iOS)
├── ⚙️ server/              # Node.js Express API
├── 🖥️ admin-panel/         # React Admin Dashboard
└── 💬 whatsapp-service/    # Baileys WhatsApp Bot
```

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo SDK 52 + TypeScript |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Free Tier) |
| Admin | React 19 + Vite + Material UI |
| WhatsApp | Baileys (WhatsApp Web API) |
| Hosting | Render.com (Free Tier) |

## 📋 Prerequisites

- **Node.js** 20 LTS or later
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Android Studio** (for Android emulator)
- **MongoDB Atlas** account (free tier)

## 🔧 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/SarveshJoshi242/ExpenseTracker.git
cd ExpenseTracker
```

### 2. Backend Server
```bash
cd server
npm install
# Configure .env with your MongoDB URI
npm run dev
```
Server runs at `http://localhost:5000`

### 3. Mobile App
```bash
cd mobile
npm install
npx expo start
```
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Scan QR code with Expo Go app on physical device

### 4. Admin Panel
```bash
cd admin-panel
npm install
npm run dev
```
Admin panel runs at `http://localhost:5173`

### 5. WhatsApp Service
```bash
cd whatsapp-service
npm install
npm run dev
```
WhatsApp service runs at `http://localhost:5001`

## 🔑 Default Admin Credentials
- **Email:** admin@expensetracker.com
- **Password:** Admin@12345

## 📱 Features

### Mobile App
- 📊 Dashboard with animated balance cards
- ➕ Quick expense/income entry with bottom sheet
- 📋 Transaction history with swipe actions
- 📈 Statistics with interactive charts
- 💰 Budget tracking with progress indicators
- 🌙 Dark/Light theme support
- 🔔 Local push notifications
- 📸 Receipt capture
- 📤 Export reports (PDF/CSV)

### Admin Panel
- 📊 Real-time dashboard with KPIs
- 👥 User management (activate/deactivate)
- 🗄️ Database overview & stats
- 💬 WhatsApp CRM (broadcast messages)
- 📈 Reports & analytics

### WhatsApp Bot
- 📋 Expense reports on demand
- 💰 Budget alerts
- 📢 Admin broadcast messages
- 🤖 Auto-reply commands

## 🌐 Deployment (Render.com)

1. Push code to GitHub
2. Create services on Render:
   - **Web Service** → `server/` (Node.js)
   - **Static Site** → `admin-panel/` (React build)
   - **Background Worker** → `whatsapp-service/`
3. Set environment variables on Render dashboard
4. Update mobile app `API_URL` to Render URL

## 📄 License

MIT License — feel free to use and modify.

## 👨‍💻 Author

**Sarvesh Joshi** — [@SarveshJoshi242](https://github.com/SarveshJoshi242)

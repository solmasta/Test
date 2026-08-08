# EcoCycle - Environmental Impact Tracker

A modern web application for tracking environmental impact, joining eco-communities, and participating in sustainability challenges.

## Features

- Track personal waste and recycling
- Join local eco-communities
- Participate in environmental challenges
- View leaderboards
- Eco-friendly dashboard

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Deployment: GitHub Pages (frontend) + Cloudflare Workers (backend)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/solmasta/Test.git
cd Test
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Start the development server:
```bash
# In root directory
npm run start

# In frontend directory
npm run dev
```

## Deployment

### Frontend
```bash
cd frontend
npm run build
npm run deploy
```

### Backend
Deploy to a Node.js hosting platform like Render, Heroku, or Vercel.

## Project Structure

```
├── frontend/           # React frontend application
│   ├── src/            # Source files
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── App.jsx     # Main application component
│   │   └── main.jsx    # Entry point
│   └── index.html      # HTML template
├── src/                # Backend source files
├── index.js            # Backend entry point
└── package.json        # Project configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

MIT License
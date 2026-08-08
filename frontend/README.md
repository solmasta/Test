# EcoCycle Frontend

A modern React-based frontend for the EcoCycle environmental impact tracking application.

## Features

- User authentication (login/register)
- Dashboard with environmental impact statistics
- Community listings and joining
- Environmental challenges
- Leaderboard ranking
- User profile management

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Vite build tool

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components for routing
├── App.jsx         # Main application component
├── main.jsx        # Application entry point
└── index.css       # Global styles
```

## Development

This frontend is designed to work with the EcoCycle backend API. Make sure the backend is running and properly configured.

## Deployment

The frontend can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.) by building the production assets:

```bash
npm run build
```

The built files will be in the `dist/` directory.
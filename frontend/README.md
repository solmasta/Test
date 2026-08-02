# EcoCycle Frontend

React-based dashboard for the EcoCycle API. Track environmental impact, join communities, and compete in challenges.

## Features

- 🌱 **Dashboard** - Log waste and view personal statistics
- 👥 **Communities** - Create and join local environmental communities
- 🏆 **Challenges** - Participate in eco-friendly competitions
- 📊 **Leaderboard** - See global rankings and environmental impact
- 👤 **Profile** - View stats and update account information
- 🔐 **Authentication** - JWT-based secure login/registration

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool (fast dev server, optimized builds)
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` with hot reload. The dev server proxies API requests to `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

Builds optimized bundle in `dist/` directory.

## Configuration

### Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

**Required variables:**
- `VITE_API_URL` - Backend API URL (default: `http://localhost:3000/api`)

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main navigation & layout
│   ├── ProtectedRoute.jsx  # Auth guard for routes
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Dashboard.jsx       # Waste logs & stats
│   ├── Communities.jsx     # Community browser
│   ├── Challenges.jsx      # Challenge list
│   ├── Leaderboard.jsx     # Global rankings
│   ├── Profile.jsx         # User profile & stats
├── context/
│   └── AuthContext.jsx     # Authentication state management
├── api.js                  # API client with interceptors
├── App.jsx                 # Router configuration
├── main.jsx                # React entry point
└── index.css               # Global styles (TailwindCSS)
```

## API Integration

The frontend communicates with the EcoCycle API:

- **Auth Endpoints**: Register, login, profile management
- **Waste Logs**: Create, read, update, delete logs
- **Communities**: Browse, create, join/leave communities
- **Challenges**: View, create, participate in challenges
- **Stats**: Leaderboards and user statistics

All API requests include JWT token from localStorage automatically.

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all subsequent requests via Axios interceptor
5. On logout, token removed and user redirected to home

## Styling

Uses TailwindCSS with custom theme:

- **Colors**: Eco-green (#22c55e) primary color
- **Components**: Reusable btn-primary, btn-secondary, card, input-field classes
- **Responsive**: Mobile-first design with md: and lg: breakpoints

## Error Handling

- API errors caught and displayed to user
- Form validation on client side
- Loading states during async operations
- Clear error messages from backend

## Performance

- Code splitting via Vite
- Lazy loading via React Router
- Image optimization
- CSS minification
- Tree shaking for unused code

## Deployment

### As Static Files

```bash
npm run build
# Copy dist/ to web server
```

### With Backend

```bash
# Option 1: Serve from Node.js
npm run build
# Copy dist/ to backend public/ folder
```

### Environment Setup for Production

Update `.env` with production API URL:

```
VITE_API_URL=https://your-api-domain.com/api
```

Rebuild with `npm run build`.

## Troubleshooting

### CORS Errors

Ensure backend CORS is configured correctly. The backend should allow requests from the frontend URL.

### API Requests Return 401

- Clear localStorage
- Log out and log back in
- Check JWT_SECRET on backend matches

### White Screen

Check browser console for errors. Common issues:
- API_URL misconfigured
- Backend not running
- Node version incompatibility

## Development Tips

### Add New Page

1. Create `src/pages/NewPage.jsx`
2. Add route in `App.jsx`
3. Import and use `useAuth()` for auth state
4. Use API functions from `api.js`

### Add New API Endpoint

1. Add function to relevant section in `src/api.js`
2. Use in components with try/catch and error handling

### Styling

- Use TailwindCSS classes (responsive-first)
- Custom components in `@layer components` in `index.css`
- Use eco theme colors: `text-eco-600`, `bg-eco-500`, etc.

## Support

- API Documentation: `/api/docs` (Swagger UI)
- Backend Repository: https://github.com/solmasta/Test
- Issues: Report in GitHub Issues

---

**Status**: Production ready ✅

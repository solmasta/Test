# EcoCycle Setup Guide

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (version 4.4 or higher)
- npm (version 6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ecocycle.git
cd ecocycle
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
# Server
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/ecocycle

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Node environment
NODE_ENV=development
```

## Database Setup

Make sure MongoDB is running on your system. If you don't have MongoDB installed, you can:

1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/
2. Or use a cloud MongoDB service like MongoDB Atlas

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon, which automatically restarts the server when code changes are detected.

### Production Mode

```bash
npm start
```

This will start the server in production mode.

## Testing

Run the test suite:
```bash
npm test
```

## API Documentation

API documentation is available in the [API.md](API.md) file.

## Project Structure

```
ecocycle/
├── index.js              # Main server file
├── package.json          # Project dependencies and scripts
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── src/
│   ├── models/           # Database models
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   └── middleware/       # Custom middleware
└── docs/
    ├── API.md            # API documentation
    └── SETUP.md          # Setup guide
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/ecocycle |
| JWT_SECRET | Secret key for JWT tokens | - |
| JWT_EXPIRES_IN | JWT token expiration | 7d |
| NODE_ENV | Node environment | development |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# Control Desk Web

A React + Vite web application for the AMS (Attendance Management System) control desk.

## Features

- 🎓 School and campus management
- 👨‍🏫 Teacher management
- 👨‍🎓 Student management
- 📚 Class and section management
- 🗺️ Google Maps integration for campus locations
- 🌍 Multi-language support (i18n)
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management
- **i18next** - Internationalization
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Google Maps API** - Maps integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your configuration
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

The development server includes a proxy to the backend API at `http://127.0.0.1:5000`.

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Deployment

This application is configured for deployment to Google Cloud Platform App Engine.

### Quick Deploy

```bash
# Verify your setup
./verify-deployment.sh

# Deploy to App Engine
./deploy.sh
```

### Detailed Documentation

- [📖 Full Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [🔐 GitHub Actions Setup](./GITHUB_SECRETS.md) - CI/CD configuration

### Deployment Files

- `app.yaml` - App Engine configuration (Express server)
- `app.yaml.static` - Alternative static file serving configuration
- `Dockerfile` - Container configuration
- `server.js` - Production Express server
- `deploy.sh` - Deployment script
- `verify-deployment.sh` - Pre-deployment verification

## Project Structure

```
control-desk-web/
├── src/
│   ├── api/              # API client functions
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── store/            # Zustand stores
│   ├── ui-components/    # Reusable UI components
│   ├── utils/            # Utility functions
│   ├── schemas/          # Form schemas
│   ├── i18n/             # Internationalization
│   ├── App.jsx           # Main app component
│   └── main.jsx          # App entry point
├── public/               # Static assets
├── .github/workflows/    # GitHub Actions
└── package.json          # Dependencies
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_NODE_ENV=development
```

See `.env.example` for a complete list of available variables.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm start` - Start production server (after build)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## License

Private - All rights reserved

## Support

For issues or questions, please contact the development team.

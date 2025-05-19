# Talky Frontend

Talky is a modern, all-in-one multilingual communication platform. It offers real-time chat, instant translation, speech-to-speech, text scanning, file sharing, and more—all in one seamless experience.

## Features

- Real-time multilingual chat
- Open text and document translation
- Speech-to-speech translation
- Text scanner for images and PDFs
- Secure file and media sharing
- AI-powered FAQ and accessibility tools

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file in the root of the frontend directory with any required environment variables (e.g., API endpoints, keys). **Do not commit sensitive keys to public repos.**

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will start on [http://localhost:5173](http://localhost:5173) by default.

### Proxy Setup

API requests to `/api` are proxied to the backend server (default: `http://localhost:5000`).

## Project Structure

- `src/pages/` — Main pages (Landing, Chat, Services, etc.)
- `src/components/` — Reusable UI components
- `src/store/` — State management (Zustand)
- `src/assets/` — Images and static files

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

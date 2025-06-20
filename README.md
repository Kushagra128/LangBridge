# Deployment Note for Vercel

**Important:**

- This project is structured for deployment on Vercel with the following limitations:
  - No WebSockets (socket.io is not supported on Vercel serverless functions).
  - No Python subprocesses (TTS and speech-to-text features will not work unless rewritten in Node.js or provided as an external API).
  - Only REST API endpoints that do not require Python or sockets are supported.

---

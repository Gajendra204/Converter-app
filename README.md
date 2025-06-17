# File Converter Application

A full-stack application that enables users to convert various types of files including documents, videos, and audio files.

## Features

- Document conversion (PDF services)
- Video format conversion
- Audio format conversion
- User authentication
- File upload and download
- Modern, responsive UI

## Tech Stack

### Frontend
- React with Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- React Dropzone for file uploads
- Firebase Authentication

### Backend
- Node.js & Express
- Firebase Admin SDK
- Adobe PDF Services
- Fluent-ffmpeg for media conversion
- Multer for file handling

## Project Structure

```
converter-app/
├── client/              # Frontend React application
│   ├── src/
│   └── package.json
└── server/              # Backend Express application
    ├── routes/
    │   ├── authRoutes.js
    │   ├── documentRoutes.js
    │   ├── videoRoutes.js
    │   └── audioRoutes.js
    ├── app.js
    ├── server.js
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Adobe PDF Services credentials

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_CONFIG=your_firebase_config
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/documents/convert` - Convert documents
- `POST /api/videos/convert` - Convert video files
- `POST /api/audio/convert` - Convert audio files
- `GET /health` - API health check

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Adobe PDF Services for document conversion
- FFmpeg for media conversion
- Firebase for authentication and hosting

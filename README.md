# QR Code Generator - Premium Full-Stack Application

A modern, premium QR code generator with support for both text-to-QR and image-embedded QR codes. Built with React (Frontend) and Node.js/Express (Backend).

**Developed by Aadi in 2025**

## Features

✨ **Text to QR Code**
- Generate QR codes from any text, URL, or data
- Customizable size, colors, margins, and error correction levels
- Real-time preview

🎨 **Image-Embedded QR Codes**
- Upload your logo/image to embed in QR codes
- Professional branding for your QR codes
- High error correction for better readability

💎 **Modern Premium UI**
- Beautiful gradient backgrounds
- Glass-morphism effects
- Smooth animations and transitions
- Fully responsive design
- Tailwind CSS styling

## Screenshots

### Text QR Code Generator
![Text QR Generator](assets/Screenshot%202025-12-27%20193434.png)

### Image QR Code Generator (with Logo)
![Image QR Generator](assets/Screenshot%202025-12-27%20193521.png)

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **QRCode** - QR code generation
- **Sharp** - Image processing
- **Jimp** - Image manipulation
- **Multer** - File upload handling

## Installation

1. **Install all dependencies:**
```bash
npm run install-all
```

Or install manually:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Run Separately

**Backend only:**
```bash
npm run server
# or
cd backend && npm run dev
```

**Frontend only:**
```bash
npm run client
# or
cd frontend && npm run dev
```

## API Endpoints

### POST `/api/qr/text`
Generate QR code from text.

**Request Body:**
```json
{
  "text": "Your text here",
  "options": {
    "width": 500,
    "margin": 4,
    "darkColor": "#000000",
    "lightColor": "#FFFFFF",
    "errorCorrectionLevel": "M"
  }
}
```

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "text": "Your text here"
}
```

### POST `/api/qr/image`
Generate QR code with embedded image/logo.

**Request:** `multipart/form-data`
- `text`: Text to encode
- `image`: Image file
- `options`: JSON string with customization options

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "text": "Your text here"
}
```

### GET `/api/health`
Health check endpoint.

## Project Structure

```
qrgenerator/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── public/            # Static files (if needed)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── QRGenerator.jsx
│   │   │   ├── TextQRGenerator.jsx
│   │   │   └── ImageQRGenerator.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── tailwind.config.js # Tailwind configuration
├── package.json           # Root package.json
└── README.md
```

## Usage

1. **Text QR Code:**
   - Select "Text QR" tab
   - Enter your text/URL
   - Customize appearance (size, colors, etc.)
   - Click "Generate QR Code"
   - Download the generated QR code

2. **Image QR Code:**
   - Select "Image QR" tab
   - Enter your text/URL
   - Upload a logo/image
   - Customize appearance
   - Click "Generate QR Code with Logo"
   - Download the generated QR code

## Customization Options

- **Size**: 200px - 1000px
- **Margin**: 1 - 10
- **Dark Color**: Custom color for QR code pattern
- **Light Color**: Custom background color
- **Error Correction Level**: L, M, Q, H (for text QR)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

**Aadi** - 2025

Developed with ❤️ by Aadi in 2025.

## Security

See [SECURITY.md](SECURITY.md) for security guidelines and best practices.

**Important:** Never commit `.env` files or sensitive data to version control.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


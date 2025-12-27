import express from 'express';
import cors from 'cors';
import multer from 'multer';
import QRCode from 'qrcode';
import sharp from 'sharp';
import Jimp from 'jimp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Security headers middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Request logging middleware (sanitized)
app.use((req, res, next) => {
  // Only log method and path, not query params or body
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Test endpoint to verify QRCode library works (development only)
app.get('/api/qr/test', async (req, res) => {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }
  
  try {
    const testText = 'Hello World';
    const qrCodeDataURL = await QRCode.toDataURL(testText, { width: 200 });
    res.json({ 
      success: true, 
      message: 'QRCode library is working',
      qrCode: qrCodeDataURL 
    });
  } catch (error) {
    console.error('QRCode test error:', error.message);
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json({ 
      error: 'QRCode library error',
      ...(isDevelopment && { details: error.message })
    });
  }
});

// Input validation helper
const validateQRInput = (text) => {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Text must be a non-empty string' };
  }
  
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Text cannot be empty' };
  }
  
  // Limit text length to prevent abuse (QR codes have practical limits)
  if (trimmed.length > 2953) { // Maximum for QR code version 40
    return { valid: false, error: 'Text is too long. Maximum 2953 characters.' };
  }
  
  return { valid: true, text: trimmed };
};

// Generate QR code from text
app.post('/api/qr/text', async (req, res) => {
  try {
    const { text, options = {} } = req.body;
    
    // Validate input
    const validation = validateQRInput(text);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Sanitized logging - only log length, not content
    console.log('Generating QR code - text length:', validation.text.length);
    // Don't log user input to prevent data leakage

    // Validate and sanitize options
    const qrOptions = {
      errorCorrectionLevel: ['L', 'M', 'Q', 'H'].includes(options.errorCorrectionLevel) 
        ? options.errorCorrectionLevel 
        : 'M',
      margin: (typeof options.margin === 'number' && options.margin >= 1 && options.margin <= 10) 
        ? options.margin 
        : 4,
      color: {
        dark: /^#[0-9A-Fa-f]{6}$/.test(options.darkColor) ? options.darkColor : '#000000',
        light: /^#[0-9A-Fa-f]{6}$/.test(options.lightColor) ? options.lightColor : '#FFFFFF'
      },
      width: (typeof options.width === 'number' && options.width >= 200 && options.width <= 1000) 
        ? options.width 
        : 500
    };

    const qrCodeDataURL = await QRCode.toDataURL(validation.text, qrOptions);
    
    console.log('QR code generated successfully');
    
    res.json({
      success: true,
      qrCode: qrCodeDataURL,
      text: validation.text
    });
  } catch (error) {
    console.error('Error generating QR code:', error.message);
    // Don't expose stack traces in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json({ 
      error: 'Failed to generate QR code', 
      ...(isDevelopment && { details: error.message })
    });
  }
});

// Generate QR code from image (embed image in QR code)
app.post('/api/qr/image', upload.single('image'), async (req, res) => {
  try {
    const { text, options = {} } = req.body;
    const imageFile = req.file;

    // Validate input
    const validation = validateQRInput(text);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Process image to embed in QR code
    let processedImage;
    try {
      // Resize and process image
      const imageBuffer = await sharp(imageFile.buffer)
        .resize(150, 150, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toBuffer();

      processedImage = await Jimp.read(imageBuffer);
    } catch (error) {
      console.error('Error processing image:', error);
      return res.status(400).json({ error: 'Failed to process image' });
    }

    // Parse options if it's a string
    let parsedOptions = options;
    if (typeof options === 'string') {
      try {
        parsedOptions = JSON.parse(options);
      } catch (e) {
        parsedOptions = {};
      }
    }

    // Validate and sanitize options
    const qrOptions = {
      errorCorrectionLevel: 'H', // High error correction for embedded images
      margin: (typeof parsedOptions.margin === 'number' && parsedOptions.margin >= 1 && parsedOptions.margin <= 10) 
        ? parsedOptions.margin 
        : 4,
      color: {
        dark: /^#[0-9A-Fa-f]{6}$/.test(parsedOptions.darkColor) ? parsedOptions.darkColor : '#000000',
        light: /^#[0-9A-Fa-f]{6}$/.test(parsedOptions.lightColor) ? parsedOptions.lightColor : '#FFFFFF'
      },
      width: (typeof parsedOptions.width === 'number' && parsedOptions.width >= 200 && parsedOptions.width <= 1000) 
        ? parsedOptions.width 
        : 500
    };

    // Create QR code canvas
    const qrCodeDataURL = await QRCode.toDataURL(validation.text, qrOptions);
    
    // Convert data URL to buffer
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(base64Data, 'base64');
    
    // Load QR code with Jimp
    const qrImage = await Jimp.read(qrBuffer);
    
    // Calculate position to center the logo
    const logoSize = Math.min(qrImage.bitmap.width, qrImage.bitmap.height) * 0.2;
    processedImage.resize(logoSize, logoSize);
    
    const x = (qrImage.bitmap.width - processedImage.bitmap.width) / 2;
    const y = (qrImage.bitmap.height - processedImage.bitmap.height) / 2;
    
    // Composite the logo onto QR code
    qrImage.composite(processedImage, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.9
    });
    
    // Convert back to base64
    const finalBuffer = await qrImage.getBufferAsync(Jimp.MIME_PNG);
    const finalBase64 = finalBuffer.toString('base64');
    const finalDataURL = `data:image/png;base64,${finalBase64}`;

    res.json({
      success: true,
      qrCode: finalDataURL,
      text: validation.text
    });
  } catch (error) {
    console.error('Error generating QR code with image:', error.message);
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json({ 
      error: 'Failed to generate QR code',
      ...(isDevelopment && { details: error.message })
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'QR Generator API is running' });
});

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File upload error', details: err.message });
  }
  res.status(500).json({ 
    error: 'Internal server error', 
    details: err.message 
  });
});

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Test endpoint: http://localhost:${PORT}/api/qr/test`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50) + '\n');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the other process or use a different port.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});


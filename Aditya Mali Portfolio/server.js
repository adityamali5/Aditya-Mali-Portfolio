import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
const portfolioFile = path.join(dataDir, 'portfolio.json');
const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'uploads');

// Ensure storage directories exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(path.join(uploadsDir, 'certificates'))) {
  fs.mkdirSync(path.join(uploadsDir, 'certificates'), { recursive: true });
}
if (!fs.existsSync(path.join(uploadsDir, 'photos'))) {
  fs.mkdirSync(path.join(uploadsDir, 'photos'), { recursive: true });
}

// Body parsers (support up to 50mb base64 image uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, 'dist')));

// 1. GET /api/portfolio
app.get('/api/portfolio', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (fs.existsSync(portfolioFile)) {
    const data = fs.readFileSync(portfolioFile, 'utf-8');
    res.send(data);
  } else {
    res.json(null);
  }
});

// 2. POST /api/portfolio
app.post('/api/portfolio', (req, res) => {
  try {
    fs.writeFileSync(portfolioFile, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// 3. POST /api/upload
app.post('/api/upload', (req, res) => {
  try {
    const { image, filename = 'upload', folder = 'certificates' } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const base64Data = matches ? matches[2] : image;
    const ext = matches && matches[1].includes('png') ? '.png' : '.jpg';

    const cleanName = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    const targetFolder = path.join(uploadsDir, folder);
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

    const hasExt = cleanName.endsWith('.jpg') || cleanName.endsWith('.png') || cleanName.endsWith('.jpeg');
    const finalFileName = `${folder}_${Date.now()}_${cleanName}${hasExt ? '' : ext}`;
    const filePath = path.join(targetFolder, finalFileName);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const publicUrl = `/uploads/${folder}/${finalFileName}`;
    res.json({ success: true, url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Catch-all SPA route
app.get('*', (req, res) => {
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.send('Portfolio API server running. Vite dev server handles client on port 3000.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Portfolio backend server running at http://localhost:${PORT}`);
});

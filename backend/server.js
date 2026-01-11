import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
  origin: FRONTEND_URL || '*'
}));
app.use(express.json());

const DATA_FILE = join(__dirname, 'data.json');

const initData = () => {
  const fixed = ['bat', 'cmd', 'com', 'cpl', 'exe', 'scr', 'js'];
  return {
    fixedExtensions: fixed.map(ext => ({ extension: ext, blocked: 0 })),
    customExtensions: []
  };
};

const readData = () => {
  if (!existsSync(DATA_FILE)) {
    const data = initData();
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    console.error('파일 읽기 오류:', err);
    const data = initData();
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return data;
  }
};

const writeData = (data) => {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

if (!existsSync(DATA_FILE)) {
  writeData(initData());
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/fixed-extensions', (req, res) => {
  const data = readData();
  res.json(data.fixedExtensions.sort((a, b) => a.extension.localeCompare(b.extension)));
});

app.put('/api/fixed-extensions/:extension', (req, res) => {
  const { extension } = req.params;
  const { blocked } = req.body;
  const data = readData();
  const ext = data.fixedExtensions.find(e => e.extension === extension);
  
  if (!ext) {
    return res.status(404).json({ error: 'Extension not found' });
  }
  
  ext.blocked = blocked ? 1 : 0;
  writeData(data);
  res.json({ success: true });
});

app.get('/api/custom-extensions', (req, res) => {
  const data = readData();
  res.json(data.customExtensions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.post('/api/custom-extensions', (req, res) => {
  const { extension } = req.body;
  
  if (!extension) {
    return res.status(400).json({ error: 'Extension is required' });
  }
  
  const normalized = extension.toLowerCase().trim().replace(/^\.+/, '');
  
  if (!normalized || normalized.length > 20) {
    return res.status(400).json({ error: 'Invalid extension' });
  }
  
  const data = readData();
  
  if (data.fixedExtensions.some(e => e.extension === normalized)) {
    return res.status(400).json({ error: 'Already in fixed extensions' });
  }
  
  if (data.customExtensions.length >= 200) {
    return res.status(400).json({ error: 'Maximum 200 extensions' });
  }
  
  if (data.customExtensions.some(e => e.extension === normalized)) {
    return res.status(400).json({ error: 'Extension already exists' });
  }
  
  data.customExtensions.push({
    extension: normalized,
    created_at: new Date().toISOString()
  });
  writeData(data);
  res.json({ success: true, extension: normalized });
});

app.delete('/api/custom-extensions/:extension', (req, res) => {
  const { extension } = req.params;
  const data = readData();
  const idx = data.customExtensions.findIndex(e => e.extension === extension);
  
  if (idx === -1) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  data.customExtensions.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

app.get('/api/blocked-extensions', (req, res) => {
  const data = readData();
  const fixed = data.fixedExtensions.filter(e => e.blocked === 1).map(e => e.extension);
  const custom = data.customExtensions.map(e => e.extension);
  res.json({ fixed, custom, all: [...fixed, ...custom] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


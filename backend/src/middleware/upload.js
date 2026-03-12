const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.bin').toLowerCase().slice(0, 5);
    const safe = /^[a-zA-Z0-9.]+$/.test(ext) ? ext : '.bin';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safe}`;
    cb(null, name);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype);
  if (allowed) cb(null, true);
  else cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
};

const uploadOne = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('file');

function handleUpload(req, res, next) {
  uploadOne(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      return next(err);
    }
    next();
  });
}

module.exports = { handleUpload };

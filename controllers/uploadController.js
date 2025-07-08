const cloudinary = require('../config/cloudinary');

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'uploads' },
    (error, result) => {
      if (error) return res.status(500).json({ error: 'Upload failed' });
      res.json({ message: 'Uploaded', imageUrl: result.secure_url });
    }
  );

  stream.end(req.file.buffer);
};
const s3 = require("../config/s3");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const result = await s3.upload(params).promise();

    res.json({
      message: "Uploaded",
      imageUrl: result.Location, // S3 URL
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};

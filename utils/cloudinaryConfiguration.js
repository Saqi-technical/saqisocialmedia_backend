const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'saqisocials', // The folder in Cloudinary where you want to store images

    params: {
        resource_type: 'auto'

    },
});

const parser = multer({ storage });

const setupUploadImageMiddleware = (req, res, next) => {
    parser.single('image')(req, res, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ message: "File not uploaded", error: err });
        }
        if (req.file) {
            req.file.url = req.file.path; // Cloudinary provides the URL in the 'path' field
            console.log('Uploaded file URL:', req.file.url); // Log the URL
        }
        next();
    });
};
module.exports = {setupUploadImageMiddleware};
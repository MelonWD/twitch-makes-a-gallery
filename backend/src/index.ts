// Application deps
import express, { Request, Response} from 'express';
import path from 'path';
import multer from 'multer';

// Internal deps
import UploadRoute from './upload/upload.route';
import envionment from './config/environment';
import environment from './config/environment';

// Load the configuration into the environment files.
require('dotenv').config()

// Set the image upload directory.
// TODO: consider moving these folders within dist
const imageUploadDirectory = path.join(__dirname, environment.UPLOAD_ROOT)

const temporaryUploadDirectory = path.join(imageUploadDirectory, envionment.TEMPORARY_FOLDER_NAME)

const publishedUploadDirectory = path.join(imageUploadDirectory, envionment.PUBLISHED_FOLDER_NAME);

// Create a new instance of express
const app = express();

// Listen to provided port or 3000
const applicationPort = process.env.ENV || 3000;

// Setup upload so we can retrieve uploaded files.
const upload = multer({ dest: temporaryUploadDirectory })

// Setup the JSON parser so we can retrieve JSON bodies sent.
app.use(express.json());

// Endpoint for uploading an image
app.post('/upload', upload.single('file'), UploadRoute.postImage.bind(UploadRoute));

// Endpoint for retrieving the currently active image.
app.get('/image', UploadRoute.getImage.bind(UploadRoute));

// Static route pointing to our published files folder.
app.use('/images', express.static(publishedUploadDirectory));

// Listen on the application port.
app.listen(applicationPort, () => {
    console.log(`Listening on port ${applicationPort}`);
});

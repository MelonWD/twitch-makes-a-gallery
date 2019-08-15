// Application deps
import express, { Request, Response} from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { promises as fs } from 'fs';

// Internal deps
import UploadRoute from './upload/upload.route';
import UploadProcessor from './upload/upload.processor';
import environment from './config/environment';

// Load the configuration into the environment files.
require('dotenv').config()

// Set the image upload directory.
// TODO: consider moving these folders within dist
const imageUploadDirectory = path.join(__dirname, environment.UPLOAD_ROOT)

const temporaryUploadDirectory = path.join(imageUploadDirectory, environment.TEMPORARY_FOLDER_NAME)

const publishedUploadDirectory = path.join(imageUploadDirectory, environment.PUBLISHED_FOLDER_NAME);

const archivedFolderName = path.join(imageUploadDirectory, environment.ARCHIVED_FOLDER_NAME);

// Create a new instance of express
const app = express();

// Listen to provided port or 3000
const applicationPort = process.env.PORT || environment.port || 80;

// Setup upload so we can retrieve uploaded files.
const upload = multer({ dest: temporaryUploadDirectory })

// Setup the JSON parser so we can retrieve JSON bodies sent.
app.use(express.json());

// Add cors to each request
app.use(cors());

// Endpoint for uploading an image
app.post('/upload', upload.single('file'), UploadRoute.postImage.bind(UploadRoute));

// Endpoint for retrieving the currently active image.
app.get('/image', UploadRoute.getImage.bind(UploadRoute));

// Static route pointing to our published files folder that 
app.use('/images', express.static(publishedUploadDirectory));

// Listen on the application port.
app.listen(applicationPort, () => {
    console.log(`Listening on port ${applicationPort}`);
});


// Use a simple setTimeout to control the time between image displays
setInterval(cycleImages, 2000);

async function cycleImages() {
    const oldestFile = await UploadProcessor.getOldestFile(publishedUploadDirectory);

    if (!oldestFile) {
        return;
    }

    const currentTime = (new Date()).getTime();

    const isOlderThanTimeout = (currentTime - oldestFile.time > 20000);

    if (!isOlderThanTimeout) {
        return;
    }

    const nextFile = await UploadProcessor.getOldestFile(publishedUploadDirectory, 1);

    if (!nextFile) {
        return;
    }

    await fs.rename(path.join(publishedUploadDirectory, oldestFile.name), path.join(archivedFolderName, oldestFile.name));
}
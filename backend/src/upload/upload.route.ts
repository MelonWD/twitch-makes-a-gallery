// Application deps
import { Request, Response } from 'express';
import { promises as fs } from 'fs'
import path from 'path';

import UploadProcessor from './upload.processor';
import environment from '../config/environment';

// Class representing all the routes 
export class UploadRoute {
    
    // A string representing the path to the filesystem folder to store images.
    publishDirectory = path.join(__dirname, '..', environment.UPLOAD_ROOT, environment.PUBLISHED_FOLDER_NAME);

    async postImage(request: any, response: Response) {
        // Retrieve the file from the request.
        const { file, body } = request;

        if (!file) {
            return response
                .status(418)
                .send();
        }

        // Retrieve the name param from the body of the JSON.
        const { name } = body;

        // Check if the file is the correct type.
        const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif'];

        // If the mime type is a known mimetype.
        const hasImageMime = allowedImageTypes.find(type => file.mimetype.includes(type));

        // We need to return here as the image provided isn't in the correct format.
        if (!hasImageMime) {
            return response
                .status(415)
                .send({
                    'title': 'Incorrect image format',
                    'message': 'The image provided does not match a known image format'
                });
        }

        // TODO: check for naughty things in the image uploaded.
        const isImageNSFW = await UploadProcessor.isImageNSFW(file.path);

        // If the image is nsfw we should exit here before doing any further stuff, and remove it from our fs.
        if (isImageNSFW) {
            // Remove the file from our system.
            await fs.unlink(file.path);

            return response
                .status(415)
                .send({
                    'title': 'Possible NSFW image uploaded',
                    'message': 'The image you have provided has been flagged as not safe for work'
                });
        }

        // The newest filepath that represents where the file should move to.
        const newFilePath = path.join(this.publishDirectory, file.originalname);

        // Move the file to the published directory.
        await fs.rename(file.path, newFilePath);
        
        // The the exifdata on the image so we can store the author data there.
        if (name) {
            await UploadProcessor.setFileAuthor(newFilePath, name || '');
        }

        response.status(200).send();
    }    

    async getImage(request: any, response: Response) {
        // Retrieve the current oldest from the published directory.
        const oldestFile = await UploadProcessor.getOldestFile(this.publishDirectory);
        // The name of the author of the file, can be undefined.
        const authorName = await UploadProcessor.getFileAuthor(path.join(this.publishDirectory, oldestFile.name));
        // Respond with the file and the author so the information can be used on the front end.
        return response.send({
            file: `http://nathan.melon:3000/images/${encodeURIComponent(oldestFile.name)}`,
            author: authorName
        });
    }
}

// Export a singleton as default
export default new UploadRoute();

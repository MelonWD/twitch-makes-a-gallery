// Application deps
import { Request, Response } from 'express';
import { promises as fs } from 'fs'
import path from 'path';

import UploadProcessor from './upload.processor';
import environment from '../config/environment';

// Class representing all the routes 
export class UploadRoute {
    
    publishDirectory = path.join(__dirname, '..', environment.UPLOAD_ROOT, environment.PUBLISHED_FOLDER_NAME);

    async postImage(request: any, response: Response) {
        // TODO: find a better name for this field.
        const file = request.file;

        if (!file) {
            return response
                .status(418)
                .send();
        }

        const name = request.body.name;

        // Check if the file is the correct type.
        const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif'];

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
        const imageSearchAnnotations = await UploadProcessor.getImageAnnotations(file.path);

        // Check if any of the values, other than spoof, don't equal VERY_UNLIKEY
        const isImageNSFW = ["adult", "medical", "racy", "violence"].find(key => imageSearchAnnotations[key] !== 'VERY_UNLIKELY');

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

        const newFilePath = path.join(this.publishDirectory, file.originalname);

        await fs.rename(file.path, newFilePath);
        
        if (name) {
            await UploadProcessor.setFileAuthor(newFilePath, name || '');
        }

        response.status(200).send();
    }    

    async getImage(request: any, response: Response) {
        const oldestFile = await UploadProcessor.getOldestFile(this.publishDirectory);

        const authorName = await UploadProcessor.getFileAuthor(path.join(this.publishDirectory, oldestFile.name));

        response.send({
            file: `http://localhost:3000/images/${encodeURIComponent(oldestFile.name)}`,
            author: authorName
        });
    }
}

// Export a singleton as default
export default new UploadRoute();

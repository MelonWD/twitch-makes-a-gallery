import exiftool from 'node-exiftool';
import { promises as fs } from 'fs'
import path from 'path';
import * as vision from '@google-cloud/vision';

export class UploadProcessor {
    async setFileAuthor(filepath: string, name: string) {
        const ep = new exiftool.ExiftoolProcess();

        await ep.open();

        return ep.writeMetadata(filepath, { Creator: name }, ['overwrite_original']);
    }

    async getFileAuthor(filepath: string) {
        const ep = new exiftool.ExiftoolProcess();

        await ep.open();

        const { data } = await ep.readMetadata(filepath, ['-File:all']);

        return data[0].Creator;
    }

    async getImageAnnotations(imagePath: string) {
        const client = new vision.ImageAnnotatorClient();

        const v = vision;

        const request = {
            image: {
              source: {
                  filename: imagePath
                }
            },
            features: [{ type: 'SAFE_SEARCH_DETECTION' }]
          };

        const [result] = await client.annotateImage(request);
        return result.safeSearchAnnotation;
    }

    async isImageNSFW(filePath: string) {
        const imageSearchAnnotations = await this.getImageAnnotations(filePath);

        return ["adult", "medical", "racy", "violence"]
                .find(key => imageSearchAnnotations[key] !== 'VERY_UNLIKELY');
    }

    /**
     * Returns the oldest file from a directory.
     * @param directoryPath The directory to search
     */
    async getOldestFile(directoryPath: string, index: number = 0) {
        let files: string[] | {
            name: string,
            time: number
        }[] = await fs.readdir(directoryPath);
        
        // We need to retrieve all of the time values from the filesystem
        // as sort is required to be sync.
        files = await Promise.all(files.map(async (f) => {
            const absoluteFilePath = path.join(directoryPath, f);

            return {
                name: f,
                time: (await fs.stat(absoluteFilePath)).mtime.getTime()
            }
        }));

        // Sort the files based on their modified time,
        files.sort((a, b) => {
            return a.time - b.time
        });

        // Return the oldest file.
        return files[index];
    }
}

export default new UploadProcessor();
import exiftool from 'node-exiftool';
import { promises as fs } from 'fs'
import path from 'path';
import * as vision from '@google-cloud/vision';

export class UploadProcessor {
    /**
     * 
     * @param filePath 
     * @param name 
     */
    async setFileAuthor(filePath: string, name: string) {
        const ep = new exiftool.ExiftoolProcess();

        await ep.open();

        // Write the name into the creator field within the exif data, replacing any
        // content which may exist.
        return ep.writeMetadata(filePath, { Creator: name }, ['overwrite_original']);
    }

    /**
     * Retrieved the `Creator` field from the exifdata on the file.
     * @param filePath A string representing the file path.
     */
    async getFileAuthor(filePath: string) {
        const ep = new exiftool.ExiftoolProcess();

        await ep.open();

        const { data } = await ep.readMetadata(filePath, ['-File:all']);

        // As exifdata may be an array, grab the first instance (as we didn't specify one in the write)
        // and retrieve the creator from that.
        return data[0].Creator;
    }

    /**
     * Retrieves the safe search annotations on the image.
     * @param filePath A string representing the file path.
     */
    async getImageAnnotations(filePath: string) {
        const client = new vision.ImageAnnotatorClient();

        // Object defining the request options,
        // with the features being safe search.
        const request = {
            image: {
              source: {
                  filename: filePath
                }
            },
            features: [{ type: 'SAFE_SEARCH_DETECTION' }]
          };

        // Request and unpack the annotations for the image.
        const [result] = await client.annotateImage(request);

        return result.safeSearchAnnotation;
    }

    /**
     * Returns a boolean value based on the annotations returned by the image.
     * @param filePath A string representing the file path.
     */
    async isImageNSFW(filePath: string) {
        const imageSearchAnnotations = await this.getImageAnnotations(filePath);

        return ["adult", "medical", "racy", "violence"]
                .find(key => {
                    const value = imageSearchAnnotations[key];
                    return value !== 'VERY_UNLIKELY';
            });
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
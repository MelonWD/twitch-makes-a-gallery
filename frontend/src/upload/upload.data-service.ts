import axios from 'axios';

export class UploadDataService {
    
    async postImage(imageFile: any, name: string) {
        const formData = new FormData();

        formData.append("file", imageFile);
        formData.append("name", name);

        return axios.post('http://nathan.melon:3000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
    }

    async getImage() {
        return axios.get('http://nathan.melon:3000/image');
    }
}

export default new UploadDataService();
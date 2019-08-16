import axios from 'axios';
import environment from './../environment';

export class UploadDataService {
    
    async postImage(imageFile: any, name: string) {
        const formData = new FormData();

        formData.append("file", imageFile);
        formData.append("name", name);

        return axios.post(`${environment.api_url}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
    }

    async getImage() {
        return axios.get(`${environment.api_url}/image`);
    }
}

export default new UploadDataService();
import axios from 'axios';

const apiImage = axios.create(
  {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: process.env.NEXT_PUBLIC_API_KEY ? `Bearer ${process.env.NEXT_PUBLIC_API_KEY}` : ''
    }
  }
);

export default apiImage;

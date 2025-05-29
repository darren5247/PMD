import { getCookie } from '@src/utils/cookies';
import axios from 'axios';

const api = axios.create(
  {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.NEXT_PUBLIC_API_KEY ? `Bearer ${process.env.NEXT_PUBLIC_API_KEY}` : ''
    }
  }
);

export const userAPI = axios.create(
  {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getCookie('jwt')}`
    }
  }
);

export default api;

import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

// export const api = axios.create({
//   baseURL: 'https://notehub-api.goit.study',
//     withCredentials: true,
// });



export const api = axios.create({
  baseURL: 'https://nodejs-hw-mail-and-img.onrender.com',
  withCredentials: true,
});
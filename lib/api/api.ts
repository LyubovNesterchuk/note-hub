
import axios from "axios";

// export const nextServer = axios.create({
//   baseURL: "/api",
//   withCredentials: true,
// });



// ---------------2 ++

// const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

// export const nextServer = axios.create({
//   baseURL: baseURL,
//   withCredentials: true,
// });


// ----------------1

// const nextServer = axios.create({
//   baseURL: 'http://localhost:3000/api',
//   withCredentials: true, 
// });



const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";;

export const nextServer = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
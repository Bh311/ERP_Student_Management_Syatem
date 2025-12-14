import axios from 'axios';

const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      // 1. Retrieves the token from localStorage
      const token = localStorage.getItem('token');
      
      // 2. Attaches the token in the required Bearer format
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Correctly sets 'Authorization: Bearer <token>'
      }
      
      // 3. Returns the modified configuration
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
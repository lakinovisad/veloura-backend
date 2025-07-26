import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002/api', // koristi port backend servera
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 
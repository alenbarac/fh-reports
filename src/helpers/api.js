import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api-reports.fishinhole-integration.commer.com/api',
  withCredentials: true,
});

export default apiClient;

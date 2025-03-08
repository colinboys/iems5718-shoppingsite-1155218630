// src/utils/request.js 或 src/main.js
import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://13.215.48.147',  // 替换为你的EC2公网IP
    // baseURL: 'http://localhost:8000'
    timeout: 5000,
});

export default instance;
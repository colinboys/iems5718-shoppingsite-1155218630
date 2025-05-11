import axios from 'axios'

const request = axios.create({
    // baseURL: 'https://s20.iems5718.ie.cuhk.edu.hk:8000',  // 更新为你的域名
    baseURL: 'http://localhost:8000',  // 更新为你的域名
    timeout: 5000
})

export default request;
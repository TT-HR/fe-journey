import axios from "axios"

const api = axios.create({
    baseURL:"/api",
    timeout:8000
})
// 请求拦截器
api.interceptors.request.use(
    (config)=>{
        console.log("开始请求",config.url)
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
)

//返回拦截器
api.interceptors.response.use(
    (response)=>{
        return response.data
    },
    (error)=>{
        console.log("请求错误",error)
        alert("网络错误，请稍后重试")
        return Promise.reject(error)
    }
)

export default api
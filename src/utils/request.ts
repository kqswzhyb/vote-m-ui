import axios from 'axios'
import { Toast } from 'vant'
import router from '../router'
import store from '../store/index'

const request = axios.create({
  baseURL: 'http://localhost:7001/api',
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => {
    const token = (store as any).state.common.token || localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    //在请求发出之前进行一些操作
    return config
  },
  (err) => {
    //Do something with request error
    return Promise.reject(err)
  }
)
//添加一个响应拦截器
request.interceptors.response.use(
  (res) => {
    if (res.data.code === '1') {
      Toast.fail(res.data.message)
      return Promise.reject(res.data)
    }
    //在这里对返回的数据进行处理
    return res
  },
  (err) => {
    //Do something with response error
    if (err?.response?.status === 401) {
      localStorage.removeItem('token')
      Toast.fail('登录状态已过期失效')
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default request

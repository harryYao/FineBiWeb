import axios from 'axios'
import store from '../store'

const service = axios.create({
  baseURL: process.env.BASE_API,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
})


// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  // console.log(store.getters.token)
  // if (store.getters.token) {
  //   config.headers['Authorization'] = store.getters.token // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  // }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  // response => response.data,
  response => {
    console.log('response' , response);
    const res = response.data;
    if (res.data) {
      return res.data;
    } else if (res.errorCode){
      this.$message.error(res.errorMsg);
      return res;
    } else {
      return res;
    }
  }, function(error) {
    console.log(error.response.status)
  }
)

export default service
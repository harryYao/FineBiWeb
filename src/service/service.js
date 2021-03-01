import axios from 'axios'
import Vue from 'vue'

const service = axios.create({
  timeout: 20000
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
  response => {
    if (response.status === 200) {
      const res = response.data;
      if (res.success) {
        return Promise.resolve(res);
      } else {
        Vue.prototype.$message.error(res.errorMsg);
        return Promise.reject(res).catch((e)=>{});
      }
    }
  }, error => {
    return Promise.reject(error).catch((error)=>{});
  }
)

export default service
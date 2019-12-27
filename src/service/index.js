import axios from 'axios'

const service = axios.create({
  baseURL: process.env.BASE_API
})


// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  // console.log(config)
  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  // }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => response,
)

export default service
import axios from 'axios'
import store from '../store/index'
import API from '../config/api'
import CONST from '../config/const'

/**
 * http response 拦截器
 * 统一处理返回的错误消息
 */
axios.interceptors.response.use(
  response => {

  },
  error => {
    let data = error && error.response && error.response.data
    if (data) {
      Message({
        type: 'error',
        dangerouslyUseHTMLString: true,
        message: data.status ? `<strong>错误 ${data.status}</strong> : ${data.message}` : data
      })
      return Promise.reject(error.response)
    } else {
      Message({
        type: 'error',
        dangerouslyUseHTMLString: true,
        message: '服务器无响应，请联系管理员。'
      })
      return Promise.reject()
    }
  },
)

export default axios

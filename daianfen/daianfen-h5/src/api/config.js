
import axios from 'axios';
import router from '../router/index'
import Vue from '../main'

axios.defaults.timeout = 60000; //响应时间
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
let URL = ''
if (process.env.NODE_ENV === 'production') {
  URL = location.origin + location.pathname.match(/^\/\w+/g)[0] + '/employee';
} else {
  URL = '/triumph/employee'
};
axios.defaults.baseURL = URL;
axios.interceptors.response.use((res) => {
  if (res.data.errCode == 0) {
    return Promise.resolve(res);
  } else {
    if(res.data.errCode === 401) {
      Vue.$router.replace("/login");
    }
    Vue.$vux.toast.show({ text: res.data.errMsg, type: 'text' })
    return Promise.reject(res);
  };
}, (error) => {
  return Promise.reject(error);
});

export default {
  post(url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        })
    })
  },
  get(url, params) {
    return new Promise((resolve, reject) => {
      axios.get(url, { params: params })
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        })
    })
  },
  upLoad(url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, { params: params }, {
        headers: {
          "Content-Type":"multipart/form-data", 
        }
      })
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        })
    })
  }

}
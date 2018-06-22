import axios from 'axios';
import qs from 'qs';
import router from '../router/index'
// import Vue from 'vue'
import Vue from '../main'
import { Message } from 'element-ui';
axios.defaults.timeout = 60000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'; //配置请求头
let URL = ''
if (process.env.NODE_ENV === 'production') {
  URL = location.origin + location.pathname.match(/^\/\w+/g)[0] + '/triumph/admin';
} else {
  URL = '/triumph/admin'
};
axios.defaults.baseURL = URL;

//POST传参序列化(添加请求拦截器)
// axios.interceptors.request.use((config) => {
//     //在发送请求之前做某件事
//     if (config.method === 'post') {
//         config.data = qs.stringify(config.data);
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
  // console.log('返回状态判断', res.data.errCode)
  // if (res.data.errCode == 50103) {
  //   console.log(res.data.errCode)
  // }
  // debugger
  if ( res.data.errCode === 0 ) {
    return res;
    // console.log(res.data)
  } else {
    if (res.data.errCode === 401) {
      Vue.$router.replace("/login");
    }
    Message.error(res.data.errMsg);
    // Vue.$router.replace("/login");
    return Promise.reject(res);
  }
}, function axiosRetryInterceptor (err) {
  // Message.error('请求超时');
  // alert('请求超时')
  // console.log(Vue.$router)
  // Vue.$router.replace("/login");
})
export default {
  //返回一个Promise(发送请求)
  post2: function (url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, params, {
        traditional: true,
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
  },

  post: function (url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(params))
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

  postJson: function (url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, params, {
        headers: {
          "Content-Type": "application/json",
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
  },

  get: function (url, params) {
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
  put: function (url, params) {
    return new Promise((resolve, reject) => {
      axios.put(url, qs.stringify(params))
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
  delete: function (url, params) {
    return new Promise((resolve, reject) => {
      axios.delete(url, { params: params })
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

}
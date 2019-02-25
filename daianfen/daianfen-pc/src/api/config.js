import axios from 'axios';
import qs from 'qs';
import Vue from "../main.js";
import { Message, MessageBox } from 'element-ui';
import base from '../assets/js/base'

axios.defaults.timeout = 60000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头

axios.defaults.baseURL =  base.projectName();

//添加请求拦截器)
// axios.interceptors.request.use((config) => {
//     //在发送请求之前做某件事
//     
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((success) => {
  if (success.data.errCode == 0) {
    return Promise.resolve(success);
  } else {
    if(success.data.errCode == 401){
      // Vue.$router.replace('/')
      MessageBox.confirm(success.data.errMsg, '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          Vue.$router.replace('/')
        })
        .catch(() => {
          return
        })
    }
    Message.error(success.data.errMsg);
    return Promise.reject(success);
  };
}, (error) => {
  return Promise.reject(error);
});
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
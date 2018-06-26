
let host = 'http://192.168.1.32:8080/triumph/app'; // 宁
// let host = 'http://192.168.1.18:8088/triumph/app'; // 华
// let host = 'https://triumph.wego168.com/triumph/app'; //线上
// 

// 用来获取storage 中的sessionKey  添加到 data中的参数里面;
let getSessionKey = (data) => {
  data.sessionKeyId = wx.getStorageSync('sessionKeyId');
  return data;
}

let wxPromisify = (fn) => {
  return (obj = {}) => {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res) //成功
      }
      obj.fail = function (res) {
        reject(res) //失败
      }
      fn(obj)
    })
  }
}

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

/**
 * get方法;
 * url 请求地址
 * data 请求参数
 */
let get = (url, data, isSessionKey = false) => {
  // 是否需要sessionKey;
  if (isSessionKey) data = getSessionKey(data);
  var get = wxPromisify(wx.request)
  return get({
    url: host+url,
    method: 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json'
    }
  })
}


/**
 * post方法;
 * url 请求地址
 * data 请求参数
 * isSessionKey 是否需要sessionKey
 */
let post = (url, data, isSessionKey = false) => {
  // 是否需要sessionKey;
  if (isSessionKey) data = getSessionKey(data);
  var post = wxPromisify(wx.request)
  return post({
    url: host+url,
    method: 'POST',
    data: data,
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
  })
}

/**
 * put方法;
 * url 请求地址
 * data 请求参数
 */
let put = (url, data, isSessionKey = false) => {
  // 是否需要sessionKey;
  if (isSessionKey) data = getSessionKey(data);
  var post = wxPromisify(wx.request)
  return post({
    url: host+url,
    method: 'PUT',
    data: data,
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
  })
}

/**
 * del方法;
 * url 请求地址
 * data 请求参数
 */
let del = (url, data, isSessionKey = false) => {
  // 是否需要sessionKey;
  if (isSessionKey) data = getSessionKey(data);
  var del = wxPromisify(wx.request)
  return delete ({
    url: host+url,
    method: 'DELETE',
    data: data,
  })
}

module.exports = {
  post: post,
  get: get,
  delete: del,
  put: put,
  getSessionKey: getSessionKey
}
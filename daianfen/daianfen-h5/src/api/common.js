import fetch from './config';

export default {
  getProductList() {
    return fetch.get(url, params);
  },
  getWeixin(data) {
    return fetch.get(`/coupons/getJsApiTicket`, data);
  }
};

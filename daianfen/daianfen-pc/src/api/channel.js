import fetch from './config';

const channel = {
  // 渠道商列表
  listChannel(params) {
    return fetch.get('api/admin/v1/channel/page', params)
  },
  // 添加渠道商
  addChannel(params) {
    return fetch.post('api/admin/v1/channel/insert', params)
  },
  // 添加渠道
  addChannelCode(params) {
    return fetch.post('api/admin/v1/channel_code/insert', params)
  },
  // 获取渠道
  getChannelCode(params) {
    return fetch.get('api/admin/v1/channel_code/get', params)
  },
  // 修改渠道
  updateChannelCode(params) {
    return fetch.post('api/admin/v1/channel_code/update', params)
  },
  // 渠道列表
  listChannelCode (params) {
    return fetch.get('api/admin/v1/channel_code/page', params)
  },
}

export default channel
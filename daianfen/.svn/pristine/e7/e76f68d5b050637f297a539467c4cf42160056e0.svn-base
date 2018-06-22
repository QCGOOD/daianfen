import fetch from './config';

const app = {
  // 新增应用
  addApp(params) {
    return fetch.postJson('api/admin/v1/app/insert', params)
  },
  // 获取应用
  getApp(params) {
    return fetch.get('api/admin/v1/app/get', params)
  },
  // 更新应用
  updateApp(params) {
    return fetch.postJson('api/admin/v1/app/update', params)
  },
  // 删除应用
  deleteApp(params) {
    return fetch.post('api/admin/v1/app/delete', params)
  },
}

export default app

import fetch from './config';

const activity = {
  // 标签列表
  listTag(params) {
    return fetch.get('api/admin/v1/tag/page', params)
  },
  // 添加标签
  addTag(params) {
    return fetch.postJson('api/admin/v1/tag/insert', params)
  },
  // 更新标签
  updateTag(params) {
    return fetch.postJson('api/admin/v1/tag/update', params)
  },
  // 查看标签
  getTag(params) {
    return fetch.get('api/admin/v1/tag/get', params)
  },
  // 删除标签
  deleteTag(params) {
    return fetch.post('api/admin/v1/tag/delete', params)
  },

  // 活动列表
  listActivity(params) {
    return fetch.get('api/admin/v1/activity/page', params)
  },
  // 添加活动
  addActivity(params) {
    return fetch.postJson('api/admin/v1/activityTemp/insert', params)
  },
  // 更新活动
  updateActivity(params) {
    return fetch.postJson('api/admin/v1/activityTemp/update', params)
  },
  // 查看活动
  getActivity(params) {
    return fetch.get('api/admin/v1/activity/get', params)
  },
  // 删除活动
  deleteActivity(params) {
    return fetch.post('api/admin/v1/activity/delete', params)
  },
  // 发布
  updateRelease(params) {
    return fetch.post('api/admin/v1/activity/updateRelease', params)
  },

  // 活动报名列表
  activitySign(params) {
    return fetch.get('api/admin/v1/activitySign/page', params)
  },
  // 获取活动报名的字段
  signDataSetting(params) {
    return fetch.get('api/admin/v1/signDataSetting/listBySourceId', params)
  },
  // 报名审核
  auditSign(params) {
    return fetch.postJson('api/admin/v1/activitySign/audit', params)
  },

  // 获取系统字段列表
  getSignDataSetting() {
    return fetch.get('api/admin/v1/signDataSetting/list')
  },
  // 保存字段
  saveSignDataSetting(params) {
    return fetch.postJson('api/admin/v1/signDataSetting/save', params)
  },

  // 签到列表
  listCheckin(params) {
    return fetch.get('api/admin/v1/checkin/page', params)
  },

  // 评论列表
  listComment(params) {
    return fetch.get('api/admin/v1/comment/page', params)
  },
  // 审核评论
  auditComment(params) {
    return fetch.post('api/admin/v1/comment/audit', params)
  },
  // 拒绝评论
  refuseComment(params) {
    return fetch.post('api/admin/v1/comment/refuse', params)
  },
  // 删除评论
  deleteComment(params) {
    return fetch.post('api/admin/v1/comment/delete', params)
  },
}

export default activity

import fetch from './config';

const level = {
  // 新增等级分类
  addLevelType(params) {
    return fetch.postJson('accelerator/api/admin/v1/level_type/add', params)
  },
  // 获取等级分类
  getLevelType(params) {
    return fetch.get('api/admin/v1/level_type/item', params)
  },
  // 更新等级分类
  updateLevelType(params) {
    return fetch.postJson('api/admin/v1/level_type/update', params)
  },
  // 新增等级配置
  addLevelConfig(params) {
    return fetch.postJson('api/admin/v1/level_config/add', params)
  },
  // 获取等级配置
  getLevelConfig(params) {
    return fetch.get('api/admin/v1/level_config/item', params)
  },
  // 更新等级配置
  updateLevelConfig(params) {
    return fetch.postJson('api/admin/v1/level_config/update', params)
  },
  // 删除等级配置
  deleteLevelConfig(params) {
    return fetch.post('api/admin/v1/level_config/delete', params)
  },

  // 新增经验来源
  addLevelSource(params) {
    return fetch.postJson('api/admin/v1/level_experience_source/add', params)
  },
  // 获取经验来源
  getLevelSource(params) {
    return fetch.get('api/admin/v1/level_experience_source/item', params)
  },
  // 更新经验来源
  updateLevelSource(params) {
    return fetch.postJson('api/admin/v1/level_experience_source/update', params)
  },
  // 删除经验来源
  deleteLevelSource(params) {
    return fetch.post('api/admin/v1/level_experience_source/delete', params)
  },
}

export default level

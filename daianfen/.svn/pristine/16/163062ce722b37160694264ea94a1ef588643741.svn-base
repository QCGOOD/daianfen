import fetch from './config';

const power = {
  // 新增账号
  addAccount(params) {
    return fetch.postJson('api/v1/admin/account/add', params)
  },
  // 获取账号
  getAccount(params) {
    return fetch.get('api/v1/admin/account/get', params)
  },
  // 更新账号
  updateAccount(params) {
    return fetch.postJson('api/v1/admin/account/update', params)
  },
  // 删除账号
  deleteAccount(params) {
    return fetch.post('api/v1/admin/account/delete', params)
  },
  // 修改账号密码
  updatePwd(params) {
    return fetch.postJson('api/v1/admin/account/updatePwd', params)
  },

  // 新增角色
  addRole(params) {
    return fetch.postJson('api/v1/admin/role/add', params)
  },
  // 获取角色
  getRole(params) {
    return fetch.get('api/v1/admin/role/get', params)
  },
  // 更新角色
  updateRole(params) {
    return fetch.postJson('api/v1/admin/role/update', params)
  },
  // 删除角色
  deleteRole(params) {
    return fetch.post('api/v1/admin/role/delete', params)
  },
  // 设置角色的权限
  updatePermissionByRole(params) {
    return fetch.post('api/v1/admin/rolePermission/updatePermissionByRole', params)
  },

  // 获取管理菜单树结构
  manageMenuTree() {
    return fetch.get('api/v1/admin/permission/manageMenuTree')
  },
  // 获取管理权限的树结构
  permissionTree() {
    return fetch.get('api/v1/admin/permission/tree')
  },
  // 根据菜单节点获取权限列表
  listByParentId(params) {
    return fetch.get('api/v1/admin/permission/listByParentId', params)
  },
  // 新增菜单（权限）
  addPermission(params) {
    return fetch.postJson('api/v1/admin/permission/add', params)
  },
  // 更新菜单（权限）
  updatePermission(params) {
    return fetch.postJson('api/v1/admin/permission/update', params)
  },
  // 获取菜单（权限）
  getPermission(params) {
    return fetch.get('api/v1/admin/permission/get', params)
  },
  // 删除菜单（权限）
  deletePermission(params) {
    return fetch.post('api/v1/admin/permission/delete', params)
  },
}

export default power

import fetch from './config';

const product = {
  // 查看订单
  getOrder(params) {
    return fetch.get('api/v1/admin/order/get', params)
  },
  // 修改订单物流
  updateLogistics(params) {
    return fetch.postJson('api/v1/admin/order/updateLogistics', params)
  },

  // 查询品牌品牌 
  getbrand(params) {
    return fetch.get('api/v1/admin/brand/get', params)
  },
  // 添加品牌
  saveBrand(params) {
    return fetch.postJson('api/v1/admin/brand/add', params)
  },
  // 更新品牌
  updateBrand(params) {
    return fetch.postJson(`api/v1/admin/brand/update`, params)
  },
  // 删除品牌
  deleteBrand(params) {
    return fetch.post(`api/v1/admin/brand/delete`, params)
  },

  // 添加商品
  addProduct(params) {
    return fetch.postJson('api/v1/admin/product/add', params)
  },
  // 查看商品
  getProduct(params) {
    return fetch.get('api/v1/admin/product/get', params)
  },
  // 更新商品
  updateProduct(params) {
    return fetch.postJson('api/v1/admin/product/update', params)
  },
  // 删除商品
  deleteProduct(params) {
    return fetch.delete('api/v1/admin/product/delete', params)
  },

  // 品牌列表
  getBrandList(params) {
    return fetch.get('api/v1/admin/brand/page', params)
  },

  //账号列表
  getAccountList(params) {
    return fetch.get('api/v1/admin/account/page', params)
  },

  //商户列表
  getStoreList(params) {
    return fetch.get('api/admin/v1/store/page', params)
  },
  // 查询商户
  getStore(params) {
    return fetch.get('api/v1/admin/store/get', params)
  },
  //删除商户
  deleteStore(params) {
    return fetch.post('api/v1/admin/store/delete', params)
  },
  //添加商户
  addStore(params) {
    return fetch.postJson('api/v1/admin/store/add', params)
  },
  //更新客户
  updatetore(params) {
    return fetch.postJson('api/v1/admin/store/update', params)
  },
}

export default product

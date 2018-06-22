import fetch from './config';

const coupon = {
  // 优惠券规则列表
  listCouponRule(params) {
    return fetch.get('api/admin/v1/coupon_rule/list', params)
  },
  // 新增优惠券规则
  addCouponRule(params) {
    return fetch.post('api/admin/v1/coupon_rule/add', params)
  },
  // 获取优惠券规则
  getCouponRule(params) {
    return fetch.get('api/admin/v1/coupon_rule/item', params)
  },
  // 更新优惠券规则
  updateCouponRule(params) {
    return fetch.post('api/admin/v1/coupon_rule/update', params)
  },
  // 中止优惠券规则
  deleteCouponRule(params) {
    return fetch.post('api/admin/v1/coupon_rule/abort', params)
  },
  // 发布
  publish(params) {
    return fetch.post('api/admin/v1/coupon_rule/publish', params)
  },
  // 获取优惠券规则使用范围类型
  couponRuleType(params) {
    return fetch.get('api/admin/v1/coupon_rule/type', params)
  },
}

export default coupon

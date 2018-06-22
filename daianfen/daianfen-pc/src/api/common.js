import fetch from './config';
import activity from './activity'
import product from './product'
import power from './power'
import level from './level'
import lesson from './lesson'
import coupon from './coupon'
import channel from './channel'
import app from './app'
import category from './category'
import attachment from './attachment'

export default {
  // 加速  accelerator
  //用户登录
  login(data) {
    return fetch.post('ajaxLogin', data);
  },
  //用户登录
  login2(data) {
    return fetch.post('login', data);
  },
  // 用户退出
  logout() {
    return fetch.post('ajaxLogout')
  },
  // 修改密码
  password(model) {
    return fetch.put(`admin/users/password`, model);
  },
  // 所有表格数据 通过此接口 统一发放
  table(url, data) {
    return fetch.get(url, data);
  },

  // 会员转分销者
  transferMember(params) {
    return fetch.post('api/admin/v1/distributer/transfer_member', params)
  },
  // 业务员审核
  distributerAudit(params) {
    return fetch.post('api/admin/v1/distributer/audit', params)
  },
  // 获取关注设置
  getFollow(params) {
    return fetch.get('/api/admin/v1/app_wechat_config/get', params)
  },
  // 是否开启关注
  follow(params) {
    return fetch.post('api/admin/v1/app_wechat_config/update', params)
  },

  // 应用
  ...app,

  // 权限
  ...power,

  // 分类
  ...category,

  // 商城
  ...product,

  // 活动
  ...activity,

  // 课程
  ...lesson,

  // 等级
  ...level,

  // 优惠券
  ...coupon,

  // 渠道
  ...channel,

  // 图片
  ...attachment,
}

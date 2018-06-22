// pages/common/couponItem/couponItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    },
    state: {
      type: Number,
      default: 2
    },
    imghead: {
      type: String,
      value: 'http://triumph-1255600302.file.myqcloud.com'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    detailToggle (e) {
      let index = e.currentTarget.dataset.index;
      let list = this.data.list;
      list.map((item, i) => {
        if (index === i) item.open = !item.open;
        else item.open = false;
      })
      this.setData({
        list: list
      })
    },
  }
})

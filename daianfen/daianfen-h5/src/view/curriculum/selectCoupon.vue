<template>
  <div class="select">
    <coupon-item v-for="(item, i) in list" :key="i" :index="i" type="select" :item="item" @click.native="check(item)"></coupon-item>
  </div>
</template>

<script>
import CouponItem from '../Common/couponItem'

export default {
  components: {
    CouponItem
  },
  data () {
    return {
      list: [
        { id: '1', price: 50, time: '2018.30.21', checked: false },
        { id: '2', price: 50, time: '2018.30.21', checked: false },
        { id: '3', price: 50, time: '2018.30.21', checked: false },
        { id: '4', price: 50, time: '2018.30.21', checked: true },
        { id: '5', price: 50, time: '2018.30.21', checked: false },
        { id: '6', price: 50, time: '2018.30.21', checked: false },
      ]
    }
  },
  methods: {
    check (params) {
      console.log(params.checked)
      this.list.map((item, i) => {
        if (params.id !== item.id) item.checked = false
      })
      params.checked = !params.checked 
    },
  }
}
</script>
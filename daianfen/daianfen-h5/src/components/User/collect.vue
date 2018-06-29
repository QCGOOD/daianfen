<template>
  <div class="collect">
    <act-item v-for="(item, i) in actList" :key="i" :item="item" type="collect"></act-item>
  </div>
</template>

<script>
import ActItem from '../Common/actItem'

export default {
  components: {
    ActItem
  },
  data () {
    return {
      actList: [
        { id: 'fssdfssdf', title: '到附近披萨叫批发商佛啊手机费怕视频地方', img: 'static/image/zanwei.jpg', typeText: '经济学', time: 'dsfsfsdfdsfd', price: 2432 },
        { id: 'fssdftreessdf', title: '到附近披萨叫批发商佛啊手机费怕视频地方', img: 'static/image/zanwei.jpg', typeText: '经济学', time: 'dsfsfsdfdsfd', price: 2432 },
        { id: 'dsfgdfg', title: '到附近披萨叫批发商佛啊手机费怕视频地方', img: 'static/image/zanwei.jpg', typeText: '经济学', time: 'dsfsfsdfdsfd', price: 2432 },
      ],
    }
  }
}
</script>
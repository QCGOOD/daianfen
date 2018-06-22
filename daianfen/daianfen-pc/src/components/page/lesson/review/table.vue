<template>
  <div>
     <el-table
      :data="tableData"
      :height="tHeight"
      style="width: 100%; border-top:1px solid #ccc;">
      <!-- <el-table-column width="55"></el-table-column> -->
      <el-table-column :prop="item.prop" :label="item.label" v-for="(item, i) in propData" :key="i" v-if="!item.template"></el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='iconUrl'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">
          <img style="display:block;margin:10px auto" :src="`${imgHost+scope.row[item.prop]}`" width="60" height="60">
        </template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='img'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">
          <img style="display:block;margin:10px auto" v-if="scope.row[item.prop].length > 0" :src="`${imgHost+scope.row[item.prop][0]}`" width="60" height="60" @click="carousel(scope.row[item.prop])">
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center; padding: 10px; 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="page.total">
    </el-pagination>
    <el-dialog :visible.sync="dialogImg" :modal-append-to-body="false">
      <el-carousel :interval="4000" height="200px" indicator-position="outside" :autoplay="false">
        <el-carousel-item v-for="(item, i) in imgList" :key="i">
          <img style="display:block;margin:10px auto" :src="`${imgHost+item}`" width="100" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    tableData: Array,
    propData: Array,
    activeIndex: String,
    page: Object,
    tHeight:Number
  },
  data() {
    return {
      dialogImg: false,
      imgList: [],
    }
  },
  created() {

  },
  mounted() {
    console.log(this.tHeight)
    console.log(this.tableData)
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('size-change', val)
    },
    handleCurrentChange (val) {
      this.$emit('current-change', val)
    },
    handleSelectionChange (val) {
      this.$emit('get-selection', val)
    },
    carousel(arr){
      this.imgList = arr
      this.dialogImg = true;
    }
  }
}
</script>
<style lang="less" scoped>

</style>



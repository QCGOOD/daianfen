import * as types from './mutations-types'

const mutations = {
  // 选中表格数据
  [types.TABLELIST](state, data) {
    state.tableList = data;
  },
  //表格数据id做导出
  [types.TABLEID](state, data) {
    state.tableId = data;
  },
  // 清空表格数据数组
  [types.CANCELLIST](state, data) {
    state.checkList.map((item, index) => {
      if (item.id === data.id) {
        state.checkList.splice(index, 1)
      }
      if (item.sourceId = data.sourceId) {
        state.checkList.splice(index, 1)
      }
    })
  },

}

export default mutations
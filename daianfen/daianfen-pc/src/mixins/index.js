import api from 'api/config'

export const TABLE = {
  data() {
    return {
      tableData: [],
      search: {
        curPage: 1,
        size: 20,
      },
    }
  },
  methods: {
    /**
     * 获取列表数据
     */
    onSearch() {
      api.get(this.tableApi, this.search).then(res => {
        this.tableData = res.data.content0.rows;
        this.search.total = res.data.content0.total;
      })
    },
    /**
     * 刷新搜索
     */
    onSearchRefresh() {
      this.search.curPage = 1
      this.onSearch()
    },
    /**
     * 修改每页条数
     */
    onChangeSize(size) {
      this.search.size = size
      this.search.curPage = 1
      this.onSearch()
    },
    /**
     * 修改页码
     */
    onChangePage(num) {
      this.search.curPage = num
      this.onSearch()
    },
  },
}

import { mapGetters, mapMutations } from 'vuex'
import QcTable from "../../components/common/QcTable";
export const tableMixin = {
  components: { QcTable },
  data() {
    return {
      domHeight: 0,
      wrapHeight: 0,
    }
  },
  computed: {
    ...mapGetters([
      'tableList'
    ])
  },
  methods: {
    searchKeep() {
      this.$refs.table.searchTableListKeep(this.searchData);
    },
    search() {
      this.$refs.table.searchTableList(this.searchData);
    },

  }
}

<template>
  <div class="pagination-container">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import api from "../../api";
export default {
  name: "ProductPagination",
  data() {
    return {
      currentPage: 1,
      total: 100,
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(val);
      console.log(`当前页: ${val}`);
      this.$bus.$emit("page", val);
    },
    getTotalData(){
      api.getTotal().then((res) => {
      // console.log(res.data);
      this.total = res.data.result[0]["count(*)"];
    });
    }
  },
  mounted() {
    console.log('分页');
    this.getTotalData();
  },
};
</script>

<style scoped>
.pagination-container {
  margin-top: 40px;
}
</style>
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
import api from '../api'
export default {
  name: "ProductPagination",
  data() {
    return {
      currentPage: 1,
    //   total: 100,
    };
  },
  props:{
      total:{
          type:[String,Number],
          default:0
      }
  },
  methods: {
    handleSizeChange(val) {
      
    },
    handleCurrentChange(val) {
      this.$bus.$emit("page", val);
    },
  },
  mounted() {
  },
};
</script>

<style scoped>
.pagination-container {
  margin-top: 40px;
}
</style>
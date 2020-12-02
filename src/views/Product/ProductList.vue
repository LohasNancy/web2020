<template>
  <div class="">
    <ElementTable :tableData="tableData" :cell-style="cellStyle">
      <el-table-column
        type="selection"
        width="55"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :multipleSelection="multipleSelection"
      ></el-table-column>
      <el-table-column prop="id" label="商品ID" width="80"> </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="title"
        label="商品名称"
        width="150"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="image"
        label="商品图片"
        width="100"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="sellPoint"
        label="商品卖点"
        width="250"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="price"
        label="商品价格"
        width="80"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="num"
        label="商品数量"
        width="80"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="descs" label="商品描述">
        <template show-overflow-tooltip slot-scope="scope">
          <div v-html="scope.row.descs" show-overflow-tooltip></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </ElementTable>
    <div style="margin-top: 20px; float: left">
      <el-button @click="toggleSelection1()">全部选择</el-button>
      <el-button @click="toggleSelection2()">取消选择</el-button>
    </div>
  </div>
</template>

<script>
import api from "../../api";
import ElementTable from "../../components/element-table/ElementTable.vue";

export default {
  components: { ElementTable },
  name: "ProductList",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      allLength: [],
    };
  },
  mounted() {
    this.http(1); //请求第一页数据
    this.$bus.$on("page", (val) => {
      this.http(val);
    });
    this.$bus.$on("searchData", (data) => {
      this.tableData = data;
    });
    this.$bus.$on("onRef", (data) => {
      this.http(1);
    });
  },
  methods: {
    http(page) {
      //启动loading
      const loading = this.$loading({
        lock: true,
        text: "loading……",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)",
      });
      api.getSelectTbItemAllByPage({ page }).then((res) => {
        // console.log(res.data);
        loading.close();
        this.tableData = res.data;
      });
    },
    handleEdit(index, row) {
      this.$bus.$emit("onEditor", row);
      // console.log("handleEdit");
      // console.log(index, row);
      // api.preUpdateItem({
      //   id:row.id
      // }).then(res=>{
      //   console.log(res.data);
      // })
    },
    handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.deleteItemById({ id: row.id }).then((res) => {
            if (res.data.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.http(1); //刷新页面
            } else {
              this.$message({
                type: "error",
                message: "删除失败！",
              });
            }
          });
        })
        .catch((error) => {
          this.$message({
            message: "取消删除！",
          });
        });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log("{row, column, rowIndex, columnIndex}");
      // console.log(row);
      if (row.num <= 10) {
        return {
          color: "brown",
          // fontWeight:"bolder",
        };
      } else {
        return {
          color: "green",
        };
      }
    },
    // 全部选择
    toggleSelection1() {
      console.log(this.$refs.multipleTable.$options.parent);
      let rows = this.$refs.multipleTable.$options.parent.$options.propsData
        .data;
      rows.forEach((rows) => {
        this.$refs.multipleTable.$options.parent.toggleRowSelection(rows);
      });
    },
    toggleSelection2() {
      this.$refs.multipleTable.$options.parent.clearSelection();
    },
    // toggleSelection(rows) {
    //   console.log(rows);
    //   // console.log(this.$refs);
    //   let test=this.$refs.multipleTable.$options.parent.$options.propsData.data;
    //   console.log(test);
    //   rows=test;
    //   if (rows) {
    //     rows.forEach((rows) => {
    //       console.log("***");
    //       console.log(rows);
    //       this.$refs.multipleTable.$options.parent.toggleRowSelection(rows);
    //       // this.$refs.multipleTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.multipleTable.$options.parent.clearSelection();
    //   }

    //   // this.handleSelectionChange(test);
    // },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
  },
};
</script>

<style scoped>
.el-table_1_column_2 .is-leaf .headerStyle {
  background-color: antiquewhite;
  color: brown;
  font-weight: bolder;
}
</style>
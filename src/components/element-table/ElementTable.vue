<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    :cell-style="cellStyle"
    ref="multipleTable"
  >
    <slot></slot>
  </el-table>
</template>

<script>
export default {
  name: "ElementTable",
  data() {
    return {
      // multipleTable
    };
  },
  props: {
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    cellStyle: {
      type: Function,
      default: function () {
        return [];
      },
    },
    multipleTable: {
      type: Array,
      default: function () {
        return [];
      },
    },
    multipleSelection: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
};
</script>

<style>
</style>
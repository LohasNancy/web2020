<template>
  <div>
    <el-tree
      highlight-current
      :props="defaultProps"
      :load="loadNode"
      lazy
      @node-click="handleNodeClick"
    >
    </el-tree>
  </div>
</template>

<script>
import api from "../../api";

export default {
  data() {
    return {
      defaultProps: {
        label: "name",
        children: "children",
        // isLeaf: "leaf",
      },
    };
  },
  methods: {
    //   异步处理
    loadNode(node, resolve) {
      // console.log(node);
      //默认获取第一层数据
      if (node.level === 0) {
        api.selectItemCategoryByParentId().then((res) => {
          if (res.data.status === 200) {
            return resolve(res.data.result);
          } else {
            return resolve([]);
          }
        });
      }
      if (node.level >= 1) {
        api
          .selectItemCategoryByParentId({
            id: node.data.cid,
          })
          .then((res) => {
            if (res.data.status === 200) {
              return resolve(res.data.result);
            } else {
              return resolve([]);
            }
          })
          .catch((error) => {
            resolve([]);
          });
      }

      //   setTimeout(() => {
      //     const data = [
      //       {
      //         name: "leaf",
      //         leaf: true,
      //       },
      //       {
      //         name: "children",
      //       },
      //     ];

      //     resolve(data);
      //   }, 500);
    },
    handleNodeClick(data) {
        // console.log(data);
        this.$emit("treeData",data);
    },
  },
};
</script>

<style>
</style>
<template>
  <div class="ContentNav">
    <el-tree
      highlight-current
      :props="defaultProps"
      :load="loadNode"
      lazy
      @node-click="handleNodeClick"
      :expand-on-click-node="false"
      :render-content="renderContent"
    >
    </el-tree>
    <!-- 子导航添加对话框 -->
    <el-dialog
      title="添加子导航"
      :visible.sync="dialogAddNavVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="navForm" ref="ruleForm">
        <el-form-item label="导航名字" prop="pass">
          <el-input type="text" v-model="navForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddNavVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddNavHandle">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 导航修改对话框 -->
    <el-dialog
      title="修改导航"
      :visible.sync="dialogUpdateNavVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="navForm" ref="ruleForm">
        <el-form-item label="导航名字">
          <el-input type="text" v-model="navForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateNavVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureUpdateNavHandle">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api";
export default {
  name: "ContentNav",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      dialogAddNavVisible: false,
      dialogUpdateNavVisible:false,
      navForm: {
        name: "",
      },
      navContent: {},
    };
  },
  inject: ["reload"],
  methods: {
    http(level, resolve) {
      api.selectContentCategoryByParentId(level).then((res) => {
        if (res.data.status === 200) {
          return resolve(res.data.result);
        } else {
          return resolve([]);
        }
      });
    },
    handleNodeClick(node) {
      // console.log(node);
      this.$bus.$emit("contentInfo",node);
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button
              style="font-size: 12px;"
              type="text"
              on-click={() => this.append(node, data)}
            >
              增加子导航
            </el-button>
            <el-button
              style="font-size: 12px;"
              type="text"
              on-click={() => this.update(node, data)}
            >
              修改
            </el-button>
            <el-button
              style="font-size: 12px;"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      );
    },
    append(node, data) {
      console.log(data);
      this.navContent = data;
      this.dialogAddNavVisible = true;
    },
    //更新
    update(node, data) {
      // console.log(node, data);
      this.dialogUpdateNavVisible=true;
      this.navContent=data;
    },
    //删除功能
    remove(node, data) {
      // console.log(node, data);
      api.deleteContentCategoryById({ pid: data.pid }).then((res) => {
        if (res.data.status === 200) {
          this.reload();
        }
      });
    },
    loadNode(node, resolve) {
      // console.log(node);
      // console.log(resolve);
      if (node.level === 0) {
        this.http({ id: 1 }, resolve);
      }
      if (node.level >= 1) {
        this.http({ id: node.data.pid }, resolve);
      }
    },
    //子导航
    handleClose() {
      this.dialogAddNavVisible = false;
    },
    sureAddNavHandle() {
      api.insertContentCategory({
          pid: this.navContent.pid,
          name: this.navForm.name,
        })
        .then((res) => {
          console.log(res);
          if (res.data.status === 200) {
            this.dialogAddNavVisible = false;
            this.reload();
          }
        });
    },
    //修改
    sureUpdateNavHandle() {
      api.updateContentCategory({
          pid: this.navContent.pid,
          name: this.navForm.name,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.status === 200) {
            this.reload();
          }
        });
    },
  },
};
</script>

<style>
</style>
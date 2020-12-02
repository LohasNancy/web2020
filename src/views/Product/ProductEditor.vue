<template>
  <el-dialog
    title="编辑商品"
    :visible.sync="dialogEditorVisible"
    width="80%"
    :before-close="handleClose"
  >
    <el-form
      label-width="70px"
      :label-position="labelPosition"
      :model="EditorForm"
      ref="ruleForm"
    >
      <el-form-item label="商品类目">
        <el-button class="category" type="primary" @click="dialogCategory"
          >类目选择</el-button
        >
        <span class="category">{{ treeData.name }}</span>
        <el-dialog
          width="50%"
          title="类目选择"
          :visible.sync="dialogCategoryVisible"
          append-to-body
        >
          <ProductTree @treeData="getTreeData" />
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="getCategoryDataHandle"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="EditorForm.name"></el-input>
      </el-form-item>
      <el-form-item label="商品卖点" prop="sellPoint">
        <el-input v-model="EditorForm.sellPoint"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="EditorForm.price"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="num">
        <el-input v-model="EditorForm.num"></el-input>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-button
          class="category"
          type="primary"
          @click="dialogUploadVisible = true"
          >图片上传</el-button
        >
        <span class="category">{{ uploadData.url }}</span>
        <el-dialog
          width="50%"
          title="上传图片"
          :visible.sync="dialogUploadVisible"
          append-to-body
        >
          <ProductUpload @upload="getUpload" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品描述">
        <ProductWangEditor @onEditor="getEditor" :editorData="editorContent" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogEditorVisible = false">取 消</el-button>
      <el-button type="primary" @click="sureSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ProductWangEditor from "./ProductWangEditor";
import ProductUpload from "./ProductUpload";
import ProductTree from "./ProductTree";
import api from "../../api";
import { mapMutations, mapState } from "vuex";
export default {
  name: "ProductEditor",
  data() {
    return {
      dialogEditorVisible: false,
      dialogUploadVisible: false,
      dialogCategoryVisible: false,
      labelPosition: "left",
      EditorForm: {
        name: "",
        sellPoint: "",
        price: "",
        num: "",
      },
      treeData: {},
      uploadData: {},
      editorData: "",
      currentId: 0,
    };
  },
  components: {
    ProductWangEditor,
    ProductUpload,
    ProductTree,
  },
  mounted() {
    this.$bus.$on("onEditor", (row) => {
      this.dialogEditorVisible = true;
      this.currentId = row.id;
      api
        .preUpdateItem({
          id: row.id,
        })
        .then((res) => {
          //   console.log(res);
          this.preCategoryUpdate(res.data.result[0].cid);
          let obj = res.data.result[0];
          (this.EditorForm = {
            name: obj.title,
            sellPoint: obj.sellPoint,
            price: obj.price,
            num: obj.num,
          }),
            (this.treeData = { name: obj.cid }),
            (this.uploadData = { url: obj.image }),
            (this.editorData = obj.descs);
          this.setEditorContent(this.editorData);
        });
    });
  },
  computed: {
    ...mapState("editorModule", {
      editorContent: (state) => state.editorContent,
    }),
  },
  methods: {
    ...mapMutations("editorModule", ["setEditorContent"]),
    handleClose() {
      this.dialogEditorVisible = false;
    },
    sureSubmit() {
      // 编辑
      api
        .updateTbItem({
          id: this.currentId,
          title: this.EditorForm.name,
          sellPoint: this.EditorForm.sellPoint,
          price: this.EditorForm.price,
          num: this.EditorForm.num,
          cid: this.treeData.cid,
          desc: this.editorData,
          image: this.uploadData.url,
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.dialogEditorVisible = false;
            this.$bus.$emit("onRef", true);
            this.$message({
              message: "恭喜你，提交修改成功啦！",
              type: "success",
            });
          } else {
            this.$message.error("修改失败");
          }
        });
    },
    initForm() {
      // 初始化
      (this.EditorForm = {
        name: "",
        sellPoint: "",
        price: "",
        num: "",
      }),
        (this.treeData = {}),
        (this.uploadData = {}),
        (this.editorData = "");
    },
    getUpload(data) {
      // console.log(data);
      this.uploadData = data;
      this.dialogUploadVisible = false;
    },
    dialogCategory() {
      this.dialogCategoryVisible = true;
    },
    getCategoryDataHandle() {
      this.dialogCategoryVisible = false;
    },
    getTreeData(data) {
      this.treeData = data;
    },
    getEditor(data) {
      console.log(data);
      this.editorData = data;
    },
    preCategoryUpdate(cid){
      console.log(cid);
      api.preCategory({cid}).then((res)=>{
        console.log(res);
        if(res.data.status === 200){
          this.treeData={
            name:res.data.result[0].name,
            cid:res.data.result[0].cid,
          }
        }else{
          this.treeData={
            // name:res.data.msg
            name:''
          }
        }
      })
    }
  },
};
</script>
<style scoped lang="less">
.category {
  float: left;
  margin-right: 20px;
}
.upload-img {
  width: 400px;
  float: left;
}
</style>
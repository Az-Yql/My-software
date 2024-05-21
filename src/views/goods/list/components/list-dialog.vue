<script lang="ts" setup>
import type { AddGoodParamsType } from "@/api/types/goodListType";
import type { ResponseCategoryListType } from "@/api/types/goodCategoryType";
import { getCategoryList } from "@/api/goods/goodCategory";
import { ref, nextTick, shallowRef, onBeforeUnmount, reactive } from "vue";
import {
  ElNotification,
  type FormInstance,
  type FormRules,
  type UploadRequestOptions,
} from "element-plus";
import _ from "lodash";
import { upload } from "@/api/common";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { addGood, editGood, findGood } from "@/api/goods/goodList";

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 初始化编辑器
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const dialogFormRef = ref<FormInstance>();

// 控制弹窗显示与隐藏
const visible = ref<boolean>(false);
// 弹窗标题
const dialogTitle = ref<string>();
// 弹窗类型
const dialogType = ref<string>();
// 弹窗表单
const dialogForm = ref<AddGoodParamsType>({
  // 商品名称
  name: "",
  // 商品分类
  categoryId: "",
  // 商品编码
  code: "",
  // 规格名称
  specsName: "",
  // 库存数量
  stockNum: 0,
  // 商品单位
  unitName: "",
  // 销售价格
  price: 0,
  // 商品特价
  discountPrice: 0,
  // 成本价格
  cost: 0,
  // 获得积分
  score: 0,
  // 商品状态
  status: 1,
  // 品牌名称
  brand: "",
  // 商品简码
  quickCode: "",
  // 商品产地
  address: "",
  // 排序号
  sort: 1,
  // 备注信息
  remark: "",
  // 商品主图
  imageUrl: "",
  // 商品详情
  goodsDetail: "",
});

// 打开抽屉
const openDrawer = (type?: string, title?: string, data = {} as any) => {
  initGoodCategoryList();
  dialogType.value = type;
  dialogTitle.value = title;
  console.log("Data=>", data);

  if (type === "edit") {
    nextTick(() => {
      dialogForm.value = _.cloneDeep(data);
    });
  }

  visible.value = true;
};

// 关闭抽屉
const handleClose = () => {
  dialogFormRef.value?.resetFields();
  visible.value = false;
};

// 获取商品的分类列表
const categoryList = ref<ResponseCategoryListType[]>();
const initGoodCategoryList = async () => {
  try {
    const res = await getCategoryList();
    categoryList.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

// 导出打开抽屉方法
defineExpose({
  openDrawer,
});

// 图像上传
const handleUploadImg = async (options: UploadRequestOptions) => {
  try {
    console.log("options", options);
    // 1. 拉起选择文件的弹窗

    // 2. 获取选择的文件
    const file = options.file;

    // 3. 判断上传文件的大小
    // if (file.size > 1 * 1024 * 1024) {
    //   alert("上传的文件大小不能超过1MB");
    //   return;
    // }

    // 4. 实例化FormData对象
    const formData = new FormData();
    // 5. 将文件添加到FormData对象中
    formData.append("file", file);
    formData.append("data", JSON.stringify({ sourceType: "goods_img" }));

    // 6.调用文件上传接口,实现上传
    const res = await upload(formData);

    // 7. 将返回的图片地址赋值给imageUrl
    dialogForm.value.imageUrl = res.data;
  } catch (error) {
    console.log(error);
  }
};

const handleCheckCode = async (rule: any, value: any, callback: any) => {
  console.log("value,", value);
  try {
    if (dialogType.value === "add") {
      const res = await findGood(value);
      if (res.data) {
        return callback(new Error("当前的商品已存在"));
      } else {
        return callback();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const dialogFormRules = reactive<FormRules<AddGoodParamsType>>({
  name: [{ required: true, message: "商品名称为必填项！", trigger: "blur" }],
  categoryId: [
    { required: true, message: "商品分类为必填项！", trigger: "change" },
  ],

  code: [
    { required: true, message: " 商品编码为必填项！", trigger: "blur" },
    { validator: handleCheckCode, trigger: "blur" },
  ],
  stockNum: [
    { required: true, message: " 库存数量为必填项！", trigger: "blur" },
  ],
  price: [{ required: true, message: " 销售价格为必填项！", trigger: "blur" }],
});

const emits = defineEmits(["refresh"]);

const handleSubmit = () => {
  dialogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (dialogType.value === "add") {
          await addGood(dialogForm.value);
        } else {
          await editGood(dialogForm.value);
        }
        handleClose();

        ElNotification({
          title: "操作成功",
          type: "success",
        });

        emits("refresh");
      } catch (error) {
        console.log(error);
      }
    }
  });
};
</script>
<template>
  <el-drawer
    size="800px"
    v-model="visible"
    :title="dialogTitle"
    direction="rtl"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form
      ref="dialogFormRef"
      :rules="dialogFormRules"
      :model="dialogForm"
      label-width="95px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称:" prop="name">
            <el-input
              v-model="dialogForm.name"
              maxlength="30"
              show-word-limit
              placeholder="请输入商品名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品分类:" prop="categoryId">
            <el-select
              v-model="dialogForm.categoryId"
              placeholder="请选择商品分类"
            >
              <el-option
                v-for="(item, index) in categoryList"
                :key="index"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品编码:" prop="code">
            <el-input
              v-model="dialogForm.code"
              placeholder="请输入商品编码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品规格:" prop="specsName">
            <el-input
              v-model="dialogForm.specsName"
              maxlength="20"
              show-word-limit
              placeholder="请输入商品名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存数量:" prop="stockNum">
            <el-input-number
              v-model="dialogForm.stockNum"
              :min="0"
              :max="999999999"
              placeholder="请输入库存数量"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品单位:" prop="unitName">
            <el-input
              v-model="dialogForm.unitName"
              placeholder="请输入商品单位"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售价格:" prop="price">
            <el-input-number
              v-model="dialogForm.price"
              :min="0"
              :max="999999999"
              placeholder="0.00"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品特价:" prop="discountPrice">
            <el-input-number
              v-model="dialogForm.discountPrice"
              :min="0"
              :max="999999999"
              placeholder="0.00"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成本价格:" prop="cost">
            <el-input-number
              v-model="dialogForm.cost"
              :min="0"
              :max="999999999"
              placeholder="0.00"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="获得积分:" prop="score">
            <el-input-number
              v-model="dialogForm.cost"
              :min="0"
              :max="999999999"
              placeholder="请输入可获得积分"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品状态:" prop="status">
            <el-radio-group v-model="dialogForm.status">
              <el-radio :value="1" border>上架 </el-radio>
              <el-radio :value="0" border>下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌名称:" prop="brand">
            <el-input
              v-model="dialogForm.brand"
              maxlength="30"
              show-word-limit
              placeholder="请输入品牌名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品简码:" prop="quickCode">
            <el-input
              v-model="dialogForm.quickCode"
              maxlength="30"
              show-word-limit
              placeholder="请输入,方便快速搜索商品"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品产地:" prop="address">
            <el-input
              v-model="dialogForm.address"
              maxlength="100"
              show-word-limit
              placeholder="商品产地最多可输入100个字"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序号:" prop="sort">
            <el-input-number
              v-model="dialogForm.sort"
              :min="0"
              :max="999999999"
              placeholder="请输入排序号"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注信息:" prop="remark">
            <el-input
              v-model="dialogForm.remark"
              maxlength="100"
              show-word-limit
              placeholder="备注信息最多可输入100个字符"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品主图:" prop="imageUrl">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              accept="image/png,image/jpeg,image/jpg"
              :http-request="handleUploadImg"
            >
              <img
                v-if="dialogForm.imageUrl"
                :src="dialogForm.imageUrl"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              <template #tip>
                <div class="el-upload__tip">
                  上传的图片大小不能超过 1MB，格式为 png/jpg/jpeg 的文件
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品详情:" prop="goodsDetail">
            <div style="border: 1px solid #ccc">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="{}"
                mode="default"
              />
              <Editor
                style="height: 500px; overflow-y: hidden"
                v-model="dialogForm.goodsDetail"
                :defaultConfig="{ placeholder: '请输入内容...' }"
                mode="default"
                @onCreated="handleCreated"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-row justify="center" style="margin-top: 10px">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-row>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

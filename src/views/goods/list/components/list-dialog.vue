<script lang="ts" setup>
import type { AddGoodParamsType } from "@/api/types/goodListType";
import type { ResponseCategoryListType } from "@/api/types/goodCategoryType";
import { getCategoryList } from "@/api/goods/goodCategory";
import { ref } from "vue";

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
  categoryId: 0,
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
    dialogForm.value = data;
  }

  visible.value = true;
};

// 关闭抽屉
const handleClose = () => {
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
</script>
<template>
  <el-drawer size="800px" v-model="visible" :title="dialogTitle" direction="rtl" :before-close="handleClose"
    destroy-on-close>
    <el-form :model="dialogForm" label-width="95px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称:" prop="name">
            <el-input v-model="dialogForm.name" maxlength="30" show-word-limit placeholder="请输入商品名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品分类:" prop="categoryId">
            <el-select v-model="dialogForm.categoryId" placeholder="请选择商品分类">
              <el-option v-for="(item, index) in categoryList" :key="index" :label="item.categoryName"
                :value="item.categoryId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品编码:" prop="code">
            <el-input v-model="dialogForm.code" placeholder="请输入商品编码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品规格:" prop="specsName">
            <el-input v-model="dialogForm.specsName" maxlength="20" show-word-limit placeholder="请输入商品名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存数量:" prop="stockNum">
            <el-input-number v-model="dialogForm.stockNum" :min="0" :max="999999999" placeholder="请输入库存数量"
              style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品单位:" prop="unitName">
            <el-input v-model="dialogForm.unitName" placeholder="请输入商品单位" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售价格:" prop="price">
            <el-input-number v-model="dialogForm.price" :min="0" :max="999999999" placeholder="0.00"
              style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品特价:" prop="discountPrice">
            <el-input-number v-model="dialogForm.discountPrice" :min="0" :max="999999999" placeholder="0.00"
              style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成本价格:" prop="cost">
            <el-input-number v-model="dialogForm.cost" :min="0" :max="999999999" placeholder="0.00"
              style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="获得积分:" prop="score">
            <el-input-number v-model="dialogForm.cost" :min="0" :max="999999999" placeholder="请输入可获得积分"
              style="width: 100%" />
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
            <el-input v-model="dialogForm.brand" maxlength="30" show-word-limit placeholder="请输入品牌名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品简码:" prop="quickCode">
            <el-input v-model="dialogForm.quickCode" maxlength="30" show-word-limit placeholder="请输入,方便快速搜索商品"
              clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品产地:" prop="address">
            <el-input v-model="dialogForm.address" maxlength="100" show-word-limit placeholder="商品产地最多可输入100个字"
              clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序号:" prop="sort">
            <el-input-number v-model="dialogForm.sort" :min="0" :max="999999999" placeholder="请输入排序号"
              style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注信息:" prop="remark">
            <el-input v-model="dialogForm.remark" maxlength="100" show-word-limit placeholder="备注信息最多可输入100个字符"
              clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品主图:" prop="remark"> </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品详情:" prop="remark"> </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss"></style>

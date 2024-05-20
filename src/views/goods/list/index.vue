<script lang="ts" setup name="List">
import { useGoodList } from "./composable/useGoodList";

import { defineAsyncComponent } from "vue";
const ListDialog = defineAsyncComponent(
  () => import("./components/list-dialog.vue")
);

const {
  current,
  size,
  total,
  searchForm,
  goodList,
  initGoodList,
  changeStatus,
  handleSizeChange,
  handleCurrentChange,
  handleDelete,
  handleSearch,
  listDialogRef,
  handleAdd,
  handleEdit,
} = useGoodList();

initGoodList();
</script>

<template>
  <div class="layout-padding">
    <!-- 商品查询 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="名称/编码:">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入商品名称/编码/简码"
          clearable
        />
      </el-form-item>
      <el-form-item label="商品状态:">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择商品状态"
          clearable
          style="width: 200px"
        >
          <el-option label="已上架" :value="1" />
          <el-option label="已下架" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="search" type="primary" @click="handleSearch"
          >查询</el-button
        >
        <el-button type="success" icon="plus" @click="handleAdd"
          >新增商品</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 商品列表渲染 -->
    <el-table border :data="goodList" style="width: 100%" stripe>
      <el-table-column
        show-overflow-tooltip
        align="center"
        fixed
        label="商品名称/编码"
        width="230"
      >
        <template #default="{ row }">
          <div style="display: flex; align-items: center">
            <el-avatar shape="square" :size="50" :src="row.imageUrl" />
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-left: 10px;
              "
            >
              <div>{{ row.name }}</div>
              <el-link type="primary">{{ row.code }}</el-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="specsName" label="商品规格" />
      <el-table-column
        align="center"
        prop="categoryName"
        label="所属分类"
        min-width="110"
      />
      <el-table-column
        align="center"
        prop="quickCode"
        label="快捷码"
        width="120"
      />
      <el-table-column align="center" prop="unitName" label="单位" width="70" />
      <el-table-column
        align="center"
        prop="stockNum"
        label="库存"
        sortable
        min-width="110"
      />
      <el-table-column
        align="center"
        prop="price"
        label="销售价"
        sortable
        width="130"
      />
      <el-table-column align="center" label="商品特价" sortable min-width="110">
        <template #default="{ row }">¥ {{ row.discountPrice }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="cost"
        label="成本价"
        sortable
        width="130"
      />
      <el-table-column
        align="center"
        prop="createTime"
        label="入库时间"
        width="110"
      />
      <el-table-column
        align="center"
        prop="status"
        label="商品状态"
        width="110"
      >
        <template #default="{ row }">
          <el-switch
            @click.stop
            v-model="row.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="已上架"
            inactive-text="已下架"
            @change="changeStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button link icon="edit" type="warning" @click="handleEdit(row)"
            >修改</el-button
          >
          <el-popconfirm
            width="220"
            confirm-button-text="确定"
            cancel-button-text="取消"
            :title="`确定永久删除【${row.name}】吗?`"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button link icon="delete" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 商品列表分页 -->
    <el-row justify="end" style="margin-top: 20px">
      <el-pagination
        v-model:current-page="current"
        v-model:page-size="size"
        :page-sizes="[10, 20, 30, 50]"
        :background="true"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>

    <!-- 新增与编辑弹窗 -->
    <list-dialog ref="listDialogRef"></list-dialog>
  </div>
</template>

<style scoped lang="scss"></style>

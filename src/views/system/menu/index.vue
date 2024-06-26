<script lang="ts" setup>
import { ref, defineAsyncComponent } from "vue";
import type { ResponseMenuListType } from "@/api/types/menuType";
import { delMenu, getMenuList } from "@/api/system/menu";
import { ElNotification } from "element-plus";

// 异步加载组件
const menuDialog = defineAsyncComponent(
  () => import("./components/menu-dialog.vue")
);

// 保存后台返回的菜单列表数据
const menuList = ref<ResponseMenuListType[]>([]);

// 菜单查询的参数
const searchFormKey = ref({
  keyword: "",
});

// 获取菜单列表
const initMenuList = async () => {
  try {
    const res = await getMenuList(searchFormKey.value);
    menuList.value = res.data;
  } catch (e) {
    console.log(e);
  }
};
// 调用菜单列表方法
initMenuList();

// 过滤图表的ele-
const filterMenuIcon = (icon: string) => {
  if (icon) {
    return icon.replace("ele-", "");
  }
};

// 删除菜单方法
const handleDelete = async (row: ResponseMenuListType) => {
  try {
    await delMenu(row.id);

    // 删除成功的提示信息
    ElNotification({
      title: "删除成功!",
      type: "success",
    });

    // 刷新菜单列表
    initMenuList();
  } catch (error) {
    console.log(error);
  }
};

// dialog抽屉实例
const dialogRef = ref();

// 新增
const handleAdd = (id: string) => {
  dialogRef.value.openDrawer("add", "新增菜单", { parentId: id });
};

// 编辑
const handleEdit = (row: ResponseMenuListType) => {
  dialogRef.value.openDrawer("edit", "编辑菜单", { row });
};

// 修改/新增成功之后的方法
const handleRefresh = () => {
  initMenuList();
};
</script>

<template>
  <div class="layout-padding">
    <!-- 菜单查询 -->
    <el-form :inline="true" :model="searchFormKey" class="demo-form-inline">
      <el-form-item label="菜单名称:">
        <el-input
          v-model="searchFormKey.keyword"
          placeholder="请输入菜单名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="initMenuList"
          >查询</el-button
        >
        <el-button type="success" icon="plus" @click="handleAdd('')"
          >新增菜单</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 菜单列表 -->
    <el-table
      :data="menuList"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column align="center" label="菜单名称">
        <template #default="{ row }">
          <svg-icon
            v-if="filterMenuIcon(row.meta.icon)"
            :icon="filterMenuIcon(row.meta.icon)"
          ></svg-icon>
          <span style="margin-left: 10px">{{ row.meta.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="path" label="路由地址" />
      <el-table-column align="center" prop="component" label="组件路径">
      </el-table-column>
      <el-table-column align="center" prop="code" label="权限标识">
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template #default="{ row }">
          <!-- <el-tag :type="row.type == 1 ? 'primary' : 'success'">{{
            row.type == 1 ? "菜单" : "按钮"
          }}</el-tag> -->
          <el-tag v-if="row.type == 1" type="primary">菜单</el-tag>
          <el-tag v-if="row.type == 2" type="success">按钮</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="sort" label="排序" />
      <el-table-column align="center" label="操作" width="240">
        <template #default="scope">
          <el-button
            @click="handleAdd(scope.row.id)"
            type="primary"
            icon="Plus"
            link
            size="small"
          >
            新增下级
          </el-button>
          <el-button
            @click="handleEdit(scope.row)"
            type="warning"
            icon="Edit"
            link
            size="small"
          >
            修改
          </el-button>
          <el-popconfirm
            width="auto"
            :title="`确定永久删除【${scope.row.meta.title}】吗?`"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button
                @click.stop
                type="danger"
                icon="delete"
                link
                size="small"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <menu-dialog ref="dialogRef" @refresh="handleRefresh"></menu-dialog>
  </div>
</template>

<style scoped lang="scss"></style>

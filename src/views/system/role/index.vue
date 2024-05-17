<script lang="ts" setup>
import { ref, defineAsyncComponent } from "vue";
import type { Record } from "@/api/types/roleType";
import { delRole, getRoleList } from "@/api/system/role";

const RoleDialog = defineAsyncComponent(
  () => import("./components/role-dialog.vue")
);
const RolePermission = defineAsyncComponent(
  () => import("./components/permission.vue")
);

// 保存请求到的角色列表
const roleList = ref<Record[]>([]);

const current = ref<number>(1);
const size = ref<number>(10);
const total = ref<number>(0);

const searchForm = ref<{ name: string }>({
  name: "",
});

// 初始化列表数据
const initRoleList = async () => {
  const res = await getRoleList({
    current: current.value,
    size: size.value,
    name: searchForm.value.name,
  });
  roleList.value = res.data.records;
  total.value = res.data.total;
};

// 调用初始化列表方法
initRoleList();

// 条数
const handleSizeChange = (value: number) => {
  size.value = value;
  initRoleList();
};

// 页码
const handleCurrentChange = (value: number) => {
  current.value = value;
  initRoleList();
};

// 删除方法
const handleDelete = async (id: number) => {
  try {
    await delRole(id);
    initRoleList();
  } catch (error) {
    console.log(error);
  }
};

const roleDialogRef = ref<InstanceType<typeof RoleDialog>>();

// 新增
const handleAdd = () => {
  roleDialogRef.value!.openDialog("add", "新增角色");
};

// 编辑
const handleEdit = (row: Record) => {
  roleDialogRef.value!.openDialog("edit", "编辑角色", { row });
};

const handleRefresh = () => {
  initRoleList();
};

const rolePermisssionRef = ref<InstanceType<typeof RolePermission>>();

const handlePermission = (row: Record) => {
  rolePermisssionRef.value!.openDrawer(`分配【${row.roleName}】的权限`, row.id);
};
</script>

<template>
  <div class="layout-padding">
    <!-- 角色查询 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="角色名称:">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入角色名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="initRoleList"
          >查询</el-button
        >
        <el-button type="success" icon="plus" @click="handleAdd"
          >新增角色</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 角色列表 -->
    <el-table :data="roleList" border style="width: 100%" stripe>
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column align="center" prop="roleName" label="角色名称" />
      <el-table-column align="center" prop="roleCode" label="角色编码" />
      <el-table-column align="center" prop="status" label="角色状态">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'warning'">{{
            row.status ? "启用" : "禁用"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注" />
      <el-table-column align="center" width="260" label="操作">
        <template #default="scope">
          <el-button
            link
            icon="edit"
            type="primary"
            @click="handlePermission(scope.row)"
          >
            分配权限
          </el-button>
          <el-button
            link
            icon="edit"
            type="warning"
            @click="handleEdit(scope.row)"
          >
            修改
          </el-button>
          <el-popconfirm
            width="220"
            confirm-button-text="确定"
            cancel-button-text="取消"
            title="确定删除此角色和所拥有权限吗?"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button link icon="delete" type="danger"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 新增与标记弹窗 -->
    <role-dialog ref="roleDialogRef" @refresh="handleRefresh"></role-dialog>

    <!-- 分配权限 -->
    <role-permission ref="rolePermisssionRef"></role-permission>
  </div>
</template>

<style scoped lang="scss"></style>

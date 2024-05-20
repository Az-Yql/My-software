<script lang="ts" setup>
import { delUser, getUserList } from "@/api/system/user";
import { ref } from "vue";
import type { Record } from "@/api/types/userType";
import { ElNotification } from "element-plus";
import { defineAsyncComponent } from "vue";
// import {} from "./components/pass-dialog.vue";

const userDialog = defineAsyncComponent(
  () => import("./components/user-dialog.vue")
);

const passDialog = defineAsyncComponent(
  () => import("./components/pass-dialog.vue")
);

const dialogRef = ref<InstanceType<typeof userDialog>>();

// 页码
const current = ref<number>(1);
// 条数
const size = ref<number>(20);
// 用户查询条件
const searchForm = ref({
  keyword: "",
});
// 总条数
const total = ref<number>(0);

// 保存用户列表的数据时
const userList = ref<Record[]>([]);

const initUserList = async () => {
  try {
    const res = await getUserList({
      current: current.value,
      size: size.value,
      keyword: searchForm.value.keyword,
    });

    userList.value = res.data.records;
    total.value = res.data.total;

    console.log("resss=>", res);
  } catch (error) {
    console.log(error);
  }
};
initUserList();

// 条数
const handleSizeChange = (value: number) => {
  size.value = value;
  initUserList();
};

// 页码
const handleCurrentChange = (value: number) => {
  current.value = value;
  initUserList();
};

// 查询
const handleSearch = () => {
  initUserList();
};

// 新增用户
const handleAdd = () => {
  dialogRef.value?.openDialog("add", "新增用户");
};

// 编辑用户
const handleEdit = (row: Record) => {
  dialogRef.value?.openDialog("edit", "编辑用户", { row });
};

// 删除用户
const handleDelete = async (id: number) => {
  try {
    await delUser(id);

    ElNotification({
      title: "删除成功!",
      type: "success",
    });

    initUserList();
  } catch (error) {
    console.log(error);
  }
};

const passDialogRef = ref<InstanceType<typeof passDialog>>();
const resetPassword = (row: Record) => {
  passDialogRef.value?.openDialog(`重置密码[${row.nickName}]`, row.id);
};
</script>

<template>
  <div class="layout-padding">
    <!-- 用户查询 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item>
        <el-input
          style="width: 280px"
          v-model="searchForm.keyword"
          placeholder="请输入账号/昵称/手机号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleSearch"
          >查询</el-button
        >
        <el-button type="success" icon="plus" @click="handleAdd"
          >新增用户</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 用户列表 -->
    <el-table :data="userList" border stripe style="width: 100%">
      <el-table-column align="center" prop="nickName" label="用户昵称" />
      <el-table-column align="center" prop="nickName" label="用户账号" />
      <el-table-column align="center" prop="mobile" label="手机号" />
      <el-table-column align="center" prop="email" label="邮箱" />
      <el-table-column align="center" label="账号锁定" sortable>
        <template #default="{ row }">
          <el-tag :type="row.accountNonLocked ? 'success' : 'danger'">{{
            row.accountNonLocked ? "正常" : "锁定"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号过期" sortable>
        <template #default="{ row }">
          <el-tag :type="row.accountNonExpired ? 'success' : 'danger'">{{
            row.accountNonExpired ? "正常" : "锁定"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码过期" sortable>
        <template #default="{ row }">
          <el-tag :type="row.credentialsNonExpired ? 'success' : 'danger'">{{
            row.credentialsNonExpired ? "正常" : "过期"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="updateTime"
        label="创建时间"
        sortable
      />
      <el-table-column align="center" label="操作" width="260px">
        <template #default="{ row }">
          <el-button icon="key" link type="primary" @click="resetPassword(row)"
            >密码重置</el-button
          >
          <el-button icon="edit" link type="warning" @click="handleEdit(row)"
            >修改</el-button
          >
          <el-popconfirm
            width="220"
            confirm-button-text="确定"
            cancel-button-text="取消"
            :title="`确定要永久删除【${row.nickName}】吗?`"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button icon="delete" link type="danger">删除</el-button>
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

    <!-- 新增与编辑弹窗 -->
    <user-dialog ref="dialogRef" @refresh="initUserList"></user-dialog>

    <!-- 修改密码弹窗 -->
    <pass-dialog ref="passDialogRef"></pass-dialog>
  </div>
</template>

<style scoped lang="scss"></style>

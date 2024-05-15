<script lang="ts" setup>
import type { AddRoleParamsType } from "@/api/types/roleType";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

const dialogFormVisible = ref<boolean>(false);
const dialogTitle = ref<string>();
const dialogForm = ref<AddRoleParamsType>({
  roleCode: "",
  roleName: "",
  status: true,
  remark: "",
});

const dialogFormrules = reactive<FormRules<AddRoleParamsType>>({
  roleName: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  roleCode: [
    {
      required: true,
      message: "角色编码不能为空",
      trigger: "change",
    },
    {
      pattern: /^[a-zA-Z0-9_]{2,30}$/,
      message: "只允许输入2-30位英文/数字/下划线",
      trigger: "blur",
    },
  ],
  status: [
    {
      required: true,
      message: "角色状态位必选项!",
      trigger: "change",
    },
  ],
});
const dialogFormRef = ref<FormInstance>();
// 新增与修改的提交方法
const handleSubmit = () => {
  dialogFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      alert("123");
    }
  });
};

// 打开弹窗方法
const openDialog = (title: string = "新增角色") => {
  dialogFormVisible.value = true;
  dialogTitle.value = title;
};

// 暴露子组件方法给父组件
defineExpose({
  openDialog,
});
</script>

<template>
  <el-dialog center v-model="dialogFormVisible" title="新增角色" width="520px">
    <el-form
      :rules="dialogFormrules"
      :model="dialogForm"
      label-width="95px"
      label-position="right"
      status-icon
      label-suffix=":"
      ref="dialogFormRef"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="dialogForm.roleName"
          autocomplete="off"
          clearable
          placeholder="请输入角色名称"
        />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="dialogForm.roleCode"
          autocomplete="off"
          placeholder="保证唯一性,建议以`ROLE_`开头"
        />
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-switch
          v-model="dialogForm.status"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="dialogForm.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>

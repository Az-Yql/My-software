<script lang="ts" setup>
import { resetPassword } from "@/api/system/user";
import type { PasswordDataType } from "@/api/types/userType";
import {
  ElNotification,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { reactive, ref } from "vue";

const dialogFormRef = ref<FormInstance>();
const visible = ref<boolean>(false);
const dialogTitle = ref<string>();
const dialogForm = ref<PasswordDataType>({
  newPassword: "",
  repPassword: "",
  userId: "",
});

// 打开弹窗
const openDialog = (title: string, id: number) => {
  dialogTitle.value = title;
  dialogForm.value.userId = id;
  visible.value = true;
};

// 关闭弹窗
const handleClose = () => {
  // 重置表单
  dialogFormRef.value?.resetFields();
  // 关闭弹窗
  visible.value = false;
};

// 导出openDialog
defineExpose({
  openDialog,
});

// 表单校验
const changePassword = (rule: any, value: any, callback: any) => {
  if (value === dialogForm.value.newPassword) {
    callback();
  } else {
    callback(new Error("新密码与确认密码不一致"));
  }
};
const dialogFormRules = reactive<FormRules<typeof dialogForm>>({
  newPassword: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    {
      pattern: /^(?!^[\d]+$)(?!^[-]+$)(?!^[_]+$)(?!^[a-zA-Z]+$)[\w-]{6,30}$/,
      message: "新密码必须为6~30位数字、字母、下划线！",
      trigger: "blur",
    },
  ],
  repPassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    { validator: changePassword, trigger: "blur" },
  ],
});

// 提交密码
const handleSubmit = () => {
  dialogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const res = await resetPassword(dialogForm.value);

        ElNotification({
          title: "密码修改成功",
          type: "success",
        });

        handleClose();
      } catch (error) {
        console.log(error);
      }
    }
  });
};
</script>

<template>
  <el-dialog
    :before-close="handleClose"
    draggable
    center
    v-model="visible"
    :title="dialogTitle"
    width="400"
  >
    <el-form
      ref="dialogFormRef"
      :rules="dialogFormRules"
      :model="dialogForm"
      label-width="85px"
    >
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          type="password"
          v-model="dialogForm.newPassword"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="repPassword">
        <el-input
          type="password"
          v-model="dialogForm.repPassword"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>

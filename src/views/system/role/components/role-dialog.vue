<script lang="ts" setup>
import { addRole, editRole } from "@/api/system/role";
import type { AddRoleParamsType } from "@/api/types/roleType";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref, nextTick } from "vue";
import { ElNotification } from "element-plus";
import _ from "lodash";

const dialogFormVisible = ref<boolean>(false);
const dialogTitle = ref<string>();
const dialogType = ref<string>();
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
      submitData();
    }
  });
};

const emits = defineEmits(["refresh"]);

// 提交数据方法
const submitData = async () => {
  try {
    if (dialogType.value === "add") {
      await addRole(dialogForm.value);
    } else if (dialogType.value === "edit") {
      // 编辑
      await editRole(dialogForm.value);
    }

    dialogFormVisible.value = false;

    ElNotification({
      title: "操作成功",
      type: "success",
    });

    emits("refresh");
  } catch (error) {
    console.log(error);
  }
};

// 打开弹窗方法
const openDialog = (
  type: string,
  title: string = "新增角色",
  data = {} as any
) => {
  dialogFormVisible.value = true;
  dialogTitle.value = title;
  dialogType.value = type;

  if (type === "edit") {
    nextTick(() => {
      dialogForm.value = _.cloneDeep(data.row);
    });
  }
};

// 暴露子组件方法给父组件
defineExpose({
  openDialog,
});

// 关闭的回调
const handleClose = () => {
  dialogFormRef.value?.resetFields();

  dialogFormVisible.value = false;
};
</script>

<template>
  <el-dialog
    center
    v-model="dialogFormVisible"
    :title="dialogTitle"
    width="520px"
    destroy-on-close
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
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
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>

<script lang="ts" setup>
import type { UserParamsType } from "@/api/types/userType";
import {
  ElNotification,
  type FormInstance,
  type FormRules,
} from "element-plus";
import type { Record } from "@/api/types/roleType";
import { ref, nextTick, reactive } from "vue";
import _ from "lodash";
import { getRoleList } from "@/api/system/role";
import { addUser, editUser } from "@/api/system/user";

// 控制弹窗显示与隐藏
const visible = ref<boolean>(false);
const dialogTitle = ref<string>("");
const dialogFormRef = ref<FormInstance>();
const dialogType = ref<string>();

// 保存弹窗表单数据
const dialogForm = ref<UserParamsType>({
  nickName: "",
  accountNonExpired: false,
  accountNonLocked: false,
  credentialsNonExpired: false,
  email: "",
  mobile: "",
  password: "",
  remark: "",
  roleIds: [],
  username: "",
});

// 打开弹窗的方法
const openDialog = (type: string, title: string, data = {} as any) => {
  initRoleList();
  dialogTitle.value = title;
  visible.value = true;
  dialogType.value = type;

  if (type === "edit") {
    nextTick(() => {
      dialogForm.value = _.cloneDeep(data.row);
    });
  }
};

// 关闭弹窗的方法
const handleClose = () => {
  dialogFormRef.value?.resetFields();
  visible.value = false;
};

// 暴露子组件的方法
defineExpose({
  openDialog,
});

// 表单校验规则
const dialogFormRules = reactive<FormRules<UserParamsType>>({
  nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  username: [
    {
      required: true,
      message: "用户帐号为必填项！",
      trigger: "blur",
    },
    {
      min: 6,
      max: 30,
      message: "帐号必须为6~30位数字、字母、下划线！",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      min: 6,
      max: 30,
      message: "密码必须为6~30位数字、字母、下划线！",
      trigger: "blur",
    },
  ],
  accountNonLocked: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
  ],
  accountNonExpired: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
  ],
  credentialsNonExpired: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
  ],
});

const emits = defineEmits(["refresh"]);

// 提交方法
const handleSubmit = () => {
  dialogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (dialogType.value === "add") {
          await addUser(dialogForm.value);
        } else if (dialogType.value === "edit") {
          await editUser(dialogForm.value);
        }

        // 关闭弹窗
        handleClose();

        // 提示信息
        ElNotification({
          title: "操作成功",
          type: "success",
        });

        // 刷新表格数据
        emits("refresh");
      } catch (error) {
        console.log(error);
      }
    }
  });
};

// 初始化角色列表
const roleList = ref<Record[]>();
const initRoleList = async () => {
  try {
    const res = await getRoleList();
    roleList.value = res.data.records;
    console.log("roleList.value ", roleList.value);
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <el-dialog
    center
    @close="handleClose"
    :before-close="handleClose"
    v-model="visible"
    :title="dialogTitle"
    width="720px"
  >
    <el-form
      status-icon
      ref="dialogFormRef"
      :model="dialogForm"
      label-width="95px"
      :rules="dialogFormRules"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称:" prop="nickName">
            <el-input
              placeholder="请输入用户昵称"
              maxlength="30"
              clearable
              show-word-limit
              v-model="dialogForm.nickName"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户帐号:" prop="username">
            <el-input
              placeholder="请输入4-30位用户账号"
              maxlength="30"
              clearable
              show-word-limit
              v-model="dialogForm.username"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码:" prop="mobile">
            <el-input
              placeholder="请输入手机号"
              maxlength="20"
              clearable
              show-word-limit
              v-model="dialogForm.mobile"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录密码:" prop="password">
            <el-input
              :disabled="dialogType === 'edit'"
              placeholder="请输入6-30位登录密码"
              maxlength="20"
              clearable
              show-word-limit
              type="password"
              v-model="dialogForm.password"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分配角色:" prop="roleIds">
            <el-select
              v-model="dialogForm.roleIds"
              multiple
              placeholder="请选择角色"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱:" prop="email">
            <el-input
              placeholder="请输入电子邮箱"
              maxlength="30"
              clearable
              show-word-limit
              v-model="dialogForm.email"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号锁定:" prop="accountNonLocked">
            <el-radio-group v-model="dialogForm.accountNonLocked">
              <el-radio :value="false" border>未锁定</el-radio>
              <el-radio :value="true" border>已锁定</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号过期:" prop="accountNonExpired">
            <el-radio-group v-model="dialogForm.accountNonExpired">
              <el-radio :value="false" border>未过期</el-radio>
              <el-radio :value="true" border>已过期</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码过期:" prop="credentialsNonExpired">
            <el-radio-group v-model="dialogForm.credentialsNonExpired">
              <el-radio :value="false" border>未过期</el-radio>
              <el-radio :value="true" border>已过期</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注信息:" prop="remark">
            <el-input
              placeholder="请输入备注信息"
              maxlength="100"
              clearable
              show-word-limit
              v-model="dialogForm.remark"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>

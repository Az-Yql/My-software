<script lang="ts" setup>
import type { MenuParamsType } from "@/api/types/menuType";
import type { FormInstance } from "element-plus";
import { ref, nextTick } from "vue";
import { selectMenu, addMenu, editMenu } from "@/api/system/menu";
import { ElNotification } from "element-plus";
import _ from "lodash";

// 控制抽屉的状态
const visible = ref<boolean>(false);
// 抽屉的标题
const dialogTitle = ref("新增");
// 弹窗的类型 tpye add 新增 edit 编辑

const dialogType = ref<string>();

// 抽屉表单数据
const formData = ref<MenuParamsType>({
  parentId: "",
  type: "1",
  meta: {
    title: "",
    icon: "",
    hidden: false,
    cache: false,
  },
  path: "",
  sort: 1,
  remark: "",
  name: "",
  component: "",
  redirect: "",
  code: "",
});

// 抽屉表单验证规则
// const formDataRules = reactive<FormRules<MenuParamsType>>({
//   // type: [
//   //   {
//   //     required: true,
//   //     message: "请选择菜单类型",
//   //     trigger: "change",
//   //   },
//   // ],
//   // meta[title: [
//   //   {
//   //     required: true,
//   //     message: "请输入菜单名称",
//   //     trigger: "blur",
//   //   },
//   // ],
//   // [meta.hidden]: [
//   //   {
//   //     required: true,
//   //     message: "请选择",
//   //     trigger: "change",
//   //   },
//   // ],
//   // [meta.cache]: [
//   //   {
//   //     required: true,
//   //     message: "请选择",
//   //     trigger: "change",
//   //   },
//   // ],
// });

// 关闭抽屉之前触发的方法
const handleClose = () => {
  formDataRef.value?.resetFields();
  visible.value = false;
};

const props = {
  checkStrictly: true,
  value: "id",
  label: "title",
  emitPath: false,
};

// 上级菜单数据
const options = ref<any>([
  {
    value: "guide",
    label: "Guide",
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [
          {
            value: "consistency",
            label: "Consistency",
          },
          {
            value: "feedback",
            label: "Feedback",
          },
          {
            value: "efficiency",
            label: "Efficiency",
          },
          {
            value: "controllability",
            label: "Controllability",
          },
        ],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          {
            value: "side nav",
            label: "Side Navigation",
          },
          {
            value: "top nav",
            label: "Top Navigation",
          },
        ],
      },
    ],
  },
  {
    value: "component",
    label: "Component",
    children: [
      {
        value: "basic",
        label: "Basic",
        children: [
          {
            value: "layout",
            label: "Layout",
          },
          {
            value: "color",
            label: "Color",
          },
          {
            value: "typography",
            label: "Typography",
          },
          {
            value: "icon",
            label: "Icon",
          },
          {
            value: "button",
            label: "Button",
          },
        ],
      },
      {
        value: "form",
        label: "Form",
        children: [
          {
            value: "radio",
            label: "Radio",
          },
          {
            value: "checkbox",
            label: "Checkbox",
          },
          {
            value: "input",
            label: "Input",
          },
          {
            value: "input-number",
            label: "InputNumber",
          },
          {
            value: "select",
            label: "Select",
          },
          {
            value: "cascader",
            label: "Cascader",
          },
          {
            value: "switch",
            label: "Switch",
          },
          {
            value: "slider",
            label: "Slider",
          },
          {
            value: "time-picker",
            label: "TimePicker",
          },
          {
            value: "date-picker",
            label: "DatePicker",
          },
          {
            value: "datetime-picker",
            label: "DateTimePicker",
          },
          {
            value: "upload",
            label: "Upload",
          },
          {
            value: "rate",
            label: "Rate",
          },
          {
            value: "form",
            label: "Form",
          },
        ],
      },
      {
        value: "data",
        label: "Data",
        children: [
          {
            value: "table",
            label: "Table",
          },
          {
            value: "tag",
            label: "Tag",
          },
          {
            value: "progress",
            label: "Progress",
          },
          {
            value: "tree",
            label: "Tree",
          },
          {
            value: "pagination",
            label: "Pagination",
          },
          {
            value: "badge",
            label: "Badge",
          },
        ],
      },
      {
        value: "notice",
        label: "Notice",
        children: [
          {
            value: "alert",
            label: "Alert",
          },
          {
            value: "loading",
            label: "Loading",
          },
          {
            value: "message",
            label: "Message",
          },
          {
            value: "message-box",
            label: "MessageBox",
          },
          {
            value: "notification",
            label: "Notification",
          },
        ],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          {
            value: "menu",
            label: "Menu",
          },
          {
            value: "tabs",
            label: "Tabs",
          },
          {
            value: "breadcrumb",
            label: "Breadcrumb",
          },
          {
            value: "dropdown",
            label: "Dropdown",
          },
          {
            value: "steps",
            label: "Steps",
          },
        ],
      },
      {
        value: "others",
        label: "Others",
        children: [
          {
            value: "dialog",
            label: "Dialog",
          },
          {
            value: "tooltip",
            label: "Tooltip",
          },
          {
            value: "popover",
            label: "Popover",
          },
          {
            value: "card",
            label: "Card",
          },
          {
            value: "carousel",
            label: "Carousel",
          },
          {
            value: "collapse",
            label: "Collapse",
          },
        ],
      },
    ],
  },
  {
    value: "resource",
    label: "Resource",
    children: [
      {
        value: "axure",
        label: "Axure Components",
      },
      {
        value: "sketch",
        label: "Sketch Templates",
      },
      {
        value: "docs",
        label: "Design Documentation",
      },
    ],
  },
]);

const formDataRef = ref<FormInstance>();

const emits = defineEmits(["refresh"]);

// 提交弹窗数据方法
const handleSubmit = () => {
  formDataRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (formData.value.type === "2") {
        formData.value.path = "";
        formData.value.component = "";
        formData.value.redirect = "";
        formData.value.name = "";
        formData.value.meta.icon = "";
        formData.value.meta.hidden = false;
        formData.value.meta.cache = false;
      }
      submitData();
    }
  });
};

//  提交数据
const submitData = async () => {
  try {
    if (dialogType.value === "add") {
      delete formData.value.code;
      await addMenu(formData.value);
    } else {
      // 编辑
      await editMenu(formData.value);
    }

    ElNotification({
      title: "操作成功!",
      type: "success",
    });

    handleClose();

    // 通过父组件操作成功
    emits("refresh");
  } catch (error) {
    console.log(error);
  }
};

// 获取下拉菜单方法
const getSelectMenu = async () => {
  try {
    const res = await selectMenu();
    options.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

// 开启抽屉方法
const openDrawer = (type: string, title: string, data = {} as any) => {
  getSelectMenu();
  visible.value = true;
  dialogType.value = type;
  dialogTitle.value = title;
  formData.value.parentId = data.parentId;

  if (type === "edit") {
    nextTick(() => {
      formData.value = _.cloneDeep(data.row);
    });
  }
};



// 暴露子组件方法
defineExpose({
  openDrawer,
});
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="dialogTitle"
    direction="rtl"
    :before-close="handleClose"
    size="650px"
  >
    <el-form
      ref="formDataRef"
      :model="formData"
      label-width="85px"
      label-position="right"
    >
      <el-form-item label="上级菜单" prop="parentId">
        <el-cascader
          placeholder="请选择上级菜单"
          v-model="formData.parentId"
          :options="options"
          :props="props"
          clearable
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item
        label="菜单类型"
        :rules="{
          required: true,
          message: '请选择菜单类型',
          trigger: 'change',
        }"
        prop="type"
      >
        <el-radio-group v-model="formData.type">
          <el-radio value="1" border>菜单</el-radio>
          <el-radio value="2" border>按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="菜单名称"
        :rules="{
          required: true,
          message: '请选择菜单名称',
          trigger: 'blur',
        }"
        prop="meta.title"
      >
        <el-input
          v-model="formData.meta.title"
          maxlength="10"
          placeholder="请输入菜单名称"
          show-word-limit
          type="text"
        />
      </el-form-item>
      <el-form-item label="权限标识" v-if="formData.type === '2'" prop="code">
        <el-input
          v-model="formData.code"
          maxlength="10"
          placeholder="请输入权限标识"
          show-word-limit
          type="text"
        />
      </el-form-item>
      <el-form-item label="路由地址" v-if="formData.type === '1'" prop="path">
        <el-input
          v-model="formData.path"
          maxlength="200"
          placeholder="路由地址path值"
          show-word-limit
          type="text"
        />
      </el-form-item>
      <el-form-item label="路由名称" v-if="formData.type === '1'" prop="name">
        <el-input
          v-model="formData.name"
          maxlength="50"
          placeholder="路由名称"
          show-word-limit
          type="text"
        />
      </el-form-item>
      <el-form-item
        label="组件路径"
        v-if="formData.type === '1'"
        prop="component"
      >
        <el-input
          v-model="formData.component"
          maxlength="390"
          placeholder="路由组件相对路径"
          show-word-limit
          type="text"
        />
      </el-form-item>
      <el-form-item
        label="菜单图标"
        v-if="formData.type === '1'"
        prop="meta.icon"
      >
        <el-input
          v-model="formData.meta.icon"
          maxlength="100"
          placeholder="请输入图标名"
          show-word-limit
          type="text"
        />
      </el-form-item>
      <el-form-item label="重定向" v-if="formData.type === '1'" prop="redirect">
        <el-input
          v-model="formData.redirect"
          maxlength="100"
          placeholder="路由重定向地址redirect值"
          show-word-limit
          type="text"
        />
      </el-form-item>
      <el-row v-if="formData.type === '1'">
        <el-col :span="12">
          <el-form-item
            label="是否隐藏"
            :rules="{
              required: true,
              message: '请选择',
              trigger: 'change',
            }"
            prop="meta.hidden"
          >
            <el-radio-group v-model="formData.meta.hidden" class="ml-4">
              <el-radio :value="false">不隐藏</el-radio>
              <el-radio :value="true">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否缓存"
            :rules="{
              required: true,
              message: '请选择',
              trigger: 'change',
            }"
            prop="meta.cache"
          >
            <el-radio-group v-model="formData.meta.cache" class="ml-4">
              <el-radio :value="false">不缓存</el-radio>
              <el-radio :value="true">缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          style="width: 300px"
          v-model="formData.sort"
          :min="1"
          :max="100000"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-row justify="center" style="margin-top: 10px">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-row>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>

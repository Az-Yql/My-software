<script lang="ts" setup>
import { getMenuList } from "@/api/system/menu";
import { getCheckRoleList, saveRole } from "@/api/system/role";
import type { ResponseMenuListType } from "@/api/types/menuType";
import { type ElTree } from "element-plus";
import { ref } from "vue";

// 控制抽屉的显示与隐藏
const visible = ref<boolean>(false);

// 抽屉的标题
const drawerTitle = ref<string>();

// 角色的id
const roleId = ref<number | string>();

// 保存选中的菜单的id
const menuIds = ref<string[]>([]);

// 关闭抽屉触发的方法
const handleClose = () => {
  visible.value = false;
};

// 打开抽屉的方法
const openDrawer = async (title: string, id: number | string) => {
  drawerTitle.value = title;
  visible.value = true;
  roleId.value = id;

  await initMenuList();
  await initCheckedMenuList();
  await checkMenuNode();
};

// 导出给父组件使用
defineExpose({
  openDrawer,
});

const defaultProps = {
  children: "children",
  // label: (data: ResponseMenuListType, node: Node) => {
  //   return data.meta.title;
  // },
};

const data = ref<ResponseMenuListType[]>([]);

const treeRef = ref<InstanceType<typeof ElTree>>();

// 全选与全不选的状态
const checked = ref<boolean>(false);

// tree展开或者收起的状态
const defaultExpandAll = ref<boolean>(false);

// 展开与收起的方法
const handleExpand = () => {
  defaultExpandAll.value = !defaultExpandAll.value;

  changeTreeNodeStatus(treeRef.value.root);
};

// 递归
const changeTreeNodeStatus = (node: Node) => {
  for (let i = 0; i < node!.childNodes.length; i++) {
    node!.childNodes[i]!.expanded = defaultExpandAll.value;

    if (node!.childNodes[i].childNodes.length > 0) {
      changeTreeNodeStatus(node!.childNodes[i]);
    }
  }
};

// 全选与全不选方法
const handleCheckAll = () => {
  checked.value = !checked.value;
  if (checked.value) {
    treeRef.value?.setCheckedNodes(data.value);
  } else {
    treeRef.value?.setCheckedNodes([]);
  }
};

// 获取菜单的数据
const initMenuList = async () => {
  try {
    const res = await getMenuList();
    data.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

// 获取选中的菜单权限数据
const initCheckedMenuList = async () => {
  try {
    const res = await getCheckRoleList(roleId.value as number);
    menuIds.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

// 根据后台返回的权限数据选中对应的节点
const checkMenuNode = () => {
  menuIds.value.forEach((id: string) => {
    treeRef.value?.setChecked(id, true, false);
  });
};

// 过滤ele
const filterIcon = (icon: string) => {
  if (icon) {
    return icon.replace("ele-", "");
  }
};

// 提交
const handleSubmit = async () => {
  try {
    // 获取选中的菜单的ids
    const checkedMenuIds = treeRef.value?.getCheckedKeys();
    console.log("checkedMenuIds", checkedMenuIds);

    // 获取半选中的父节点id
    const parentIds = treeRef.value?.getHalfCheckedKeys();

    // 合并选中的子节点id与半选中的父节点的id
    const menuIds = parentIds?.concat(checkedMenuIds!);

    // 分配权限
    const res = await saveRole(roleId.value as string, menuIds as string[]);

    // 关闭抽屉
    handleClose();
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <el-drawer
    v-model="visible"
    title="分配【售前客服】的权限"
    direction="rtl"
    :before-close="handleClose"
    size="400px"
  >
    <el-tree
      ref="treeRef"
      style="max-width: 600px"
      :data="data"
      show-checkbox
      node-key="id"
      :default-expand-all="defaultExpandAll"
      :props="defaultProps"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <svg-icon
            v-if="data.meta.icon"
            :icon="filterIcon(data.meta.icon)"
          ></svg-icon>
          <span style="margin-left: 10px">{{ data.meta.title }}</span>
        </span>
      </template>
    </el-tree>

    <template #footer>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleCheckAll">全选/全不选</el-button>
      <el-button @click="handleExpand">展开/收起</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.custom-tree-node {
  font-size: 14px;
  display: flex;
  // justify-content: center;
  align-items: center;
  padding-left: 10px;
}
</style>

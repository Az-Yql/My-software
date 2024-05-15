/**
 * 角色管理模块接口
 */

import request from "@/utils/request";
import type {
  AddRoleParamsType,
  ResponseRoleListType,
  RoleParamsType,
} from "../types/roleType";

/**
 * 获取角色列表接口
 * @param roleParams
 * @returns
 */
export const getRoleList = (roleParams: RoleParamsType) => {
  return request<ResponseRoleListType>(
    "/system/role/search",
    "POST",
    roleParams
  );
};

/**
 * 删除角色接口
 * @param id
 * @returns
 */
export const delRole = (id: number) => {
  return request(`/system/role/${id}`, "DELETE");
};

/**
 * 新增角色
 * @param roleParams
 * @returns
 */
export const addRole = (roleParams: AddRoleParamsType) => {
  return request("/system/role", "POST", roleParams);
};

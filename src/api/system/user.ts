/**
 * 用户管理相关接口
 */
import request from "@/utils/request";
import type {
  EditUserParamsType,
  PasswordDataType,
  ResponseUserListType,
  UserListParamsType,
  UserParamsType,
} from "../types/userType";

/**
 * 用户列表接口
 * @param userParams
 * @returns
 */
export const getUserList = (userListParams: UserListParamsType) => {
  return request<ResponseUserListType>(
    "/system/user/search",
    "POST",
    userListParams
  );
};

/**
 * 删除用户接口
 * @param id
 * @returns
 */
export const delUser = (id: number) => {
  return request(`/system/user/${id}`, "DELETE");
};

/**
 * 新增用户
 * @param userParams
 * @returns
 */
export const addUser = (userParams: UserParamsType) => {
  return request(`/system/user`, "POST", userParams);
};

/**
 * 编辑用户
 * @param userParams
 * @returns
 */
export const editUser = (userParams: EditUserParamsType) => {
  return request("/system/user", "PUT", userParams);
};

/**
 * 重置密码
 * @param data
 * @returns
 */
export const resetPassword = (data: PasswordDataType) => {
  return request("/system/user/password", "PUT", data);
};

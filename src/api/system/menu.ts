/**
 * 菜单管理模块接口
 */
import request from "@/utils/request";
import type {
  MenuParamsType,
  ResponseMenuListType,
  SearchParamsType,
} from "../types/menuType";

/**
 * 获取菜单列表
 * @param searchParams
 * @returns
 */
export const getMenuList = (searchParams?: SearchParamsType) => {
  return request<ResponseMenuListType[]>(
    "/system/menu/search",
    "POST",
    searchParams
  );
};

/**
 * 删除菜单接口
 * @param id
 * @returns
 */
export const delMenu = (id: number | string) => {
  return request(`/system/menu/${id}`, "DELETE");
};

/**
 * 新增菜单接口
 * @param menuParams
 * @returns
 */
export const addMenu = (menuParams: MenuParamsType) => {
  return request(`/system/menu`, "POST", menuParams);
};

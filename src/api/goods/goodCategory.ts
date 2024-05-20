import request from "@/utils/request";
import type { ResponseCategoryListType } from "../types/goodCategoryType";

/**
 * 获取商品分类列表
 * @returns
 */
export const getCategoryList = () => {
  return request<ResponseCategoryListType[]>("/goods/category/list", "GET");
};

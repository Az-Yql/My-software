import request from "@/utils/request";
import type {
  AddGoodParamsType,
  GoodListParamsType,
  ResponseGoodListType,
  StatusParamsType,
} from "../types/goodListType";

/**
 * 获取商品列表接口
 * @param goodListParams
 * @returns
 */
export const getGoodList = (goodListParams: GoodListParamsType) => {
  return request<ResponseGoodListType>("/goods/search", "POST", goodListParams);
};

/**
 * 修改商品状态接口
 * @param statusParams
 * @returns
 */
export const changeGoodStatus = (statusParams: StatusParamsType) => {
  return request("/goods/status", "PUT", statusParams);
};

/**
 * 删除商品接口
 * @param id
 * @returns
 */
export const delGood = (id: number) => {
  return request(`goods/${id}`, "DELETE");
};

/**
 * 根据商品编码查询商品接口
 * @param code
 * @returns
 */
export const findGood = (code: number) => {
  return request("/goods/exist", "GET", {
    code,
  });
};

/**
 * 新增商品接口
 * @param goodParams
 * @returns
 */
export const addGood = (goodParams: AddGoodParamsType) => {
  return request("/goods", "POST", goodParams);
};

/**
 * 编辑商品接口
 * @param goodParams
 * @returns
 */
export const editGood = (goodParams: AddGoodParamsType) => {
  return request("/goods", "PUT", goodParams);
};

import request from "@/utils/request";
import type { LoginParamsType, responseLoginType } from "./types/authType";

/**
 * 登录接口
 * @param loginParams
 * @returns
 */
export const login = (loginParams: LoginParamsType) => {
  return request<responseLoginType>("/auth/token", "POST", loginParams);
};

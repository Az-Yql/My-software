//用户管理相关接口
import request from "@/utils/request";
import type { ResponseUserListType, UserListParamsType } from "../types/userType";

export const getUserList=(userListParams:UserListParamsType)=>{
    return request<ResponseUserListType[]>('/system/user/search', 'POST',userListParams)

}
export type UserListParamsType = {
    current: number;
    keyword: string;
    size: number;
}

export type ResponseUserListType = {
    records: Record[];
    total: number;
  };

export type Record = {
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    createTime: string;
    credentialsNonExpired: boolean;
    email: string;
    id: number;
    imageUrl: string;
    mobile: string;
    nickName: string;
    password: string;
    remark: string;
    roleIds: number[];
    updateTime: string;
    username: string;
    [property: string]: any;
}
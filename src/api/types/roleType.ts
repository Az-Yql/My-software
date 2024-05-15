// 定义获取角色列表参数类型
export type RoleParamsType = {
  /**
   * 页码
   */
  current: number;
  /**
   * 角色名称
   */
  name: string;
  /**
   * 条数
   */
  size: number;
};

// 定义角色列表后台返回的数据类型
export type ResponseRoleListType = {
  records: Record[];
  total: number;
};

export type Record = {
  createTime: string;
  id: number;
  remark: string;
  roleCode: string;
  roleName: string;
  status: boolean;
  updateTime: string;
};

// 定义新增角色参数类型
export type AddRoleParamsType = {
  /**
   * 备注
   */
  remark: string;
  /**
   * 角色编码
   */
  roleCode: string;
  /**
   * 角色名称
   */
  roleName: string;
  /**
   * 角色状态
   */
  status: boolean;
};

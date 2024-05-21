export type GoodListParamsType = {
  /**
   * 页码
   */
  current: number;
  /**
   * 商品名称/编码
   */
  keyword: string;
  /**
   * 条数
   */
  size: number;
  /**
   * 商品状态
   */
  status: number;
};

export type ResponseGoodListType = {
  records: Record[];
  total: number;
  [property: string]: any;
};

export type Record = {
  address: string;
  brand: string;
  categoryId: number;
  categoryName: string;
  code: number;
  cost: number;
  createTime: string;
  discountPrice: number;
  goodsDetail: string;
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  quickCode: string;
  remark: string;
  score: number;
  sort: number;
  specsName: string;
  status: number;
  stockNum: number;
  unitName: string;
  updateTime: string;
  [property: string]: any;
};

export type StatusParamsType = {
  /**
   * 商品id
   */
  id: number;
  /**
   * 商品状态: 0 下 1 上
   */
  status: number;
};

export type AddGoodParamsType = {
  id?: number;
  address: string;
  brand: string;
  categoryId: number | string;
  code: string;
  cost: number;
  discountPrice: number;
  goodsDetail: string;
  imageUrl: string;
  name: string;
  price: number;
  quickCode: string;
  remark: string;
  score: number;
  sort: number;
  specsName: string;
  status: number;
  stockNum: number;
  unitName: string;
  updateTime?: string;
};

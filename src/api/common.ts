import request from "@/utils/request";

/**
 * 文件上传
 * @returns
 */
export const upload = (data: any) => {
  return request("/system/media/upload/img", "POST", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

import request from "@/utils/request";

/**
 * 文件上传
 * @returns
 */
export const upload = () => {
  return request(
    "/system/media/upload/img",
    "POST",
    {},
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

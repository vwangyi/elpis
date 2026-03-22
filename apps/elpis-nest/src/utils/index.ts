/* eslint-disable */
/* 请求成功 统一返回格式 */
export function success(data: any, msg: string) {
  return { code: 0, data, msg };
}
/* 请求失败 统一返回格式 */
export function fail(data: any, msg: string) {
  return { code: -1, data, msg };
}

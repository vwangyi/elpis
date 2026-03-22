// import { Injectable } from '@nestjs/common';
// import * as Client from 'ali-oss';
// import * as dayjs from 'dayjs';

// // pnpm add ali-oss
// // pnpm add dayjs
// // pnpm add -D @types/dayjs

// /**
//  * 注意这几个参数：

//     host：客户端上传文件时的地址
//     dir：需要和文件名拼接成一个完整的上传路径
//     signature：是一个临时的上传签名
//     policy ：用户表单上传的策略（Policy），Policy是一个经过 Base64 编码过的字符串
//     accessId： 用户请求的 AccessKey ID
//     expire：由服务器端指定的 Policy 过期时间，格式为Unix时间戳

//  */

// @Injectable()
// export class OssService {
//   async getSignature() {
//     const config = {
//       // 填写你自己的 AccessKey
//       accessKeyId: 'accessKeyId',
//       accessKeySecret: 'accessKeySecret',
//       // 存储桶名字
//       bucket: 'kw-tuku',
//       // 文件存储路径
//       dir: 'images/',
//     };

//     const client = new Client(config);

//     const date = new Date();
//     // 时长加 1 天，作为签名的有限期
//     date.setDate(date.getDate() + 1);

//     const policy = {
//       // 设置签名的有效期，格式为Unix时间戳
//       expiration: date.toISOString(),
//       conditions: [
//         ['content-length-range', 0, 10485760000], // 设置上传文件的大小限制
//       ],
//     };

//     // 生成签名，策略等信息
//     const formData = await client.calculatePostSignature(policy);

//     // 生成 bucket 域名，客户端将向此地址发送请求
//     const location = await client.getBucketLocation();
//     const host = `http://${config.bucket}.${location.location}.aliyuncs.com`;

//     // 响应给客户端的签名和策略等信息
//     return {
//       expire: dayjs().add(1, 'days').unix().toString(),
//       policy: formData.policy,
//       signature: formData.Signature,
//       accessId: formData.OSSAccessKeyId,
//       host,
//       dir: config.dir,
//     };
//   }
// }

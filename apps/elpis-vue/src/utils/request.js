import { message } from 'ant-design-vue';
import md5 from 'md5';
import axios from 'axios'; // https://www.axios-http.cn/docs/intro

// 前端明文存储这个key 好像也不是很安全？是的 我们加这一步 只能说算增加攻击成本 做不到绝对安全
const signKey = 'klx05hb3n1c9ujp8uhx4bs2iksdfsdfk5io6wp212';
/*
  调用方式为
  await request.get('xx/xx', {
    query: {},
    data: {},
    headers: {},
  })
*/
async function request(url, config = {}) {
  const { query, ...axiosConfig } = config;
  const st = Date.now();
  const ajax = {
    url,
    responseType: 'json',
    ...axiosConfig,
    // query 优先级高于原有的 params
    params: query || axiosConfig.params,
    headers: {
      ...axiosConfig.headers,
      s_t: st,
      s_sign: md5(`${signKey}_${st}`) // md5加密
    }
  };
  if ('query' in ajax) delete ajax.query;
  try {
    const res = await axios.request(ajax);
    // 业务失败：后端根据业务规则 主动返回失败 密码错误 token过期等等
    if (res.data.success !== true) {
      message.error(res.data.message || '业务失败');
    }
    // if (res.data.success === true) {
    //   message.success(res.data.message || '业务成功');
    // }
    // res.data才是后端给的数据 res其他数据均为axios附加数据
    return Promise.resolve(res.data);
  } catch (err) {
    /**
     * 物理失败：后端没收到请求，比如 请求超时 请求没通
     * 这里用 try-catch 来代替 axios.request的 .catch 返回成功的promise
     */
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.match(/timeout/)) {
      message.error('请求超时(后端没收到请求)', 5);
    }
    return Promise.resolve(err); // 返回成功的promise
  }
}

request.get = (url, config) =>
  request(url, {
    method: 'GET',
    ...config
  });
request.post = (url, config) =>
  request(url, {
    method: 'POST',
    ...config
  });
request.put = (url, config) =>
  request(url, {
    method: 'PUT',
    ...config
  });
request.delete = (url, config) =>
  request(url, {
    method: 'DELETE',
    ...config
  });
export default request;

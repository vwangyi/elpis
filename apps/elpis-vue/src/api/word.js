import request from '@/utils/request';

/* 查询单词 */
export function dict(word) {
  return request.get('/youdao/dictvoice', {
    query: {
      type: 0,
      audio: word
    },
    responseType: 'blob'
  });
}

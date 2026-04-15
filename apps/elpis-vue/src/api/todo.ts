import request from '@/utils/request';

export function getTodoList(pageIndex: number, pageSize: number) {
  return request.post('/api/todo/list/123', {
    query: { pageIndex, pageSize },
    data: { a: 1 },
    headers: { b: 2 }
  });
}

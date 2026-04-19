import request from '@/utils/request';

export function findAll(pageIndex: number, pageSize: number) {
  return request.get('/api/todo/list', {
    query: { pageIndex, pageSize }
  });
}

export function createTodo(data: Object) {
  return request.post('/api/todo/create', {
    data
  });
}

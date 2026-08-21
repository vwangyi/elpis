export interface ChatMsg {
  id?: number;
  room?: string;
  username: string;
  content: string;
  createTime?: string;
  type?: 'user' | 'system';
}

export interface OnlineUser {
  username: string;
  joinTime: number;
}

export interface HistoryPayload {
  list: ChatMsg[];
  total: number;
  page: number;
  pageSize: number;
}

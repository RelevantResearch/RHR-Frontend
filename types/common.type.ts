export interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ICommonResObj {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
}

export interface IQueryParams {
  page: number;
  limit: number;
}

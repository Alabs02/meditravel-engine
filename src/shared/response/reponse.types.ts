export interface SuccessResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  isSuccessful: true;
  errors: null;
}

export interface ErrorResponse {
  data: null;
  message: string;
  statusCode: number;
  isSuccessful: false;
  errors: string | string[] | object | object[] | null;
}

export interface SuccessParams<T> {
  data: T;
  message?: string;
  code?: number;
}

export interface ErrorParams {
  errors: string | string[] | object | object[] | null;
  message?: string;
  code?: number;
}

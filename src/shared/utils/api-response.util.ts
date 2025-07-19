export interface ApiResponse<T = any> {
  status: boolean;
  status_code: number;
  message: string;
  data: T;
  timestamp?: string;
}

export const response = <T = any>(
  status_code: number,
  message: string,
  data: T
): ApiResponse<T> => {
  return {
    status: status_code >= 200 && status_code < 300,
    status_code,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

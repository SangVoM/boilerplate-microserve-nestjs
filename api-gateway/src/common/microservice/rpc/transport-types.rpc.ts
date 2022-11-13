export type JSONRpcCodedError = { code: number; message: string; data: any };
export type JsonRpcResponse<T> =
  | { jsonrpc: '2.0'; id: string; result: T }
  | { jsonrpc: '2.0'; id: string; error: JSONRpcCodedError };

import type { StandardResponse } from "../types/standard.response.js";

export function StandardJsonResponse({ data, message }: { message: string; data?: any }): StandardResponse {
  return {
    data: data,
    errorCode: "",
    message: message,
    statusCode: 200,
    success: true,
  };
}

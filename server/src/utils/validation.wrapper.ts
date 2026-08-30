import { CustomError } from "./custom.httpexception.js";

const VALIDATION_ERROR_CODE = "VALIDATION_ERROR";
const VALIDATION_STATUS = 400;

// Hook untuk @hono/zod-validator. Throw supaya masuk jalur app.onError.
export function ValidationHook(result: {
  success: boolean;
  error?: any;
}): void {
  if (!result.success && result.error) {
    const message = result.error.issues
      .map(
        (issue: any) =>
          `${issue.path.join(".") || "payload"}: ${issue.message}`,
      )
      .join(", ");
    throw new CustomError(
      false,
      message,
      VALIDATION_ERROR_CODE,
      VALIDATION_STATUS,
      null,
    );
  }
}

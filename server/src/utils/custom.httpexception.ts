export class CustomError extends Error {
  constructor(
    public success: boolean,
    message: string,
    public errorCode: string,
    public statusCode: number,
    public data: any,
  ) {
    super(message);
    this.name = "Error";
  }
}

export function InternalError(message: string) {
  throw new CustomError(false, message, "INTERNAL_SERVICE_ERROR", 500, null);
}

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

export function BadRequestError(message: string) {
  throw new CustomError(false, message, "BAD_REQUEST", 400, null);
}

export function UnauthorizedError(message: string) {
  throw new CustomError(false, message, "UNAUTHORIZED", 401, null);
}

export function ForbiddenError(message: string) {
  throw new CustomError(false, message, "FORBIDDEN", 403, null);
}

export function NotFoundError(message: string) {
  throw new CustomError(false, message, "NOT_FOUND", 404, null);
}

export function ConflictError(message: string) {
  throw new CustomError(false, message, "CONFLICT", 409, null);
}

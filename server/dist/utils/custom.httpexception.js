export class CustomError extends Error {
    success;
    errorCode;
    statusCode;
    data;
    constructor(success, message, errorCode, statusCode, data) {
        super(message);
        this.success = success;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.data = data;
        this.name = "Error";
    }
}
export function InternalError(message) {
    throw new CustomError(false, message, "INTERNAL_SERVICE_ERROR", 500, null);
}

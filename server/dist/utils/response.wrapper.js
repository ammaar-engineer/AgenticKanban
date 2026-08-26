export function StandardJsonResponse({ data, message }) {
    return {
        data: data,
        errorCode: "",
        message: message,
        statusCode: 200,
        success: true,
    };
}

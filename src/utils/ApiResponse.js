class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = this.statusCode < 400;
        this.data = data;
    }
}

export { ApiResponse };

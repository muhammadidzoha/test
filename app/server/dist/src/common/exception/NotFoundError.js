"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const ClientError_1 = require("./ClientError");
class NotFoundError extends ClientError_1.ClientError {
    constructor(message, statusCode = 404) {
        super(message, statusCode);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
exports.NotFoundError = NotFoundError;

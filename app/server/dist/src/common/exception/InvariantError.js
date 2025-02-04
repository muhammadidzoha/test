"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvariantError = void 0;
const ClientError_1 = require("./ClientError");
class InvariantError extends ClientError_1.ClientError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
        this.message = message;
        this.statusCode = statusCode;
        this.name = 'InvariantError';
    }
}
exports.InvariantError = InvariantError;

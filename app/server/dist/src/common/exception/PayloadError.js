"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadError = void 0;
const InvariantError_1 = require("./InvariantError");
class PayloadError extends InvariantError_1.InvariantError {
    constructor(message) {
        super(message, 422);
        this.name = 'PayloadError';
    }
}
exports.PayloadError = PayloadError;

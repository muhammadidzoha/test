"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayload = void 0;
const exception_1 = require("../../exception");
const validatePayload = (schema, payload) => {
    const result = schema.validate(payload);
    if (result.error) {
        throw new exception_1.InvariantError(result.error.message);
    }
};
exports.validatePayload = validatePayload;

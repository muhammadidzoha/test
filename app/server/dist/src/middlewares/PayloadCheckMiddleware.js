"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payloadCheckMiddleware = void 0;
const http_1 = require("../common/http");
const payloadCheckMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            (0, http_1.validatePayload)(schema, req.body); // Validate the payload
            next(); // Proceed if validation passes
        }
        catch (error) {
            (0, http_1.handleError)(error, res); // Handle the error and send a response
        }
    };
};
exports.payloadCheckMiddleware = payloadCheckMiddleware;

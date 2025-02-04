"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const exception_1 = require("../exception");
const AuthenticationError_1 = require("../exception/AuthenticationError");
const handleError = (error, res) => {
    if (error instanceof exception_1.InvariantError) {
        return res.status(400).json({
            status: 'Fail',
            message: error.message
        });
    }
    if (error instanceof exception_1.NotFoundError) {
        return res.status(404).json({
            status: 'Fail',
            message: error.message
        });
    }
    if (error instanceof AuthenticationError_1.AuthenticationError) {
        return res.status(401).json({
            status: 'Fail',
            message: error.message
        });
    }
    if (error instanceof exception_1.AuthorizationError) {
        return res.status(403).json({
            status: 'Fail',
            message: error.message
        });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'Fail',
            message: 'Token is already expired'
        });
    }
    res.status(500).json({
        status: 'Fail',
        message: `Internal server error: ${error.message}`
    });
};
exports.handleError = handleError;

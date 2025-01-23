import { AuthorizationError, InvariantError, NotFoundError } from "../exception";
import { AuthenticationError } from "../exception/AuthenticationError";
import { ClientError } from "../exception/ClientError";

export const handleError = (error: any, res: any) => {
    if (error instanceof InvariantError) {
        return res.status(400).json({
            status: 'Fail',
            message: error.message
        });
    }

    if (error instanceof NotFoundError) {
        return res.status(404).json({
            status: 'Fail',
            message: error.message
        });
    }

    if (error instanceof AuthenticationError) {
        return res.status(401).json({
            status: 'Fail',
            message: error.message
        });
    }

    if (error instanceof AuthorizationError) {
        return res.status(403).json({
            status: 'Fail',
            message: error.message
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'Fail',
            message: 'Token is already expired'
        })
    }

    res.status(500).json({
        status: 'Fail',
        message: `Internal server error: ${error.message}`
    });
}
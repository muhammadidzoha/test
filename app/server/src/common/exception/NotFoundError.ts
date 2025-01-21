import { ClientError } from "./ClientError";

export class NotFoundError extends ClientError {
    constructor(public message: string, public statusCode: number = 404) {
        super(message, statusCode);
        this.statusCode = statusCode;
    }
}
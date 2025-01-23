import { ClientError } from "./ClientError";

export class InvariantError extends ClientError {
    constructor(public message: string, public statusCode: number = 400) {
        super(message, statusCode);
        this.name = 'InvariantError';
    }
}
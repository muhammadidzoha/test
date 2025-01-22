import { ClientError } from "./ClientError";

export class PayloadError extends ClientError {
    constructor(message: string) {
        super(message, 422);
        this.name = 'PayloadError';
    }
}
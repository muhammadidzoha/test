import { InvariantError } from "./InvariantError";

export class PayloadError extends InvariantError {
    constructor(message: string) {
        super(message, 422);
        this.name = 'PayloadError';
    }
}
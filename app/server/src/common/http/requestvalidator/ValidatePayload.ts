import { InvariantError } from '../../exception';

export const validatePayload = (schema: any, payload: any) => {
    const result = schema.validate(payload);
    if (result.error) {
        throw new InvariantError(result.error.message);
    }
}
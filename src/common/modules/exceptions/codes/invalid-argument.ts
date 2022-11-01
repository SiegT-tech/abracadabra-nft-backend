import { Errors } from './errors.enum';

export const INVALID_ARGUMENT_ERRORS = {
    INVALID_ARGUMENT: {
        code: Errors.INVALID_ARGUMENT,
        message: 'Invalid argument',
    },

    SIGNATURE_IS_INVALID: {
        code: Errors.SIGNATURE_IS_INVALID,
        message: 'Signature is invalid',
    },
};

import { Errors } from './errors.enum';

export const NOT_FOUND_ERRORS = {
    NOT_FOUND: {
        code: Errors.NOT_FOUND,
        message: 'Not found',
    },

    CAULDRON_NOT_FOUND: {
        code: Errors.CAULDRON_NOT_FOUND,
        message: 'Cauldron not found',
    },

    NFT_NOT_FOUND: {
        code: Errors.NFT_NOT_FOUND,
        message: 'Nft not found',
    },

    COLLATERAL_NOT_FOUND: {
        code: Errors.COLLATERAL_NOT_FOUND,
        message: 'Collateral not found',
    },
};

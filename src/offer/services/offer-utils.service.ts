import { Injectable } from '@nestjs/common';
import { utils } from 'ethers';
import { recoverAddress, keccak256 } from 'nestjs-ethers';

import { CauldronEntity } from '../../cauldron/dao/cauldron.entity';
import { LEND_SIGNATURE_HASH, BORROW_SIGNATURE_HASH, LEND_ORACLE_SIGNATURE_HASH, BORROW_ORACLE_SIGNATURE_HASH } from '../../env';
import { getDomainSeparator, getDigest } from '../../utils';

@Injectable()
export class OfferUtilsService {
    public checkLendSignature(
        cauldron: CauldronEntity,
        anyTokenId: boolean,
        tokenId: number,
        valuation: number,
        duration: number,
        annualInterestBPS: number,
        nonce: number,
        deadline: number,
        lender: string,
        sign: string,
    ): boolean {
        const dataHash = keccak256(
            utils.defaultAbiCoder.encode(
                ['bytes32', 'address', 'uint256', 'bool', 'uint128', 'uint64', 'uint16', 'uint256', 'uint256'],
                [LEND_SIGNATURE_HASH, cauldron.address, tokenId, anyTokenId, valuation, duration, annualInterestBPS, nonce, deadline],
            ),
        );
        const domainSeparator = getDomainSeparator(cauldron.network, cauldron.masterContract);
        const digest = getDigest(domainSeparator, dataHash);
        const targetAddress = recoverAddress(digest, sign);
        return targetAddress === lender;
    }

    public checkLendSignatureWithOralce(
        cauldron: CauldronEntity,
        anyTokenId: boolean,
        tokenId: number,
        valuation: number,
        duration: number,
        annualInterestBPS: number,
        nonce: number,
        deadline: number,
        lender: string,
        sign: string,
        oracle: string,
        ltvBPS: number,
    ): boolean {
        const dataHash = keccak256(
            utils.defaultAbiCoder.encode(
                ['bytes32', 'address', 'uint256', 'bool', 'uint128', 'uint64', 'uint16', 'uint16', 'address', 'uint256', 'uint256'],
                [LEND_ORACLE_SIGNATURE_HASH, cauldron.address, tokenId, anyTokenId, valuation, duration, annualInterestBPS, ltvBPS, oracle, nonce, deadline],
            ),
        );
        const domainSeparator = getDomainSeparator(cauldron.network, cauldron.masterContract);
        const digest = getDigest(domainSeparator, dataHash);
        const targetAddress = recoverAddress(digest, sign);
        return targetAddress === lender;
    }

    public checkBorrowSignature(
        cauldron: CauldronEntity,
        tokenId: number,
        valuation: number,
        duration: number,
        annualInterestBPS: number,
        nonce: number,
        deadline: number,
        borrower: string,
        sign: string,
    ): boolean {
        const dataHash = keccak256(
            utils.defaultAbiCoder.encode(
                ['bytes32', 'address', 'uint256', 'uint128', 'uint64', 'uint16', 'uint256', 'uint256'],
                [BORROW_SIGNATURE_HASH, cauldron.address, tokenId, valuation, duration, annualInterestBPS, nonce, deadline],
            ),
        );
        const domainSeparator = getDomainSeparator(cauldron.network, cauldron.masterContract);
        const digest = getDigest(domainSeparator, dataHash);
        const targetAddress = recoverAddress(digest, sign);
        return targetAddress === borrower;
    }

    public checkBorrowSignatureWithOralce(
        cauldron: CauldronEntity,
        tokenId: number,
        valuation: number,
        duration: number,
        annualInterestBPS: number,
        nonce: number,
        deadline: number,
        borrower: string,
        sign: string,
        oracle: string,
        ltvBPS: number,
    ): boolean {
        const dataHash = keccak256(
            utils.defaultAbiCoder.encode(
                ['bytes32', 'address', 'uint256', 'uint128', 'uint64', 'uint16', 'uint16', 'address', 'uint256', 'uint256'],
                [BORROW_ORACLE_SIGNATURE_HASH, cauldron.address, tokenId, valuation, duration, annualInterestBPS, ltvBPS, oracle, nonce, deadline],
            ),
        );
        const domainSeparator = getDomainSeparator(cauldron.network, cauldron.masterContract);
        const digest = getDigest(domainSeparator, dataHash);
        const targetAddress = recoverAddress(digest, sign);
        return targetAddress === borrower;
    }
}

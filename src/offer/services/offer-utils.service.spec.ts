import { Test } from '@nestjs/testing';
import { Wallet, AddressZero } from 'nestjs-ethers';

import { Networks } from '../../blockchain/constants';
import { CauldronEntity } from '../../cauldron/dao/cauldron.entity';
import { getTimeNowSec } from '../../utils';

import { OfferUtilsService } from './offer-utils.service';

describe('OfferUtilsService', () => {
    let offerUtilsService: OfferUtilsService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [OfferUtilsService],
        }).compile();

        offerUtilsService = moduleRef.get(OfferUtilsService);
    });

    describe('checkLendSignature', () => {
        const timestamp = getTimeNowSec();
        const valuation = 1000;
        const duration = 365 * 24 * 3600;
        const annualInterestBPS = 15000;
        const deadline = timestamp + 3600;
        const cauldron = {
            address: '0x9AEEf9f52eCCef2dc970090c304635fb29161805',
            masterContract: '0x3a341f5474aac54829a587cE6ab13C86af6B1E29',
            network: Networks.MAINNET,
        } as CauldronEntity;
        const tokenId = 0;

        const sigTypes = [
            { name: 'contract', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'anyTokenId', type: 'bool' },
            { name: 'valuation', type: 'uint128' },
            { name: 'duration', type: 'uint64' },
            { name: 'annualInterestBPS', type: 'uint16' },
            { name: 'batchId', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ];

        it('should return true', async () => {
            const wallet = Wallet.createRandom();

            const sigValues = {
                contract: cauldron.address,
                tokenId,
                anyTokenId: true,
                valuation,
                duration,
                annualInterestBPS,
                batchId: 0,
                deadline,
            };

            const sig = await wallet._signTypedData({ chainId: cauldron.network, verifyingContract: cauldron.masterContract }, { Lend: sigTypes }, sigValues);

            const check = offerUtilsService.checkLendSignature(cauldron, true, tokenId, valuation, duration, annualInterestBPS, 0, deadline, wallet.address, sig);
            expect(check).toBeTruthy();
        });
    });

    describe('checkLendSignatureWithOralce', () => {
        const timestamp = getTimeNowSec();
        const valuation = 1000;
        const duration = 365 * 24 * 3600;
        const annualInterestBPS = 15000;
        const oracle = AddressZero;
        const ltvBPS = 1000;
        const deadline = timestamp + 3600;
        const cauldron = {
            address: '0x9AEEf9f52eCCef2dc970090c304635fb29161805',
            masterContract: '0x3a341f5474aac54829a587cE6ab13C86af6B1E29',
            network: Networks.MAINNET,
        } as CauldronEntity;
        const tokenId = 0;

        const sigTypes = [
            { name: 'contract', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'anyTokenId', type: 'bool' },
            { name: 'valuation', type: 'uint128' },
            { name: 'duration', type: 'uint64' },
            { name: 'annualInterestBPS', type: 'uint16' },
            { name: 'ltvBPS', type: 'uint16' },
            { name: 'oracle', type: 'address' },
            { name: 'batchId', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ];

        it('should return true', async () => {
            const wallet = Wallet.createRandom();

            const sigValues = {
                contract: cauldron.address,
                tokenId,
                anyTokenId: true,
                valuation,
                duration,
                annualInterestBPS,
                batchId: 0,
                deadline,
                oracle,
                ltvBPS,
            };

            const sig = await wallet._signTypedData({ chainId: cauldron.network, verifyingContract: cauldron.masterContract }, { Lend: sigTypes }, sigValues);
            const check = offerUtilsService.checkLendSignatureWithOralce(
                cauldron,
                true,
                tokenId,
                valuation,
                duration,
                annualInterestBPS,
                0,
                deadline,
                wallet.address,
                sig,
                oracle,
                ltvBPS,
            );
            expect(check).toBeTruthy();
        });
    });

    describe('checkBorrowSignature', () => {
        const timestamp = getTimeNowSec();
        const valuation = 1000;
        const duration = 365 * 24 * 3600;
        const annualInterestBPS = 15000;
        const deadline = timestamp + 3600;
        const cauldron = {
            address: '0x9AEEf9f52eCCef2dc970090c304635fb29161805',
            masterContract: '0x3a341f5474aac54829a587cE6ab13C86af6B1E29',
            network: Networks.MAINNET,
        } as CauldronEntity;
        const tokenId = 0;

        const sigTypes = [
            { name: 'contract', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'valuation', type: 'uint128' },
            { name: 'duration', type: 'uint64' },
            { name: 'annualInterestBPS', type: 'uint16' },
            { name: 'batchId', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ];

        it('should return true', async () => {
            const wallet = Wallet.createRandom();

            const sigValues = {
                contract: cauldron.address,
                tokenId,
                valuation,
                duration,
                annualInterestBPS,
                batchId: 0,
                deadline,
            };

            const sig = await wallet._signTypedData({ chainId: cauldron.network, verifyingContract: cauldron.masterContract }, { Borrow: sigTypes }, sigValues);

            const check = offerUtilsService.checkBorrowSignature(cauldron, tokenId, valuation, duration, annualInterestBPS, 0, deadline, wallet.address, sig);
            expect(check).toBeTruthy();
        });
    });

    describe('checkBorrowSignatureWithOralce', () => {
        const timestamp = getTimeNowSec();
        const valuation = 1000;
        const duration = 365 * 24 * 3600;
        const annualInterestBPS = 15000;
        const deadline = timestamp + 3600;
        const cauldron = {
            address: '0x9AEEf9f52eCCef2dc970090c304635fb29161805',
            masterContract: '0x3a341f5474aac54829a587cE6ab13C86af6B1E29',
            network: Networks.MAINNET,
        } as CauldronEntity;
        const tokenId = 0;
        const oracle = AddressZero;
        const ltvBPS = 1000;

        const sigTypes = [
            { name: 'contract', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'valuation', type: 'uint128' },
            { name: 'duration', type: 'uint64' },
            { name: 'annualInterestBPS', type: 'uint16' },
            { name: 'ltvBPS', type: 'uint16' },
            { name: 'oracle', type: 'address' },
            { name: 'batchId', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ];

        it('should return true', async () => {
            const wallet = Wallet.createRandom();

            const sigValues = {
                contract: cauldron.address,
                tokenId,
                valuation,
                duration,
                annualInterestBPS,
                ltvBPS,
                oracle,
                batchId: 0,
                deadline,
            };

            const sig = await wallet._signTypedData({ chainId: cauldron.network, verifyingContract: cauldron.masterContract }, { Borrow: sigTypes }, sigValues);

            const check = offerUtilsService.checkBorrowSignatureWithOralce(
                cauldron,
                tokenId,
                valuation,
                duration,
                annualInterestBPS,
                0,
                deadline,
                wallet.address,
                sig,
                oracle,
                ltvBPS,
            );
            expect(check).toBeTruthy();
        });
    });
});

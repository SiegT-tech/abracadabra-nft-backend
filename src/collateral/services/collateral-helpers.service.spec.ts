import { Test } from '@nestjs/testing';
import { ILike } from 'typeorm';

import { Networks } from '../../blockchain/constants';

import { CollateralBlockchainService } from './collateral-blockchain.service';
import { CollateralHelpersService } from './collateral-helpers.service';
import { CollateralService } from './collateral.service';

import { CollateralEntity } from '../dao/collateral.entity';

describe('CollateralHelpersService', () => {
    let collateralHelpersService: CollateralHelpersService;
    let collateralService: CollateralService;
    let collateralBlockchainService: CollateralBlockchainService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CollateralHelpersService, CollateralService, CollateralBlockchainService],
        })
            .overrideProvider(CollateralService)
            .useValue({
                readOne: jest.fn,
                create: jest.fn,
            })
            .overrideProvider(CollateralBlockchainService)
            .useValue({
                getCollateral: jest.fn,
            })
            .compile();

        collateralHelpersService = moduleRef.get(CollateralHelpersService);
        collateralService = moduleRef.get(CollateralService);
        collateralBlockchainService = moduleRef.get(CollateralBlockchainService);
    });

    describe('findOrCreateCollateral', () => {
        let actual$: Promise<CollateralEntity>;
        let readMock: jest.SpyInstance;
        let getCollateral: jest.SpyInstance;
        let createMock: jest.SpyInstance;

        beforeEach(() => {
            readMock = jest.spyOn(collateralService, 'readOne').mockResolvedValueOnce(null);
            getCollateral = jest.spyOn(collateralBlockchainService, 'getCollateral').mockResolvedValueOnce({} as Partial<CollateralEntity>);
            createMock = jest.spyOn(collateralService, 'create').mockResolvedValueOnce({} as CollateralEntity);
            actual$ = collateralHelpersService.findOrCreateCollateral(Networks.MAINNET, 'address');
        });

        it('should return collateral', async () => {
            const actual = await actual$;
            expect(actual).toEqual({});
        });

        it('should call read', async () => {
            await actual$;
            expect(readMock).toHaveBeenCalledTimes(1);
            expect(readMock).toHaveBeenCalledWith({ network: Networks.MAINNET, address: ILike(`%address%`) });
        });

        it('should call getCollateral', async () => {
            await actual$;
            expect(getCollateral).toHaveBeenCalledTimes(1);
            expect(getCollateral).toHaveBeenCalledWith(Networks.MAINNET, 'address');
        });

        it('should call create', async () => {
            await actual$;
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledWith({ canSync: false });
        });
    });
});

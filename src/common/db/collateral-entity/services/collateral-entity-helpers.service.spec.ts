import { Test } from '@nestjs/testing';
import { ILike } from 'typeorm';

import { Networks } from '../../../modules/blockchain/constants';
import { BlockchainHelpersService } from '../../../modules/blockchain/services/blockchain-helpers.service';

import { CollateralEntityHelpersService } from './collateral-entity-helpers.service';
import { CollateralEntityService } from './collateral-entity.service';

import { CollateralEntity } from '../dao/collateral.entity';

describe('CollateralEntityHelpersService', () => {
    let collateralEntityHelpersService: CollateralEntityHelpersService;
    let collateralEntityService: CollateralEntityService;
    let blockchainHelpersService: BlockchainHelpersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CollateralEntityHelpersService, CollateralEntityService, BlockchainHelpersService],
        })
            .overrideProvider(CollateralEntityService)
            .useValue({
                readOne: jest.fn,
                create: jest.fn,
            })
            .overrideProvider(BlockchainHelpersService)
            .useValue({
                getCollateral: jest.fn,
            })
            .compile();

        collateralEntityHelpersService = moduleRef.get(CollateralEntityHelpersService);
        collateralEntityService = moduleRef.get(CollateralEntityService);
        blockchainHelpersService = moduleRef.get(BlockchainHelpersService);
    });

    describe('findOrCreateCollateral', () => {
        let actual$: Promise<CollateralEntity>;
        let readMock: jest.SpyInstance;
        let getCollateral: jest.SpyInstance;
        let createMock: jest.SpyInstance;

        beforeEach(() => {
            readMock = jest.spyOn(collateralEntityService, 'readOne').mockResolvedValueOnce(null);
            getCollateral = jest.spyOn(blockchainHelpersService, 'getCollateral').mockResolvedValueOnce({} as Partial<CollateralEntity>);
            createMock = jest.spyOn(collateralEntityService, 'create').mockResolvedValueOnce({} as CollateralEntity);
            actual$ = collateralEntityHelpersService.findOrCreateCollateral(Networks.MAINNET, 'address');
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

import { Test } from '@nestjs/testing';
import { ILike } from 'typeorm';

import { Networks } from '../../../modules/blockchain/constants';
import { IAsset } from '../../../modules/blockchain/interfaces/asset.interface';
import { BlockchainHelpersService } from '../../../modules/blockchain/services/blockchain-helpers.service';

import { AssetEntityHelpersService } from './asset-entity-helpers.service';
import { AssetEntityService } from './asset-entity.service';

import { AssetEntity } from '../dao/asset.entity';

describe('AssetEntityHelpersService', () => {
    let blockchainHelpersService: BlockchainHelpersService;
    let assetEntityService: AssetEntityService;
    let assetEntityHelpersService: AssetEntityHelpersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [BlockchainHelpersService, AssetEntityService, AssetEntityHelpersService],
        })
            .overrideProvider(AssetEntityService)
            .useValue({
                read: jest.fn,
                create: jest.fn,
            })
            .overrideProvider(BlockchainHelpersService)
            .useValue({
                getAsset: jest.fn,
            })
            .compile();

        assetEntityService = moduleRef.get(AssetEntityService);
        blockchainHelpersService = moduleRef.get(BlockchainHelpersService);
        assetEntityHelpersService = moduleRef.get(AssetEntityHelpersService);
    });

    describe('findOrCreateAsset', () => {
        describe('asset exist', () => {
            let readMock: jest.SpyInstance;
            let actual$: Promise<AssetEntity>;

            beforeEach(() => {
                readMock = jest.spyOn(assetEntityService, 'read').mockResolvedValueOnce({} as AssetEntity);
                actual$ = assetEntityHelpersService.findOrCreateAsset(Networks.MAINNET, 'address');
            });

            it('should return asset', async () => {
                const actual = await actual$;
                expect(actual).toEqual({});
            });

            it('should call read', async () => {
                await actual$;
                expect(readMock).toHaveBeenCalledTimes(1);
                expect(readMock).toHaveBeenCalledWith({ network: Networks.MAINNET, address: ILike('%address%') });
            });
        });

        describe('asset not exist', () => {
            let readMock: jest.SpyInstance;
            let getAssetMock: jest.SpyInstance;
            let createMock: jest.SpyInstance;
            let actual$: Promise<AssetEntity>;

            beforeEach(() => {
                readMock = jest.spyOn(assetEntityService, 'read').mockResolvedValueOnce(null);
                getAssetMock = jest.spyOn(blockchainHelpersService, 'getAsset').mockResolvedValueOnce({} as IAsset);
                createMock = jest.spyOn(assetEntityService, 'create').mockResolvedValueOnce({} as AssetEntity);
                actual$ = assetEntityHelpersService.findOrCreateAsset(Networks.MAINNET, 'address');
            });

            it('should return asset', async () => {
                const actual = await actual$;
                expect(actual).toEqual({});
            });

            it('should call read', async () => {
                await actual$;
                expect(readMock).toHaveBeenCalledTimes(1);
                expect(readMock).toHaveBeenCalledWith({ network: Networks.MAINNET, address: ILike('%address%') });
            });

            it('should call getAsset', async () => {
                await actual$;
                expect(getAssetMock).toHaveBeenCalledTimes(1);
                expect(getAssetMock).toHaveBeenCalledWith(Networks.MAINNET, 'address');
            });

            it('should call create', async () => {
                await actual$;
                expect(createMock).toHaveBeenCalledTimes(1);
                expect(createMock).toHaveBeenCalledWith({});
            });
        });
    });
});

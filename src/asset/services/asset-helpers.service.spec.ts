import { Test } from '@nestjs/testing';
import { ILike } from 'typeorm';

import { Networks } from '../../blockchain/constants';

import { AssetBlockchainService } from './asset-blockchain.service';
import { AssetHelpersService } from './asset-helpers.service';
import { AssetService } from './asset.service';

import { AssetEntity } from '../dao/asset.entity';
import { IAsset } from '../interfaces/asset.interface';

describe('AssetHelpersService', () => {
    let assetBlockchainService: AssetBlockchainService;
    let assetService: AssetService;
    let assetHelpersService: AssetHelpersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AssetBlockchainService, AssetService, AssetHelpersService],
        })
            .overrideProvider(AssetService)
            .useValue({
                read: jest.fn,
                create: jest.fn,
            })
            .overrideProvider(AssetBlockchainService)
            .useValue({
                getAsset: jest.fn,
            })
            .compile();

        assetService = moduleRef.get(AssetService);
        assetBlockchainService = moduleRef.get(AssetBlockchainService);
        assetHelpersService = moduleRef.get(AssetHelpersService);
    });

    describe('findOrCreateAsset', () => {
        describe('asset exist', () => {
            let readMock: jest.SpyInstance;
            let actual$: Promise<AssetEntity>;

            beforeEach(() => {
                readMock = jest.spyOn(assetService, 'read').mockResolvedValueOnce({} as AssetEntity);
                actual$ = assetHelpersService.findOrCreateAsset(Networks.MAINNET, 'address');
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
                readMock = jest.spyOn(assetService, 'read').mockResolvedValueOnce(null);
                getAssetMock = jest.spyOn(assetBlockchainService, 'getAsset').mockResolvedValueOnce({} as IAsset);
                createMock = jest.spyOn(assetService, 'create').mockResolvedValueOnce({} as AssetEntity);
                actual$ = assetHelpersService.findOrCreateAsset(Networks.MAINNET, 'address');
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

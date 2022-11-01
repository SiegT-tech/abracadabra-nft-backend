import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { tokenUrlToHttp } from '../../../../utils';
import { CollateralEntity } from '../../../db/collateral-entity/dao/collateral.entity';

import { BlockchainUtilsService } from './blockhain-utils.service';

import { CoingeckoRes } from '../interfaces/coingecko.interface';
import { NftInfo } from '../interfaces/nft.interface';
import { OpenseaRes } from '../interfaces/opensea.interface';
import { RaribleRes } from '../interfaces/rarible.interface';

@Injectable()
export class BlockchainExternalApisService {
    constructor(private readonly httpService: HttpService, private readonly blockchainUtilsService: BlockchainUtilsService) {}

    public async getNftInfo(tokenUrl: string): Promise<NftInfo> {
        const url = tokenUrlToHttp(tokenUrl);
        const { data } = await this.httpService.get(url).toPromise();
        if (data.image) {
            data.image = tokenUrlToHttp(data.image);
        }
        return data;
    }

    public async opensea(collateral: Partial<CollateralEntity>): Promise<Partial<CollateralEntity>> {
        const id = this.blockchainUtilsService.toSlug(collateral.name);

        try {
            const { data } = await this.httpService.get<OpenseaRes>(`https://api.opensea.io/api/v1/collection/${id}`).toPromise();

            if (data.collection) {
                const { banner_image_url, image_url, large_image_url, stats } = data.collection;
                collateral.banner = banner_image_url || large_image_url;
                collateral.logo = image_url;
                if (stats) {
                    const { floor_price } = stats;
                    collateral.floorPrice = floor_price;
                }
            }
        } catch (err) {}

        return collateral;
    }

    public async coingecko(collateral: Partial<CollateralEntity>): Promise<Partial<CollateralEntity>> {
        if (collateral.floorPrice) return collateral;

        const id = this.blockchainUtilsService.toSlug(collateral.name);

        try {
            const { data } = await this.httpService.get<CoingeckoRes>(`https://api.coingecko.com/api/v3/nfts/${id}`).toPromise();

            if (data.floor_price) {
                const { native_currency } = data.floor_price;
                collateral.floorPrice = native_currency;
            }
        } catch (err) {}

        return collateral;
    }

    public async rarible(collateral: Partial<CollateralEntity>): Promise<Partial<CollateralEntity>> {
        if (collateral.floorPrice) return collateral;

        const tag = this.blockchainUtilsService.toRaribleSlug(collateral.address, collateral.network);

        try {
            const { data } = await this.httpService.get<RaribleRes>(`https://api.rarible.org/v0.1/collections/${tag}`).toPromise();

            if (data.statistics && data.statistics.floorPrice) {
                collateral.floorPrice = data.statistics.floorPrice.value;
            }
        } catch (err) {}

        return collateral;
    }
}

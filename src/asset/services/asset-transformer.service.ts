import { Injectable } from '@nestjs/common';

import { AssetEntity } from '../dao/asset.entity';
import { AssetWithPagination } from '../interfaces/asset-with-pagination.interface';

@Injectable()
export class AssetTransformerService {
    public toAssetWithPagination({ assets, pagination }: AssetWithPagination) {
        return {
            assets: assets.map(asset => this.toAsset(asset)),
            pagination,
        };
    }

    public toAsset({ id, name, decimals, address, network }: AssetEntity) {
        return {
            id,
            name,
            decimals,
            address,
            network,
        };
    }
}

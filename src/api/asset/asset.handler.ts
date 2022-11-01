import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

import { AssetEntityService } from '../../common/db/asset-entity/services/asset-entity.service';

import { GetAssetsDto } from './dto/get-assets.dto';
import { AssetTransformerService } from './services/asset-transformer.service';

@Injectable()
export class AssetHandler {
    constructor(private readonly assetEntityService: AssetEntityService, private readonly assetTransformerService: AssetTransformerService) {}

    public getAssets(dto: GetAssetsDto) {
        return this.assetEntityService.getAssets(dto.filters, dto.pagination).pipe(map(data => this.assetTransformerService.toAssetWithPagination(data)));
    }
}

import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

import { GetAssetsDto } from './dto/get-assets.dto';
import { AssetTransformerService } from './services/asset-transformer.service';
import { AssetService } from './services/asset.service';

@Injectable()
export class AssetHandler {
    constructor(private readonly assetService: AssetService, private readonly assetTransformerService: AssetTransformerService) {}

    public getAssets(dto: GetAssetsDto) {
        return this.assetService.getAssets(dto.filters, dto.pagination).pipe(map(data => this.assetTransformerService.toAssetWithPagination(data)));
    }
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AssetHandler } from './asset.handler';
import { GetAssetsDto } from './dto/get-assets.dto';

@ApiTags('Asset')
@Controller('asset')
export class AssetController {
    constructor(private readonly assetHandler: AssetHandler) {}

    @Post()
    public getAssets(@Body() body: GetAssetsDto) {
        return this.assetHandler.getAssets(body);
    }
}

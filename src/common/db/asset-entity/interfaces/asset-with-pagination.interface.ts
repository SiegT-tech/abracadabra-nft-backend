import { IPagination } from '../../../interfaces/pagination.interface';

import { AssetEntity } from '../dao/asset.entity';

export interface AssetWithPagination {
    assets: AssetEntity[];
    pagination: IPagination;
}

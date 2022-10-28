import { IPagination } from '../../common/interfaces/pagination.interface';

import { NftEntity } from '../dao/nft.entity';

export interface NftWithPagination {
    nfts: NftEntity[];
    pagination: IPagination;
}

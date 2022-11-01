import { Injectable } from '@nestjs/common';

import { Networks, NetworksNames } from '../constants';

@Injectable()
export class BlockchainUtilsService {
    public toSlug(name: string) {
        return name.replace(/ /g, '-').toLowerCase();
    }

    public toRaribleSlug(address: string, network: Networks) {
        const name = NetworksNames[network];
        return `${name}:${address}`;
    }
}

import { Injectable } from '@nestjs/common';

import { CollateralEntity } from '../../collateral/dao/collateral.entity';

import { NftAttributesEntityService } from './nft-attributes-entity.service';
import { TokenAttribute } from './nft-utils.service';

import { NftAttributesEntity } from '../dao/nft-attributes.entity';

@Injectable()
export class NftAttributesHelpersService {
    constructor(private readonly nftAttributesEntityService: NftAttributesEntityService) {}

    public async findOrCreateNftAttribute(collateral: CollateralEntity, attribut: TokenAttribute): Promise<NftAttributesEntity> {
        let _attribut = await this.nftAttributesEntityService.readOne({ type: attribut.trait_type, value: attribut.value, collateral });
        if (!_attribut) {
            _attribut = await this.nftAttributesEntityService.create({ type: attribut.trait_type, value: attribut.value, collateral });
        }
        return _attribut;
    }

    public async findOrCreateNftAttributes(collateral: CollateralEntity, attributs: TokenAttribute[]): Promise<NftAttributesEntity[]> {
        return Promise.all(attributs.map(async attribut => await this.findOrCreateNftAttribute(collateral, attribut)));
    }
}

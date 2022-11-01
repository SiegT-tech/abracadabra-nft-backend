import { Injectable } from '@nestjs/common';

import { NftAttribute } from '../../../modules/blockchain/interfaces/nft.interface';
import { CollateralEntity } from '../../collateral-entity/dao/collateral.entity';

import { NftAttributesEntityService } from './nft-attributes-entity.service';

import { NftAttributesEntity } from '../dao/nft-attributes.entity';

@Injectable()
export class NftAttributesEntityHelpersService {
    constructor(private readonly nftAttributesEntityService: NftAttributesEntityService) {}

    public async findOrCreateNftAttribute(collateral: CollateralEntity, attribut: NftAttribute): Promise<NftAttributesEntity> {
        let _attribut = await this.nftAttributesEntityService.readOne({ type: attribut.trait_type, value: attribut.value, collateral });
        if (!_attribut) {
            _attribut = await this.nftAttributesEntityService.create({ type: attribut.trait_type.trim(), value: attribut.value.trim(), collateral });
        }
        return _attribut;
    }

    public async findOrCreateNftAttributes(collateral: CollateralEntity, attributs: NftAttribute[]): Promise<NftAttributesEntity[]> {
        return Promise.all(attributs.map(async attribut => await this.findOrCreateNftAttribute(collateral, attribut)));
    }
}

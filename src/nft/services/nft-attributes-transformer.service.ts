import { Injectable } from '@nestjs/common';

import { NftAttributesEntity } from '../dao/nft-attributes.entity';

@Injectable()
export class NftAttributesTransformerService {
    public toNftAttribute(attribute: NftAttributesEntity) {
        return {
            type: attribute.type,
            value: attribute.value,
        };
    }

    public toCollateralAttributesList(attributes: NftAttributesEntity[]) {
        const types = new Set(attributes.map(({ type }) => type));
        const attributesList: { type: string; values: string[] }[] = [];
        types.forEach(type => {
            const values = attributes.filter(attribute => attribute.type === type).map(({ value }) => value);
            attributesList.push({ type, values });
        });
        return attributesList;
    }
}

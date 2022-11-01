import { Injectable } from '@nestjs/common';
import { mergeMap } from 'rxjs';

import { CauldronEntityService } from '../../common/db/cauldron-entity/services/cauldron-entity.service';

import { GetCauldronsDto } from './dto/get-cauldrons.dto';
import { CauldronTransformService } from './services/cauldron-transform.service';

@Injectable()
export class CauldronHandler {
    constructor(private readonly cauldronEntityService: CauldronEntityService, private readonly cauldronTransformService: CauldronTransformService) {}

    public getCauldrons({ filters, pagination }: GetCauldronsDto) {
        return this.cauldronEntityService.getPairs(filters, pagination).pipe(mergeMap(data => this.cauldronTransformService.toCauldronWithPagination(data)));
    }
}

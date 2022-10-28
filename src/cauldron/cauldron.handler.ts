import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

import { GetCauldronsDto } from './dto/get-cauldrons.dto';
import { CauldronTransformService } from './services/cauldron-transform.service';
import { CauldronService } from './services/cauldron.service';

@Injectable()
export class CauldronHandler {
    constructor(private readonly cauldronService: CauldronService, private readonly cauldronTransformService: CauldronTransformService) {}

    public getCauldrons({ filters, pagination }: GetCauldronsDto) {
        return this.cauldronService.getPairs(filters, pagination).pipe(map(data => this.cauldronTransformService.toCauldronWithPagination(data)));
    }
}

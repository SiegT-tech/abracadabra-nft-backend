import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository, UpdateResult } from 'typeorm';

import { BentoboxEntity } from '../dao/bentobox.entity';

@Injectable()
export class BentoboxService {
    constructor(
        @InjectRepository(BentoboxEntity)
        private readonly bentoboxEntityRepository: Repository<BentoboxEntity>,
    ) {}

    public updateOne(where: Partial<BentoboxEntity>, doc: Partial<BentoboxEntity>): Promise<UpdateResult> {
        return this.bentoboxEntityRepository.update(where, doc);
    }

    public read(options?: FindConditions<BentoboxEntity>): Promise<BentoboxEntity[]> {
        return this.bentoboxEntityRepository.find(options);
    }
}

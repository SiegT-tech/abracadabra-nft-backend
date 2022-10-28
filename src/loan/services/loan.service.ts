import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindConditions, Repository, UpdateResult } from 'typeorm';

import { LoanEntity } from '../dao/loan.entity';

@Injectable()
export class LoanService {
    constructor(
        @InjectRepository(LoanEntity)
        private readonly loanEntityRepository: Repository<LoanEntity>,
    ) {}

    public create(doc: Partial<LoanEntity>): Promise<LoanEntity> {
        const created = this.loanEntityRepository.create(doc);
        return this.loanEntityRepository.save(created);
    }

    public updateOne(where: Partial<LoanEntity>, doc: Partial<LoanEntity>): Promise<UpdateResult> {
        return this.loanEntityRepository.update(where, doc);
    }

    public delete(where: FindConditions<LoanEntity>): Promise<DeleteResult> {
        return this.loanEntityRepository.softDelete(where);
    }

    public read(options?: FindConditions<LoanEntity>): Promise<LoanEntity[]> {
        return this.loanEntityRepository.find(options);
    }

    public readOne(options?: FindConditions<LoanEntity>): Promise<LoanEntity> {
        return this.loanEntityRepository.findOne(options);
    }
}

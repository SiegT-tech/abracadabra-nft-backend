import { Injectable } from '@nestjs/common';

import { BentoboxEntity } from "../../../common/db/bentobox-entity/dao/bentobox.entity";

@Injectable()
export class BentoboxSyncUtilsService {
    private readonly bentoboxsSyncStatus : { [key: string]: boolean } = {};

    public isBentoboxSyncing(bentobox: BentoboxEntity): boolean{
        return this.bentoboxsSyncStatus[bentobox.id] ?? false;
    }

    public setBentoboxSyncingState(bentobox: BentoboxEntity, state: boolean): void {
        this.bentoboxsSyncStatus[bentobox.id] = state;
    }
}

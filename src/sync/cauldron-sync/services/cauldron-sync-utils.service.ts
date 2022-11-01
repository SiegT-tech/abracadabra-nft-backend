import { Injectable } from '@nestjs/common';

import { CauldronEntity } from "../../../common/db/cauldron-entity/dao/cauldron.entity";

@Injectable()
export class CauldronSyncUtilsService {
    private readonly cauldronsSyncStatus : { [key: string]: boolean } = {};

    public isCauldronSyncing(cauldron: CauldronEntity): boolean{
        return this.cauldronsSyncStatus[cauldron.id] ?? false;
    }

    public setCauldronSyncingState(cauldron: CauldronEntity, state: boolean): void {
        this.cauldronsSyncStatus[cauldron.id] = state;
    }
}

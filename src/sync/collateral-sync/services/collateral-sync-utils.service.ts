import { Injectable } from '@nestjs/common';

import { CollateralEntity } from "../../../common/db/collateral-entity/dao/collateral.entity";

@Injectable()
export class CollateralSyncUtilsService {
    private readonly collateralsSyncStatus : { [key: string]: boolean } = {};

    public isCollateralSyncing(cauldron: CollateralEntity): boolean{
        return this.collateralsSyncStatus[cauldron.id] ?? false;
    }

    public setCollateralSyncingState(cauldron: CollateralEntity, state: boolean): void {
        this.collateralsSyncStatus[cauldron.id] = state;
    }
}

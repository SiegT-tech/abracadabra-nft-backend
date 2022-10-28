import { Injectable } from '@nestjs/common';

import { BlockchainExplorerApiService } from '../../blockchain/blockchain-explorer-api.service';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { Networks } from '../../blockchain/constants';

import { CollateralEntity } from '../dao/collateral.entity';
import { CollateralApiService } from './collateral-api.service';

@Injectable()
export class CollateralBlockchainService {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly blockchainExplorerApiService: BlockchainExplorerApiService,
        private readonly collateralApiService: CollateralApiService
    ) {}

    public async getCollateral(network: Networks, address: string): Promise<Partial<CollateralEntity>> {
        const contract = this.blockchainService.getCollateral(network, address);
        const collateral: Partial<CollateralEntity> = { network, address, name: 'Unknow', totalSupply: 0, idsStartFrom: 0, creationBlock: 0 };
        try {
            collateral.name = await contract.name();
        } catch (err) {}
        try {
            collateral.totalSupply = (await contract.totalSupply()).toNumber();
        } catch (err) {}
        try {
            collateral.creationBlock = await this.blockchainExplorerApiService.getContractCreationBlockNumber(network, address);
        } catch (err) {}

        const { banner, logo, floorPrice } = await this.collateralApiService.getCollateralInfo(collateral.name, address, network);

        if(banner){
            collateral.banner = banner;
        }

        if(logo){
            collateral.logo = logo;
        }

        if(floorPrice){
            collateral.floorPrice = floorPrice;
        }

        for (let i = 0; i < collateral.totalSupply; i++) {
            try {
                const owner = await contract.ownerOf(i);
                if (owner) {
                    collateral.idsStartFrom = i;
                    break;
                }
            } catch (err) {}
        }

        return collateral;
    }
}

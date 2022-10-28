import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { OpenseaRes } from "../interfaces/opensea.interface";
import { CoingeckoRes } from "../interfaces/coingecko.interface";
import { CollateralUtilsService } from "./collateral-utils.service";
import { Networks } from "../../blockchain/constants";
import { RaribleRes } from "../interfaces/rarible.interface";

interface CollateralInfo {
    banner?: string; 
    logo?: string; 
    floorPrice?: number;
}

@Injectable()
export class CollateralApiService{
    constructor(private readonly httpService: HttpService, private readonly collateralUtilsService: CollateralUtilsService){}

    public async getCollateralInfo(name: string, address: string, network: Networks): Promise<CollateralInfo>{
        const info: CollateralInfo = { banner: undefined, logo: undefined, floorPrice: undefined};

        if(name !== 'Unknow'){
            const slug = this.collateralUtilsService.toSlug(name);
            await this.opensea(slug, info);
            await this.coingecko(slug, info);
        }

        await this.rarible(address, network, info);
        
        return info;
    }

    private async opensea(id: string, info: CollateralInfo){
        try{
            const { data } = await this.httpService.get<OpenseaRes>(`https://api.opensea.io/api/v1/collection/${id}`).toPromise();

            if(data.collection){
                const { banner_image_url, image_url, large_image_url, stats } = data.collection;
                info.banner = banner_image_url || large_image_url;
                info.logo = image_url;
                if(stats){
                    const { floor_price } = stats;
                    info.floorPrice = floor_price;
                }
            }

        } catch(err){}
    }

    private async coingecko(id: string, info: CollateralInfo){
        if(info.floorPrice) return;

        try{
            const { data } = await this.httpService.get<CoingeckoRes>(`https://api.coingecko.com/api/v3/nfts/${id}`).toPromise();

            if(data.floor_price){
                const { native_currency } = data.floor_price;
                info.floorPrice = native_currency;
            }

        } catch(err){}
    }

    private async rarible(address: string, network: Networks, info: CollateralInfo){
        if(info.floorPrice) return;

        const tag = this.collateralUtilsService.toRarible(address, network);

        try{
            const { data } = await this.httpService.get<RaribleRes>(`https://api.rarible.org/v0.1/collections/${tag}`).toPromise();

            if(data.statistics && data.statistics.floorPrice){
                info.floorPrice = data.statistics.floorPrice.value
            }

        } catch(err){}
    }
}
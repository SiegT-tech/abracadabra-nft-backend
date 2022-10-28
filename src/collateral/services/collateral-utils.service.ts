import { Injectable } from "@nestjs/common";
import { Networks, NetworksNames } from "../../blockchain/constants";

@Injectable()
export class CollateralUtilsService{
    public toSlug(name: string){
        return name.replace(/ /g, "-").toLowerCase();
    }

    public toRarible(address: string, network: Networks){
        const name = NetworksNames[network];
        return `${name}:${address}`;
    }
}
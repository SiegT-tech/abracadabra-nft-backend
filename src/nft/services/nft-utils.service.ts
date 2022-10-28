import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { tokenUrlToHttp } from '../../utils';

export interface TokenAttribute {
    readonly trait_type: string;
    readonly value: string;
}

export interface TokenInfo {
    readonly name: string;
    readonly description: string;
    readonly image: string;
    readonly dna: string;
    readonly edition: number;
    readonly date: number;
    readonly attributes: TokenAttribute[];
}

@Injectable()
export class NftUtilsService {
    constructor(private readonly httpService: HttpService) {}

    public idsArray(totalSupply: number, startFrom = 0): number[] {
        const ids = [];
        for (let i = startFrom; i < totalSupply; i++) {
            ids.push(i);
        }
        return ids;
    }

    public async getTokenInfo(tokenUrl: string): Promise<TokenInfo> {
        const url = tokenUrlToHttp(tokenUrl);
        const { data } = await this.httpService.get(url).toPromise();
        if (data.image) {
            data.image = tokenUrlToHttp(data.image);
        }
        return data;
    }
}

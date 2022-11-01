export interface NftAttribute {
    readonly trait_type: string;
    readonly value: string;
}

export interface NftInfo {
    readonly name: string;
    readonly description: string;
    readonly image: string;
    readonly dna: string;
    readonly edition: number;
    readonly date: number;
    readonly attributes: NftAttribute[];
}

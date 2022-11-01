interface Price {
    readonly value?: number;
}

interface Statistics {
    readonly floorPrice?: Price;
}

export interface RaribleRes {
    readonly statistics?: Statistics;
}

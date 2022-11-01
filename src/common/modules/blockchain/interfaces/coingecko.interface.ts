interface CoingeckPrice {
    readonly native_currency?: number;
    readonly usd?: number;
}

export interface CoingeckoRes {
    floor_price?: CoingeckPrice;
}

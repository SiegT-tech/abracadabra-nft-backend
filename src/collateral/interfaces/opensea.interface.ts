interface Stats {
    readonly floor_price?: number;
}

interface Collection {
    readonly banner_image_url?: string;
    readonly image_url?: string;
    readonly large_image_url?: string;
    readonly stats?: Stats;
}

export interface OpenseaRes{
    readonly collection?: Collection;
}
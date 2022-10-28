export const tokenUrlToHttp = (uri: string): string => {
    if (uri.includes('http')) return uri;
    if (uri.includes('ipfs')) return `https://ipfs.io/ipfs/${uri.split('//')[1]}`;
    return uri;
};

export const idsArray = (totalSupply: number, startFrom = 0): number[] => {
    const ids = [];
    for (let i = startFrom; i < totalSupply + 1; i++) {
        ids.push(i);
    }
    return ids;
};

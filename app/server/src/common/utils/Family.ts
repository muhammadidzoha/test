export const calculateGajiScore = (totalGaji: number, totalFamily: number, umr: number) => {
    if (totalGaji < umr) {
        return 1;
    } else if (totalGaji >= umr && totalFamily > 4) {
        return 2;
    }
    return 3;
}
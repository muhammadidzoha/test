export const calculateGajiScore = (totalGaji: number, totalFamily: number, umr: number) => {
    if (totalGaji < umr) {
        return 1;
    } else if (totalGaji >= umr && totalFamily > 4) {
        return 2;
    }
    return 3;
}

export const calculateBirthWeightScore = (birthWeight: number) => {
    if (birthWeight > 4) {
        return 1;
    }
    return 2;
}

export const calculateBehaviourScore = (behaviourScore: number) => {
    if (behaviourScore >= 1 && behaviourScore <= 30) {
        return 1;
    }
    return 2;
}
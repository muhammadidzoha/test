export const calculateServiceScore = (answers: any[]) => {
    const score = answers.filter(answer => answer);
    return Math.round((score.length / answers.length) * 100)
}

export const categorizeServiceScore = (score: number) => {
    const categorization = {
        minimal: 25,
        standard: 50,
        optimal: 75,
        paripurna: 100
    }
    if (score <= categorization.minimal) {
        return 1
    } else if (score <= categorization.standard) {
        return 2
    } else if (score <= categorization.optimal) {
        return 3
    }
    return 4
}
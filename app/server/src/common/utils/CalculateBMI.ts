export const calculateBMI = (heightInCM: number, weightInKg: number) => {
    const bmi = weightInKg / (heightInCM / 100) ** 2;

    return +bmi.toFixed(2);
}
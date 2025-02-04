"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineNutritionStatus = void 0;
const WHO_BMI_REFERENCES = [
    // Laki-laki
    { age: 5, gender: "male", meanBMI: 15.5, sd: 1.2 },
    { age: 6, gender: "male", meanBMI: 15.7, sd: 1.2 },
    { age: 7, gender: "male", meanBMI: 16.0, sd: 1.3 },
    { age: 8, gender: "male", meanBMI: 16.3, sd: 1.3 },
    { age: 9, gender: "male", meanBMI: 16.7, sd: 1.4 },
    { age: 10, gender: "male", meanBMI: 17.0, sd: 1.5 },
    { age: 11, gender: "male", meanBMI: 17.5, sd: 1.5 },
    { age: 12, gender: "male", meanBMI: 18.1, sd: 1.6 },
    { age: 13, gender: "male", meanBMI: 18.7, sd: 1.7 },
    { age: 14, gender: "male", meanBMI: 19.4, sd: 1.8 },
    { age: 15, gender: "male", meanBMI: 20.1, sd: 1.9 },
    { age: 16, gender: "male", meanBMI: 20.8, sd: 1.9 },
    { age: 17, gender: "male", meanBMI: 21.4, sd: 2.0 },
    { age: 18, gender: "male", meanBMI: 21.9, sd: 2.0 },
    { age: 19, gender: "male", meanBMI: 22.3, sd: 2.1 },
    // Perempuan
    { age: 5, gender: "female", meanBMI: 15.7, sd: 1.3 },
    { age: 6, gender: "female", meanBMI: 16.0, sd: 1.3 },
    { age: 7, gender: "female", meanBMI: 16.4, sd: 1.4 },
    { age: 8, gender: "female", meanBMI: 16.8, sd: 1.4 },
    { age: 9, gender: "female", meanBMI: 17.3, sd: 1.5 },
    { age: 10, gender: "female", meanBMI: 17.5, sd: 1.6 },
    { age: 11, gender: "female", meanBMI: 18.1, sd: 1.6 },
    { age: 12, gender: "female", meanBMI: 18.8, sd: 1.7 },
    { age: 13, gender: "female", meanBMI: 19.5, sd: 1.8 },
    { age: 14, gender: "female", meanBMI: 20.3, sd: 1.8 },
    { age: 15, gender: "female", meanBMI: 20.9, sd: 1.9 },
    { age: 16, gender: "female", meanBMI: 21.4, sd: 1.9 },
    { age: 17, gender: "female", meanBMI: 21.8, sd: 2.0 },
    { age: 18, gender: "female", meanBMI: 22.2, sd: 2.0 },
    { age: 19, gender: "female", meanBMI: 22.5, sd: 2.1 }
];
const calculateZScore = (references, payload) => {
    const genderAndAgeReferences = references.filter(reference => reference.age === payload.age && reference.gender === payload.gender)[0];
    const zScore = (payload.meanBMI - genderAndAgeReferences.meanBMI) / genderAndAgeReferences.sd;
    if (zScore <= 1) {
        return "Tidak Beresiko Gizi Lebih";
    }
    if (zScore > 1 && zScore <= 2) {
        return "Beresiko Gizi Lebih";
    }
    return "Gizi Lebih";
};
const determineNutritionStatus = (bmi) => {
    if (bmi < 17) {
        return {
            statusId: 1,
            status: 'KURUS',
            information: 'Kekurangan bb tingkat berat'
        };
    }
    if (bmi < 18.5) {
        return {
            statusId: 2,
            status: 'KURUS',
            information: 'Kekurangan bb tingkat ringan'
        };
    }
    if (bmi >= 18.5 && bmi <= 25) {
        return {
            statusId: 3,
            status: 'NORMAL',
            information: 'Berat badan normal'
        };
    }
    if (bmi > 25 && bmi <= 27) {
        return {
            statusId: 4,
            status: 'GEMUK',
            information: 'Kelebihan bb tingkat ringan'
        };
    }
    return {
        statusId: 5,
        status: 'GEMUK',
        information: 'Kelebihan bb tingkat berat'
    };
};
exports.determineNutritionStatus = determineNutritionStatus;

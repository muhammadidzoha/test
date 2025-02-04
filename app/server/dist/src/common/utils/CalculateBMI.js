"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBMI = void 0;
const calculateBMI = (heightInCM, weightInKg) => {
    const bmi = weightInKg / (heightInCM / 100) ** 2;
    return +bmi.toFixed(2);
};
exports.calculateBMI = calculateBMI;

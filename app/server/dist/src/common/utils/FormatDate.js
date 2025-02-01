"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDate = void 0;
const FormatDate = (date) => {
    const formattedDate = date.toISOString().split('T').join(' ').split('.')[0];
    return formattedDate;
};
exports.FormatDate = FormatDate;

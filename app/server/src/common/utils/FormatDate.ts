export const FormatDate = (date: Date) => {
    const formattedDate: string = date.toISOString().split('T').join(' ').split('.')[0];

    return formattedDate;
}
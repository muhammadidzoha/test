export const generateFutureDate = (days: number) => {
    const date = new Date();
    const futureDate = new Date()
    futureDate.setDate(date.getDate() + days);

    const formattedDate = Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(futureDate);

    return formattedDate;
};
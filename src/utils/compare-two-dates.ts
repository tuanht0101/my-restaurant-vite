import { compareAsc, isDate } from 'date-fns';

/* Function that compares the value of 2 DatePicker  */
export const compareDates = (
    startDate: Date | null | undefined,
    endDate: Date | null | undefined
): boolean => {
    if (!startDate || !endDate) {
        return true; // Treat as valid if either startDate or endDate is null or undefined
    }

    if (isDate(startDate) && isDate(endDate)) {
        return compareAsc(startDate, endDate) === -1;
    }

    return true;
};

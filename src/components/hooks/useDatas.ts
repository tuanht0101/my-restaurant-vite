import { useMemo } from 'react';
import { applyPagination } from '../../utils/apply-pagination';

export const useCustomers = (
    data: any[],
    page: number,
    rowsPerPage: number
) => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return data.slice(startIndex, endIndex);
};

import { useMemo } from 'react';
import { Table } from '../../type/Table.type';

export const useCustomerIds = (customers: Table[]) => {
    return useMemo(() => {
        return customers.map((customer) => customer.id);
    }, [customers]);
};

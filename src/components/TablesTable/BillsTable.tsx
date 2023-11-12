import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Card,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import { Scrollbar } from '../common/ScrollBar/Scrollbar';
import { PencilAlt } from '../../icons/pencil-alt';
import DeleteIcon from '@mui/icons-material/Delete';
import { TableModal } from '../modals/tableModal';
import axios from 'axios';
import useAuthorization from '../../hooks/authorizationHooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

interface BillsTableProps {
    count?: number;
    items?: any[];
    onDeselectAll?: () => void;
    onDeselectOne?: (tableId: string) => void;
    onPageChange?: (event: any, value: number) => void;
    onRowsPerPageChange?: (event: any) => void;
    onSelectAll?: (itemIds: any[]) => any;
    onSelectOne?: (tableId: string) => void;
    page?: number;
    rowsPerPage?: number;
    selected?: string[];
    handleDeleteModal?: (id: number) => void;
    submitEditOpen?: (id: number) => void;
}

export const BillsTable: FC<BillsTableProps> = (props) => {
    const {
        count = 0,
        items = [],
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => {},
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        page = 0,
        rowsPerPage = 0,
        selected = [],
        submitEditOpen = (id: number) => {},
        handleDeleteModal = (id: number) => {},
    } = props;

    const [localSelected, setLocalSelected] = useState<string[]>(selected);
    const [filteredCount, setFilteredCount] = useState(count);
    const { isAdmin } = useAuthorization();

    useEffect(() => {
        setLocalSelected(selected);
    }, [selected]);

    useEffect(() => {
        const filteredData = items.filter((item) => item.status === status);
        setFilteredCount(filteredData.length);
    }, [count]);

    const handleSelectAll = () => {
        onSelectAll?.([]);
        setLocalSelected(items.map((table: any) => table.id));
        console.log('123', localSelected);
    };

    const handleDeselectAll = () => {
        onDeselectAll?.();
        setLocalSelected([]);
        console.log(localSelected);
    };

    const handleSelectOne = (tableId: string) => {
        onSelectOne?.(tableId);
        setLocalSelected((prevSelected) => [...prevSelected, tableId]);
        console.log(localSelected);
    };

    const handleDeselectOne = (tableId: string) => {
        onDeselectOne?.(tableId);
        setLocalSelected((prevSelected) =>
            prevSelected.filter((id) => id !== tableId)
        );
        console.log(localSelected);
    };

    const formatCreatedAt = (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toLocaleString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'blue';
            case 'CANCELLED':
                return 'red';
            case 'DONE':
                return 'green';
            default:
                return 'default';
        }
    };

    return (
        <Card>
            <Box sx={{ minWidth: 800 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {isAdmin && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={
                                            items.length > 0 &&
                                            localSelected.length ===
                                                items.length
                                        }
                                        indeterminate={
                                            localSelected.length > 0 &&
                                            localSelected.length < items.length
                                        }
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                handleSelectAll();
                                            } else {
                                                handleDeselectAll();
                                            }
                                        }}
                                    />
                                </TableCell>
                            )}
                            <TableCell>
                                {' '}
                                <Typography fontWeight={600}>
                                    Customer Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {' '}
                                <Typography fontWeight={600}>
                                    Phonenumber
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {' '}
                                <Typography fontWeight={600}>Total</Typography>
                            </TableCell>
                            <TableCell>
                                {' '}
                                <Typography fontWeight={600}>
                                    Created By
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {' '}
                                <Typography fontWeight={600}>
                                    Created At
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {' '}
                                <Typography fontWeight={600}>Status</Typography>
                            </TableCell>
                            <TableCell>
                                {' '}
                                <Typography fontWeight={600}>Action</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((table: any) => (
                            <TableRow
                                hover
                                key={table.id}
                                selected={localSelected.includes(table.id)}
                            >
                                {isAdmin && (
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={localSelected.includes(
                                                table.id
                                            )}
                                            onChange={(event) => {
                                                const tableId = table.id;
                                                if (event.target.checked) {
                                                    handleSelectOne(tableId);
                                                } else {
                                                    handleDeselectOne(tableId);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>
                                    <Typography variant="subtitle2">
                                        {table.guessName}
                                    </Typography>
                                </TableCell>
                                <TableCell>{table.guessNumber}</TableCell>
                                <TableCell>{table.total} VND</TableCell>
                                <TableCell>{table.createdBy}</TableCell>
                                <TableCell>
                                    {formatCreatedAt(table.createdAt)}
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="subtitle2"
                                        color={getStatusColor(table.status)}
                                    >
                                        {table.status}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        component="button"
                                        onClick={() => submitEditOpen(table.id)}
                                    >
                                        <PencilAlt
                                            fontSize="small"
                                            color="info"
                                        />
                                    </IconButton>
                                    <IconButton>
                                        <FontAwesomeIcon
                                            icon={faFileInvoiceDollar}
                                            fontSize={'medium'}
                                        />
                                    </IconButton>

                                    {isAdmin && (
                                        <IconButton
                                            component="button"
                                            onClick={() =>
                                                handleDeleteModal(table.id)
                                            }
                                        >
                                            <DeleteIcon
                                                fontSize="small"
                                                color="error"
                                            />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={count}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Box>
        </Card>
    );
};

BillsTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onDeselectAll: PropTypes.func,
    onDeselectOne: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectOne: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array,
};

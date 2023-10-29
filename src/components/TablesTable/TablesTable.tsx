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

interface TablesTableProps {
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

export const TablesTable: FC<TablesTableProps> = (props) => {
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

    useEffect(() => {
        setLocalSelected(selected);
    }, [selected]);

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

    return (
        <Card>
            <Box sx={{ minWidth: 800 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={
                                        items.length > 0 &&
                                        localSelected.length === items.length
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
                            <TableCell>Name</TableCell>
                            <TableCell>Capacity</TableCell>
                            <TableCell>Table Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Active Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((table: any) => (
                            <TableRow
                                hover
                                key={table.id}
                                selected={localSelected.includes(table.id)}
                            >
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
                                <TableCell>
                                    <Typography variant="subtitle2">
                                        {table.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{table.capacity}</TableCell>
                                <TableCell>
                                    {table.isPrivate ? 'VIP' : 'Normal'}
                                </TableCell>
                                <TableCell>
                                    {table.isAvailable ? (
                                        <p className="text-[green]">
                                            Available
                                        </p>
                                    ) : (
                                        <p className="text-[red]">
                                            Unavailable
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {table.isActive ? (
                                        <p className="text-[green]">Active</p>
                                    ) : (
                                        <p className="text-[red]">Inactive</p>
                                    )}
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

TablesTable.propTypes = {
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

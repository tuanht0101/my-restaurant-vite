import React, { FC, useEffect, useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import { PencilAlt } from '../../icons/pencil-alt';
import { TableModal } from '../modals/tableModal';
import { Scrollbar } from '../common/ScrollBar/Scrollbar';
import axios from 'axios';
import useAuthorization from '../../hooks/authorizationHooks';

interface CategoryTableProps {
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

export const CategoryTable: FC<CategoryTableProps> = (props) => {
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
    const { isAdmin } = useAuthorization();

    useEffect(() => {
        setLocalSelected(selected);
    }, [selected]);

    const handleSelectAll = () => {
        onSelectAll?.([]);
        setLocalSelected(items.map((data: any) => data.id));
    };

    const handleDeselectAll = () => {
        onDeselectAll?.();
        setLocalSelected([]);
    };

    const handleSelectOne = (dataId: string) => {
        onSelectOne?.(dataId);
        setLocalSelected((prevSelected) => [...prevSelected, dataId]);
    };

    const handleDeselectOne = (dataId: string) => {
        onDeselectOne?.(dataId);
        setLocalSelected((prevSelected) =>
            prevSelected.filter((id) => id !== dataId)
        );
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

                            <TableCell sx={{ minWidth: 50 }}>ID</TableCell>
                            <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
                            <TableCell sx={{ minWidth: 100 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((data: any) => (
                            <TableRow
                                hover
                                key={data.id}
                                selected={localSelected.includes(data.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={localSelected.includes(
                                            data.id
                                        )}
                                        onChange={(event) => {
                                            const dataId = data.id;
                                            if (event.target.checked) {
                                                handleSelectOne(dataId);
                                            } else {
                                                handleDeselectOne(dataId);
                                            }
                                        }}
                                    />
                                </TableCell>

                                <TableCell>{data.id}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">
                                        {data.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        component="button"
                                        onClick={() => submitEditOpen(data.id)}
                                    >
                                        <PencilAlt
                                            fontSize="small"
                                            color="info"
                                        />
                                    </IconButton>

                                    <IconButton
                                        component="button"
                                        onClick={() =>
                                            handleDeleteModal(data.id)
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

CategoryTable.propTypes = {
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

import { FC, useEffect, useState } from 'react';
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
import { PencilAlt } from '../../icons/pencil-alt';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuthorization from '../../hooks/authorizationHooks';

interface UsersTableProps {
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

export const UsersTable: FC<UsersTableProps> = (props) => {
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
        submitEditOpen = () => {},
        handleDeleteModal = () => {},
    } = props;

    const [localSelected, setLocalSelected] = useState<string[]>(selected);
    const { isAdmin } = useAuthorization();

    useEffect(() => {
        setLocalSelected(selected);
    }, [selected]);

    const handleSelectAll = () => {
        onSelectAll?.([]);
        setLocalSelected(items.map((data: any) => data.id));
        console.log('123', localSelected);
    };

    const handleDeselectAll = () => {
        onDeselectAll?.();
        setLocalSelected([]);
        console.log(localSelected);
    };

    const handleSelectOne = (dataId: string) => {
        onSelectOne?.(dataId);
        setLocalSelected((prevSelected) => [...prevSelected, dataId]);
        console.log(localSelected);
    };

    const handleDeselectOne = (dataId: string) => {
        onDeselectOne?.(dataId);
        setLocalSelected((prevSelected) =>
            prevSelected.filter((id) => id !== dataId)
        );
        console.log(localSelected);
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
                            {/* <TableCell>ID</TableCell> */}
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((data: any) => (
                            <TableRow
                                hover
                                key={data.id}
                                selected={localSelected.includes(data.id)}
                            >
                                {isAdmin && (
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
                                )}
                                {/* <TableCell>{data.id}</TableCell> */}
                                <TableCell>
                                    <Typography variant="subtitle2">
                                        {data.email}
                                    </Typography>
                                </TableCell>
                                <TableCell>{data.role}</TableCell>
                                <TableCell>{data.fullname}</TableCell>
                                <TableCell>{data.phonenumber}</TableCell>
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
                                    {isAdmin && (
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

UsersTable.propTypes = {
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

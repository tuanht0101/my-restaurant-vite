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
import html2pdf from 'html2pdf.js';
import { PencilAlt } from '../../icons/pencil-alt';
import DeleteIcon from '@mui/icons-material/Delete';
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
        submitEditOpen = () => {},
        handleDeleteModal = () => {},
    } = props;

    const [localSelected, setLocalSelected] = useState<string[]>(selected);
    const [filteredCount, setFilteredCount] = useState(count);
    const [selectedModal, setSelectedModal] = useState<any>(null);
    const { isAdmin } = useAuthorization();
    const accessToken = localStorage.getItem('access_token');

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
    };

    const handleDeselectAll = () => {
        onDeselectAll?.();
        setLocalSelected([]);
    };

    const handleSelectOne = (tableId: string) => {
        onSelectOne?.(tableId);
        setLocalSelected((prevSelected) => [...prevSelected, tableId]);
    };

    const handleDeselectOne = (tableId: string) => {
        onDeselectOne?.(tableId);
        setLocalSelected((prevSelected) =>
            prevSelected.filter((id) => id !== tableId)
        );
    };

    const formatCreatedAt = (createdAt: string) => {
        const date = new Date(createdAt);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        } as const;
        return date.toLocaleDateString('en-GB', options);
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

    const generateHtmlTemplate = () => {
        if (!selectedModal) {
            // Handle the case where selectedModal is null (e.g., fetch failed)
            return '<html><body>Error loading data</body></html>';
        }
        return `
            <html>
                <head>
                    <style>
                        table {
                            font-family: Arial, Helvetica, sans-serif;
                            border-collapse: collapse;
                            width: 100%;
                        }

                        h3 {
                            margin-bottom: 10px;
                            font-weight: bold;
                        }
    
                        td, th {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                    </style>
                </head>
                <body>
                    <h3 style="text-align: center">Midtaste Restaurant</h3>
                    <table>
                        <tr>
                            <th>Name: ${selectedModal.guessName}</th>
                            <th>Status: ${selectedModal.status}</th>
                        </tr>
                        <tr>
                            <th>Contact Number: ${
                                selectedModal.guessNumber
                            }</th>
                            <th>Table: ${selectedModal.tableName}</th>
                        </tr>
                    </table>
    
                    <h3>Product Details:</h3>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Sub total</th>
                        </tr>
                        ${selectedModal.productDetails
                            .map(
                                (item: any) => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.category}</td>
                                        <td>${item.quantity}</td>
                                        <td>${item.price} VND</td>
                                        <td>${
                                            item.quantity * item.price
                                        } VND</td>
                                    </tr>
                                `
                            )
                            .join('')}
                    </table>
                    <h3>Total: ${selectedModal.total} VND</h3>
                    <h3>Date: ${formatCreatedAt(selectedModal.createdAt)}</h3>
                    <h3>
                        Thank you for supporting our restaurant. If there are any problems, we
                        would love to hear from you at admin@midtaste.com
                    </h3>
                </body>
            </html>
        `;
    };

    const fetchBill = async (id: number) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/bill/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setSelectedModal(response.data);
        } catch (error) {
            console.error('Error fetching tables:', error);
            setSelectedModal(null);
        }
    };

    const downloadBill = async (id: number) => {
        await fetchBill(id);
    };

    useEffect(() => {
        if (selectedModal) {
            const pdfElement = document.createElement('div');
            pdfElement.innerHTML = generateHtmlTemplate();

            html2pdf(pdfElement, {
                margin: 10,
                filename: `${selectedModal.uuid}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            });
        }
    }, [selectedModal]);

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
                        {items.map((item: any) => (
                            <TableRow
                                hover
                                key={item.id}
                                selected={localSelected.includes(item.id)}
                            >
                                {isAdmin && (
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={localSelected.includes(
                                                item.id
                                            )}
                                            onChange={(event) => {
                                                const itemId = item.id;
                                                if (event.target.checked) {
                                                    handleSelectOne(itemId);
                                                } else {
                                                    handleDeselectOne(itemId);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>
                                    <Typography variant="subtitle2">
                                        {item.guessName}
                                    </Typography>
                                </TableCell>
                                <TableCell>{item.guessNumber}</TableCell>
                                <TableCell>{item.total} VND</TableCell>
                                <TableCell>{item.createdBy}</TableCell>
                                <TableCell>
                                    {formatCreatedAt(item.createdAt)}
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="subtitle2"
                                        color={getStatusColor(item.status)}
                                    >
                                        {item.status}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {item.status !== 'DONE' && (
                                        <IconButton
                                            component="button"
                                            onClick={() =>
                                                submitEditOpen(item.id)
                                            }
                                        >
                                            <PencilAlt
                                                fontSize="small"
                                                color="info"
                                            />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        component="button"
                                        onClick={() => downloadBill(item.id)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faFileInvoiceDollar}
                                            fontSize={'medium'}
                                        />
                                    </IconButton>

                                    {isAdmin && (
                                        <IconButton
                                            component="button"
                                            onClick={() =>
                                                handleDeleteModal(item.id)
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

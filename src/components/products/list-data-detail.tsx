import {
    Box,
    Button,
    Card,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import type { ChangeEvent, FC, FormEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Scrollbar } from '../common/ScrollBar/Scrollbar';
import { RoundedTablePagination } from '../common/table/rounded-pagination';
import axios from 'axios';
import TableCellToolTip from '../common/table/table-cell';
import { PencilAlt } from '../../icons/pencil-alt';
import { CategoryModal } from '../modals/CategoryModal';
import { DeleteConfirmModal } from '../common/modals/delete-confirm-modal';
import { ProductModal } from '../modals/ProductModal';

//   import Page500 from '../../../pages/500'

interface ListDataTableProps {
    selectedDuLieuThuThap: any | null;
    isAddData?: boolean;
}

export const ListDataDetailTable: FC<ListDataTableProps> = (props) => {
    const { selectedDuLieuThuThap, isAddData, ...other } = props;
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedData, setSelectedData] = useState<null | any>(null);
    const [openToDate, setOpenToDate] = useState(false);
    const [dateFilter, setDateFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInputValue, setSearchInputValue] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [startDraftDate, setStartDraftDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [endDraftDate, setEndDraftDate] = useState<Date | null>(null);
    const [isErrorOnStartDate, setIsErrorOnStartDate] = useState(false);
    const [isStartDateShaking, setIsStartDateShaking] = useState(false);
    const [isValidDates, setIsValidDates] = useState(true);
    const [isResetDates, setIsResetDates] = useState(false);
    const [count, setCount] = useState(0);
    const [datas, setDatas] = useState([]);

    const [isEndDateShaking, setIsEndDateShaking] = useState(false);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addModalEditOpen, setAddModalEditOpen] = useState(false);

    const [page, setPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isDeleteSubmit, setIsDeleteSubmit] = useState(false);
    const [selectedModal, setSelectedModal] = useState<any>(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState<any>(null);
    const [draftValue, setDraftValue] = useState({
        search: '',
    });
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const accessToken = localStorage.getItem('access_token');

    const onChange = (value: string, name: string): void => {
        setDraftValue({
            ...draftValue,
            [name]: value,
        });
    };

    useEffect(() => {
        const fetchProductsByCate = async () => {
            try {
                if (selectedDuLieuThuThap?.id !== undefined) {
                    const res = await axios.get(
                        `${
                            import.meta.env.VITE_API_URL
                        }/product/getByCategory/${selectedDuLieuThuThap?.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    setCount(res.data.length);
                    setDatas(res.data);
                    setPage(1);
                }
            } catch (error) {
                console.error('Error fetching Users:', error);
                setCount(0);
                setDatas([]);
            }
        };
        fetchProductsByCate();
    }, [selectedDuLieuThuThap, addModalEditOpen, isAddData, openDeleteModal]);

    const handleStartDateChange = (data: Date | null) => {
        if (data) {
            setOpenToDate(true);
            setStartDraftDate(data);
        }
    };
    const handleEndDateChange = (data: Date | null) => {
        if (data) {
            setOpenToDate(false);
            setEndDraftDate(data);
        }
    };

    const handleValidDates = (isValid: boolean) => {
        setIsValidDates(isValid);
    };

    const handleModalClose = () => {
        setAddModalOpen(false);
    };

    const handleEditModalClose = () => {
        setAddModalEditOpen(false);
        setSelectedModal(null);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSelectedDeleteId(null);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/product/filter`,
                {
                    name: draftValue.search || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setDatas(response.data);
            setCount(response.data.length);
            setPage(1);
        } catch (error) {
            console.error('Error searching Users:', error);
        }
    };

    const clearQuery = useCallback(() => {
        setDraftValue({
            search: '',
        });
    }, []);

    const handleQueryChange = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        setSearchQuery(searchInputRef.current?.value || '');
        setIsErrorOnStartDate(false);
        setIsStartDateShaking(false);
    };

    const onPageChange = (
        _event: MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ): void => {
        setPage(newPage);
    };

    let loadingData = false;

    // const { fetching, error } = resultDuLieuThuThap
    // if (fetching) {
    //   loadingData = true
    // } else {
    //   loadingData = false
    // }
    // if (error) return <Page500 />

    const onRowsPerPageChange = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const getLimitString = (str: string): string => {
        return str.length > 70 ? `${str.slice(0, 68)}...` : str;
    };

    const handleSubmitData = () => {
        setAddModalOpen(false);
    };

    const handleSubmitEditData = useCallback(() => {
        setAddModalOpen(false);
    }, []);

    const deleteData = async (id: number) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/product/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    };

    const onDelete = () => {
        deleteData(selectedDeleteId);
        setOpenDeleteModal(false);
    };

    const fetchTable = async (id: number) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/product/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setSelectedModal(response.data);
        } catch (error) {
            console.error('Error fetching Users:', error);
            setSelectedModal(null);
        }
    };

    const submitEditOpen = async (id: number) => {
        await fetchTable(id);
        setAddModalEditOpen(true);
    };

    const handleDeleteModal = useCallback(async (id: number) => {
        setOpenDeleteModal(true);
        setSelectedDeleteId(id);
    }, []);

    return (
        <div {...other}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    m: -1.5,
                    py: 2.5,
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleQueryChange}
                    sx={{
                        flexGrow: 1,
                        m: 1.5,
                        display: 'flex',
                        gap: 1.5,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        ml: 4,
                        paddingRight: { xs: '0', sm: '0' },
                        width: { xs: '100%', sm: 'auto' },
                    }}
                >
                    <TextField
                        size="small"
                        label="Từ khóa"
                        placeholder="Nhập từ khóa"
                        value={draftValue.search}
                        onChange={(event) =>
                            onChange(event.target.value, 'search')
                        }
                    />
                    <Button
                        variant="contained"
                        onClick={(_) => handleSubmit()}
                        size="medium"
                    >
                        Search
                    </Button>
                    <Button
                        size="medium"
                        color="error"
                        variant="outlined"
                        onClick={clearQuery}
                    >
                        Reset filter
                    </Button>
                </Box>
            </Box>
            <Card
                sx={{
                    mt: 1.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ pl: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" color="#666666">
                        {selectedDuLieuThuThap?.name &&
                            `${selectedDuLieuThuThap?.name} (${count} bản ghi)`}
                    </Typography>
                </Box>

                <Scrollbar
                    sx={{
                        maxHeight: `400px`,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888',
                            borderRadius: '4px',
                        },
                    }}
                >
                    <Table>
                        <TableHead sx={{ visibility: 'visible' }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                            {loadingData ? (
                                <TableRow>
                                    <TableCell colSpan={10}>
                                        <LinearProgress />
                                    </TableCell>
                                </TableRow>
                            ) : null}
                        </TableHead>
                        <TableBody
                            sx={{
                                position: 'relative',
                            }}
                        >
                            {datas
                                .slice(
                                    (page - 1) * rowsPerPage,
                                    page * rowsPerPage
                                )
                                .map((item: any, index) => (
                                    <TableRow key={index}>
                                        <TableCellToolTip
                                            key={`${item.name}+${item.id}`}
                                            title={item.name}
                                            sx={{
                                                minWidth: 200,
                                                pl: 2,
                                                py: 1.5,
                                            }}
                                        />
                                        <TableCellToolTip
                                            key={
                                                `description ` +
                                                item.description
                                            }
                                            title={item.description}
                                            sx={{
                                                minWidth: 200,
                                                pl: 2,
                                                py: 1.5,
                                            }}
                                        />
                                        <TableCellToolTip
                                            key={`price ` + item.price}
                                            title={`${item.price} VND`}
                                            sx={{
                                                minWidth: 200,
                                                pl: 2,
                                                py: 1.5,
                                            }}
                                        />
                                        <TableCellToolTip
                                            key={item.status}
                                            title={item.status}
                                            sx={{
                                                minWidth: 200,
                                                pl: 2,
                                                py: 1.5,
                                                color:
                                                    item.status === 'Available'
                                                        ? 'success.main'
                                                        : 'error.main',
                                            }}
                                        />
                                        <TableCell>
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
                                        </TableCell>
                                    </TableRow>
                                )) || null}

                            <ProductModal
                                isOpen={addModalOpen}
                                onClose={handleModalClose}
                                onSubmitData={handleSubmitData}
                            />
                            <ProductModal
                                data={selectedModal}
                                isOpen={addModalEditOpen}
                                onClose={handleEditModalClose}
                                onSubmitData={handleSubmitEditData}
                            />

                            {/* <DeleteConfirmModal
                        isOpen={openDeleteListModal}
                        onClose={cancelRemoveListData}
                        onDelete={confirmRemoveListData}
                    /> */}
                            <DeleteConfirmModal
                                isOpen={openDeleteModal}
                                onClose={handleCloseDeleteModal}
                                onDelete={onDelete}
                            />
                        </TableBody>
                    </Table>
                </Scrollbar>
                <RoundedTablePagination
                    count={count}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>
        </div>
    );
};

ListDataDetailTable.propTypes = {};

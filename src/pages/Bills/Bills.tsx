import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import { applyPagination } from '../../utils/apply-pagination';
import { useCustomerIds } from '../../components/hooks/useDataIds';
import {
    Box,
    Button,
    Container,
    Stack,
    SvgIcon,
    Typography,
    useTheme,
} from '@mui/material';
import { useSelection } from '../../components/hooks/use-selection';
import Delete from '@mui/icons-material/Delete';
import { DeleteConfirmModal } from '../../components/common/modals/delete-confirm-modal';
import useAuthorization from '../../hooks/authorizationHooks';
import { BillsTable } from '../../components/TablesTable/BillsTable';
import RangePicker from '../../components/common/RangePicker/RangePicker';
import { BillModal } from '../../components/modals/BillModal';

type Props = {};

const Bills: React.FC<Props> = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [tables, setTables] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addModalEditOpen, setAddModalEditOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openDeleteListModal, setOpenDeleteListModal] = useState(false);
    const [isDeleteSubmit, setIsDeleteSubmit] = useState(false);
    const [selectedModal, setSelectedModal] = useState<any>(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState<any>(null);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [startDraftDate, setStartDraftDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [endDraftDate, setEndDraftDate] = useState<Date | null>(null);
    const [isErrorOnStartDate, setIsErrorOnStartDate] = useState(false);
    const [isStartDateShaking, setIsStartDateShaking] = useState(false);
    const [isValidDates, setIsValidDates] = useState(true);
    const [isResetDates, setIsResetDates] = useState(false);

    const [draftValue, setDraftValue] = useState({
        name: '',
        phonenumber: '',
        status: '',
    });

    const { isAdmin } = useAuthorization();

    const customers = useMemo(
        () => applyPagination(tables, page, rowsPerPage),
        [tables, page, rowsPerPage]
    );
    const customersIds = useCustomerIds(customers);
    const customersSelection = useSelection(customersIds);

    const accessToken = localStorage.getItem('access_token');

    const notifyFail = () =>
        toast.error('There are some errors! Please try again!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });

    const deleteData = async (id: number) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/bill/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
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

    const handleModalEditOpen = useCallback(async (id: number) => {
        setAddModalEditOpen(true);
        await fetchBill(id);
    }, []);

    const handleModalDeleteOpen = useCallback(async (id: number) => {
        setOpenDeleteModal(true);
        setSelectedDeleteId(id);
    }, []);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/bill`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setTables(response.data);
                setPage(page);
            } catch (error) {
                console.error('Error fetching tables:', error);
                setTables([]);
            }
        };
        setIsDeleteSubmit(false);
        fetchBills();
    }, [accessToken, addModalOpen, addModalEditOpen, isDeleteSubmit]);

    const handlePageChange = useCallback(
        (event: any, value: any) => {
            setPage(value);
            console.log(event);
        },
        [tables]
    );

    const handleRowsPerPageChange = useCallback(
        (event: any) => {
            setRowsPerPage(event.target.value);
        },
        [setRowsPerPage]
    );

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

    const cancelRemoveListData = () => {
        setOpenDeleteListModal(false);
    };

    const handleSubmitEditData = useCallback(() => {
        setAddModalOpen(false);
    }, []);

    const onChange = (value: string, name: string) => {
        setDraftValue({
            ...draftValue,
            [name]: value,
        });
    };

    const onSearch = async () => {
        if (isValidDates) {
            setIsErrorOnStartDate(false);
            setIsStartDateShaking(false);
            setStartDate(startDraftDate);
            setEndDate(endDraftDate);
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/bill/filter`,
                    {
                        guessName: draftValue.name || undefined,
                        guessNumber: draftValue.phonenumber || undefined,
                        status: draftValue.status || undefined,
                        startDate: startDraftDate?.toISOString(),
                        endDate: endDraftDate?.toISOString(),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setTables(response.data);
                setPage(0);
            } catch (error) {
                console.error('Error searching tables:', error);
            }
        } else {
            setIsErrorOnStartDate(true);
            setIsStartDateShaking(true);

            setTimeout(() => {
                setIsStartDateShaking(false);
            }, 1000);
        }
    };

    const handleOpenDeleteSearch = useCallback(() => {
        setDraftValue({
            name: '',
            phonenumber: '',
            status: '',
        });

        setStartDraftDate(null);
        setEndDraftDate(null);

        setIsResetDates(true);
        setTimeout(() => {
            setIsResetDates(false);
        }, 500);
    }, []);

    const onDelete = () => {
        deleteData(selectedDeleteId);
        setOpenDeleteModal(false);
        setIsDeleteSubmit(true);
    };

    const confirmRemoveListData = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/bill/deleteMany`,
                {
                    idList: customersSelection.selected,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
        } catch (error) {
            notifyFail();
        }
        setOpenDeleteListModal(false);
        setIsDeleteSubmit(true);
    };

    const handleStartDateChange = (data: Date | null) => {
        if (data) {
            setStartDraftDate(data);
        }
    };
    const handleEndDateChange = (data: Date | null) => {
        if (data) {
            setEndDraftDate(data);
        }
    };

    const handleValidDates = (isValid: boolean) => {
        setIsValidDates(isValid);
    };

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 8,
            }}
        >
            <Container maxWidth="xl">
                <Stack
                    spacing={3}
                    sx={{
                        [theme.breakpoints.down('md')]: {
                            paddingLeft: '16px',
                            paddingRight: '16px',
                        },
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <Stack spacing={1}>
                            <Typography variant="h4">Bills</Typography>
                        </Stack>
                        {isAdmin && (
                            <div className="mr-4">
                                <Button
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            <Delete />
                                        </SvgIcon>
                                    }
                                    variant="contained"
                                    onClick={() => setOpenDeleteListModal(true)}
                                    disabled={
                                        customersSelection.selected.length
                                            ? false
                                            : true
                                    }
                                    color="error"
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </Stack>
                    <Box
                        display="flex"
                        flexDirection={'row'}
                        marginBottom={'16px'}
                    >
                        <TextField
                            label="Customer Name"
                            placeholder="Enter Customer Name"
                            value={draftValue.name}
                            onChange={(event) =>
                                onChange(event.target.value, 'name')
                            }
                            size="small"
                            sx={{
                                mr: 2,
                                mt: 2,
                            }}
                        />
                        <TextField
                            label="Phone Number"
                            placeholder="Enter Phone Number"
                            value={draftValue.phonenumber}
                            onChange={(event) =>
                                onChange(event.target.value, 'phonenumber')
                            }
                            size="small"
                            sx={{
                                mr: 2,
                                mt: 2,
                            }}
                        />
                        <RangePicker
                            startDate={startDraftDate}
                            endDate={endDraftDate}
                            handleDates={handleValidDates}
                            isErrorOnStartDate={isErrorOnStartDate}
                            isStartDateShaking={isStartDateShaking}
                            handleUpdateStartDate={handleStartDateChange as any}
                            handleUpdateEndDate={handleEndDateChange as any}
                            isResetFilter={isResetDates}
                        />
                        <FormControl
                            sx={{
                                width: 130,
                                mr: 2,
                                mt: 2,
                            }}
                            size="small"
                        >
                            <InputLabel id="demo-simple-select-label">
                                Status
                            </InputLabel>
                            <Select
                                required
                                label="Status"
                                placeholder="Pick Status"
                                onChange={(e) => {
                                    onChange(e.target.value, 'status');
                                }}
                                value={draftValue.status}
                                name="status"
                            >
                                <MenuItem key={'CANCELLED'} value={'CANCELLED'}>
                                    CANCELLED
                                </MenuItem>
                                <MenuItem key={'PENDING'} value={'PENDING'}>
                                    PENDING
                                </MenuItem>
                                <MenuItem key={'DONE'} value={'DONE'}>
                                    DONE
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            size="medium"
                            sx={{
                                mr: 2,
                                mt: 2,
                            }}
                            onClick={onSearch}
                        >
                            Search
                        </Button>
                        <Button
                            size="medium"
                            color="error"
                            variant="outlined"
                            onClick={handleOpenDeleteSearch}
                            sx={{
                                mr: 2,
                                mt: 2,
                            }}
                        >
                            Reset filter
                        </Button>
                    </Box>
                    <BillsTable
                        count={tables.length}
                        items={customers}
                        onDeselectAll={customersSelection.handleDeselectAll}
                        onDeselectOne={customersSelection.handleDeselectOne}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        onSelectAll={customersSelection.handleSelectAll}
                        onSelectOne={customersSelection.handleSelectOne}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        selected={customersSelection.selected}
                        handleDeleteModal={handleModalDeleteOpen}
                        submitEditOpen={handleModalEditOpen}
                    />
                    <BillModal
                        data={selectedModal}
                        isOpen={addModalEditOpen}
                        onClose={handleEditModalClose}
                        onSubmitData={handleSubmitEditData}
                    />

                    <DeleteConfirmModal
                        isOpen={openDeleteListModal}
                        onClose={cancelRemoveListData}
                        onDelete={confirmRemoveListData}
                    />
                    <DeleteConfirmModal
                        isOpen={openDeleteModal}
                        onClose={handleCloseDeleteModal}
                        onDelete={onDelete}
                    />

                    <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </Stack>
            </Container>
        </Box>
    );
};

export default Bills;

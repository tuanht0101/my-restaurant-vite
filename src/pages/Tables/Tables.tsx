import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TablesTable } from '../../components/TablesTable/TablesTable';
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
import SearchIcon from '@mui/icons-material/Search';
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

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { TableModal } from '../../components/modals/tableModal';
import Delete from '@mui/icons-material/Delete';
import { DeleteConfirmModal } from '../../components/common/modals/delete-confirm-modal';
import useAuthorization from '../../hooks/authorizationHooks';

type Props = {};

const Tables: React.FC<Props> = () => {
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
    const [draftValue, setDraftValue] = useState({
        search: '',
        type: '',
        available: '',
        active: '',
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
        console.log(id);
        await axios.delete(`${import.meta.env.VITE_API_URL}/table/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    };

    const fetchTable = async (id: number) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/table/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setSelectedModal(response.data);
            console.log(response);
        } catch (error) {
            console.error('Error fetching tables:', error);
            setSelectedModal(null);
        }
    };

    const handleModalEditOpen = useCallback(async (id: number) => {
        setAddModalEditOpen(true);
        console.log('id pa', id);
        await fetchTable(id);
    }, []);

    const handleModalDeleteOpen = useCallback(async (id: number) => {
        setOpenDeleteModal(true);
        setSelectedDeleteId(id);
        console.log('id delete', id);
    }, []);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/table`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setTables(response.data);
            } catch (error) {
                console.error('Error fetching tables:', error);
                setTables([]);
            }
        };
        setIsDeleteSubmit(false);
        fetchTables();
    }, [
        accessToken,
        addModalOpen,
        addModalEditOpen,
        openDeleteModal,
        isDeleteSubmit,
    ]);

    const handlePageChange = (event: any, value: any) => {
        setPage(value);
    };

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

    const handleModalOpen = () => {
        setAddModalOpen(true);
    };

    const handleSubmitData = () => {
        console.log('click add');
        setAddModalOpen(false);
    };

    const handleSubmitEditData = useCallback(() => {
        console.log('click add', selectedModal);
        setAddModalOpen(false);
    }, []);

    const onChange = (value: string, name: string) => {
        setDraftValue({
            ...draftValue,
            [name]: value,
        });
    };

    const onSearch = async () => {
        console.log(draftValue);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/table/filter`,
                {
                    search: draftValue.search || undefined,
                    isPrivate: draftValue.type || undefined,
                    isAvailable: draftValue.available || undefined,
                    isActive: draftValue.active || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setTables(response.data);
        } catch (error) {
            console.error('Error searching tables:', error);
        }
    };

    const handleOpenDeleteSearch = useCallback(() => {
        setDraftValue({
            search: '',
            type: '',
            available: '',
            active: '',
        });
    }, []);

    useEffect(() => {
        console.log(selectedModal);
    }, [selectedModal]);

    const onDelete = () => {
        console.log(selectedDeleteId);
        deleteData(selectedDeleteId);
        setOpenDeleteModal(false);
    };

    const confirmRemoveListData = async () => {
        try {
            console.log(customersSelection.selected);
            await axios.post(
                `${import.meta.env.VITE_API_URL}/table/deleteMany`,
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
                            <Typography variant="h4">Tables</Typography>
                        </Stack>
                        {isAdmin && (
                            <div className="mr-4">
                                <Button
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    }
                                    variant="contained"
                                    onClick={handleModalOpen}
                                    sx={{
                                        marginRight: '8px',
                                    }}
                                >
                                    Add
                                </Button>
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
                            label="Keyword"
                            placeholder="Enter keyword"
                            value={draftValue.search}
                            onChange={(event) =>
                                onChange(event.target.value, 'search')
                            }
                            size="small"
                            sx={{
                                mr: 2,
                                mt: 2,
                            }}
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
                                Table Type
                            </InputLabel>
                            <Select
                                required
                                label="Table Type"
                                placeholder="Pick table type"
                                onChange={(e) => {
                                    onChange(e.target.value, 'type');
                                }}
                                value={draftValue.type}
                                name="type"
                            >
                                <MenuItem key={'normal'} value={'false'}>
                                    Normal
                                </MenuItem>
                                <MenuItem key={'vip'} value={'true'}>
                                    VIP
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                            sx={{
                                width: 130,
                                mr: 2,
                                mt: 2,
                            }}
                            size="small"
                        >
                            <InputLabel id="demo-simple-select-label">
                                Available Status
                            </InputLabel>
                            <Select
                                required
                                label="Available Status"
                                placeholder="Pick Available Status"
                                onChange={(e) => {
                                    onChange(e.target.value, 'available');
                                }}
                                value={draftValue.available}
                                name="available"
                            >
                                <MenuItem key={'available'} value={'true'}>
                                    Available
                                </MenuItem>
                                <MenuItem key={'unavailable'} value={'false'}>
                                    Unavailable
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                            sx={{
                                width: 130,
                                mr: 2,
                                mt: 2,
                            }}
                            size="small"
                        >
                            <InputLabel id="demo-simple-select-label">
                                Active Status
                            </InputLabel>
                            <Select
                                required
                                label="Available Status"
                                placeholder="Pick Available Status"
                                onChange={(e) => {
                                    onChange(e.target.value, 'active');
                                }}
                                value={draftValue.active}
                                name="active"
                            >
                                <MenuItem key={'active'} value={'true'}>
                                    Available
                                </MenuItem>
                                <MenuItem key={'inactive'} value={'false'}>
                                    Inactive
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
                    <TablesTable
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
                    <TableModal
                        isOpen={addModalOpen}
                        onClose={handleModalClose}
                        onSubmitData={handleSubmitData}
                    />
                    <TableModal
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

export default Tables;

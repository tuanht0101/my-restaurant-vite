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
import { UsersTable } from '../../components/TablesTable/UsersTable';
import { UserModal } from '../../components/modals/userModal';
import { CategoryTable } from '../../components/TablesTable/CategoryTable';
import { CategoryModal } from '../../components/modals/CategoryModal';

type Props = {};

const Categories: React.FC<Props> = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addModalEditOpen, setAddModalEditOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openDeleteListModal, setOpenDeleteListModal] = useState(false);
    const [isDeleteSubmit, setIsDeleteSubmit] = useState(false);
    const [selectedModal, setSelectedModal] = useState<any>(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState<any>(null);
    const [draftValue, setDraftValue] = useState({
        name: '',
    });
    const { isAdmin } = useAuthorization();

    const customers = useMemo(
        () => applyPagination(users, page, rowsPerPage),
        [users, page, rowsPerPage]
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/category/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    };

    const fetchTable = async (id: number) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/category/${id}`,
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
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/category`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching Users:', error);
                setUsers([]);
            }
        };
        setIsDeleteSubmit(false);
        fetchUsers();
    }, [
        accessToken,
        addModalOpen,
        addModalEditOpen,
        openDeleteModal,
        isDeleteSubmit,
    ]);

    const handlePageChange = (event: any, value: any) => {
        setPage(value);
        console.log(event);
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
                `${import.meta.env.VITE_API_URL}/category/filter`,
                {
                    name: draftValue.name || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setUsers(response.data);
        } catch (error) {
            console.error('Error searching Users:', error);
        }
    };

    const handleOpenDeleteSearch = useCallback(() => {
        setDraftValue({
            name: '',
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
                `${import.meta.env.VITE_API_URL}/category/deleteMany`,
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
                            <Typography variant="h4">Categories</Typography>
                        </Stack>

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
                    </Stack>
                    <Box
                        display="flex"
                        flexDirection={'row'}
                        marginBottom={'16px'}
                    >
                        <TextField
                            label="Name"
                            placeholder="Search name ..."
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
                    <CategoryTable
                        count={users.length}
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
                    <CategoryModal
                        isOpen={addModalOpen}
                        onClose={handleModalClose}
                        onSubmitData={handleSubmitData}
                    />
                    <CategoryModal
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

export default Categories;

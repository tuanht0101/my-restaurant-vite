import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TablesTable } from '../../components/TablesTable/TablesTable';
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import axios from 'axios';
import { applyPagination } from '../../utils/apply-pagination';
import SearchIcon from '@mui/icons-material/Search';
// import { Table } from '../../type/Table.type';
import { useCustomers } from '../../components/hooks/useDatas';
import { useCustomerIds } from '../../components/hooks/useDataIds';
import {
    Box,
    Button,
    Container,
    Stack,
    SvgIcon,
    Typography,
    useTheme, // Import useTheme
} from '@mui/material';
import { useSelection } from '../../components/hooks/use-selection';

import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { TableModal } from '../../components/modals/tableModal';
import Delete from '@mui/icons-material/Delete';

type Props = {};

const Tables: React.FC<Props> = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [tables, setTables] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [draftValue, setDraftValue] = useState({
        search: '',
        type: '',
        available: '',
        active: '',
    });

    const customers = applyPagination(tables, page, rowsPerPage); // Update this line
    const customersIds = useCustomerIds(customers);
    const customersSelection = useSelection(customersIds);

    const accessToken = localStorage.getItem('access_token');

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

        fetchTables();
    }, [accessToken]);

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

    const handleModalOpen = () => {
        setAddModalOpen(true);
    };

    const handleSubmitData = () => {
        console.log('click add');
        setAddModalOpen(false);
    };

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
                                // onClick={handleModalOpen}
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
                            startIcon={<SearchIcon />}
                            variant="contained"
                            sx={{
                                mr: 2,
                                mt: 2,
                            }}
                            onClick={onSearch}
                        >
                            Search
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleOpenDeleteSearch}
                            color="error"
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
                    />
                    <TableModal
                        isOpen={addModalOpen}
                        onClose={handleModalClose}
                        onSubmitData={handleSubmitData}
                    />
                </Stack>
            </Container>
        </Box>
    );
};

export default Tables;

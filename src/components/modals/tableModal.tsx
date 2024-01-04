import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, type FC } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import useAuthorization from '../../hooks/authorizationHooks';

interface TableModalProps {
    data?: any;
    isOpen: boolean;
    onClose: () => void;
    onSubmitData: (value: any) => void;
}

export const TableModal: FC<TableModalProps> = (props) => {
    const accessToken = localStorage.getItem('access_token');
    const { isAdmin } = useAuthorization();

    const notifyFail = (errorMessage?: string) => {
        toast.error(
            'Failed! ' + errorMessage ||
                'There are some errors! Please try again!',
            {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            }
        );
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: props.data?.name || '',
            capacity: props.data?.capacity || '',
            tableType: props.data?.isPrivate === true ? 'vip' : 'normal',
            availableStatus: props.data?.isPrivate
                ? props.data.isPrivate
                    ? 'vip'
                    : 'normal'
                : '',
            activeStatus: props.data?.isActive
                ? props.data.isActive === true
                    ? 'active'
                    : 'inactive'
                : '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('This field is required'),
            capacity: Yup.number().required('This field is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const isPrivateStatus = formik.values.tableType === 'vip';
            const isAvailable = formik.values.availableStatus === 'available';
            const isActive = formik.values.activeStatus === 'active';
            if (!props.data) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/table`,
                        {
                            name: formik.values.name,
                            capacity: parseInt(formik.values.capacity, 10),
                            isPrivate: isPrivateStatus,
                            isAvailable: isAvailable,
                            isActive: isActive,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                } catch (error: any) {
                    console.error('Error fetching tables:', error);

                    // Check if the error has a response from the server
                    if (error.response && error.response.data) {
                        const errorMessage = error.response.data.message;
                        notifyFail(errorMessage);
                    } else {
                        notifyFail(); // Fallback to the default error message
                    }
                }
            } else {
                if (isAdmin) {
                    try {
                        const response = await axios.patch(
                            `${import.meta.env.VITE_API_URL}/table/${
                                props.data.id
                            }`,
                            {
                                name: formik.values.name,
                                capacity: parseInt(formik.values.capacity, 10),
                                isPrivate: isPrivateStatus,
                                isAvailable: isAvailable,
                                isActive: isActive,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );
                    } catch (error: any) {
                        console.error('Error fetching tables:', error);

                        // Check if the error has a response from the server
                        if (error.response && error.response.data) {
                            const errorMessage = error.response.data.message;
                            notifyFail(errorMessage);
                        } else {
                            notifyFail(); // Fallback to the default error message
                        }
                    }
                } else {
                    try {
                        const response = await axios.patch(
                            `${
                                import.meta.env.VITE_API_URL
                            }/table/updateStatus/${props.data.id}`,
                            {
                                isAvailable: isAvailable,
                                isActive: isActive,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );
                    } catch (error: any) {
                        console.error('Error fetching tables:', error);

                        // Check if the error has a response from the server
                        if (error.response && error.response.data) {
                            const errorMessage = error.response.data.message;
                            notifyFail(errorMessage);
                        } else {
                            notifyFail(); // Fallback to the default error message
                        }
                    }
                }
            }

            props.onSubmitData(values as any);
            resetForm();
            props.onClose();
        },
    });

    useEffect(() => {
        // Update formik values when data prop changes
        if (props.data) {
            formik.setValues({
                name: props.data?.name || '',
                capacity: props.data?.capacity || '',
                tableType: props.data?.isPrivate === true ? 'vip' : 'normal',
                availableStatus:
                    props.data?.isAvailable === true
                        ? 'available'
                        : 'unavailable',
                activeStatus:
                    props.data?.isActive === true ? 'active' : 'inactive',
            });
            formik.submitForm = async () => {};
        } else {
            // Set default values when there's no data prop
            formik.setValues({
                name: '',
                capacity: '',
                tableType: '',
                availableStatus: '',
                activeStatus: '',
            });
        }
    }, [props.data]);

    const handleCloseModal = (e: any) => {
        formik.handleReset(e);
        props.onClose();
    };

    return (
        <Modal open={props.isOpen} onClose={handleCloseModal}>
            <Box
                sx={{
                    minHeight: '100%',
                    p: 3,
                }}
            >
                <Paper
                    elevation={12}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 3,
                        mx: 'auto',
                        outline: 'none',
                        maxWidth: 900,
                        width: 'calc(100% - 64px)',
                    }}
                >
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            px: 2,
                            py: 2,
                            borderBottom: '1px solid #D9D9D9',
                        }}
                    >
                        <Typography variant="h6">
                            {props.data ? 'Edit Table' : 'Add Table'}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </Box>
                    <Divider />
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            sx={{
                                padding: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '49%',
                                }}
                            >
                                <TextField
                                    label="Table Name"
                                    placeholder="Fill Table name"
                                    fullWidth
                                    required
                                    error={Boolean(
                                        formik.touched.name &&
                                            formik.errors.name
                                    )}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    name="name"
                                    disabled={!isAdmin}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div
                                        style={{
                                            color: 'red',
                                            marginLeft: '4px',
                                        }}
                                    >
                                        {formik.errors.name.toString()}
                                    </div>
                                )}
                            </Box>
                            <Box
                                sx={{
                                    width: '49%',
                                }}
                            >
                                <TextField
                                    label="Capacity"
                                    placeholder="Fill Capacity"
                                    fullWidth
                                    required
                                    error={Boolean(
                                        formik.touched.capacity &&
                                            formik.errors.capacity
                                    )}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.capacity}
                                    name="capacity"
                                    disabled={!isAdmin}
                                />
                                {formik.touched.capacity &&
                                    formik.errors.capacity && (
                                        <div
                                            style={{
                                                color: 'red',
                                                marginLeft: '4px',
                                            }}
                                        >
                                            {formik.errors.capacity.toString()}
                                        </div>
                                    )}
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                px: 2,
                                paddingBottom: 2,
                            }}
                        >
                            <Box sx={{ width: '49%' }}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(
                                        formik.touched.tableType &&
                                            formik.errors.tableType
                                    )}
                                >
                                    <InputLabel id="demo-simple-select-label">
                                        Table Type
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        required
                                        label="Table Type"
                                        placeholder="Pick table type"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.tableType}
                                        name="tableType"
                                        disabled={!isAdmin}
                                    >
                                        <MenuItem
                                            key={'normal'}
                                            value={'normal'}
                                        >
                                            Normal
                                        </MenuItem>
                                        <MenuItem key={'vip'} value={'vip'}>
                                            VIP
                                        </MenuItem>
                                    </Select>
                                    {formik.touched.tableType &&
                                        formik.errors.tableType && (
                                            <FormHelperText>
                                                {formik.errors.tableType.toString()}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Box>
                            <Box sx={{ width: '49%' }}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(
                                        formik.touched.availableStatus &&
                                            formik.errors.availableStatus
                                    )}
                                >
                                    <InputLabel id="demo-simple-select-label">
                                        Available Status
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        required
                                        label="Available Status"
                                        placeholder="Pick Available Status"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.availableStatus}
                                        name="availableStatus"
                                    >
                                        <MenuItem
                                            key={'available'}
                                            value={'available'}
                                        >
                                            Available
                                        </MenuItem>
                                        <MenuItem
                                            key={'unavailable'}
                                            value={'unavailable'}
                                        >
                                            Unavailable
                                        </MenuItem>
                                    </Select>
                                    {formik.touched.availableStatus &&
                                        formik.errors.availableStatus && (
                                            <FormHelperText>
                                                {formik.errors.availableStatus.toString()}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                px: 2,
                                paddingBottom: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: '49%',
                                }}
                            >
                                <FormControl
                                    fullWidth
                                    error={Boolean(
                                        formik.touched.activeStatus &&
                                            formik.errors.activeStatus
                                    )}
                                >
                                    <InputLabel id="demo-simple-select-label">
                                        Active Status
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        required
                                        label="Đơn vị cung cấp"
                                        placeholder="Chọn đơn vị cung cấp cung cấp"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.activeStatus}
                                        name="activeStatus"
                                    >
                                        <MenuItem
                                            key={'active'}
                                            value={'active'}
                                        >
                                            Active
                                        </MenuItem>
                                        <MenuItem
                                            key={'inactive'}
                                            value={'inactive'}
                                        >
                                            Inactive
                                        </MenuItem>
                                    </Select>
                                    {formik.touched.activeStatus &&
                                        formik.errors.activeStatus && (
                                            <FormHelperText>
                                                {formik.errors.activeStatus.toString()}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                padding: 2,
                                borderTop: '1px solid #D9D9D9',
                            }}
                        >
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={formik.isSubmitting || !formik.dirty}
                            >
                                Save
                            </Button>
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
                            <Button
                                variant="outlined"
                                sx={{ ml: 3 }}
                                onClick={handleCloseModal}
                            >
                                Close
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Modal>
    );
};

TableModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

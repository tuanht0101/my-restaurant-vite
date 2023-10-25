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
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

interface TableModalProps {
    data?: any;
    isOpen: boolean;
    onClose: () => void;
    onSubmitData: (value: any) => void;
}

export const TableModal: FC<TableModalProps> = (props) => {
    const accessToken = localStorage.getItem('access_token');

    const formik = useFormik({
        initialValues: {
            name: '',
            capacity: '',
            tableType: '',
            availableStatus: '',
            activeStatus: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('This field is required'),
            capacity: Yup.number().required('This field is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const isPrivateStatus = formik.values.tableType === 'normal';
            const isAvailable = formik.values.availableStatus === 'available';
            const isActive = formik.values.activeStatus === 'active';
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

                props.onSubmitData(values as any);
                resetForm();
                props.onClose();
                console.log('respone data', response.data);
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
            console.log(formik.values.name);
            console.log('type of name:', typeof formik.values.name);
            console.log(formik.values.capacity);
            console.log('type of capacity:', typeof formik.values.capacity);
            console.log(formik.values.tableType);
            console.log(formik.values.availableStatus);
            console.log(formik.values.activeStatus);
        },
    });

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
                        <Typography variant="h6">Add Table</Typography>
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
                                    helperText={
                                        formik.touched.name &&
                                        formik.errors.name
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    name="name"
                                />
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
                                    helperText={
                                        formik.touched.capacity &&
                                        formik.errors.capacity
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.capacity}
                                    name="capacity"
                                />
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
                                    >
                                        {/* {hinhThucCungCaps.map((h) => (
                                            <MenuItem key={h.id} value={h.id}>
                                                {h.name}
                                            </MenuItem>
                                        ))} */}
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
                                    <FormHelperText>
                                        {formik.touched.tableType &&
                                            formik.errors.tableType}
                                    </FormHelperText>
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
                                    <FormHelperText>
                                        {formik.touched.availableStatus &&
                                            formik.errors.availableStatus}
                                    </FormHelperText>
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
                                    <FormHelperText>
                                        {formik.touched.activeStatus &&
                                            formik.errors.activeStatus}
                                    </FormHelperText>
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
                                disabled={formik.isSubmitting}
                            >
                                Lưu
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ ml: 3 }}
                                onClick={handleCloseModal}
                            >
                                Đóng
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

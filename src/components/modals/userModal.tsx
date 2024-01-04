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

interface UserModalProps {
    data?: any;
    isOpen: boolean;
    onClose: () => void;
    onSubmitData: (value: any) => void;
}

export const UserModal: FC<UserModalProps> = (props) => {
    const accessToken = localStorage.getItem('access_token');
    const { isAdmin } = useAuthorization();

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

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: props.data?.email || '',
            role: props.data?.role || '',
            name: props.data?.fullname || '',
            phonenumber: props.data?.phonenumber || '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required('Email is required')
                .email('Invalid email address'),
            role: Yup.string().required('Role is required'),
            name: Yup.string().required('Name is required'),
            phonenumber: Yup.string().required('Phonenumber is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            if (!props.data) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/signup`,
                        {
                            email: formik.values.email,
                            password: formik.values.password,
                            role: formik.values.role,
                            fullname: formik.values.name,
                            phonenumber: formik.values.phonenumber,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                } catch (error) {
                    console.error('Error fetching tables:', error);
                    notifyFail();
                }
            } else {
                try {
                    const response = await axios.patch(
                        `${import.meta.env.VITE_API_URL}/user/${props.data.id}`,
                        {
                            role: formik.values.role,
                            fullname: formik.values.name,
                            phonenumber: formik.values.phonenumber,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                } catch (error) {
                    console.error('Error fetching tables:', error);
                    notifyFail();
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
                email: props.data?.email || '',
                role: props.data?.role || '',
                name: props.data?.fullname || '',
                phonenumber: props.data?.phonenumber || '',
                password: '',
            });
        } else {
            // Set default values when there's no data prop
            formik.setValues({
                email: '',
                role: '',
                name: '',
                phonenumber: '',
                password: '',
            });
        }
    }, [props.data]);

    const handleCloseModal = (e: any) => {
        formik.handleReset(e);
        props.onClose();
    };

    return (
        <Modal open={props.isOpen} onClose={handleCloseModal}>
            <Box sx={{ minHeight: '100%', p: 3 }}>
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
                            {props.data ? 'Edit User' : 'Add User'}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </Box>
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            sx={{
                                padding: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box sx={{ width: '49%' }}>
                                <TextField
                                    label="Email"
                                    placeholder="Enter email"
                                    fullWidth
                                    required
                                    error={Boolean(
                                        formik.touched.email &&
                                            formik.errors.email
                                    )}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    disabled={!!props.data}
                                    name="email"
                                />
                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <div
                                            style={{
                                                color: 'red',
                                                marginLeft: '4px',
                                            }}
                                        >
                                            {formik.errors.email.toString()}
                                        </div>
                                    )}
                            </Box>
                            <Box sx={{ width: '49%' }}>
                                <TextField
                                    label="Name"
                                    placeholder="Enter name"
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
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Role
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        required
                                        label="Role"
                                        placeholder="Pick Role"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.role}
                                        name="role"
                                    >
                                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                                        <MenuItem value="USER">USER</MenuItem>
                                    </Select>
                                    {formik.touched.role &&
                                        formik.errors.role && (
                                            <FormHelperText>
                                                {formik.errors.role.toString()}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Box>
                            <Box sx={{ width: '49%' }}>
                                <TextField
                                    label="Phonenumber"
                                    placeholder="Enter phonenumber"
                                    fullWidth
                                    required
                                    error={Boolean(
                                        formik.touched.phonenumber &&
                                            formik.errors.phonenumber
                                    )}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phonenumber}
                                    name="phonenumber"
                                />
                                {formik.touched.phonenumber &&
                                    formik.errors.phonenumber && (
                                        <div
                                            style={{
                                                color: 'red',
                                                marginLeft: '4px',
                                            }}
                                        >
                                            {formik.errors.phonenumber.toString()}
                                        </div>
                                    )}
                            </Box>
                        </Box>
                        {!props.data && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    px: 2,
                                    paddingBottom: 2,
                                }}
                            >
                                <Box sx={{ width: '49%' }}>
                                    <TextField
                                        label="Password"
                                        placeholder="Enter Password"
                                        fullWidth
                                        required
                                        error={Boolean(
                                            formik.touched.password &&
                                                formik.errors.password
                                        )}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                        name="password"
                                    />
                                    {formik.touched.password &&
                                        formik.errors.password && (
                                            <div
                                                style={{
                                                    color: 'red',
                                                    marginLeft: '4px',
                                                }}
                                            >
                                                {formik.errors.password.toString()}
                                            </div>
                                        )}
                                </Box>
                            </Box>
                        )}
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

UserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

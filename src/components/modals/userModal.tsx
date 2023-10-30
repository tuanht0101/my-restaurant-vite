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
import useAuthorization from '../../hooks/authHooks';

interface UserModalProps {
    data?: any;
    isOpen: boolean;
    onClose: () => void;
    onSubmitData: (value: any) => void;
}

export const UserModal: FC<UserModalProps> = (props) => {
    const accessToken = localStorage.getItem('access_token');
    const { isAdmin } = useAuthorization();

    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
            password: '',
            role: props.data?.role || '',
            fullname: props.data?.fullname || '',
            phonenumber: props.data?.phonenumber || '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            fullname: Yup.string().max(255).required('Name is required'),
            phonenumber: Yup.string().matches(
                phoneRegExp,
                'Phone number is not valid'
            ),
            password: Yup.string()
                .min(8)
                .max(16)
                .required('Password is required'),
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
                            fullname: formik.values.fullname,
                            phonenumber: formik.values.phonenumber,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    console.log('respone data', response.data);
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
                            fullname: formik.values.fullname,
                            phonenumber: formik.values.phonenumber,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    console.log('respone data', response.data);
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
                password: '',
                role: props.data?.role || '',
                fullname: props.data?.fullname || '',
                phonenumber: props.data?.phonenumber || '',
            });
            formik.submitForm = async () => {};
        } else {
            // Set default values when there's no data prop
            formik.setValues({
                email: '',
                password: '',
                role: '',
                fullname: '',
                phonenumber: '',
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
                            {props.data ? 'Edit User' : 'Add User'}
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
                                    label="Email"
                                    placeholder="Fill User Email"
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
                            <Box
                                sx={{
                                    width: '49%',
                                }}
                            >
                                <FormControl
                                    fullWidth
                                    error={Boolean(
                                        formik.touched.role &&
                                            formik.errors.role
                                    )}
                                >
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
                                        <MenuItem key={'USER'} value={'USER'}>
                                            USER
                                        </MenuItem>
                                        <MenuItem key={'ADMIN'} value={'ADMIN'}>
                                            ADMIN
                                        </MenuItem>
                                    </Select>
                                    {formik.touched.role &&
                                        formik.errors.role && (
                                            <FormHelperText>
                                                {formik.errors.role.toString()}
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
                            <Box sx={{ width: '49%' }}>
                                <TextField
                                    label="Full Name"
                                    placeholder="Enter Full Name"
                                    fullWidth
                                    required
                                    error={Boolean(
                                        formik.touched.fullname &&
                                            formik.errors.fullname
                                    )}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.fullname}
                                    name="fullname"
                                    disabled={!isAdmin}
                                />
                                {formik.touched.fullname &&
                                    formik.errors.fullname && (
                                        <div
                                            style={{
                                                color: 'red',
                                                marginLeft: '4px',
                                            }}
                                        >
                                            {formik.errors.fullname.toString()}
                                        </div>
                                    )}
                            </Box>
                            <Box sx={{ width: '49%' }}>
                                <TextField
                                    label="Phone Number"
                                    placeholder="Enter phone number ..."
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
                                    disabled={!isAdmin}
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
                                        disabled={!isAdmin}
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
                                Submit
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

UserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

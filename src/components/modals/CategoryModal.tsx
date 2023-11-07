import {
    Box,
    Button,
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

export const CategoryModal: FC<UserModalProps> = (props) => {
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
            name: props.data?.name || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            console.log('Submit button clicked!');
            if (!props.data) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/category`,
                        {
                            name: formik.values.name,
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
                        `${import.meta.env.VITE_API_URL}/category/${
                            props.data.id
                        }`,
                        {
                            name: formik.values.name,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    console.log('respone data', response.data);

                    console.log('input: ', {
                        name: formik.values.name,
                    });
                } catch (error) {
                    console.error('Error fetching tables:', error);
                    notifyFail();
                }
            }
            console.log('input: ', {
                name: formik.values.name,
            });
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
            });
        } else {
            // Set default values when there's no data prop
            formik.setValues({
                name: props.data?.name || '',
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
                            {props.data ? 'Edit Category' : 'Add Category'}
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
                            <Box sx={{ width: '100%' }}>
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

CategoryModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

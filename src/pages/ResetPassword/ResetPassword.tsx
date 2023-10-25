import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Alert,
    Box,
    Button,
    FormHelperText,
    Link,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {};

export default function ResetPassword({}: Props) {
    const navigate = useNavigate();

    const notify = () =>
        toast.success('Email sent successfully! Redirecting to LogIn Page!!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });

    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const formik = useFormik({
        initialValues: {
            email: '',
            phonenumber: '',
            submit: null,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            phonenumber: Yup.string().matches(
                phoneRegExp,
                'Phone number is not valid'
            ),
        }),
        onSubmit: async (values: any, helpers: any) => {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/reset-password`,
                    {
                        email: formik.values.email,
                        phonenumber: formik.values.phonenumber,
                    }
                );
                notify();
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (err: any) {
                helpers.setStatus({ success: false });

                if (err.response && err.response.data) {
                    // If there's a response from the server, use the server's error message
                    helpers.setErrors({ submit: err.response.data.message });
                } else {
                    // If no specific error message is available, provide a generic error
                    helpers.setErrors({
                        submit: 'An error occurred. Please try again later.',
                    });
                }
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <Box
            sx={{
                backgroundColor: 'background.paper',
                flex: '1 1 auto',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    maxWidth: 550,
                    px: 3,
                    py: '100px',
                    width: '100%',
                    boxShadow: '0px 4px 80px 0px rgba(255, 159, 13, 0.15)',
                }}
            >
                <div>
                    <Stack spacing={1} sx={{ mb: 3 }}>
                        <Typography variant="h4">Reset password</Typography>
                        <Typography color="text.secondary" variant="body2">
                            Don&apos;t have an account? &nbsp;
                            <Link
                                href="/signup"
                                underline="hover"
                                variant="subtitle2"
                            >
                                Register
                            </Link>
                        </Typography>
                    </Stack>

                    <form noValidate onSubmit={formik.handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                error={
                                    !!(
                                        formik.touched.email &&
                                        formik.errors.email
                                    )
                                }
                                fullWidth
                                helperText={
                                    formik.touched.email && formik.errors.email
                                }
                                label="Email Address"
                                name="email"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="email"
                                value={formik.values.email}
                            />
                            <TextField
                                error={
                                    !!(
                                        formik.touched.phonenumber &&
                                        formik.errors.phonenumber
                                    )
                                }
                                fullWidth
                                helperText={
                                    formik.touched.phonenumber &&
                                    formik.errors.phonenumber
                                }
                                label="Account's Phonenumber"
                                name="phonenumber"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="phonenumber"
                                value={formik.values.phonenumber}
                            />
                        </Stack>
                        <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{ mt: 1 }}
                        >
                            Already have an account? &nbsp;
                            <Link
                                href="/signin"
                                underline="hover"
                                variant="subtitle2"
                            >
                                Login here
                            </Link>
                        </Typography>
                        <Stack
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {formik.errors.submit && (
                                <Typography
                                    color="error"
                                    sx={{ mt: 3 }}
                                    variant="body2"
                                >
                                    {formik.errors.submit}
                                </Typography>
                            )}
                        </Stack>
                        <Button
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                            type="submit"
                            variant="contained"
                            style={{
                                backgroundColor: '#FF9F0D',
                            }}
                        >
                            Send mail
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
                    </form>
                </div>
            </Box>
        </Box>
    );
}

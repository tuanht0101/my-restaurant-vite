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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

type Props = {};

export default function ChangePassword({}: Props) {
    const logIn = useAuthStore((state: any) => state.logIn);
    const navigate = useNavigate();
    const notify = () =>
        toast.success(
            'Change password successfully! Redirecting to homepage!!',
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

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            retypePassword: '',
            submit: null,
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('This field is required'),
            newPassword: Yup.string()
                .min(8)
                .max(16)
                .required('This field is required'),
            retypePassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), ''], 'Passwords must match')
                .max(255)
                .required('This field is required'),
        }),
        onSubmit: async (values: any, helpers: any) => {
            try {
                console.log(values);
                const accessToken = localStorage.getItem('access_token');
                const res = await axios.patch(
                    `${import.meta.env.VITE_API_URL}/auth/change-password`,
                    {
                        oldPassword: formik.values.oldPassword,
                        newPassword: formik.values.newPassword,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                notify();
                setTimeout(() => {
                    navigate('/');
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
        <>
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '6rem',
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
                            <Typography variant="h4">
                                Change Password
                            </Typography>
                        </Stack>

                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    error={
                                        !!(
                                            formik.touched.oldPassword &&
                                            formik.errors.oldPassword
                                        )
                                    }
                                    fullWidth
                                    helperText={
                                        formik.touched.oldPassword &&
                                        formik.errors.oldPassword
                                    }
                                    label="Old Password"
                                    name="oldPassword"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.oldPassword}
                                />
                                <TextField
                                    error={
                                        !!(
                                            formik.touched.newPassword &&
                                            formik.errors.newPassword
                                        )
                                    }
                                    fullWidth
                                    helperText={
                                        formik.touched.newPassword &&
                                        formik.errors.newPassword
                                    }
                                    label="New Password"
                                    name="newPassword"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.newPassword}
                                />
                                <TextField
                                    error={
                                        !!(
                                            formik.touched.retypePassword &&
                                            formik.errors.retypePassword
                                        )
                                    }
                                    fullWidth
                                    helperText={
                                        formik.touched.retypePassword &&
                                        formik.errors.retypePassword
                                    }
                                    label="Confirm Password"
                                    name="retypePassword"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.retypePassword}
                                />
                            </Stack>
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
                        </form>
                    </div>
                </Box>
            </Box>
        </>
    );
}

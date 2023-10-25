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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

type Props = {};

export default function SignIn({}: Props) {
    const logIn = useAuthStore((state: any) => state.logIn);
    const navigate = useNavigate();

    const getRoleFromToken = () => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            try {
                const tokenPayload = JSON.parse(
                    atob(accessToken.split('.')[1])
                );
                return tokenPayload.role;
            } catch (error) {
                console.error('Error decoding access token:', error);
            }
        }
        return null;
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            submit: null,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            password: Yup.string().max(255).required('Password is required'),
        }),
        onSubmit: async (values: any, helpers: any) => {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/signin`,
                    {
                        email: formik.values.email,
                        password: formik.values.password,
                    }
                );

                await localStorage.setItem(
                    'access_token',
                    res.data.access_token
                );
                await localStorage.setItem(
                    'refresh_token',
                    res.data.refresh_token
                );

                const role = getRoleFromToken();
                localStorage.setItem('role', role);

                setTimeout(() => {
                    logIn();
                    navigate('/');
                }, 300);
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
                            <Typography variant="h4">Login</Typography>
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
                                        formik.touched.email &&
                                        formik.errors.email
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
                                            formik.touched.password &&
                                            formik.errors.password
                                        )
                                    }
                                    fullWidth
                                    helperText={
                                        formik.touched.password &&
                                        formik.errors.password
                                    }
                                    label="Password"
                                    name="password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.password}
                                />
                            </Stack>
                            <Typography
                                color="text.secondary"
                                variant="body2"
                                sx={{ mt: 1 }}
                            >
                                Forgot your password? &nbsp;
                                <Link
                                    href="/reset-password"
                                    underline="hover"
                                    variant="subtitle2"
                                >
                                    Reset it here
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
                                Login
                            </Button>
                        </form>
                    </div>
                </Box>
            </Box>
        </>
    );
}

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header/Header';

type Props = {};

export default function SignUp({}: Props) {
    const navigate = useNavigate();
    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            fullname: '',
            phonenumber: '',
            submit: null,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            fullname: Yup.string().max(255).required('Name is required'),
            password: Yup.string().max(255).required('Password is required'),
            phonenumber: Yup.string().matches(
                phoneRegExp,
                'Phone number is not valid'
            ),
        }),
        onSubmit: async (values, helpers: any) => {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/signup`,
                    {
                        email: formik.values.email,
                        password: formik.values.password,
                        fullname: formik.values.fullname,
                        phonenumber: formik.values.phonenumber,
                    }
                );

                // localStorage.setItem('access_token', res.data.access_token);
                // localStorage.setItem('refresh_token', res.data.refresh_token);
                navigate('/signin');
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
                            <Typography variant="h4">Register</Typography>
                            <Typography color="text.secondary" variant="body2">
                                Already have an account? &nbsp;
                                <Link
                                    href="/signin"
                                    underline="hover"
                                    variant="subtitle2"
                                >
                                    Log in
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
                                <TextField
                                    error={
                                        !!(
                                            formik.touched.fullname &&
                                            formik.errors.fullname
                                        )
                                    }
                                    fullWidth
                                    helperText={
                                        formik.touched.fullname &&
                                        formik.errors.fullname
                                    }
                                    label="Name"
                                    name="fullname"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.fullname}
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
                                    label="Phone"
                                    name="phonenumber"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.phonenumber}
                                />
                            </Stack>
                            {formik.errors.submit && (
                                <Typography
                                    color="error"
                                    sx={{ mt: 3 }}
                                    variant="body2"
                                >
                                    {formik.errors.submit}
                                </Typography>
                            )}
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
                                Sign up
                            </Button>
                        </form>
                    </div>
                </Box>
            </Box>
        </>
    );
}

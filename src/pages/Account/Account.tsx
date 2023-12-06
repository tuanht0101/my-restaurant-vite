import { useEffect, useState } from 'react';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type UserData = {
    email: string;
    fullname: string;
    role: string;
    phonenumber: string;
    // Add other properties as needed
};

type Props = {};

export default function Account({}: Props) {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const notifySuccess = () =>
        toast.success(
            'Change information successfully! Redirecting to previous page!',
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

    const accessToken = localStorage.getItem('access_token');

    const getUserIdFromToken = () => {
        if (accessToken) {
            try {
                const tokenPayload = JSON.parse(
                    atob(accessToken.split('.')[1])
                );
                return tokenPayload.sub;
            } catch (error) {
                console.error('Error decoding access token:', error);
            }
        }
        return null;
    };

    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setUserData(res.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: userData?.email ? userData.email : '',
            role: userData?.role ? userData.role : '',
            fullname: userData?.fullname ? userData.fullname : '',
            phonenumber: userData?.phonenumber ? userData.phonenumber : '',
        },
        validationSchema: Yup.object({}),
        onSubmit: async (values: any, helpers: any) => {
            try {
                const accessToken = localStorage.getItem('access_token');
                const res = await axios.patch(
                    `${import.meta.env.VITE_API_URL}/user/${userId}`,
                    {
                        fullname: formik.values.fullname,
                        phonenumber: formik.values.phonenumber,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                notifySuccess();
                setIsSubmitted(true);
                setTimeout(() => {
                    navigate(-1);
                }, 4000);
                console.log(values);
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
                notifyFail();
            }
        },
    });

    useEffect(() => {
        setIsSubmitted(false);
    }, [formik.values]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box
                sx={{
                    flexGrow: 1,
                    py: 4,
                    px: 3,
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 2.5,
                        }}
                    >
                        Account Infomation
                    </Typography>
                    {/* <Box display="flex">
          <Typography
            sx={{
              color: '#3D34FF',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            // onClick={() => onClose()}
          >
            Quản lý nguồn khai thác
          </Typography>
          <Typography
            sx={{
              color: '#808080',
              fontWeight: '500',
              marginLeft: '8px'
            }}
          >
            / Thêm nguồn khai thác
          </Typography>
        </Box> */}
                </Box>
                <Box
                    sx={{
                        p: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                        }}
                    >
                        General Information
                    </Typography>
                    <Box display="flex">
                        <Box flex={1}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Email"
                                name="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                fullWidth
                                disabled
                            />
                            <TextField
                                label="Fullname"
                                fullWidth
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="fullname"
                                value={formik.values.fullname}
                                sx={{
                                    mt: 3,
                                }}
                            />
                        </Box>
                        <Box flex={1} ml={7.5}>
                            <FormControl
                                sx={{
                                    marginRight: 4,
                                }}
                                fullWidth
                            >
                                <TextField
                                    label="Role"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="role"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={formik.values.role}
                                    sx={{}}
                                    disabled
                                />
                            </FormControl>
                            <FormControl
                                sx={{
                                    marginRight: 4,
                                    mt: 3,
                                }}
                                fullWidth
                            >
                                <TextField
                                    label="Phonenumber"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="phonenumber"
                                    value={formik.values.phonenumber}
                                    sx={{}}
                                />
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
                {/* <Box
        sx={{
          p: 3,
          mt: 4
        }}
      >
        <SyncVariablesTable
          data={apiDongBo?.variables || []}
          setColumns={setColumns}
        />
      </Box> */}
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 8,
                    }}
                >
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={
                            formik.isSubmitting || !formik.dirty || isSubmitted
                        }
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
                        // onClick={() => onClose()}
                        onClick={() => navigate(-1)}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </form>
    );
}

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
import { useEffect, type FC, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import useAuthorization from '../../hooks/authorizationHooks';

interface ProductModalProps {
    data?: any;
    isOpen: boolean;
    onClose: () => void;
    onSubmitData: (value: any) => void;
}

export const ProductModal: FC<ProductModalProps> = (props) => {
    const [cateList, setCateList] = useState([]);
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
            description: props.data?.description || '',
            price: props.data?.price || '',
            status: props.data?.status
                ? props.data.status === 'Available'
                    ? 'Available'
                    : 'Unavailable'
                : '',
            categoryId: props.data?.categoryId || '',
            category: props.data?.category.name || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('This field is required'),
            description: Yup.string().required('This field is required'),
            price: Yup.number().required('This field is a required number'),
        }),
        onSubmit: async (values, { resetForm }) => {
            console.log('Submit button clicked!');
            const cateResponse = await axios.post(
                `${import.meta.env.VITE_API_URL}/category/filter`,
                {
                    name: formik.values.category || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // Check if cateResponse.data is an array and has elements
            if (
                Array.isArray(cateResponse.data) &&
                cateResponse.data.length > 0
            ) {
                // Access the first element's id
                const categoryId = cateResponse.data[0].id;

                if (!props.data) {
                    try {
                        const response = await axios.post(
                            `${import.meta.env.VITE_API_URL}/product`,
                            {
                                name: formik.values.name,
                                description: formik.values.description,
                                price: parseInt(formik.values.price),
                                status: formik.values.status,
                                categoryId: categoryId,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );
                        console.log('response data', response.data);
                        console.log('categoryId', categoryId);
                    } catch (error) {
                        console.error('Error fetching tables:', error);
                        notifyFail();
                    }
                } else {
                    try {
                        const response = await axios.patch(
                            `${import.meta.env.VITE_API_URL}/product/${
                                props.data.id
                            }`,
                            {
                                name: formik.values.name,
                                description: formik.values.description,
                                price: parseInt(formik.values.price),
                                status: formik.values.status,
                                categoryId: categoryId,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );
                        console.log('response data', response.data);
                        console.log('categoryId', categoryId);
                        console.log('input: ', {
                            name: formik.values.name,
                            description: formik.values.description,
                            price: formik.values.price,
                            status: formik.values.status,
                            categoryId: categoryId, // Use categoryId here
                        });
                    } catch (error) {
                        console.error('Error fetching tables:', error);
                        notifyFail();
                    }
                }
            }

            props.onSubmitData(values as any);
            resetForm();
            props.onClose();
        },
    });

    useEffect(() => {
        const fetchCates = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/category`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setCateList(response.data);
            } catch (error) {
                console.error('Error fetching Users:', error);
                setCateList([]);
            }
        };
        fetchCates();
    }, []);

    useEffect(() => {
        // Update formik values when data prop changes
        if (props.data) {
            formik.setValues({
                name: props.data?.name || '',
                description: props.data?.description || '',
                price: props.data?.price || '',
                status:
                    props.data?.status === 'Available'
                        ? 'Available'
                        : 'Unavailable',
                categoryId: props.data?.categoryId || '',
                category: props.data?.category.name || '',
            });
        } else {
            // Set default values when there's no data prop
            formik.setValues({
                name: '',
                description: '',
                price: '',
                status: '',
                categoryId: '',
                category: '',
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
                            {props.data ? 'Edit Product' : 'Add Product'}
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
                            <Box sx={{ width: '49%' }}>
                                <TextField
                                    label="Description"
                                    placeholder="Enter description"
                                    fullWidth
                                    required
                                    error={Boolean(
                                        formik.touched.description &&
                                            formik.errors.description
                                    )}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description}
                                    name="description"
                                />
                                {formik.touched.description &&
                                    formik.errors.description && (
                                        <div
                                            style={{
                                                color: 'red',
                                                marginLeft: '4px',
                                            }}
                                        >
                                            {formik.errors.description.toString()}
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
                                        Status
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        required
                                        label="status"
                                        placeholder="Pick status"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.status}
                                        name="status"
                                    >
                                        <MenuItem value="Available">
                                            Available
                                        </MenuItem>
                                        <MenuItem value="Unavailable">
                                            Unavailable
                                        </MenuItem>
                                    </Select>
                                    {formik.touched.status &&
                                        formik.errors.status && (
                                            <FormHelperText>
                                                {formik.errors.status.toString()}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Box>
                            <Box sx={{ width: '49%' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Category
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        required
                                        label="category"
                                        placeholder="Pick category"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.category}
                                        name="category"
                                    >
                                        {cateList.map((cate: any) => (
                                            <MenuItem
                                                value={cate.name}
                                                key={cate.name}
                                            >
                                                {cate.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.category &&
                                        formik.errors.category && (
                                            <FormHelperText>
                                                {formik.errors.category.toString()}
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
                                    label="Price"
                                    placeholder="Enter Price"
                                    fullWidth
                                    required
                                    error={Boolean(
                                        formik.touched.price &&
                                            formik.errors.price
                                    )}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price}
                                    name="price"
                                />
                                {formik.touched.description &&
                                    formik.errors.description && (
                                        <div
                                            style={{
                                                color: 'red',
                                                marginLeft: '4px',
                                            }}
                                        >
                                            {formik.errors.description.toString()}
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
                                Submit
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

ProductModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

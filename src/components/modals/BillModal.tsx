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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, FC, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import useAuthorization from '../../hooks/authorizationHooks';
import { Scrollbar } from '../Scrollbar/Scrollbar';
import AddProduct from '../bills/AddProduct';

interface BillModalProps {
    data?: any;
    isOpen: boolean;
    onClose: () => void;
    onSubmitData: (value: any) => void;
}

export const BillModal: FC<BillModalProps> = (props) => {
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [currentTotal, setCurrentTotal] = useState(props.data?.total || 0);

    const accessToken = localStorage.getItem('access_token');
    const { isAdmin } = useAuthorization();

    const formatCreatedAt = (createdAt: string) => {
        const date = new Date(createdAt);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        } as const;
        return date.toLocaleDateString('en-GB', options);
    };

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
            uuid: props.data?.uuid || '',
            guessName: props.data?.guessName || '',
            createdBy: props.data?.createdBy || '',
            createdAt: formatCreatedAt(props.data?.createdAt) || '',
            guessNumber: props.data?.guessNumber || '',
            status: props.data?.status || '',
            total: props.data?.total || 0,
            productDetails: props.data?.productDetails || [],
            newProductName: '',
            newProductPrice: '',
            newProductQuantity: '',
        },
        validationSchema: Yup.object({
            guessName: Yup.string().required('Customer Name is required'),
            guessNumber: Yup.string().required('Phone Number is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            console.log('orderItems:', orderItems);
            const productDetailsString = JSON.stringify(
                orderItems.map((item) => ({
                    name: item.name,
                    price: item.price,
                    total: item.quantity * item.price,
                    category: item.category,
                    quantity: item.quantity,
                }))
            );
            console.log('Submit button clicked!');
            try {
                const response = await axios.patch(
                    `${import.meta.env.VITE_API_URL}/bill/${props.data.id}`,
                    {
                        guessName: formik.values.guessName,
                        guessNumber: formik.values.guessNumber,
                        productDetails: productDetailsString,
                        total: currentTotal,
                        status: formik.values.status,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log('response data', response.data);
                // console.log({
                //     guessName: formik.values.guessName,
                //     guessNumber: formik.values.guessNumber,
                //     productDetails: orderItems,
                //     total: currentTotal,
                // });
            } catch (error) {
                console.error('Error fetching tables:', error);
                notifyFail();
            }
            props.onSubmitData(values as any);
            resetForm();
            props.onClose();
        },
    });

    useEffect(() => {
        // Update formik values when data prop changes
        if (props.data) {
            const parsedProductDetails =
                props.data?.productDetails &&
                JSON.parse(props.data?.productDetails);
            formik.setValues({
                uuid: props.data?.uuid || '',
                guessName: props.data?.guessName || '',
                createdBy: props.data?.createdBy || '',
                createdAt: formatCreatedAt(props.data?.createdAt) || '',
                guessNumber: props.data?.guessNumber || '',
                status: props.data?.status || '',
                total: props.data?.total || 0,
                productDetails: Array.isArray(parsedProductDetails)
                    ? parsedProductDetails
                    : JSON.parse(props.data?.productDetails || '[]'),
                newProductName: '',
                newProductPrice: '',
                newProductQuantity: '',
            });

            // Initialize orderItems state with productDetails
            setOrderItems(parsedProductDetails || []);

            // Initialize currentTotal based on existing productDetails
            const existingTotal = parsedProductDetails?.reduce(
                (sum: number, product: any) => sum + product.total,
                0
            );
            setCurrentTotal(existingTotal || 0);
        } else {
            // Set default values when there's no data prop
            formik.setValues({
                uuid: '',
                guessName: '',
                createdBy: '',
                createdAt: '',
                guessNumber: '',
                status: '',
                total: 0,
                productDetails: [],
                newProductName: '',
                newProductPrice: '',
                newProductQuantity: '',
            });

            // Initialize orderItems state as an empty array
            setOrderItems([]);

            // Initialize currentTotal as 0
            setCurrentTotal(0);
        }
    }, [props.data]);

    const handleCloseModal = (e: any) => {
        formik.handleReset(e);
        props.onClose();
    };

    const handleRemoveProduct = (index: number) => {
        const updatedProductDetails = [...formik.values.productDetails];
        updatedProductDetails.splice(index, 1);

        formik.setValues((prevValues) => ({
            ...prevValues,
            productDetails: updatedProductDetails,
        }));
    };

    const handleAddProductToOrder = (newProduct: any[]) => {
        if (newProduct.length > 0) {
            const total = newProduct.reduce((sum, product) => {
                return sum + product.price * product.quantity;
            }, 0);
            setCurrentTotal(total);
        } else {
            setCurrentTotal(0);
        }
        console.log('from P: ', newProduct);
        setOrderItems(newProduct);
        // const existingProductIndex = formik.values.productDetails.findIndex(
        //     (product: any) => product.name === newProduct.product
        // );

        // if (existingProductIndex !== -1) {
        //     // Product already exists, update quantity
        //     formik.setValues((prevValues) => {
        //         const updatedProductDetails = [...prevValues.productDetails];
        //         updatedProductDetails[existingProductIndex].quantity +=
        //             newProduct.quantity;
        //         return {
        //             ...prevValues,
        //             productDetails: updatedProductDetails,
        //         };
        //     });
        // } else {
        //     // Product doesn't exist, add new row
        //     const modifyNewProduct = {
        //         ...newProduct,
        //         name: newProduct.product,
        //         category: newProduct.category.name,
        //         quantity: newProduct.quantity || 1,
        //     };

        //     formik.setValues((prevValues) => ({
        //         ...prevValues,
        //         productDetails: [
        //             ...prevValues.productDetails,
        //             modifyNewProduct,
        //         ],
        //     }));
        // }
    };

    return (
        <Modal open={props.isOpen} onClose={handleCloseModal}>
            <Box sx={{ minHeight: '100%', p: 3, overflowY: 'auto' }}>
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
                            {props.data ? 'Edit Bill' : 'Add Bill'}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </Box>
                    <Scrollbar
                        sx={{
                            maxHeight: `650px`,
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888',
                                borderRadius: '4px',
                            },
                        }}
                    >
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
                                        label="UUID"
                                        placeholder="Enter UUID"
                                        fullWidth
                                        required
                                        error={Boolean(
                                            formik.touched.uuid &&
                                                formik.errors.uuid
                                        )}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.uuid}
                                        disabled={!!props.data}
                                        name="uuid"
                                    />
                                    {formik.touched.uuid &&
                                        formik.errors.uuid && (
                                            <div
                                                style={{
                                                    color: 'red',
                                                    marginLeft: '4px',
                                                }}
                                            >
                                                {formik.errors.uuid.toString()}
                                            </div>
                                        )}
                                </Box>
                                <Box sx={{ width: '49%' }}>
                                    <TextField
                                        label="Created By"
                                        placeholder="Created By"
                                        fullWidth
                                        required
                                        error={Boolean(
                                            formik.touched.createdBy &&
                                                formik.errors.createdBy
                                        )}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.createdBy}
                                        name="createdBy"
                                        disabled
                                    />
                                    {formik.touched.createdBy &&
                                        formik.errors.createdBy && (
                                            <div
                                                style={{
                                                    color: 'red',
                                                    marginLeft: '4px',
                                                }}
                                            >
                                                {formik.errors.createdBy.toString()}
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
                                    <TextField
                                        label="Customer Name"
                                        placeholder="Enter Customer Name"
                                        fullWidth
                                        required
                                        error={Boolean(
                                            formik.touched.guessName &&
                                                formik.errors.guessName
                                        )}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.guessName}
                                        name="guessName"
                                    />
                                    {formik.touched.guessName &&
                                        formik.errors.guessName && (
                                            <div
                                                style={{
                                                    color: 'red',
                                                    marginLeft: '4px',
                                                }}
                                            >
                                                {formik.errors.guessName.toString()}
                                            </div>
                                        )}
                                </Box>
                                <Box sx={{ width: '49%' }}>
                                    <TextField
                                        label="Phone Number"
                                        placeholder="Phone Number"
                                        fullWidth
                                        required
                                        error={Boolean(
                                            formik.touched.guessNumber &&
                                                formik.errors.guessNumber
                                        )}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.guessNumber}
                                        name="guessNumber"
                                    />
                                    {formik.touched.guessNumber &&
                                        formik.errors.guessNumber && (
                                            <div
                                                style={{
                                                    color: 'red',
                                                    marginLeft: '4px',
                                                }}
                                            >
                                                {formik.errors.guessNumber.toString()}
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
                                            label="Status"
                                            placeholder="Pick Status"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.status}
                                            name="status"
                                        >
                                            <MenuItem value="CANCELLED">
                                                CANCELLED
                                            </MenuItem>
                                            <MenuItem value="PENDING">
                                                PENDING
                                            </MenuItem>
                                            <MenuItem value="DONE">
                                                DONE
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
                                    <TextField
                                        label="Created At"
                                        placeholder="Created At"
                                        fullWidth
                                        required
                                        error={Boolean(
                                            formik.touched.createdAt &&
                                                formik.errors.createdAt
                                        )}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.createdAt}
                                        disabled
                                        name="createdAt"
                                    />
                                    {formik.touched.createdAt &&
                                        formik.errors.createdAt && (
                                            <div
                                                style={{
                                                    color: 'red',
                                                    marginLeft: '4px',
                                                }}
                                            >
                                                {formik.errors.createdAt.toString()}
                                            </div>
                                        )}
                                </Box>
                            </Box>
                            <Box sx={{ padding: 2 }}>
                                <AddProduct
                                    onAddProduct={handleAddProductToOrder}
                                    productDetails={
                                        formik.values.productDetails
                                    }
                                />
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
                                    disabled={
                                        formik.isSubmitting || !formik.dirty
                                    }
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
                    </Scrollbar>
                </Paper>
            </Box>
        </Modal>
    );
};

BillModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

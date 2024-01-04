import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
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
import FileSaver from 'file-saver';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import { useRef } from 'react';

const OrderPage: React.FC = () => {
    const [customerName, setCustomerName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [categories, setCategories] = useState<any>([]);
    const [products, setProducts] = useState<any>([]);
    const [tables, setTables] = useState<any>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>(null);
    const [quantity, setQuantity] = useState<string>('');
    const [selectedTableType, setSelectedTableType] = useState<string>('');
    const [tableName, setTableName] = useState<string>('');
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const accessToken = localStorage.getItem('access_token');

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
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching Datas:', error);
                setCategories([]);
            }
        };
        fetchCates();
    }, [accessToken]);

    useEffect(() => {
        const fetchProductsByCate = async () => {
            try {
                if (selectedCategoryId !== null) {
                    const res = await axios.get(
                        `${
                            import.meta.env.VITE_API_URL
                        }/product/getAvailableByCategory/${selectedCategoryId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    setProducts(res.data);
                }
            } catch (error) {
                console.error('Error fetching Users:', error);
                setProducts([]);
            }
        };
        fetchProductsByCate();
    }, [selectedCategoryId]);

    useEffect(() => {
        const fetchTablesByType = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/table/filter`,
                    {
                        isPrivate: selectedTableType || undefined,
                        isAvailable: 'true',
                        isActive: 'true',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setTables(response.data);
            } catch (error) {
                console.error('Error searching tables:', error);
            }
        };
        fetchTablesByType();
    }, [selectedTableType]);

    // Function to handle adding a product to the order
    const handleAddProduct = () => {
        if (selectedProduct && quantity) {
            // Find the selected product in the products array
            const selectedProductInfo = products.find(
                (product: any) => product.name === selectedProduct
            );

            // Check if the selected product is already in the order
            const existingProductIndex = orderItems.findIndex(
                (item) => item.product === selectedProduct
            );

            if (existingProductIndex !== -1) {
                // If the product exists, update the quantity
                const updatedOrderItems = [...orderItems];
                updatedOrderItems[existingProductIndex].quantity += parseInt(
                    quantity,
                    10
                );
                setOrderItems(updatedOrderItems);
            } else {
                // If the product is not in the order, add a new entry with price and category
                const newOrderItem: any = {
                    product: selectedProduct,
                    quantity: parseInt(quantity, 10),
                    price: selectedProductInfo?.price || 0,
                    category: selectedProductInfo?.category || { name: '' }, // Include the category
                };

                setOrderItems([...orderItems, newOrderItem]);
            }

            setSelectedProduct('');
            setQuantity('');
        }
    };

    // Function to handle removing a product from the order
    const handleRemoveProduct = (index: number) => {
        const updatedOrderItems = [...orderItems];
        updatedOrderItems.splice(index, 1);
        setOrderItems(updatedOrderItems);
    };

    const productDetailsString = JSON.stringify(
        orderItems.map((item) => ({
            id: item.id, // Replace with the actual property in your orderItems data
            name: item.product,
            price: item.price,
            total: item.quantity * item.price,
            category: item.category.name,
            quantity: item.quantity,
        }))
    );

    const generateHtmlTemplate = () => {
        return `
            <html>
                <head>
                    <style>
                        table {
                            font-family: Arial, Helvetica, sans-serif;
                            border-collapse: collapse;
                            width: 100%;
                        }

                        h3 {
                            margin-bottom: 10px;
                            font-weight: bold;
                        }
    
                        td, th {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                    </style>
                </head>
                <body>
                    <h3 style="text-align: center">Midtaste Restaurant</h3>
                    <table>
                        <tr>
                            <th>Name: ${customerName}</th>
                            <th>Status: PENDING</th>
                        </tr>
                        <tr>
                            <th>Contact Number: ${phoneNumber}</th>
                            <th>Table: ${tableName}</th>
                        </tr>
                    </table>
    
                    <h3>Product Details:</h3>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Sub total</th>
                        </tr>
                        ${orderItems
                            .map(
                                (item) => `
                                    <tr>
                                        <td>${item.product}</td>
                                        <td>${item.category.name}</td>
                                        <td>${item.quantity}</td>
                                        <td>${item.price} VND</td>
                                        <td>${
                                            item.quantity * item.price
                                        } VND</td>
                                    </tr>
                                `
                            )
                            .join('')}
                    </table>
                    <h3>Total: ${calculateTotalSum()} VND</h3>
                    <h3>Date: ${new Date().toLocaleString()}</h3>
                    <h3>
                        Thank you for supporting our restaurant. If there are any problems, we
                        would love to hear from you at admin@midtaste.com
                    </h3>
                </body>
            </html>
        `;
    };

    const resetForm = () => {
        setCustomerName('');
        setPhoneNumber('');
        setSelectedProduct('');
        setSelectedCategory('');
        setSelectedCategoryId(null);
        setQuantity('');
        setSelectedTableType('');
        setTableName('');
        setOrderItems([]);
        setLoading(false);
    };

    const handleSubmitOrder = async () => {
        try {
            setLoading(true);

            // Make API call to generateReport endpoint
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/bill/generateReport`,
                {
                    guessName: customerName,
                    guessNumber: phoneNumber,
                    total: orderItems.reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                    ),
                    productDetails: productDetailsString,
                    tableName: tableName,
                    status: 'PENDING',
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // Generate PDF using html2pdf
            const pdfElement = document.createElement('div');
            pdfElement.innerHTML = generateHtmlTemplate();

            html2pdf(pdfElement, {
                margin: 10,
                filename: `${response.data.uuid}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            });
            resetForm();
        } catch (error) {
            // Handle network errors or exceptions
            console.error('Error submitting order:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalSum = () => {
        return orderItems.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );
    };

    return (
        <Container>
            <Box mt={3}>
                <Typography variant="h4" mb={3}>
                    Order Page
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        {/* Customer Details Form */}
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" mb={2}>
                                Customer Details
                            </Typography>
                            <TextField
                                fullWidth
                                label="Customer Name"
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(e.target.value)
                                }
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {/* Customer Details Form */}
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" mb={2}>
                                Table Selection
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Table Type
                                </InputLabel>
                                <Select
                                    fullWidth
                                    label="Table Type"
                                    value={selectedTableType}
                                    onChange={(e) =>
                                        setSelectedTableType(e.target.value)
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    <MenuItem value="false">Normal</MenuItem>
                                    <MenuItem value="true">VIP</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Table Name
                                </InputLabel>
                                <Select
                                    fullWidth
                                    label="Table Name"
                                    value={tableName}
                                    onChange={(e) =>
                                        setTableName(e.target.value)
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {tables.map((item: any) => {
                                        return (
                                            <MenuItem
                                                value={item.name}
                                                key={item.id}
                                                onClick={() => {
                                                    setTableName(item.name);
                                                }}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {/* Product and Table Selection Form */}
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" mb={2}>
                                Product Selection
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Category
                                </InputLabel>
                                <Select
                                    fullWidth
                                    label="Select Category"
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {categories.map((cate: any) => {
                                        return (
                                            <MenuItem
                                                value={cate.name}
                                                key={cate.id}
                                                onClick={() =>
                                                    setSelectedCategoryId(
                                                        cate.id
                                                    )
                                                }
                                            >
                                                {cate.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Product
                                </InputLabel>
                                <Select
                                    fullWidth
                                    label="Select Product"
                                    value={selectedProduct}
                                    onChange={(e) =>
                                        setSelectedProduct(e.target.value)
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {products.map((item: any) => {
                                        return (
                                            <MenuItem
                                                value={item.name}
                                                key={item.id}
                                                onClick={() =>
                                                    console.log(item.name)
                                                }
                                            >
                                                {item.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <Button
                                variant="contained"
                                onClick={handleAddProduct}
                            >
                                Add Product
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                <Box mt={3}>
                    {/* Selected Products Table */}
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>
                            Selected Products
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="max-h-[50px] overflow-y-auto">
                                    {orderItems
                                        .sort((a, b) =>
                                            a.category.name.localeCompare(
                                                b.category.name
                                            )
                                        )
                                        .map((item: any, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {item.product}
                                                </TableCell>
                                                <TableCell>
                                                    {item.category.name}
                                                </TableCell>
                                                <TableCell>
                                                    {item.price}VND
                                                </TableCell>
                                                <TableCell>
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell>
                                                    {item.quantity * item.price}
                                                    VND
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() =>
                                                            handleRemoveProduct(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={4} align="right">
                                            <strong>Total Sum:</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                {calculateTotalSum()}VND
                                            </strong>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
                <Box mt={3}>
                    {/* Submit Order Button */}
                    <Button variant="contained" onClick={handleSubmitOrder}>
                        {loading ? 'Generating PDF...' : 'Submit Order'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default OrderPage;

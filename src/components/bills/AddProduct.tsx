import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
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
import React, { useCallback, useEffect, useState } from 'react';

interface AddProductProps {
    onAddProduct: (product: any) => void;
    productDetails: any[];
}

const AddProduct: React.FC<AddProductProps> = ({
    onAddProduct,
    productDetails,
}) => {
    const [quantity, setQuantity] = useState<string>('');
    const [products, setProducts] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>(productDetails);

    const accessToken = localStorage.getItem('access_token');

    useEffect(() => {
        setOrderItems(productDetails);
    }, [productDetails]);

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
                        }/product/getByCategory/${selectedCategoryId}`,
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

    const handleAddProduct = useCallback(() => {
        if (selectedProduct && quantity) {
            const selectedProductInfo = products.find(
                (product: any) => product.name === selectedProduct.name
            );

            const existingProductIndex = orderItems.findIndex(
                (item) => item.name === selectedProduct.name
            );

            if (existingProductIndex !== -1) {
                const updatedOrderItems = [...orderItems];
                updatedOrderItems[existingProductIndex].quantity += parseInt(
                    quantity,
                    10
                );
                updatedOrderItems[existingProductIndex].total +=
                    selectedProduct.price * parseInt(quantity, 10);
                setOrderItems(updatedOrderItems);
                console.log('PD: ', updatedOrderItems);
                onAddProduct(updatedOrderItems);
            } else {
                const newOrderItem: any = {
                    name: selectedProduct.name,
                    price: selectedProductInfo?.price || 0,
                    total: selectedProductInfo?.price * parseInt(quantity, 10),
                    category: selectedProductInfo?.category.name || '',
                    quantity: parseInt(quantity, 10),
                };

                setOrderItems([...orderItems, newOrderItem]);
                console.log('PD: ', [...orderItems, newOrderItem]);
                onAddProduct([...orderItems, newOrderItem]);
            }

            setSelectedProduct(null);
            setQuantity('');
        }
    }, [
        selectedProduct,
        quantity,
        orderItems,
        products,
        setOrderItems,
        onAddProduct,
    ]);

    const handleRemoveProduct = (index: number) => {
        const updatedOrderItems = [...orderItems];
        updatedOrderItems.splice(index, 1);
        setOrderItems(updatedOrderItems);
        onAddProduct(updatedOrderItems);
    };

    const getTotal = () => {
        const totalSum = orderItems.reduce(
            (accumulator, product) =>
                accumulator + product.quantity * product.price,
            0
        );

        return `${totalSum} VND`;
    };

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h6" mb={2}>
                    Product Details
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

                        <TableBody>
                            {orderItems.length > 0 ? (
                                orderItems.map((product: any, index: any) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {product.name || product.product}
                                        </TableCell>
                                        <TableCell>
                                            {product.category}
                                        </TableCell>
                                        <TableCell>
                                            {product.price} VND
                                        </TableCell>
                                        <TableCell>
                                            {product.quantity}
                                        </TableCell>
                                        <TableCell>
                                            {product.quantity * product.price}{' '}
                                            VND
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() =>
                                                    handleRemoveProduct(index)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        No product details available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} align="right">
                                    <strong>Total Sum:</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>{getTotal()}</strong>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h6" mb={2}>
                    Product Selection
                </Typography>
                <Box sx={{ display: 'flex', width: '100%' }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
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
                        >
                            {categories.map((cate: any) => (
                                <MenuItem
                                    value={cate.name}
                                    key={cate.id}
                                    onClick={() =>
                                        setSelectedCategoryId(cate.id)
                                    }
                                >
                                    {cate.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="demo-simple-select-label">
                            Product
                        </InputLabel>
                        <Select
                            fullWidth
                            label="Select Product"
                            value={selectedProduct?.name || ''}
                            onChange={(e) => {
                                const selectedProductInfo = products.find(
                                    (product: any) =>
                                        product.name === e.target.value
                                );
                                setSelectedProduct(selectedProductInfo);
                            }}
                        >
                            {products.map((item: any) => (
                                <MenuItem value={item.name} key={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
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
                </Box>

                <Button variant="contained" onClick={handleAddProduct}>
                    Add Product
                </Button>
            </Box>
        </Box>
    );
};

export default AddProduct;

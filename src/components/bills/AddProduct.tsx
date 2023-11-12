import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

interface AddProductProps {
    onAddProduct: (product: any) => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onAddProduct }) => {
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [quantity, setQuantity] = useState<string>('');
    const [products, setProducts] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>(null);

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
                        }/product/getByCategory/${selectedCategoryId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    console.log(res.data);
                    setProducts(res.data);
                }
            } catch (error) {
                console.error('Error fetching Users:', error);
                setProducts([]);
            }
        };
        fetchProductsByCate();
    }, [selectedCategoryId]);

    // Function to handle adding a product to the order
    const handleAddProduct = useCallback(() => {
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

                // Call the onAddProduct prop to update the product details in the parent component
                onAddProduct(newOrderItem);
            }

            setSelectedProduct('');
            setQuantity('');
        }
    }, []);

    return (
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
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cate: any) => (
                            <MenuItem
                                value={cate.name}
                                key={cate.id}
                                onClick={() => setSelectedCategoryId(cate.id)}
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
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        {products.map((item: any) => (
                            <MenuItem
                                value={item.name}
                                key={item.id}
                                onClick={() => setSelectedProduct(item)}
                            >
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
    );
};

export default AddProduct;

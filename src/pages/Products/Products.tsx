import {
    Box,
    Button,
    Card,
    Container,
    Grid,
    SvgIcon,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { ListDataTable } from '../../components/products/list-data';
import { ListDataDetailTable } from '../../components/products/list-data-detail';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { ProductModal } from '../../components/modals/ProductModal';
import { ToastContainer } from 'react-toastify';

export default function Products() {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedDuLieuThuThap, setSelectedDuLieuThuThap] = useState<
        any | null
    >(null);

    const handleModalClose = () => {
        setAddModalOpen(false);
    };

    const handleSubmitData = () => {
        setAddModalOpen(false);
    };

    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4,
                }}
            >
                <Container maxWidth={false}>
                    <Box sx={{ mb: 4 }}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Grid item>
                                <Typography variant="h5">Products</Typography>
                            </Grid>
                            <div className="mr-4 mt-5">
                                <Button
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    }
                                    variant="contained"
                                    onClick={() => setAddModalOpen(true)}
                                    sx={{
                                        marginRight: '8px',
                                    }}
                                >
                                    Add
                                </Button>
                                {/* <Button
                                startIcon={
                                    <SvgIcon fontSize="small">
                                        <Delete />
                                    </SvgIcon>
                                }
                                variant="contained"
                                onClick={() => setOpenDeleteListModal(true)}
                                disabled={
                                    customersSelection.selected.length
                                        ? false
                                        : true
                                }
                                color="error"
                            >
                                Delete
                            </Button> */}
                            </div>
                        </Grid>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item sm={12} md={6} lg={5} width="100%">
                            <Card
                                sx={{
                                    pt: 3,
                                }}
                            >
                                <ListDataTable
                                    selectedDuLieuThuThap={
                                        selectedDuLieuThuThap
                                    }
                                    onSelectDuLieuThuThap={
                                        setSelectedDuLieuThuThap
                                    }
                                />
                            </Card>
                        </Grid>
                        <Grid item sm={12} md={6} lg={7}>
                            <Card
                                sx={{
                                    pt: 3,
                                }}
                            >
                                <ListDataDetailTable
                                    selectedDuLieuThuThap={
                                        selectedDuLieuThuThap
                                    }
                                    isAddData={addModalOpen}
                                />
                            </Card>
                        </Grid>
                    </Grid>

                    <ProductModal
                        isOpen={addModalOpen}
                        onClose={handleModalClose}
                        onSubmitData={handleSubmitData}
                    />
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
                </Container>
            </Box>
        </>
    );
}

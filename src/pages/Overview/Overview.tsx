import React, { useEffect, useState } from 'react';
import OverviewBudget from '../../components/common/Overview/OverviewBudget';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import OverviewCategory from '../../components/common/Overview/OverviewCategory';
import axios from 'axios';
import OverviewProducts from '../../components/common/Overview/OverviewProducts';
import OverviewBills from '../../components/common/Overview/OverviewBill';
import OverviewTables from '../../components/common/Overview/OverviewTable';
import OverviewSales from '../../components/common/Overview/OverviewSales';

type Props = {};
type Details = {
    category: number;
    product: number;
    bill: number;
    table: number;
};

export default function Overview({}: Props) {
    const [currentBudget, setCurrentBudget] = useState(0);
    const [previousBudget, setPreviousBudget] = useState(0);
    const [percentBudget, setPercentBudget] = useState(0);
    const [category, setCategory] = useState(0);
    const [product, setProduct] = useState(0);
    const [bill, setBill] = useState(0);
    const [table, setTable] = useState(0);
    const [chartData, setChartData] = useState<any>(null);
    const accessToken = localStorage.getItem('access_token');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const getRoleFromToken = () => {
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

    const role = getRoleFromToken();

    const GetDetails = async (): Promise<Details> => {
        const detailsRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/dashboard/details`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return detailsRes.data;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (role === 'ADMIN') {
                const getBudget = async () => {
                    const currentBudgetRes = await axios.post(
                        `${import.meta.env.VITE_API_URL}/dashboard/totals`,
                        {
                            startMonth: currentMonth,
                            startYear: currentYear,
                            endMonth: currentMonth == 12 ? 1 : currentMonth + 1,
                            endYear:
                                currentMonth == 12
                                    ? currentYear + 1
                                    : currentYear,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    const previousBudgetRes = await axios.post(
                        `${import.meta.env.VITE_API_URL}/dashboard/totals`,
                        {
                            startMonth:
                                currentMonth - 1 == 0 ? 12 : currentMonth - 1,
                            startYear:
                                currentMonth - 1 == 0
                                    ? currentYear - 1
                                    : currentYear,
                            endMonth: currentMonth,
                            endYear: currentYear,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    if (currentBudgetRes.data == 0 || previousBudgetRes.data) {
                        setPercentBudget(0);
                    } else
                        setPercentBudget(
                            (currentBudgetRes.data / previousBudgetRes.data) *
                                100
                        );
                    setCurrentBudget(currentBudgetRes.data);
                    setPreviousBudget(previousBudgetRes.data);
                };
                getBudget();
            }

            try {
                const chartData = await axios.get(
                    `${import.meta.env.VITE_API_URL}/dashboard/chart`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const billData = await axios.get(
                    `${
                        import.meta.env.VITE_API_URL
                    }/dashboard/billCurrentMonth`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log(chartData);
                setChartData(chartData);
                const details = await GetDetails();
                setCategory(details.category);
                setBill(billData.data);
                setProduct(details.product);
                setTable(details.table);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 4,
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    {role === 'ADMIN' && (
                        <Grid xs={12} sm={6} lg={12 / 5}>
                            <OverviewBudget
                                {...(percentBudget > 0
                                    ? {
                                          difference: percentBudget,
                                          positive: true,
                                      }
                                    : {})}
                                positive={currentBudget - previousBudget > 0}
                                sx={{ height: '100%' }}
                                value={`${currentBudget.toString()} VND`}
                            />
                        </Grid>
                    )}
                    <Grid xs={12} sm={6} lg={role === 'ADMIN' ? 12 / 5 : 3}>
                        <OverviewBills
                            sx={{ height: '100%' }}
                            value={bill.toString()}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} lg={role === 'ADMIN' ? 12 / 5 : 3}>
                        <OverviewCategory
                            sx={{ height: '100%' }}
                            value={category.toString()}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} lg={role === 'ADMIN' ? 12 / 5 : 3}>
                        <OverviewProducts
                            sx={{ height: '100%' }}
                            value={product.toString()}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} lg={role === 'ADMIN' ? 12 / 5 : 3}>
                        <OverviewTables
                            sx={{ height: '100%' }}
                            value={table.toString()}
                        />
                    </Grid>
                    <Grid xs={12} lg={12}>
                        <OverviewSales
                            chartSeries={[
                                {
                                    name: 'This year',
                                    data: chartData?.data.thisYear || [],
                                },
                                {
                                    name: 'Last year',
                                    data: chartData?.data.lastYear || [],
                                },
                            ]}
                            sx={{ height: '100%' }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

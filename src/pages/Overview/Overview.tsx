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
                console.log(chartData);
                setChartData(chartData);
                const details = await GetDetails();
                setCategory(details.category);
                setBill(details.bill);
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
                py: 8,
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
                                value={`$${currentBudget.toString()}`}
                            />
                        </Grid>
                    )}
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
                        <OverviewBills
                            sx={{ height: '100%' }}
                            value={bill.toString()}
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
                    <Grid xs={12} md={6} lg={4}>
                        {/* <OverviewTraffic
              chartSeries={[63, 15, 22]}
              labels={["Desktop", "Tablet", "Phone"]}
              sx={{ height: "100%" }}
            /> */}
                    </Grid>
                    <Grid xs={12} md={6} lg={4}>
                        {/* <OverviewLatestProducts
              products={[
                {
                  id: "5ece2c077e39da27658aa8a9",
                  image: "/assets/products/product-1.png",
                  name: "Healthcare Erbology",
                  updatedAt: subHours(now, 6).getTime(),
                },
                {
                  id: "5ece2c0d16f70bff2cf86cd8",
                  image: "/assets/products/product-2.png",
                  name: "Makeup Lancome Rouge",
                  updatedAt: subDays(subHours(now, 8), 2).getTime(),
                },
                {
                  id: "b393ce1b09c1254c3a92c827",
                  image: "/assets/products/product-5.png",
                  name: "Skincare Soja CO",
                  updatedAt: subDays(subHours(now, 1), 1).getTime(),
                },
                {
                  id: "a6ede15670da63f49f752c89",
                  image: "/assets/products/product-6.png",
                  name: "Makeup Lipstick",
                  updatedAt: subDays(subHours(now, 3), 3).getTime(),
                },
                {
                  id: "bcad5524fe3a2f8f8620ceda",
                  image: "/assets/products/product-7.png",
                  name: "Healthcare Ritual",
                  updatedAt: subDays(subHours(now, 5), 6).getTime(),
                },
              ]}
              sx={{ height: "100%" }}
            /> */}
                    </Grid>
                    <Grid xs={12} md={12} lg={8}>
                        {/* <OverviewLatestOrders
              orders={[
                {
                  id: "f69f88012978187a6c12897f",
                  ref: "DEV1049",
                  amount: 30.5,
                  customer: {
                    name: "Ekaterina Tankova",
                  },
                  createdAt: 1555016400000,
                  status: "pending",
                },
                {
                  id: "9eaa1c7dd4433f413c308ce2",
                  ref: "DEV1048",
                  amount: 25.1,
                  customer: {
                    name: "Cao Yu",
                  },
                  createdAt: 1555016400000,
                  status: "delivered",
                },
                {
                  id: "01a5230c811bd04996ce7c13",
                  ref: "DEV1047",
                  amount: 10.99,
                  customer: {
                    name: "Alexa Richardson",
                  },
                  createdAt: 1554930000000,
                  status: "refunded",
                },
                {
                  id: "1f4e1bd0a87cea23cdb83d18",
                  ref: "DEV1046",
                  amount: 96.43,
                  customer: {
                    name: "Anje Keizer",
                  },
                  createdAt: 1554757200000,
                  status: "pending",
                },
                {
                  id: "9f974f239d29ede969367103",
                  ref: "DEV1045",
                  amount: 32.54,
                  customer: {
                    name: "Clarke Gillebert",
                  },
                  createdAt: 1554670800000,
                  status: "delivered",
                },
                {
                  id: "ffc83c1560ec2f66a1c05596",
                  ref: "DEV1044",
                  amount: 16.76,
                  customer: {
                    name: "Adam Denisov",
                  },
                  createdAt: 1554670800000,
                  status: "delivered",
                },
              ]}
              sx={{ height: "100%" }}
            /> */}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

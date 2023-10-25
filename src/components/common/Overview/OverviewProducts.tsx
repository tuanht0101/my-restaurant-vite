import * as React from 'react';
import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import {
    Avatar,
    Card,
    CardContent,
    Stack,
    SvgIcon,
    Typography,
} from '@mui/material';

interface OverviewProductsProps {
    difference?: number;
    positive?: boolean;
    sx?: React.CSSProperties;
    value: string;
}

const OverviewProducts: React.FC<OverviewProductsProps> = (props) => {
    const { difference, positive = false, sx, value } = props;

    return (
        <Card sx={sx}>
            <CardContent>
                <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                >
                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="overline">
                            Product
                        </Typography>
                        <Typography variant="h4">{value}</Typography>
                    </Stack>
                    <Avatar
                        sx={{
                            backgroundColor: 'warning.main',
                            height: 56,
                            width: 56,
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 6h.008v.008H6V6z"
                            />
                        </svg>
                    </Avatar>
                </Stack>
                {difference && (
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                        sx={{ mt: 2 }}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={0.5}
                        >
                            <SvgIcon
                                color={positive ? 'success' : 'error'}
                                fontSize="small"
                            >
                                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            </SvgIcon>
                            <Typography
                                color={positive ? 'success.main' : 'error.main'}
                                variant="body2"
                            >
                                {difference}%
                            </Typography>
                        </Stack>
                        <Typography color="text.secondary" variant="caption">
                            Since last month
                        </Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};

OverviewProducts.propTypes = {
    difference: PropTypes.number,
    positive: PropTypes.bool,
    sx: PropTypes.object,
    value: PropTypes.string.isRequired,
};

export default OverviewProducts;

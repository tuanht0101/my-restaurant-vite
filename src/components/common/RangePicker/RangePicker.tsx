import { keyframes } from '@emotion/react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import AdapterDateFns from '@mui/x-date-pickers/AdapterDateFns';
import { compareDates } from '../../../utils/compare-two-dates';

type Props = {
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    handleDates: (isValid: boolean) => void;
    handleUpdateStartDate?: (date: Date | null | undefined) => void;
    handleUpdateEndDate?: (date: Date | null | undefined) => void;
    isErrorOnStartDate: boolean;
    isStartDateShaking: boolean;
    isResetFilter?: boolean;
};

const shakeAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
`;

export default function RangePicker({
    startDate,
    endDate,
    handleDates,
    handleUpdateStartDate,
    handleUpdateEndDate,
    isErrorOnStartDate,
    isStartDateShaking,
    isResetFilter = false,
}: Props) {
    useEffect(() => {
        const isValidDates = compareDates(startDate, endDate);

        handleDates(isValidDates);
    }, [startDate, endDate, handleDates]);

    const onChange = (value: Date | null, name: string) => {
        if (name === 'startDate' && handleUpdateStartDate) {
            handleUpdateStartDate(value);
        }

        if (name === 'endDate' && handleUpdateEndDate) {
            handleUpdateEndDate(value);
        }
    };

    useEffect(() => {
        if (isResetFilter) {
            onChange(null, 'startDate');
            onChange(null, 'endDate');
        }
    }, [isResetFilter]);

    return (
        <Box
            sx={{
                display: 'block',
                mt: 2,
                mr: 2,
            }}
        >
            <DatePicker
                format="dd/MM/yyyy"
                label="Bắt đầu"
                sx={{
                    '& .MuiInputLabel-root': {
                        color: isErrorOnStartDate ? 'red' : 'primary',
                    },
                    '& .MuiInputBase-root': {
                        color: isErrorOnStartDate ? 'red' : 'primary',
                        animation: `${
                            isStartDateShaking
                                ? `${shakeAnimation} 0.5s`
                                : 'none'
                        }`,
                    },
                    '& .MuiIconButton-root': {
                        color: isErrorOnStartDate ? 'red' : 'primary',
                    },
                }}
                slotProps={{ textField: { size: 'small' } }}
                value={startDate}
                onChange={(v: any) => onChange(v, 'startDate')}
            />
            <DatePicker
                sx={{ ml: 1 }}
                slotProps={{ textField: { size: 'small' } }}
                format="dd/MM/yyyy"
                label="Kết thúc"
                value={endDate}
                onChange={(v: any) => onChange(v, 'endDate')}
            />
            {isErrorOnStartDate && (
                <Typography
                    color="gray"
                    sx={{
                        lineHeight: '14px',
                        fontSize: '12px',
                        ml: 1,
                        marginTop: 1,
                        color: 'red',
                        animation: `${
                            isStartDateShaking
                                ? `${shakeAnimation} 0.5s`
                                : 'none'
                        }`,
                    }}
                >
                    Ngày bắt đầu không hợp lệ
                </Typography>
            )}
        </Box>
    );
}

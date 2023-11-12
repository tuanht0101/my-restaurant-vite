import type { SelectChangeEvent } from '@mui/material';
import {
    Grid,
    MenuItem,
    Pagination,
    PaginationItem,
    Select,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import type { ChangeEvent, MouseEvent } from 'react';
import { useEffect, useState } from 'react';

type RoundedTablePaginationProps = {
    count: number;
    onPageChange: (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions?: (number | null | undefined)[];
};

export const RoundedTablePagination: React.FC<RoundedTablePaginationProps> = ({
    count,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    rowsPerPageOptions = [5, 10, 25],
}) => {
    const [currentPage, setCurrentPage] = useState(page);

    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    const handlePageChange = (event: any, newPage: number) => {
        setCurrentPage(newPage);
        onPageChange(event, newPage);
    };

    const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
        // const newRowsPerPage = parseInt(event.target.value.toString(), 10)
        setCurrentPage(1); // Reset current page to 1 when changing rows per page
        onRowsPerPageChange?.(event as ChangeEvent<HTMLInputElement>);
        onPageChange(null, 1); // Manually trigger onPageChange with new page as 1
    };

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ pr: 2.5 }}
        >
            <Grid item>
                <Typography
                    variant="body2"
                    sx={{ display: 'inline-block', mr: 1, pl: '1.8rem' }}
                >
                    Hiển thị:
                </Typography>
                <Select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    displayEmpty
                    inputProps={{
                        'aria-label': 'Rows per page',
                        sx: { width: '60px', p: '0.5rem', pl: '10px' }, // Adjust the width and padding as needed
                    }}
                    sx={{
                        '& .MuiSelect-root': {
                            height: '26px', // Set the height to match the pagination number rounded box
                            fontSize: '0.875rem', // Reduce the font size to make it smaller
                            padding: '0px', // Remove default padding
                        },
                    }}
                >
                    {rowsPerPageOptions.map((option) => (
                        <MenuItem key={option} value={option || ''}>
                            {option} hàng
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item>
                <Pagination
                    count={Math.ceil(count / rowsPerPage)}
                    page={currentPage}
                    shape="rounded"
                    variant="outlined"
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{ py: 2 }}
                    size="large"
                    renderItem={(item) => (
                        <PaginationItem component="div" {...item} />
                    )}
                />
            </Grid>
        </Grid>
    );
};

RoundedTablePagination.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};

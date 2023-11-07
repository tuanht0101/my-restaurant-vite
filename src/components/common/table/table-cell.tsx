import { TableCell, Tooltip } from '@mui/material';
import React from 'react';

const TableCellToolTip = ({ title, ...props }: any) => {
    return (
        <Tooltip
            title={title}
            placement="bottom-start"
            PopperProps={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [16, -24],
                        },
                    },
                ],
            }}
        >
            <TableCell className="ellipsis" padding="none" {...props}>
                {title}
            </TableCell>
        </Tooltip>
    );
};

export default TableCellToolTip;

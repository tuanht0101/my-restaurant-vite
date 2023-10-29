import {
    Box,
    Button,
    IconButton,
    Modal,
    Paper,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import type { FC } from 'react';

import { X as XIcon } from '../../../icons/x';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export const DeleteConfirmModal: FC<DeleteConfirmModalProps> = (props) => (
    <Modal open={props.isOpen} onClose={props.onClose}>
        <Box
            sx={{
                minHeight: '100%',
                p: 3,
            }}
        >
            <Paper
                elevation={12}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 3,
                    mx: 'auto',
                    outline: 'none',
                    maxWidth: 600,
                    width: 'calc(100% - 64px)',
                }}
            >
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        padding: '32px 24px',
                    }}
                >
                    <Typography variant="h6">Thông báo</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                        onClick={props.onClose}
                        sx={{
                            width: 40,
                            height: 40,
                            background: 'rgba(80, 72, 229, 0.08)',
                            borderRadius: 40,
                        }}
                    >
                        <XIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Typography
                    style={{
                        margin: '8px 24px',
                    }}
                >
                    Bạn có chắc chắn muốn xoá bản ghi đã chọn
                </Typography>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: '32px 24px',
                    }}
                >
                    <Button variant="contained" onClick={props.onDelete}>
                        Xác nhận
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            ml: 3,
                        }}
                        onClick={props.onClose}
                        color="error"
                    >
                        Đóng
                    </Button>
                </Box>
            </Paper>
        </Box>
    </Modal>
);

DeleteConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

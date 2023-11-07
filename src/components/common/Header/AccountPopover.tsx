import LogoutIcon from '@mui/icons-material/Logout';
import {
    Avatar,
    Box,
    Divider,
    Link,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Popover,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from '../../../icons/user-circle';
// import { useMeStore } from 'store/me'

// import type { User } from '../../graphql/generated'
// import { Cog as CogIcon } from '../../icons/cog'
// import { SwitchHorizontalOutlined as SwitchHorizontalOutlinedIcon } from '../../icons/switch-horizontal-outlined'

// import { useAuthStore } from '../../store/auth'
// import Link from '../link'

interface AccountPopoverProps {
    anchorEl: null | Element;
    onClose?: () => void;
    user: any | null;
    open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
    const { anchorEl, onClose, user, open, ...other } = props;
    const navigate = useNavigate();
    //   const { logout } = useAuthStore()
    //   const { clearUserData } = useMeStore()
    //   const auth = useAuthStore()

    const handleLogout = async (): Promise<void> => {
        try {
            onClose?.();
            // await logout();
            // clearUserData();
            navigate('/login');
        } catch (err: any) {
            toast.error('Có lỗi. Vui lòng thử lại sau!');
        }
    };

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom',
            }}
            keepMounted
            onClose={onClose}
            open={!!open}
            PaperProps={{ sx: { width: 300 } }}
            transitionDuration={0}
            {...other}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    p: 2,
                    display: 'flex',
                }}
            >
                <Avatar
                    sx={{
                        height: 40,
                        width: 40,
                        backgroundColor: 'white',
                    }}
                >
                    <img
                        src={user?.avatar || undefined}
                        height={40}
                        width={40}
                        onError={(
                            event: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                            const target = event.target as HTMLImageElement;
                            target.src =
                                '/static/mock-images/avatars/default.svg';
                        }}
                        alt="User Avatar"
                    />
                    {!`/${user?.avatar}` && <UserCircle fontSize="small" />}
                </Avatar>
                <Box
                    sx={{
                        ml: 1,
                    }}
                >
                    <Typography variant="body1">{user?.name}</Typography>
                    <Typography color="textSecondary" variant="body2">
                        {user?.role}
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <Box sx={{ my: 1 }}>
                <Link href="/thong-tin-ca-nhan">
                    <MenuItem
                        component="button"
                        sx={{ width: '100%', textAlign: 'left' }}
                    >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                            <UserCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="body1">
                                    Thông tin cá nhân
                                </Typography>
                            }
                        />
                    </MenuItem>
                </Link>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography variant="body1">Đăng xuất</Typography>
                        }
                    />
                </MenuItem>
            </Box>
        </Popover>
    );
};

AccountPopover.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
};

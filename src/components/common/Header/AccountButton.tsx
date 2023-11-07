import { Avatar, Box, ButtonBase } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { UserCircle } from '../../../icons/user-circle';
import { AccountPopover } from './AccountPopover';
import useAuthen from '../../../hooks/authenHooks';

export const AccountButton = () => {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [openPopover, setOpenPopover] = useState<boolean>(false);

    const { user } = useAuthen();
    // // Query User Me Info
    // const [result] = useQuery({
    //   query: MeDocument
    // })
    // const { data, fetching, error } = result
    // if (fetching) return null
    // if (error) {
    //   return <Page500 />
    // }
    // const user = data.me
    useEffect(() => {
        // getMeInformation().then((_) => {});
    }, []);

    const handleOpenPopover = (): void => {
        setOpenPopover(true);
    };

    const handleClosePopover = (): void => {
        setOpenPopover(false);
    };

    return (
        <>
            <Box
                component={ButtonBase}
                onClick={handleOpenPopover}
                ref={anchorRef}
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    ml: 2,
                }}
            >
                <Avatar
                    sx={{
                        height: 40,
                        width: 40,
                    }}
                    src={'/static/default-avatar.jpg'}
                >
                    <UserCircle fontSize="small" />
                </Avatar>
            </Box>
            {user ? (
                <AccountPopover
                    anchorEl={anchorRef.current}
                    onClose={handleClosePopover}
                    user={user}
                    open={openPopover}
                />
            ) : null}
        </>
    );
};

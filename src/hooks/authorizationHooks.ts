import { useState, useEffect } from 'react';

const useAuthorization = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuthorization = () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                try {
                    const tokenPayload = JSON.parse(
                        atob(accessToken.split('.')[1])
                    );
                    const userRole = tokenPayload.role;
                    setIsAdmin(userRole === 'ADMIN');
                } catch (error) {
                    console.error('Error decoding access token:', error);
                }
            } else {
                setIsAdmin(false);
            }
        };

        checkAuthorization();
    }, []);

    return {
        isAdmin,
    };
};

export default useAuthorization;

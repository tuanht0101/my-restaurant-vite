import axios from 'axios';
import { useState, useEffect } from 'react';

const useAuthen = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkAuthen = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                try {
                    const tokenPayload = JSON.parse(
                        atob(accessToken.split('.')[1])
                    );
                    const userId = tokenPayload.sub;
                    const user = await axios.get(
                        `${import.meta.env.VITE_API_URL}/user/${userId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    setUser(user);
                } catch (error) {
                    console.error('Error decoding access token:', error);
                }
            } else {
                setUser(null);
            }
        };

        checkAuthen();
    }, []);

    return {
        user,
    };
};

export default useAuthen;

import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RefreshToken = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Function to refresh the token
        const refreshAccessToken = async () => {
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/refresh`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`,
                            },
                        }
                    );
                    localStorage.setItem(
                        'access_token',
                        response.data.access_token
                    );

                    localStorage.setItem(
                        'refresh_token',
                        response.data.refresh_token
                    );
                } catch (error) {
                    navigate('/signin');
                    console.error('Error refreshing token:', error);
                }
            }
        };

        // Set up interval to call refresh token every 14 minutes
        const intervalId = setInterval(refreshAccessToken, 14 * 60 * 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return null;
};

export default RefreshToken;

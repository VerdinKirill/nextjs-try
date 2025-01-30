'use client';

import {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {LogoLoader} from '@/components/LogoLoader/LogoLoader';
import ApiClient from '@/utilities/ApiClient';

// Create a Context for the user info
const UserContext = createContext(null as any);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

export function RequireAuth({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    // useEffect(() => {
    //     console.log("huihuijui")
    // })

    useEffect(() => {
        setIsClient(true); // Ensures rendering only happens in the browser
    }, []);

    const checkTokenValidity = useCallback(async () => {
        if (!isClient) return; // Prevent execution on the server

        const authToken = localStorage.getItem('authToken');
        console.log(authToken);
        if (!authToken) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const response = await ApiClient.post('auth/verify-token', {token: authToken});

            if (response?.data?.valid) {
                setIsAuthenticated(true);
                console.log(response.data.campaigns);
                if (JSON.stringify(userInfo) !== JSON.stringify(response.data)) {
                    setUserInfo({
                        ...response.data,
                        campaigns: response.data.campaigns || [], // Ensure campaigns array exists
                    });
                }
            } else {
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
            }
        } catch (error: any) {
            console.error('Token verification failed:', error.message);
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
        }
    }, [isClient, userInfo]);

    useEffect(() => {
        if (isClient) checkTokenValidity();
    }, [isClient, checkTokenValidity]);

    const refetchUser = async () => {
        if (isClient) await checkTokenValidity();
    };

    useEffect(() => {
        const interval = setInterval(refetchUser, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [isClient]);

    useEffect(() => {
        if (isAuthenticated === false && isClient) {
            router.push('/login');
        }
    }, [isAuthenticated, router, isClient]);

    if (!isClient || isAuthenticated === null) {
        return (
            <div className="auth-loader-container">
                <LogoLoader />
            </div>
        );
    }

    return <UserContext.Provider value={{userInfo, refetchUser}}>{children}</UserContext.Provider>;
}

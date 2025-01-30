'use client';

import {useState, useEffect, createContext} from 'react';
import {App} from '@/components/App/App';

import {RequireAuth} from '@/components/RequireAuth/RequireAuth';
import {Dashboard} from '@/components/Dashboard';
import {usePathname} from 'next/navigation';

const DARK = 'dark';
const Light = 'light';
const DEFAULT_THEME = DARK;

const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
};

// Create the context
export function RootLayoutClient({children}: {children: React.ReactNode}) {
    const [theme, setTheme] = useState<string>(DEFAULT_THEME);
    useEffect(() => {
        const themeFromStorage =
            (typeof window !== 'undefined' &&
                JSON.parse(localStorage.getItem('theme') as string)) ||
            DEFAULT_THEME;
        {
            setTheme(themeFromStorage);
        }
    }, []);

    const pathname = usePathname();
    const toggleTheme = (val: string) => {
        const newTheme = val === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Store in localStorage
    };

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme));
        console.log(localStorage);
    }, [theme]);
    const isAuthPage = pathname === '/login' || pathname === '/loginHandler';
    return (
        <RequireAuth>
            <App theme={theme}>
                {isAuthPage ? (
                    children
                ) : (
                    <Dashboard theme={theme} toggleTheme={toggleTheme}>
                        {children}
                    </Dashboard>
                )}
            </App>
        </RequireAuth>
    );
}

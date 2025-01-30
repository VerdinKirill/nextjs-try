'use client';

import {Dispatch, SetStateAction, useEffect} from 'react';

import {Wrapper} from '../Wrapper';

interface AppProps {
    children: React.ReactNode;
}

interface AppProps {
    children: React.ReactNode;
    theme: string,
}

export const App: React.FC<AppProps> = ({children, theme}) => {
    return <Wrapper theme={theme}>{children}</Wrapper>;
};

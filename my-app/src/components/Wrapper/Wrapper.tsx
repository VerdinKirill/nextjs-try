'use client';

import {ThemeProvider} from '@gravity-ui/uikit';

import './Wrapper.scss';
import {ErrorProvider} from '@/contexts/ErrorContext';
import {CampaignProvider} from '@/contexts/CampaignContext';
import {GlobalAlert} from '../GlobalAlert/GlobalAlert';
import {useState, Dispatch, SetStateAction, useEffect} from 'react';

const DARK = 'dark';
const DEFAULT_THEME = DARK;

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`;

export type AppProps = {
    children: React.ReactNode;
    theme: string;
};

export const Wrapper: React.FC<AppProps> = ({children, theme}) => {
    return (
        <ThemeProvider theme={theme}>
            <ErrorProvider>
                <CampaignProvider>
                    <GlobalAlert />
                    {children}
                </CampaignProvider>
            </ErrorProvider>
        </ThemeProvider>
    );
};

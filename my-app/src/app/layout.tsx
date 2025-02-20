import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import '../styles/App.scss';
import '../styles/tailwind.scss'

import type {Metadata} from 'next';
import {RootLayoutClient} from '@/components/RootLayoutClient';
import {ReactNode} from 'react';

export const metadata: Metadata = {
    title: 'Aurum',
    description: 'App description',
};

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <html lang="en">
            <body>
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    );
}

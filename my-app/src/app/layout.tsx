import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
// import '../styles/globals.scss';

import type {Metadata} from 'next';
import {RootLayoutClient} from '@/components/RootLayoutClient';

export const metadata: Metadata = {
    title: 'Aurum',
    description: 'App description',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body>
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    );
}

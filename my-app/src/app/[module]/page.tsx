// app/[module]/page.tsx
'use client';

import {useModules} from '@/contexts/ModuleProvider';
import {useCampaign} from '@/contexts/CampaignContext';

// import { DeliveryPage } from '@/components/DeliveryPage';
import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import dynamic from 'next/dynamic';

const modulesMap: any = {
    // massAdvert: dynamic(() => import('@/components/MassAdvertPage')),
    nomenclatures: dynamic(() =>
        import('@/components/Pages/NomenclaturesPage').then((mod) => mod.NomenclaturesPage),
    ),
    prices: dynamic(() => import('@/components/Pages/PricesPage').then((mod) => mod.PricesPage), {
        ssr: false,
    }),
    delivery: dynamic(
        () => import('@/components/Pages/DeliveryPage').then((mod) => mod.DeliveryPage),
        {
            ssr: false,
        },
    ),
    detailedReports: dynamic(
        () =>
            import('@/components/Pages/DetailedReportsPage').then((mod) => mod.DetailedReportsPage),
        {
            ssr: false,
        },
    ),
    seo: dynamic(() => import('@/components/Pages/SEOPage').then((mod) => mod.SEOPage), {
        ssr: false,
    }),
    buyers: dynamic(() => import('@/components/Pages/BuyersPage').then((mod) => mod.BuyersPage), {
        ssr: false,
    }),
    api: dynamic(() => import('@/components/Pages/ApiPage').then((mod) => mod.ApiPage), {
        ssr: false,
    }),
    // analytics: dynamic(() => import('@/components/AnalyticsPage')),
    // ... other modules
};

export default function ModulePage() {
    const router = useRouter();
    const params = useParams();
    const {currentModule, availableModules, modulesLoaded} = useModules();
    const {sellerId} = useCampaign();
    const [module, setModule] = useState<string | null>(null);
    useEffect(() => {
        if (params?.module) {
            setModule(Array.isArray(params.module) ? params.module[0] : params.module);
        }
    }, [params]);

    // Handle initial module validation
    useEffect(() => {
        if (modulesLoaded && module && !availableModules.includes(module)) {
            router.replace(`/api?seller_id=${sellerId}`);
        }
    }, [modulesLoaded, module, availableModules, router, sellerId]);

    if (!modulesLoaded || !module) {
        return <div>Loading application...</div>;
    }

    if (!availableModules.includes(module)) {
        return null;
    }
    if (modulesMap[module]) {
        const ModuleComponent = modulesMap[module];

        return (
            <div>
                <ModuleComponent />
            </div>
        );
    }
    return <div>{module}</div>;
}
